from django.db import models
from account.models import Account


class Space(models.Model):
    class Meta:
        db_table = '"salesforce\".\"space__c"'
        ordering = ['-created_date']

    id = models.CharField(primary_key=True, unique=True, max_length=100,
                          db_column='sfid')
    name = models.CharField(max_length=80)
    thumbnail_image = models.CharField(max_length=100,
                                       db_column='thumbnail_image__c')
    main_image = models.CharField(max_length=100,
                                  db_column='main_image__c')
    description = models.TextField(blank=True, null=True,
                                   db_column='description__c')
    contract_status = models.BooleanField(default=False,
                                          db_column='contract_status__c')
    contract_start = models.DateTimeField(null=True, blank=True,
                                          db_column='contract_start__c')
    contract_end = models.DateTimeField(null=True, blank=True,
                                        db_column='contract_end__c')
    price = models.FloatField(null=True, blank=True,
                              db_column='price__c')
    account = models.ForeignKey(to=Account, db_column='contact_id__c',
                                related_name="spaces",
                                on_delete=models.SET_NULL, null=True)
    created_date = models.DateTimeField(auto_now_add=True,
                                        db_column='created_date__c')
    updated_date = models.DateTimeField(auto_now=True,
                                        db_column='updated_date__c')

    def __str__(self):
        return self.name

    @classmethod
    def get_space_by_id(cls, space_id) -> 'Space' or None:
        return cls.objects.filter(id=space_id).first()

    @classmethod
    def get_empty_space_by_id(cls, space_id) -> 'Space' or None:
        return cls.objects.filter(id=space_id, account=None).first()

    @classmethod
    def get_spaces(cls, data: dict) -> 'Space' or None:
        return cls.objects.filter(**data)
