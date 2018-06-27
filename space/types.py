from graphene_django import DjangoObjectType
from space.models import Space
from graphene import Node
import graphene
from math import ceil
from django.conf import settings as s


class Connection(graphene.Connection):
    total_count = graphene.Int()
    pages = graphene.Int()
    per_page = graphene.Int()
    current_page = graphene.Int()

    try:
        total = Space.objects.all().count()
    except:
        total = 0

    class Meta:
        abstract = True

    def resolve_total_count(self, __):
        return self.total

    def resolve_pages(self, __):
        return int(ceil(self.total / float(s.SPACE_PERPAGE)))

    @staticmethod
    def resolve_per_page(_, __):
        return s.SPACE_PERPAGE

    @staticmethod
    def resolve_current_page(_, info):
        return info.variable_values.get('page', 1)


class SpaceType(DjangoObjectType):

    pk = graphene.String(source='pk')

    class Meta:
        model = Space
        filter_fields = {
            'name': ['exact'],
            'contract_end': ['gte'],
        }
        interfaces = (Node,)
        connection_class = Connection
