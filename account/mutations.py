import uuid
import graphene
from django.db import transaction
from datetime import datetime, timedelta
from django.core.mail import EmailMessage
from django.contrib.auth.hashers import make_password
from account.models import Account
from account_token.models import AccountToken
from account.types import AccountType, AuthType
from tb_app.types import ErrorsType
from tb_app.fernet_cipher import fernet
from tb_app.serializer import (
    serializer_time_dumps, serializer_time_loads, time_seconds,
)


class Register(graphene.Mutation):
    """
    Mutation to register a account
    """
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.List(ErrorsType)
    token = graphene.String()
    auth = graphene.Field(AuthType)

    @staticmethod
    @transaction.atomic
    def mutate(_, __, **kwargs):

        sid = transaction.savepoint()

        email = kwargs.get('email')
        password = kwargs.get('password')

        try:
            account = Account.get_account({
                'email': email
            })

            if account is None:
                return Register(
                    success=False,
                    errors=[
                        ErrorsType(
                            field='exception',
                            message='アカウントが存在しません。'
                        )
                    ]
                )

            if account.is_active is True:
                return Register(
                    success=False,
                    errors=[
                        ErrorsType(
                            field='email',
                            message='登録済みのEメールアドレスです。'
                        )
                    ]
                )

            account.password = make_password(password)
            account.is_active = True
            account.save()

            account_token = AccountToken.objects.create(
                token=fernet.encrypt(str(account.id)),
                expire=datetime.now() + timedelta(days=1),
                account=account,
            )

            transaction.savepoint_commit(sid)

            return Register(
                success=True,
                token=account_token.token,
                auth=AuthType(
                    status=True,
                    expire=account_token.expire,
                    account=account,
                )
            )

        except Exception as e:

            transaction.savepoint_rollback(sid)

            return Register(
                success=False,
                errors=[
                    ErrorsType(
                        field='exception',
                        message=str(e)
                    )
                ]
            )


class AccountUpdate(graphene.Mutation):
    """
    Mutation to update a account
    """
    class Arguments:
        token = graphene.String(required=True)
        name = graphene.String()
        email = graphene.String()

    success = graphene.Boolean()
    errors = graphene.List(ErrorsType)
    account = graphene.Field(AccountType)

    @staticmethod
    def mutate(_, __, **kwargs):
        try:
            token = kwargs.get('token')
            token_data = serializer_time_loads(
                fernet.decrypt(token), time_seconds(days=1))
            if fernet.decrypt(token) is None or token_data is None:
                return AccountUpdate(
                    success=False,
                    errors=[
                        ErrorsType(
                            message="トークンが無効です。"
                        )
                    ]
                )

            account = Account.get_account({
                "id": token_data.get('id'),
            })
            name = kwargs.get('name', account.name)
            email = kwargs.get('email', account.email)

            account.name = name
            account.email = email
            account.save()

            return AccountUpdate(
                success=True,
                account=account
            )

        except Exception as e:
            return AccountUpdate(
                success=False,
                errors=[
                    ErrorsType(
                        message=str(e)
                    )
                ]
            )


class Login(graphene.Mutation):
    """
    Mutation to login a account
    """
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.List(ErrorsType)
    token = graphene.String()
    account = graphene.Field(AccountType)
    auth = graphene.Field(AuthType)

    @staticmethod
    def mutate(_, __, **kwargs):
        email = kwargs.get('email')
        password = kwargs.get('password')

        try:
            status, account = Account.is_authenticate({
                'email': email,
                'password': password,
            })
            if account is None:
                return Login(
                    success=status,
                    errors=[
                        ErrorsType(
                            field='account',
                            message='アカウントが存在しません。'
                        )
                    ]
                )
            if status is True:
                AccountToken.objects.filter(expire__lt=datetime.now()).delete()
                account_token = AccountToken.objects.create(
                    token=fernet.encrypt(str(account.id)),
                    expire=datetime.now() + timedelta(days=1),
                    account=account,
                )
                return Login(
                    success=status,
                    account=account,
                    token=account_token.token,
                    auth=AuthType(
                        status=True,
                        expire=account_token.expire,
                        account=account_token.account
                    )
                )
            else:
                return Login(
                    success=status,
                    errors=[
                        ErrorsType(
                            field='password',
                            message='パスワードが違います。'
                        )
                    ]
                )

        except Exception as e:
            return Login(
                success=False,
                errors=[
                    ErrorsType(
                        field='Exception',
                        message=str(e)
                    )
                ]
            )


class Logout(graphene.Mutation):
    """
    Mutation to logout a account
    """
    class Arguments:
        token = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.List(ErrorsType)
    auth = graphene.Field(AuthType)

    @staticmethod
    def mutate(_, __, **kwargs):
        try:
            token = kwargs.get('token')
            if fernet.decrypt(token) is None:
                return Logout(
                    success=False,
                    errors=[
                        ErrorsType(
                            field='token',
                            message='トークンが無効です。'
                        )
                    ]
                )

            account_token = AccountToken.get_token({
                'token': token,
            })
            if account_token is None:
                return Logout(
                    success=False,
                    errors=[
                        ErrorsType(
                            field='token',
                            message='トークンが無効です。'
                        )
                    ]
                )
            account_token.delete()
            return Logout(
                success=True,
                auth=AuthType(status=False, expire=None),
            )

        except Exception as e:
            return Logout(
                success=False,
                errors=[
                    ErrorsType(
                        field='Exception',
                        message=str(e)
                    )
                ]
            )


