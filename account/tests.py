from django.test import TestCase
from django.test.client import Client
from tb_app.schema import schema
from account.models import Account
from django.contrib.auth.hashers import make_password


class AccountTests(TestCase):

    login_mutation = """
    mutation(
        $email: String!,
        $password: String!
    ) {
        login (
            email: $email,
            password: $password
        ) {
            auth {
                status
                expire
                token
                account {
                    id
                    name
                }
            }
            success
            errors {
                field
                message
            }
        }
    }
    """

    logout_mutation = """
    mutation(
        $token: String!,
    ) {
        logout (
            token: $token
        ) {
            success
            errors {
                field
                message
            }
            auth {
                status
                expire
                token
                account {
                    id
                    name
                }
            }
        }
    }
    """

    register_mutation = """
    mutation(
        $email: String!,
        $password: String!
    ) {
        register (
            email: $email,
            password: $password
        ) {
            auth {
                status
                expire
                token
                account {
                    id
                    name
                }
            }
            success
            errors {
                field
                message
            }
        }
    }
    """

    update_mutation = """
    mutation(
        $token: String!,
        $name: String!
    ) {
        accountUpdate (
            token: $token
            name: $name
        ) {
            auth {
                status
                expire
                token
                account {
                    id
                    name
                }
            }
            success
            errors {
                field
                message
            }
        }
    }
    """

    reset_password_mutation = """
    mutation(
        $email: String!
    ) {
        resetPassword(
            email: $email
        ) {
            success
            sendToken
            errors {
                field
                message
            }
        }
    }
    """

    reset_password_confirm_mutation = """
    mutation(
        $token: String!,
        $password: String!
    ) {
        resetPasswordConfirm(
            token: $token,
            password: $password
        ) {
            success
            auth {
                status
                token
                expire
                account {
                    id
                    name
                }
            }
            errors {
                field
                message
            }
        }
    }
    """

    delete_mutation = """
    mutation(
        $email: String!,
        $password: String!
    ) {
        deleteAccount(
            email: $email,
            password: $password        
        ) {
            success
            errors {
                field
                message
            }
        }
    }
    """

    @classmethod
    def setUpTestData(cls):
        Account.objects.create(
            id='12345',
            name='sample man',
            email='sample+12345@tam-bourine.co.jp',
            is_active=False,
        )

        Account.objects.create(
            id='67898765',
            name='sample man',
            email='sample+test@tam-bourine.co.jp',
            password=make_password('test12345'),
            is_active=True,
        )

        Account.objects.create(
            id='1sssd',
            name='sample man',
            email='sample+dev@tam-bourine.co.jp',
            password=make_password('test12345'),
            is_active=True,
        )

    def setUp(self):
        self.client = Client()

    def test_login_mutation_success(self):
        result = schema.execute(
            self.login_mutation,
            variable_values={
                'email': 'sample+test@tam-bourine.co.jp',
                'password': 'test12345',
            }
        )
        assert result.data['login']['errors'] is None
        assert result.data['login']['auth']['token'] is not None
        assert result.data['login']['success'] is True

    def test_logout_mutation_success(self):
        login_result = schema.execute(
            self.login_mutation,
            variable_values={
                'email': 'sample+test@tam-bourine.co.jp',
                'password': 'test12345',
            }
        )
        token = login_result.data['login']['auth']['token']
        result = schema.execute(
            self.logout_mutation,
            variable_values={
                'token': token,
            }
        )
        assert result.data['logout']['errors'] is None
        assert result.data['logout']['success'] is True

    def test_register_mutation_success(self):
        result = schema.execute(
            self.register_mutation,
            variable_values={
                'email': 'sample+12345@tam-bourine.co.jp',
                'password': 'test12345'
            }
        )
        assert result.data['register']['errors'] is None
        assert result.data['register']['success'] is True

    def test_account_update_mutation_success(self):
        before_data = Account.get_account(
            {'email': 'sample+test@tam-bourine.co.jp'}
        )

        before_name = before_data.name

        login_result = schema.execute(
            self.login_mutation,
            variable_values={
                'email': 'sample+test@tam-bourine.co.jp',
                'password': 'test12345',
            }
        )
        token = login_result.data['login']['auth']['token']

        result = schema.execute(
            self.update_mutation,
            variable_values={
                'token': token,
                'name': 'test_sample',
            }
        )
        assert result.data[
                   'accountUpdate'
               ]['auth']['account']['name'] != before_name

    def test_reset_password_mutation_success(self):
        result = schema.execute(
            self.reset_password_mutation,
            variable_values={
                'email': 'sample+test@tam-bourine.co.jp',
            }
        )
        assert result.data['resetPassword']['errors'] is None
        assert result.data['resetPassword']['sendToken'] is not None
        assert result.data['resetPassword']['success'] is True

    def test_reset_password_confirm_mutation_success(self):
        send_result = schema.execute(
            self.reset_password_mutation,
            variable_values={
                'email': 'sample+test@tam-bourine.co.jp',
            }
        )
        token = send_result.data['resetPassword']['sendToken']
        password_result = schema.execute(
            self.reset_password_confirm_mutation,
            variable_values={
                'token': token,
                'password': "qwerty1234",
            }
        )
        assert password_result.data['resetPasswordConfirm']['errors'] is None
        assert password_result.data['resetPasswordConfirm']['success'] is True

        login_result = schema.execute(
            self.login_mutation,
            variable_values={
                'email': 'sample+test@tam-bourine.co.jp',
                'password': 'qwerty1234',
            }
        )
        assert login_result.data['login']['errors'] is None
        assert login_result.data['login']['success'] is True

    def test_delete_mutation_success(self):
        result = schema.execute(
            self.delete_mutation,
            variable_values={
                'email': 'sample+dev@tam-bourine.co.jp',
                'password': 'test12345',
            }
        )
        assert result.data['deleteAccount']['errors'] is None
        assert result.data['deleteAccount']['success'] is True
