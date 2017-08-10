from datetime import datetime, timezone
from django.utils.timezone import now
from django.db import models


# Create your models here.
from django.template.backends import django


class Website(models.Model):
    user = models.CharField(max_length=150, default="")
    repository = models.CharField(max_length=150, default="", primary_key=True)

    def __str__(self):
        return str(self.repository)


class Branche(models.Model):
    website = models.ForeignKey(Website)
    baseRefName = models.CharField(max_length=250, default="")

    def __str__(self):
        return str(self.baseRefName)


class PR(models.Model):
    website = models.ForeignKey(Website)
    branche = models.ForeignKey(Branche)
    number = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=now, blank=True)
    merged_at = models.DateTimeField(default=now, blank=True)
    state = models.CharField(max_length=20, default="")
    cursor = models.CharField(max_length=50, default="")
    title = models.CharField(max_length=250, default="")
    updated_at = models.DateTimeField(default=now, blank=True)

    def __str__(self):
        return str(self.title)

class Add_websites(models.Model):
    user = models.CharField(max_length=150, default="")
    repository = models.CharField(max_length=150, default="", primary_key=True)

    def __str__(self):
        return str(self.user)+"/" +str(self.repository)
