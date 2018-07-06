import graphene
from datetime import datetime
from account_token.models import AccountToken
from space.models import Space
from space.types import SpaceType
from tb_app.types import ErrorsType
from tb_app.services import string_to_date, get_auth_token
from graphene_django.filter import DjangoFilterConnectionField


class SpaceContract(graphene.Mutation):
    """
    Mutation to Space Contract
    """
    class Arguments:
        startDate = graphene.String(required=True)
        endDate = graphene.String(required=True)
        spaceId = graphene.String(required=True)
        order = graphene.List(graphene.String)

    success = graphene.Boolean()
    errors = graphene.List(ErrorsType)
    space = graphene.Field(SpaceType)
    contract_spaces = DjangoFilterConnectionField(
        SpaceType,
    )

    @staticmethod
    def mutate(_, info, **kwargs):
        try:
            start_date = string_to_date(kwargs.get('startDate'))
            end_date = string_to_date(kwargs.get('endDate'))
            space_id = kwargs.get('spaceId')
            token = get_auth_token(info.context)

            account_token = AccountToken.get_account({'token': token})
            if account_token is None:
                return SpaceContract(
                    success=False,
                    errors=[
                        ErrorsType(
                            field='token',
                            message='トークンが無効です。'
                        )
                    ]
                )

            if account_token.expire < datetime.now():
                account_token.delete()
                return SpaceContract(
                    success=False,
                    errors=[
                        ErrorsType(
                            field='expired',
                            message='期限切れです。'
                        )
                    ]
                )

            space = Space.get_empty_space_by_id(space_id)
            if space is None:
                return SpaceContract(
                    success=False,
                    errors=[
                        ErrorsType(
                            field='space',
                            message='既に契約してます。'
                        )
                    ]
                )

            space.contract_status = True
            space.contract_start = start_date
            space.contract_end = end_date
            space.account = account_token.account
            space.save()

            order = kwargs.get('order')

            if order is None:
                order = ['-created_date']

            contract_spaces = Space.get_spaces({
                'account': account_token.account,
                'contract_end__gte': datetime.now(),
            }).order_by(*order)

            return SpaceContract(
                success=True,
                space=space,
                contract_spaces=contract_spaces,
            )

        except Exception as e:

            return SpaceContract(
                success=False,
                errors=[
                    ErrorsType(
                        field='exception',
                        message=str(e)
                    )
                ]
            )
