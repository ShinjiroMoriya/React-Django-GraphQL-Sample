from django.core.management.base import BaseCommand
from news.models import News
import string
import random


class Command(BaseCommand):
    def handle(self, *args, **options):
        data = [
            {
                'title': 'San Isidro',
                'content': 'Mexico',
                'active_date': '2018-05-04'
            },
            {
                'title': 'Cajueiro',
                'content': 'Brazil',
                'active_date': '2018-05-15'
            },
            {
                'title': 'Capão da Canoa',
                'content': 'Brazil',
                'active_date': '2018-01-06'
            },
            {
                'title': 'El Carmen',
                'content': 'Colombia',
                'active_date': '2018-04-14'
            },
            {
                'title': 'Den Haag',
                'content': 'Netherlands',
                'active_date': '2017-09-22'
            },
            {
                'title': 'Zel’va',
                'content': 'Belarus',
                'active_date': '2017-08-27'
            },
            {
                'title': 'Temeke',
                'content': 'China',
                'active_date': '2017-07-28'
            },
            {
                'title': 'Maromme',
                'content': 'France',
                'active_date': '2017-09-30'
            },
            {
                'title': 'Itapaci',
                'content': 'Brazil',
                'active_date': '2017-11-10'
            },
            {
                'title': 'Changtian',
                'content': 'China',
                'active_date': '2018-02-14'
            }
        ]

        try:
            for s in data:
                News.objects.create(
                    title=s.get('title'),
                    id=''.join([
                        random.choice(
                            string.ascii_letters + string.digits) for _ in
                        range(18)]),
                    content=s.get('content'),
                    active_date=s.get('active_date')
                )

        except Exception as ex:
            print(str(ex))
