from django.contrib import admin

from . import Request_to_api
from .models import PR, Website,Branche,Add_website
from django.contrib import admin
import os
token = os.environ.get("TOKEN", "")
def save_website(modeladmin, request, queryset):
    for qr in queryset:
        Website(user=qr.user,repository=qr.repository).save()
        web=Website.objects.get(user=qr.user,repository=qr.repository)
        Add_website.objects.filter(user=qr.user,repository=qr.repository).delete()
        requests=Request_to_api.Request(web=web)
        requests.add()
        
class Save(admin.ModelAdmin):
    actions = [save_website]

def update_repository(modeladmin, request, queryset):
    for qr in queryset:
        print(qr.user+"/"+qr.repository)
        web=Website.objects.get(user=qr.user,repository=qr.repository)
        requests=Request_to_api.Request(web=web)
        requests.update()
        
class Update(admin.ModelAdmin):
    actions = [update_websites]

admin.site.register(PR)
admin.site.register(Website,Update)
admin.site.register(Branche)
admin.site.register(Add_website,Save)