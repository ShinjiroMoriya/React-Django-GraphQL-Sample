import uuid
from django.db import models
from datetime import datetime
from account.models import Account


class AccountToken(models.Model):
    class Meta:
        db_table = '"public\".\"account_token"'
        ordering = ['-created_date']

    id = models.UUIDField(primary_key=True, db_index=True, unique=True,
                          default=uuid.uuid4)
    token = models.CharField(max_length=255)
    account = models.ForeignKey(Account, on_delete=models.CASCADE,
                                related_name="account")
    expire = models.DateTimeField(default=datetime.now)
    created_date = models.DateTimeField(auto_now_add=True)

    @classmethod
    def get_token(cls, data: dict) -> 'AccountToken' or None:
        return cls.objects.filter(**data).first()

    @classmethod
    def get_account(cls, data: dict) -> 'AccountToken' or None:
        data.update({
            'account__is_active': True
        })
        return cls.objects.filter(**data).select_related('account').first()

    @classmethod
    def get_accounts(cls, data: dict) -> 'AccountToken' or None:
        data.update({
            'account__is_active': True
        })
        return cls.objects.filter(**data).select_related()
