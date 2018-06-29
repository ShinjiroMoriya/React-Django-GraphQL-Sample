import graphene
from graphene_django.debug import DjangoDebug
from account_token.models import AccountToken
from space.types import SpaceType
from space.models import Space
from tb_app.pagination import Pagination
from graphene_django.filter import DjangoFilterConnectionField
from django.conf import settings as s
from datetime import datetime
from tb_app.services import get_auth_token


class SpaceQuery(graphene.ObjectType):

    space = graphene.Field(
        SpaceType,
        description='get Space',
        space_id=graphene.String(default_value=None)
    )

    @staticmethod
    def resolve_space(_, __, **kwargs):
        space_id = kwargs.get('space_id')
        if space_id is not None:
            space = Space.get_space_by_id(space_id)
            if space.account is not None:
                if space.contract_end < datetime.now():
                    space.contract_status = False
                    space.account = None
                    space.contract_start = None
                    space.contract_end = None
                space.save()
            return space
        return None

    spaces = DjangoFilterConnectionField(
        SpaceType,
        page=graphene.Int(default_value=1),
    )

    @staticmethod
    def resolve_spaces(_, __, **kwargs):
        pagination = Pagination(
            page=kwargs.get('page'),
            per_page=s.SPACE_PERPAGE,
        )
        offset = pagination.offset
        per_page = pagination.per_page
        return [i for i in Space.objects.all()[offset: offset + per_page]]

    contract_spaces = DjangoFilterConnectionField(
        SpaceType,
        order=graphene.List(graphene.String),
    )

    @staticmethod
    def resolve_contract_spaces(_, info, **kwargs):
        token = get_auth_token(info.context)
        order = kwargs.get('order')

        if order is None:
            order = ['-created_date']

        account_token = AccountToken.get_account({'token': token})
        if account_token is None:
            return None

        return Space.get_spaces({
            'account': account_token.account,
            'contract_end__gte': datetime.now(),
        }).order_by(*order)

    top_spaces = DjangoFilterConnectionField(
        SpaceType,
        limit=graphene.Int(default_value=3),
    )

    @staticmethod
    def resolve_top_spaces(_, __, **kwargs):
        return [i for i in Space.objects.all()[: int(kwargs.get('limit'))]]

    debug = graphene.Field(DjangoDebug)
