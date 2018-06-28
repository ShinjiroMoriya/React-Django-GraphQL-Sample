from django.test import TestCase
from django.test.client import Client
from tb_app.schema import schema
from account.models import Account
from space.models import Space
from django.contrib.auth.hashers import make_password


class SpaceTests(TestCase):

    space_contract_mutation = """
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
            token: $token,
            order: ['contract_start']
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
            contractSpaces {
                edges {
                    node {
                        pk
                        name
                        contractStatus
                    }
                }
                pages
                perPage
                currentPage
            }
        }
    }
    """
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

    @classmethod
    def setUpTestData(cls):
        Space.objects.create(
            id="5e07482b",
            name='スペース新宿',
            description="テストです",
            price="15000"
        )

        Account.objects.create(
            name='test_jiro',
            email='sample+dev@tam-bourine.co.jp',
            password=make_password('password12345'),
            is_active=True,
        )

    def setUp(self):
        self.client = Client()

    def test_space_contract_mutation_success(self):
        login_result = schema.execute(
            self.login_mutation,
            variable_values={
                'email': 'sample+dev@tam-bourine.co.jp',
                'password': 'password12345',
            }
        )
        token = login_result.data['login']['auth']['token']
        result = schema.execute(
            self.space_contract_mutation,
            variable_values={
                'token': token,
                'spaceId': '5e07482b',
                'startDate': '2018-06-20 12:00',
                'endDate': '2018-07-20 12:00',
            }
        )

        assert result.data['spaceContract']['errors'] is None
        assert result.data['spaceContract']['success'] is True
