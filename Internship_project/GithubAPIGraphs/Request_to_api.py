import os
import dateutil.parser
import json
import requests
from .models import PR, Website, Branche, Add_website
token = os.environ.get("TOKEN", "")


class Request:
    def __init__(self, web):
        self.web = web
        self.query_pr_add = ''

    def add(self):
        self.main_structure()

    def update(self):
        if PR.objects.filter(website=self.web).exists():
            _pr = PR.objects.filter(website=self.web).last()
            self.query_pr_add = 'after:"' + _pr.cursor + '"'
        else:
            self.query_pr_add = ''
        self.main_structure()

    def main_structure(self):
        query_pr = ""
        headers = {'Authorization': 'token ' + token}

        query = '''
              {
                repository(owner: "''' + self.web.user + '''", name: "''' + self.web.repository + '''") {
                  pullRequests(first: 100 states:MERGED '''+self.query_pr_add+''') {
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
                    PR(website=self.web, number=number, created_at=created_at,
                       state=state,
                       title=title, merged_at=merged_at, updated_at=updated_at, cursor=pr_cursor,
                       branche=Branche.objects.get_or_create(baseRefName=baseRefName,
                                                             website=self.web)[0]).save()
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
                    repository(owner:"''' + self.web.user + '''", name:"''' + self.web.repository + '''"){

                      ''' + query_pr + '''

                    }
                  }
                  '''
