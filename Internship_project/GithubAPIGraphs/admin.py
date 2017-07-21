from django.contrib import admin
from .models import PR, Issue, Website,Branche
# Register your models here.

admin.site.register(PR)
admin.site.register(Issue)
admin.site.register(Website)
admin.site.register(Branche)