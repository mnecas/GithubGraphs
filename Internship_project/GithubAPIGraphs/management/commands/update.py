"""ADD funcition: at the end of the month check all websites and continue getting data"""

from django.core.management.base import BaseCommand, CommandError
from ...models import Website, Branche, PR
import dateutil.parser
import json
import requests
import os

token=os.environ.get("TOKEN","")

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('website', type=str, nargs='?', default="")

    def request(self, web):
        query_pr = ""
        pr_cursor = ""
        headers = {'Authorization': 'token ' + token}
        query_pr_add = ""

        if PR.objects.filter(website=web).exists():
            _pr = PR.objects.filter(website=web).last()
            query_pr_add = 'after:"' + _pr.cursor + '"'
        else:
            query_pr_add = ''

        query = '''
              {
                repository(owner: "''' + web.user + '''", name: "''' + web.repository + '''") {
                  pullRequests(first: 100 states:MERGED ''' + query_pr_add + ''') {
                    edges {
                      cursor
                      node {
                        number
                        createdAt
                        state
                        title
                        closed
                        mergedAt
                        baseRefName
                        updatedAt
                      }
                    }
                }
              }
              }
              '''
        r2 = requests.post('https://api.github.com/graphql', json.dumps({"query": query}),
                           headers=headers).json()
        pr_edges = r2['data']['repository']['pullRequests']['edges']

        while pr_edges != []:
            r2 = requests.post('https://api.github.com/graphql', json.dumps({"query": query}),
                               headers=headers).json()

            data = r2['data']['repository']
            if pr_edges != []:
                pr_edges = data['pullRequests']['edges']
                for pr in data['pullRequests']['edges']:
                    state = pr['node']['state']
                    number = pr['node']['number']
                    created_at = dateutil.parser.parse(pr['node']['createdAt'])
                    merged_at = dateutil.parser.parse(pr['node']['mergedAt'])
                    updated_at = dateutil.parser.parse(pr['node']['updatedAt'])
                    baseRefName = pr['node']['baseRefName']
                    title = pr['node']['title']
                    pr_cursor = pr['cursor']
                    PR(website=web, number=number, created_at=created_at,
                       state=state,
                       title=title, merged_at=merged_at, updated_at=updated_at, cursor=pr_cursor,
                       branche=Branche.objects.get_or_create(baseRefName=baseRefName,
                                                             website=web)[0]).save()
                    print("PR ", number, "BRANCHE ", baseRefName)
                    query_pr = '''
                                pullRequests(first: 100 states:MERGED after:"''' + pr_cursor + '''") {
                                        edges {
                                          cursor
                                          node {
                                        number
                                        createdAt
                                        state
                                        title
                                        closed
                                        mergedAt
                                        baseRefName
                                        updatedAt
                                          }
                                        }
                                    }'''
            query = '''
                  {
                    repository(owner:"''' + web.user + '''", name:"''' + web.repository + '''"){
                     
                      ''' + query_pr + '''

                    }
                  }
                  '''

    def handle(self, *args, **options):
        _website = options.get('website', None)

        if _website == "":
            for web in Website.objects.all():
                print(web.user + "/" + web.repository)
                self.request(web)
        else:
            try:
                web = Website.objects.get(user=_website.split(
                    "/")[0], repository=_website.split("/")[1])
                self.request(web)
            except Exception as e:
                print("Invalid repository")
