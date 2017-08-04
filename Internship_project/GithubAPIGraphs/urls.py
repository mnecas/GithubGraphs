from django.conf.urls import url, include
from . import views
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^changeGraph/$', views.change, name='change'),
    url(r'^(?P<user>[a-zA-Z0-9-._]+)/(?P<repo>[a-zA-Z0-9-_.]+)/',include([
        url(r'^data/$', views.data, name='data'),
        url(r'^$', views.graph, name='graph'),
    ])),
]
