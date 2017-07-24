from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^issues/$', views.issues, name='issues'),
    url(r'^info/', views.info, name='info'),
    url(r'^data/', views.data, name='data'),
]
