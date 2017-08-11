"""ADD funcition: at the end of the month check all websites and continue getting data"""

from django.core.management.base import BaseCommand
from ...models import Website,Add_websites
import requests
import os
from ... import Request_to_api
token = os.environ.get("TOKEN", "")


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('website', type=str, nargs='?', default="")

    def request(self, web):
        requests=Request_to_api.Request(web=web)
        requests.add()
    def handle(self, *args, **options):
        _website = options.get('website', None)
        if not (Website.objects.filter(user=_website.split("/")[0], repository=_website.split("/")[1]).exists()):
            try:
                if(Add_websites.objects.filter(user=_website.split("/")[0], repository=_website.split("/")[1]).exists()):
                    _web = Add_websites.objects.get(user=_website.split(
                            "/")[0], repository=_website.split("/")[1])
                    Website(user=_web.user,repository=_web.repository).save()
                    web=Website.objects.get(user=_web.user,repository=_web.repository)
                    self.request(web)
                    Add_websites.objects.get(user=_website.split(
                            "/")[0], repository=_website.split("/")[1]).delete()
                else:
                    r2 = requests.get('https://api.github.com/repos/' + _website.split("/")[0] + "/" + _website.split("/")[1] + "?access_token=" + token).json()
                    if str(r2) != "{'message': 'Not Found', 'documentation_url': 'https://developer.github.com/v3'}":
                        Website(user=_website.split("/")[0], repository=_website.split("/")[1]).save()
                        web = Website.objects.get(user=_website.split("/")[0], repository=_website.split("/")[1])
                        self.request(web)
                    else:
                        print("Invalid repository")

            except Exception as e:
                print("Invalid repository")
        else:
            print("Website is already in the database")

