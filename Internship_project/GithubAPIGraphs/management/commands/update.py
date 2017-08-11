"""ADD funcition: at the end of the month check all websites and continue getting data"""

from django.core.management.base import BaseCommand, CommandError
from ...models import Website, Branche, PR
from ... import Request_to_api
import os
token=os.environ.get("TOKEN","")

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('website', type=str, nargs='?', default="")

    def request(self, web):
        requests=Request_to_api.Request(web=web)
        requests.update()
    def handle(self, *args, **options):
        _website = options.get('website', None)
        if _website == "":
            for web in Website.objects.all():
                print(web.user + "/" + web.repository)
                self.request(web)
        else:
            try:
                web = Website.objects.get(user=_website.split(
                    "/")[0], repository=_website.split("/")[1])
                self.request(web)
            except Exception as e:
                print("Invalid repository")
