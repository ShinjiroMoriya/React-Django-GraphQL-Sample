from django.db import models
from datetime import datetime


class News(models.Model):

    class Meta:
        db_table = '"salesforce\".\"news__c"'
        ordering = ['-active_date']

    id = models.CharField(primary_key=True, unique=True, max_length=100,
                          db_column='sfid')
    name = models.CharField(max_length=80, blank=True, null=True,
                            db_column='name')
    content = models.TextField(blank=True, null=True, db_column='content__c')
    is_active = models.BooleanField(default=False,
                                    db_column='is_active__c')
    active_date = models.DateTimeField(db_column='active_date__c')

    def __str__(self):
        return self.name

    @classmethod
    def get_news_item(cls, data: dict) -> 'News' or None:
        data.update({
            "is_active": True,
            'active_date__lte': datetime.now()
        })
        return cls.objects.filter(**data).first()

    @classmethod
    def get_news_items(cls) -> 'News' or None:
        return cls.objects.filter(**{
            "is_active": True,
            'active_date__lte': datetime.now()
        })
