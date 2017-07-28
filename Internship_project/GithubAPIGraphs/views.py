
from django.shortcuts import render, redirect
import dateutil.parser, json, requests, time
from .models import PR, Issue, Website, Branche
from datetime import datetime
from django.core.serializers import serialize
from django.http import HttpResponse

token=""
def index(request):
    if request.method == "POST":
        user = request.POST.get('user', 'openshift')
        repo = request.POST.get('repo', 'openshift-ansible')
        if (not 'githubUser' in request.session) or (not 'githubRepo' in request.session):
            request.session['githubUser'] = user
            request.session['githubRepo'] = repo
            request.session['branche'] = ""


        if not Website.objects.filter(user=user, repository=repo).exists():
            query_issue = ""
            query_pr = ""
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

            headers = {'Authorization': 'token '+token}

            pr_edges = [""]
            issue_edges = [""]
            r2 = requests.post('https://api.github.com/graphql', json.dumps({"query": query}),
                               headers=headers).json()
            if r2['data']['repository'] != None:
                    Website(repository=repo, user=user).save()
                    while pr_edges != [] or issue_edges != [] :
                        localtime = time.asctime(time.localtime(time.time()))
                        print(localtime)
                        r2 = requests.post('https://api.github.com/graphql', json.dumps({"query": query}),
                                           headers=headers).json()

                        data = r2['data']['repository']
                        if issue_edges != []:
                            issue_edges = data['issues']['edges']
                            for issue in issue_edges:
                                state = issue['node']['state']
                                number = issue['node']['number']
                                created_at = dateutil.parser.parse(issue['node']['createdAt'])

                                title = issue['node']['title']
                                issue_cursor = issue['cursor']
                                Issue(website=Website.objects.get(repository=repo), number=number,
                                      created_at=created_at, state=state, title=title,cursor=issue_cursor).save()

                                print("ISSUE ", number)
                                query_issue ='''
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
                                                       }'''
                        else:
                            query_issue =""

                        if pr_edges != []:
                            pr_edges = data['pullRequests']['edges']
                            for pr in pr_edges:
                                state = pr['node']['state']
                                number = pr['node']['number']
                                created_at = dateutil.parser.parse(pr['node']['createdAt'])
                                merged_at = dateutil.parser.parse(pr['node']['mergedAt'])
                                updated_at = dateutil.parser.parse(pr['node']['updatedAt'])
                                baseRefName = pr['node']['baseRefName']

                                print("PR ", number)
                                title = pr['node']['title']
                                pr_cursor = pr['cursor']

                                PR(website=Website.objects.get(repository=repo), number=number, created_at=created_at,
                                   state=state,
                                   title=title, merged_at=merged_at, updated_at=updated_at,cursor=pr_cursor,
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
                            query_pr =""

                        query = '''
                        {
                          repository(owner:"''' + user + '''", name:"''' + repo + '''"){
                            '''+query_issue+'''
                           '''+query_pr+'''
                        }
                        }
                        '''
            else:
                del request.session['githubUser']
                del request.session['githubRepo']
                return redirect("/")
        return redirect("/"+user+"/"+repo+"/")

    elif request.method == "GET":
        if ('githubUser' in request.session) and ('githubRepo' in request.session):
            return redirect("/"+request.session['githubUser']+"/"+request.session['githubRepo']+"/")
        else:
            return render(request, '../templates/reg_webu.html',)




def info(request,user,repo):
    request.session['githubUser'] = user
    request.session['githubRepo'] = repo
    return render(request, '../templates/info.html',
                      {'haveData': True,
                       'by_closedIssue': Issue.objects.filter(
                           website__repository=request.session['githubRepo'],
                           website__user=request.session['githubUser']).order_by("number"),
                       'githubRepo': request.session['githubRepo'],
                       "githubUser": request.session['githubUser']
                       })


def data(request,user,repo):
    by_closed=[]
    try:
        topDate=request.session.get('topDate','1/1/2050')
        btmDate=request.session.get('btmDate','1/1/1950')
        if topDate=='':
            topDate='1/1/2050'
        if btmDate=='':
            btmDate='1/1/1950'
        branche=request.session.get('branche','')
        if branche == '':
            by_closed = PR.objects.filter(website__repository=repo,website__user=user,
                                          branche__baseRefName="master",
                                          merged_at__lt=datetime.strptime(topDate, "%d/%m/%Y"),
                                          merged_at__gt=datetime.strptime(btmDate, "%d/%m/%Y")).order_by("merged_at")
        else:
            by_closed = PR.objects.filter(website__repository=repo,website__user=user,
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


def graph(request,user,repo):
    if request.method=="GET":
        request.session['githubUser']=user
        request.session['githubRepo']=repo
        return render(request, '../templates/index.html',
                          {'haveData': True,
                           'topDate': request.session.get('topDate',''), 'btmDate': request.session.get('btmDate',''), 'branche': request.session.get('branche',''),
                           'branches': Branche.objects.filter(website__repository=repo,
                                                              website__user=user),
                           'githubRepo': repo, "githubUser": user
                           })


    elif request.method=="POST":
        request.session['topDate'] = request.POST.get('topDate', '')
        request.session['btmDate'] = request.POST.get('btmDate', '')
        request.session['branche'] = request.POST.get('branche', '')
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

