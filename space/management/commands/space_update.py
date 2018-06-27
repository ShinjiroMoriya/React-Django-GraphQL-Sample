from django.core.management.base import BaseCommand
from space.models import Space
import string
import random


class Command(BaseCommand):
    def handle(self, *args, **options):

        try:
            count = 1
            for s in Space.objects.all():
                random_str = ''.join(
                    [random.choice(string.ascii_letters + string.digits) for i
                     in range(15)])
                s.sfid = random_str
                s.save()
                count += 1

        except Exception as ex:
            print(str(ex))
