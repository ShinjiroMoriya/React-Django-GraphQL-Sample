import graphene
from graphene_django.debug import DjangoDebug
from news.types import NewsType
from news.models import News
from tb_app.pagination import Pagination
from graphene_django.filter import DjangoFilterConnectionField
from django.conf import settings as s


class NewsQuery(graphene.ObjectType):

    news_item = graphene.Field(
        NewsType,
        description='get News',
        news_id=graphene.String(default_value=None)
    )

    @staticmethod
    def resolve_news_item(_, __, **kwargs):
        news_id = kwargs.get('news_id')
        if news_id is not None:
            space = News.get_news_item({"id": news_id})
            return space
        return None

    news_items = DjangoFilterConnectionField(
        NewsType,
        page=graphene.Int(default_value=1),
    )

    @staticmethod
    def resolve_news_items(_, __, **kwargs):
        pagination = Pagination(
            page=kwargs.get('page'),
            per_page=s.NEWS_PERPAGE,
        )
        return [i for i in News.get_news_items()][
               pagination.offset: pagination.offset + pagination.per_page]

    top_news_items = DjangoFilterConnectionField(
        NewsType,
        limit=graphene.Int(default_value=3),
    )

    @staticmethod
    def resolve_top_news_items(_, __, **kwargs):
        return [i for i in News.get_news_items()][: int(kwargs.get('limit'))]

    debug = graphene.Field(DjangoDebug)
