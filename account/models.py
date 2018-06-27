from django.db import models
from django.contrib.auth.hashers import check_password


class Account(models.Model):

    class Meta:
        db_table = '"salesforce\".\"contact"'
        ordering = ['-updated_date']

    id = models.CharField(primary_key=True, unique=True, max_length=100,
                          db_column='sfid')
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=100,
                                blank=True, null=True,
                                db_column='password__c')
    password_token = models.UUIDField(blank=True, null=True,
                                      db_column='password_token__c')
    is_active = models.BooleanField(default=False,
                                    db_column='is_active__c')
    created_date = models.DateTimeField(auto_now_add=True,
                                        db_column='created_date__c')
    updated_date = models.DateTimeField(auto_now=True,
                                        db_column='update_date__c')

    def __str__(self):
        return self.name

    @classmethod
    def get_account(cls, data: dict) -> 'Account' or None:
        return cls.objects.filter(**data).first()

    @classmethod
    def get_accounts(cls, data: dict) -> 'Account' or None:
        return cls.objects.filter(**data)

    @classmethod
    def is_authenticate(cls, data: dict) -> [bool, 'Account' or None]:
        account = cls.get_account({
            'email': data.get('email'),
            'is_active': True,
        })
        if account is None:
            return False, None

        status = check_password(data.get('password'), account.password)

        return status, account
