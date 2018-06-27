import graphene
from datetime import datetime, timedelta
from account.types import AuthType
from account_token.models import AccountToken


class AuthQuery(graphene.ObjectType):
    auth = graphene.Field(
        AuthType,
        token=graphene.String(default_value=None)
    )

    @staticmethod
    def resolve_auth(_, __, **kwargs):
        token = kwargs.get('token')
        if token is not None:
            account_token = AccountToken.get_account({'token': token})
            if account_token is not None:
                account_token.expire = datetime.now() + timedelta(days=1)
                account_token.save()
                return AuthType(status=True, expire=account_token.expire,
                                account=account_token.account)
        return AuthType(status=False, expire=None, account=None)
