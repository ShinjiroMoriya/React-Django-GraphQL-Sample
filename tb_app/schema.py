import graphene
from graphene_django.debug import DjangoDebug
from space.query import SpaceQuery
from news.query import NewsQuery
from account.query import AuthQuery
from account.mutations import (
    Register, Login, Logout, AccountUpdate, ResetPassword,
    ResetPasswordConfirm, DeleteAccount,
)
from space.mutations import SpaceContract


class Query(SpaceQuery, AuthQuery, NewsQuery):
    debug = graphene.Field(DjangoDebug)


class Mutations(graphene.ObjectType):
    register = Register.Field(
        description='新規登録'
    )
    login = Login.Field(
        description='ログイン'
    )
    logout = Logout.Field(
        description='ログアウト'
    )
    account_update = AccountUpdate.Field(
        description='アカウントデータ更新'
    )
    reset_password = ResetPassword.Field(
        description='パスワードの変更'
    )
    reset_password_confirm = ResetPasswordConfirm.Field(
        description='パスワードの変更確認'
    )
    delete_account = DeleteAccount.Field(
        description='アカウント削除'
    )
    space_contract = SpaceContract.Field(
        description='スペース契約'
    )
    debug = graphene.Field(DjangoDebug)


schema = graphene.Schema(query=Query, mutation=Mutations)
