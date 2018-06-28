import graphene
from account.models import Account
from graphene_django import DjangoObjectType


class AccountType(DjangoObjectType):
    class Meta:
        model = Account
        description = " Type definition for a single Account "
        exclude_fields = ('password',)


class AuthType(graphene.ObjectType):
    status = graphene.Boolean()
    expire = graphene.DateTime()
    token = graphene.String()
    account = graphene.Field(AccountType)
