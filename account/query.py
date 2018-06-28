import graphene
from datetime import datetime, timedelta
from account.types import AuthType
from account_token.models import AccountToken


class AuthQuery(graphene.ObjectType):
    auth = graphene.Field(AuthType)

    @staticmethod
    def resolve_auth(_, info):
        token = info.context.META.get('HTTP_AUTHORIZATION')
        if token is not None:
            account_token = AccountToken.get_account({'token': token})
            if account_token is not None:
                account_token.expire = datetime.now() + timedelta(days=1)
                account_token.save()
                return AuthType(
                    status=True,
                    token=account_token.token,
                    expire=account_token.expire,
                    account=account_token.account
                )
        return AuthType(status=False, token=None, expire=None, account=None)
