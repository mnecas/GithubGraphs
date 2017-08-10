
import json
import time
from datetime import datetime
import os
import dateutil.parser
import requests
from django.core.serializers import serialize
from django.http import HttpResponse
from django.shortcuts import redirect, render

from .models import PR, Branche, Website,Add_websites

token = os.environ.get("TOKEN", "")


def websites(request):
    allwebs=""
    for website in Website.objects.all():
        allwebs+="<h3>"+website.user+"/"+website.repository+"</h3>"
    return HttpResponse(allwebs)
def index(request):
    if request.method == "POST":
        user = request.POST.get('user', 'openshift').lower()
        repo = request.POST.get('repo', 'openshift-ansible').lower()

        if (not 'githubUser' in request.session) or (not 'githubRepo' in request.session):
            request.session['githubUser'] = user
            request.session['githubRepo'] = repo
            request.session['branche'] = 'master'

        if not Website.objects.filter(user=user, repository=repo).exists():
            r2 = requests.get('https://api.github.com/repos/'+user+"/"+repo+"?access_token="+token).json()
            if str(r2)!="{'message': 'Not Found', 'documentation_url': 'https://developer.github.com/v3'}":
                if not Add_websites.objects.filter(user=user, repository=repo).exists():
                    Add_websites(user=user, repository=repo).save()
                return render(request, '../templates/index.html',{"message":"Repository was added on the list.","correct":True})
            else:
                return render(request, '../templates/index.html',{"message":"Invalid repository. ","correct":False})
                
        else:
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
