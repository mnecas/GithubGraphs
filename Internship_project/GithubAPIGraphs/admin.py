from django.contrib import admin

from . import Request_to_api
from .models import PR, Website,Branche,Add_websites
from django.contrib import admin
import os
token = os.environ.get("TOKEN", "")
def save_website(modeladmin, request, queryset):
    for qr in queryset:
        Website(user=qr.user,repository=qr.repository).save()
        web=Website.objects.get(user=qr.user,repository=qr.repository)
        Add_websites.objects.filter(user=qr.user,repository=qr.repository).delete()
        requests=Request_to_api.Request(web=web)
        requests.add()
        
class ArticleAdmin(admin.ModelAdmin):
    actions = [save_website]

admin.site.register(PR)
admin.site.register(Website)
admin.site.register(Branche)
admin.site.register(Add_websites,ArticleAdmin)