class RefreshToken(graphene.Mutation):
    """
    Mutation to re_authenticate a Account
    """
    class Arguments:
        token = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.List(ErrorsType)
    token = graphene.String()
    auth = graphene.Field(AuthType)

    @staticmethod
    def mutate(_, __, token):
        try:
            account_id = fernet.decrypt(token)
            old_account_token = AccountToken.get_accounts(
                {'token': token})
            if len(old_account_token) != 0:
                old_account_token.delete()
            else:
                return RefreshToken(
                    success=False,
                    errors=[
                        ErrorsType(
                            field='token',
                            message='トークンが無効です。'
                        )
                    ]
                )

            account = Account.get_account({'id': account_id})

            if account is None:
                return RefreshToken(
                    success=False,
                    errors=[
                        ErrorsType(
                            field='account',
                            message='アカウントが存在しません。'
                        )
                    ]
                )

            new_account_token = AccountToken.objects.create(
                token=fernet.encrypt(str(account.id)),
                expire=datetime.now() + timedelta(days=1),
                account=account,
            )

            return RefreshToken(
                success=True,
                token=new_account_token.token,
                auth=AuthType(
                    status=True,
                    expire=new_account_token.expire,
                    account=account,
                )
            )

        except Exception as e:
            return RefreshToken(
                success=False,
                errors=[
                    ErrorsType(
                        field='exception',
                        message=str(e)
                    )
                ],
            )


class ResetPassword(graphene.Mutation):
    """
    Mutation for requesting a password reset email
    """
    class Arguments:
        email = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.List(ErrorsType)

    @staticmethod
    @transaction.atomic
    def mutate(_, info, email):

        sid = transaction.savepoint()

        try:
            account = Account.get_account({'email': email, 'is_active': True})
            if account is None:
                return ResetPassword(
                    success=False,
                    errors=[
                        ErrorsType(
                            field='email',
                            message='アカウントが存在しません。'
                        )
                    ]
                )

            uuid_token = uuid.uuid4()
            account.password_token = uuid_token
            account.save()

            serialized_token = serializer_time_dumps(
                str(uuid_token),
                expires=time_seconds(days=1)
            )

            try:
                domain = info.context.get_host()
            except:
                domain = ''

            email_message = EmailMessage(
                subject='パスワード再発行',
                from_email='BASYO KASHI<app@tam-bourine.co.jp>',
                to=[email],
                body="""
                <h3>変更手続きをしてください。</h3>
                <p><a href="https://{domain}/password/{token}">
                https://{domain}/password/{token}</a></p>
                <p>有効期間は発行から24時間以内で登録ください。</p>
                """.format(domain=domain, token=str(serialized_token))
            )
            email_message.content_subtype = 'html'
            email_result = email_message.send()
            if email_result != 0:

                transaction.savepoint_commit(sid)

                return ResetPassword(success=True)

            else:

                transaction.savepoint_rollback(sid)

                return ResetPassword(
                    success=False,
                    errors=[
                        ErrorsType(
                            field='send email',
                            message='Eメールが送れませんでした。'
                        )
                    ]
                )

        except Exception as e:

            transaction.savepoint_rollback(sid)

            return ResetPassword(
                success=False,
                errors=[
                    ErrorsType(
                        field='email',
                        message=str(e)
                    )
                ]
            )


class ResetPasswordConfirm(graphene.Mutation):
    """
    Mutation for requesting a password reset email
    """
    class Arguments:
        token = graphene.String(required=True)
        password = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.List(ErrorsType)
    account = graphene.Field(AccountType)
    token = graphene.String()

    @staticmethod
    def mutate(_, __, **kwargs):
        try:
            token = kwargs.get('token')
            password = kwargs.get('password')

            load_token = serializer_time_loads(
                token, time_seconds(days=1))
            if load_token is None:
                return ResetPasswordConfirm(
                    success=False,
                    errors=[
                        ErrorsType(
                            field='token',
                            message=('トークンが無効です。もう一度、'
                                     'Eメールをお送りください。')
                        )
                    ]
                )

            account = Account.get_account({'password_token': load_token})
            if account is None:
                return ResetPasswordConfirm(
                    success=False,
                    errors=[
                        ErrorsType(
                            field='account',
                            message='アカウントが存在しません。'
                        )
                    ]
                )
            account.password_token = None
            account.password = make_password(password)
            account.save()
            AccountToken.get_accounts({"account": account}).delete()
            account_token = AccountToken.objects.create(
                token=fernet.encrypt(str(account.id)),
                expire=datetime.now() + timedelta(days=1),
                account=account,
            )

            return ResetPasswordConfirm(
                success=True,
                account=account,
                token=account_token.token,
                expire=account_token.expire,
            )

        except Exception as e:
            return ResetPasswordConfirm(
                success=False,
                errors=[
                    ErrorsType(
                        field='exception',
                        message=str(e)
                    )
                ]
            )


class DeleteAccount(graphene.Mutation):
    """
    Mutation to delete an account
    """
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.List(ErrorsType)

    @staticmethod
    def mutate(_, __, **kwargs):
        try:
            email = kwargs.get('email')
            password = kwargs.get('password')
            status, account = Account.is_authenticate({
                'email': email,
                'password': password,
            })
            if account is None:
                return DeleteAccount(
                    success=status,
                    errors=[
                        ErrorsType(
                            field='account',
                            message='アカウントが存在しません。'
                        )
                    ]
                )

            if status is True:
                account_token = AccountToken.get_accounts({'account': account})
                account_token.delete()

                account.is_active = False
                account.save()

                return DeleteAccount(
                    success=status,
                )
            else:
                return DeleteAccount(
                    success=status,
                    errors=[
                        ErrorsType(
                            field='password',
                            message='パスワードが違います。'
                        )
                    ]
                )

        except Exception as e:
            return DeleteAccount(
                success=False,
                errors=[
                    ErrorsType(
                        field='Exception',
                        message=str(e)
                    )
                ]
            )
