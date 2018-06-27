from django.core.management.base import BaseCommand
from news.models import News
import string
import random


class Command(BaseCommand):
    def handle(self, *args, **options):

        data = [
        {"id": 1, "title": "San Isidro", "content": "Mexico",
          "active_date": "2018-05-04"},
         {"id": 2, "title": "Cajueiro", "content": "Brazil",
          "active_date": "2018-05-15"},
         {"id": 3, "title": "Capão da Canoa", "content": "Brazil",
          "active_date": "2018-01-06"},
         {"id": 4, "title": "El Carmen", "content": "Colombia",
          "active_date": "2018-04-14"},
         {"id": 5, "title": "Den Haag", "content": "Netherlands",
          "active_date": "2017-09-22"},
         {"id": 6, "title": "Zel’va", "content": "Belarus",
          "active_date": "2017-08-27"},
         {"id": 7, "title": "Temeke", "content": "China",
          "active_date": "2017-07-28"},
         {"id": 8, "title": "Maromme", "content": "France",
          "active_date": "2017-09-30"},
         {"id": 9, "title": "Itapaci", "content": "Brazil",
          "active_date": "2017-11-10"},
         {"id": 10, "title": "Changtian", "content": "China",
          "active_date": "2018-02-14"}]

        try:
            for s in data:
                News.objects.create(
                    title=s.get('title'),
                    id=''.join([
                        random.choice(
                            string.ascii_letters + string.digits) for _ in
                        range(18)]),
                    content=s.get('content'),
                    active_date=s.get("active_date")
                )

        except Exception as ex:
            print(str(ex))
