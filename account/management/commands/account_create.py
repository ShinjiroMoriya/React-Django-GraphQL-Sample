from django.core.management.base import BaseCommand
from account.models import Account
import string
import random


class Command(BaseCommand):
    def handle(self, *args, **options):
        data = {
            'name': 'Sample Man',
            'email': 'sample@example.com',
        }

        try:
            Account.objects.create(
                id=''.join([
                    random.choice(
                        string.ascii_letters + string.digits) for _ in
                    range(18)]),
                name=data.get('name'),
                email=data.get('email')
            )

        except Exception as ex:
            print(str(ex))
