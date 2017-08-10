
import json
import time
from datetime import datetime

import dateutil.parser
import requests
from django.core.serializers import serialize
from django.http import HttpResponse
from django.shortcuts import redirect, render

from .models import PR, Branche, Website


def index(request):

    if request.method == "POST":
        user = request.POST.get('user', 'openshift').lower()
        repo = request.POST.get('repo', 'openshift-ansible').lower()
        token = request.POST.get('token', '').lower()
        if token == '':
            with open('config.json') as json_data:
                token = json.load(json_data)[0]["token"]

        if (not 'githubUser' in request.session) or (not 'githubRepo' in request.session) or (not 'token' in request.session):
            request.session['githubUser'] = user
            request.session['githubRepo'] = repo
            request.session['branche'] = 'master'

        if not Website.objects.filter(user=user, repository=repo).exists():

            query_pr = ""
            pr_cursor = ""
            query = '''
            {
              repository(owner: "''' + user + '''", name: "''' + repo + '''") {
                 pullRequests(first: 100 states:MERGED) {
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

            headers = {'Authorization': 'token ' + token}

            pr_edges = [""]
            r2 = requests.post('https://api.github.com/graphql', json.dumps({"query": query}),
                               headers=headers).json()
            if r2['data']['repository'] != None:
                Website(repository=repo, user=user, token=token).save()
                while pr_edges != []:
                    localtime = time.asctime(time.localtime(time.time()))
                    r2 = requests.post('https://api.github.com/graphql', json.dumps({"query": query}),
                                       headers=headers).json()
                    data = r2['data']['repository']
                    if pr_edges != []:
                        pr_edges = data['pullRequests']['edges']
                        for pr in pr_edges:
                            state = pr['node']['state']
                            number = pr['node']['number']
                            created_at = dateutil.parser.parse(
                                pr['node']['createdAt'])
                            merged_at = dateutil.parser.parse(
                                pr['node']['mergedAt'])
                            updated_at = dateutil.parser.parse(
                                pr['node']['updatedAt'])
                            baseRefName = pr['node']['baseRefName']

                            print("PR ", number)
                            title = pr['node']['title']
                            pr_cursor = pr['cursor']

                            PR(website=Website.objects.get(repository=repo), number=number, created_at=created_at,
                               state=state,
                               title=title, merged_at=merged_at, updated_at=updated_at, cursor=pr_cursor,
                               branche=Branche.objects.get_or_create(baseRefName=baseRefName,
                                                                     website=Website.objects.get(repository=repo))[
                                   0]).save()
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
                                }}'''

                    else:
                        query_pr = ""

                    query = '''
                        {
                          repository(owner:"''' + user + '''", name:"''' + repo + '''"){
                           ''' + query_pr + '''
                        }
                        }
                        '''
            else:
                del request.session['githubUser']
                del request.session['githubRepo']
                return redirect("/")
        return redirect("/" + user + "/" + repo + "/")

    elif request.method == "GET":
        if ('githubUser' in request.session) and ('githubRepo' in request.session):
            return redirect("/" + request.session['githubUser'] + "/" + request.session['githubRepo'] + "/")
        else:
            return render(request, '../templates/index.html',)


def data(request, user, repo):
    by_closed = []
    try:
        topDate = request.session.get('topDate', '1/1/2050')
        btmDate = request.session.get('btmDate', '1/1/1950')
        if topDate == '':
            topDate = '1/1/2050'
        if btmDate == '':
            btmDate = '1/1/1950'
        branche = request.session.get('branche', 'master')
        if branche == '':
            by_closed = PR.objects.filter(website__repository=repo, website__user=user,
                                          branche__baseRefName="master",
                                          merged_at__lt=datetime.strptime(
                                              topDate, "%d/%m/%Y"),
                                          merged_at__gt=datetime.strptime(btmDate, "%d/%m/%Y")).order_by("merged_at")
        else:
            by_closed = PR.objects.filter(website__repository=repo, website__user=user,
                                          branche__baseRefName=branche,
                                          merged_at__lt=datetime.strptime(
                                              topDate, "%d/%m/%Y"),
                                          merged_at__gt=datetime.strptime(btmDate, "%d/%m/%Y")).order_by("merged_at")
    except Exception as e:
        print(e)

    pr_josn = []
    for pr in by_closed:
        pr_josn.append(pr)
    serialized_object = serialize('json', pr_josn)
    return HttpResponse(serialized_object, content_type='application/json')


def graph(request, user, repo):
    if request.method == "GET":

        if Website.objects.filter(user=user, repository=repo).exists():
            request.session['githubUser'] = user
            request.session['githubRepo'] = repo
            return render(request, '../templates/graphs.html',
                          {'haveData': True,
                           'topDate': request.session.get('topDate', ''), 'btmDate': request.session.get('btmDate', ''),
                           'branche': request.session.get('branche', 'master'),
                           'branches': Branche.objects.filter(website__repository=repo,
                                                              website__user=user),
                           'githubRepo': repo, "githubUser": user
                           })
        else:
            try:
                del request.session['branche']
                del request.session['topDate']
                del request.session['btmDate']

            except Exception as e:
                print(e)
            del request.session['githubUser']
            del request.session['githubRepo']
            return redirect("../../")

    elif request.method == "POST":
        request.session['topDate'] = request.POST.get('topDate', '')
        request.session['btmDate'] = request.POST.get('btmDate', '')
        request.session['branche'] = request.POST.get('branche', 'master')
        return redirect(".")


def change(request):
    try:
        del request.session['branche']
        del request.session['topDate']
        del request.session['btmDate']

    except Exception as e:
        print(e)
    del request.session['githubUser']
    del request.session['githubRepo']
    return redirect("/")
