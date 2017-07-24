import os

import sys
from django.shortcuts import render
import requests, dateutil.parser, json, requests, time
from .models import PR, Issue, Website, Branche
from datetime import datetime
from dateutil.parser import parse
from time import gmtime, strftime
from django.utils import timezone
from django.core.serializers import serialize
from django.http import JsonResponse, HttpResponse


def index(request):
    if request.method == "POST":
        if (not request.POST.get('change_graph', False)):

            user = request.POST.get('user', 'openshift')
            repo = request.POST.get('repo', 'openshift-ansible')

            if (not 'githubUser' in request.session) and (not 'githubRepo' in request.session):
                request.session['githubUser'] = user
                request.session['githubRepo'] = repo
                request.session['branche'] = "all"

            if not Website.objects.filter(user=user, repository=repo).exists():

                issue_cursor = ""
                pr_cursor = ""
                query = '''
                {
                  repository(owner: "''' + user + '''", name: "''' + repo + '''") {
                    issues(first: 100 states:CLOSED) {
                      edges {
                        cursor
                        node {
                          number
                          createdAt
                          state
                          title
                        }
                      }
                    }
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

                headers = {'Authorization': 'token '}

                pr_edges = [""]
                r2 = requests.post('https://api.github.com/graphql', json.dumps({"query": query}),
                                   headers=headers).json()
                if r2['data']['repository'] != None:
                    Website(repository=repo, user=user).save()
                    while pr_edges != []:
                        localtime = time.asctime(time.localtime(time.time()))
                        print(localtime)
                        r2 = requests.post('https://api.github.com/graphql', json.dumps({"query": query}),
                                           headers=headers).json()

                        data = r2['data']['repository']
                        for issue in data['issues']['edges']:
                            state = issue['node']['state']
                            number = issue['node']['number']
                            created_at = dateutil.parser.parse(issue['node']['createdAt'])

                            title = issue['node']['title']
                            Issue(website=Website.objects.get(repository=repo), number=number,
                                  created_at=created_at, state=state, title=title).save()
                            print(number)
                            issue_cursor = issue['cursor']

                        pr_edges = data['pullRequests']['edges']
                        for pr in data['pullRequests']['edges']:
                            state = pr['node']['state']
                            number = pr['node']['number']
                            created_at = dateutil.parser.parse(pr['node']['createdAt'])
                            merged_at = dateutil.parser.parse(pr['node']['mergedAt'])
                            updated_at = dateutil.parser.parse(pr['node']['updatedAt'])
                            baseRefName = pr['node']['baseRefName']

                            print(number)
                            title = pr['node']['title']

                            PR(website=Website.objects.get(repository=repo), number=number, created_at=created_at,
                               state=state,
                               title=title, merged_at=merged_at, updated_at=updated_at,
                               branche=Branche.objects.get_or_create(baseRefName=baseRefName,
                                                                     website=Website.objects.get(repository=repo))[
                                   0]).save()

                            pr_cursor = pr['cursor']

                        query = '''
                        {
                          repository(owner:"''' + user + '''", name:"''' + repo + '''"){
                            issues(first: 100 states:CLOSED after:"''' + issue_cursor + '''") {
                              edges {
                                cursor
                                node {
                              number
                              createdAt
                              state
                              title

                                }
                              }
                            }
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
                          }
                        }
                        }
                        '''
                else:
                    del request.session['githubUser']
                    del request.session['githubRepo']
                    return render(request, '../templates/index.html',
                                  {'haveData': False,
                                   'badInformation': True})
            return render(request, '../templates/index.html',
                          {'haveData': True, 'badInformation': True,
                           'by_closedPR': PR.objects.filter(
                               website__repository=request.session['githubRepo']).order_by(
                               "merged_at"),
                           'branches': Branche.objects.filter(website__repository=request.session['githubRepo']),
                           'githubRepo': request.session['githubRepo'], "githubUser": request.session['githubUser']

                           })
        else:
            try:
                del request.session['branche']
            except:
                pass
            del request.session['githubUser']
            del request.session['githubRepo']
            return render(request, '../templates/index.html',
                          {'haveData': False,
                           'badInformation': False
                           })
    elif request.method == "GET":
        top=request.GET.get('topDate', '')
        btm=request.GET.get('btmDate', '')
        branche=request.GET.get('branche', '')
        request.session['topDate'] = top
        request.session['btmDate'] = btm
        request.session['branche'] = branche
        try:
            return render(request, '../templates/index.html',
                          {'haveData': True,
                           'topDate':top,'btmDate':btm,'branche':branche,
                           'branches': Branche.objects.filter(website__repository=request.session['githubRepo']),
                           'githubRepo': request.session['githubRepo'], "githubUser": request.session['githubUser']
                           })
        except Exception as exp:
            print(exp)
            return render(request, '../templates/index.html',
                          {'haveData': False,
                           'badInformation': True
                           })


def issues(request):
    if request.method == "GET":
        if Issue.objects.filter(website=Website.objects.get(
                repository=request.session['githubRepo'])).count() != 0:
            return render(request, '../templates/issues.html',
                          {'haveData': True,
                           'by_closedIssue': Issue.objects.filter(
                               website__repository=request.session['githubRepo']).order_by(
                               "number"),
                           'githubRepo': request.session['githubRepo'], "githubUser": request.session['githubUser']
                           })


def info(request):
    if request.method == "GET":
        if Issue.objects.filter(website__repository=request.session['githubRepo']).count() != 0:
            if request.session['branche'] == 'all':
                closed = PR.objects.filter(
                    website__repository=request.session['githubRepo']).order_by(
                    "merged_at")
            else:
                closed = PR.objects.filter(
                    website__repository=request.session['githubRepo'],
                    branche__baseRefName=request.session['branche']).order_by(
                    "merged_at")
            return render(request, '../templates/info.html',
                          {'haveData': True,
                           'by_closedIssue': Issue.objects.filter(
                               website__repository=request.session['githubRepo']).order_by(
                               "number"),
                           'by_closedPR': closed,
                           'githubRepo': request.session['githubRepo'], "githubUser": request.session['githubUser']
                           })


def data(request):
    by_closed=[]
    try:
        topDate=request.session['topDate']
        btmDate=request.session['btmDate']
        branche=request.session['branche']

        if topDate == '':
            topDate = "1/1/2050"
        if btmDate == '':
            btmDate = "1/1/1950"
        if branche == '' or branche == 'all':
            by_closed = PR.objects.filter(website__repository=request.session['githubRepo'],
                                          merged_at__lt=datetime.strptime(topDate, "%d/%m/%Y"),
                                          merged_at__gt=datetime.strptime(btmDate, "%d/%m/%Y")).order_by("merged_at")
        else:
            by_closed = PR.objects.filter(website__repository=request.session['githubRepo'],
                                          branche__baseRefName=branche,
                                          merged_at__lt=datetime.strptime(topDate, "%d/%m/%Y"),
                                          merged_at__gt=datetime.strptime(btmDate, "%d/%m/%Y")).order_by("merged_at")

    except Exception as e:
        print(e)

    pr_josn = []
    for pr in by_closed:
        pr_josn.append(pr)
    serialized_object = serialize('json', pr_josn)
    return HttpResponse(serialized_object, content_type='application/json')
