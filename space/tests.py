from django.test import TestCase
from django.test.client import Client
from tb_app.schema import schema
from account.models import Account
from space.models import Space
from django.contrib.auth.hashers import make_password


class SpaceTests(TestCase):

    space_contract_query = """
    mutation(
        $startDate: String!,
        $endDate: String!,
        $spaceId: String!,
        $token: String!
    ) {
        spaceContract(
            startDate: $startDate,
            endDate: $endDate,
            spaceId: $spaceId,
            token: $token
        ) {
            success
            errors {
                field
                message
            }
            space {
                pk
                name
            }
        }
    }
    """
    login_query = """
    mutation(
        $email: String!,
        $password: String!
    ) {
        login (
            email: $email,
            password: $password
        ) {
            expire
            token
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
        Space.objects.create(
            id="5e07482b-6b1e-48c7-941f-072e91b2df3c",
            name='スペース新宿',
            description="テストです",
            price="15000"
        )

        Account.objects.create(
            name='test_jiro',
            email='moriya+dev@tam-bourine.co.jp',
            password=make_password('02080208'),
            is_active=True,
        )

    def setUp(self):
        self.client = Client()

    def test_space_contract_mutation_success(self):
        login_result = schema.execute(
            self.login_query,
            variable_values={
                'email': 'moriya+dev@tam-bourine.co.jp',
                'password': '02080208',
            }
        )
        token = login_result.data['login']['token']
        result = schema.execute(
            self.space_contract_query,
            variable_values={
                'token': token,
                'spaceId': '5e07482b-6b1e-48c7-941f-072e91b2df3c',
                'startDate': '2018-06-20 12:00',
                'endDate': '2018-07-20 12:00',
            }
        )

        assert result.data['spaceContract']['errors'] is None
        assert result.data['spaceContract']['success'] is True
