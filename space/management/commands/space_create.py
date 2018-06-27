from django.core.management.base import BaseCommand
from space.models import Space
import string
import random


class Command(BaseCommand):
    def handle(self, *args, **options):

        images = [
            'https://res.cloudinary.com/hga2z6dng/'
            'image/upload/v1529502212/img_1.jpg',
            'https://res.cloudinary.com/hga2z6dng/'
            'image/upload/v1529502212/img_2.jpg',
            'https://res.cloudinary.com/hga2z6dng/'
            'image/upload/v1529502212/img_3.jpg'
        ]
        data = [
            'スペース新宿',
            'スペース代々木',
            'スペース原宿',
            'スペース渋谷',
            'スペース恵比寿',
            'スペース目黒',
            'スペース五反田',
            'スペース大崎',
            'スペース品川',
            'スペース田町',
            'スペース浜松町',
            'スペース新橋',
            'スペース有楽町',
            'スペース東京',
            'スペース神田',
            'スペース秋葉原',
            'スペース御徒町',
            'スペース上野',
            'スペース鶯谷',
            'スペース日暮里',
            'スペース西日暮里',
            'スペース田端',
            'スペース駒込',
            'スペース巣鴨',
            'スペース大塚',
            'スペース池袋',
            'スペース目白',
            'スペース高田馬場',
            'スペース新大久保',
            'スペース白金台',
            'スペース白金高輪',
            'スペース三田',
            'スペース芝公園',
            'スペース御成門',
            'スペース内幸町',
            'スペース日比谷',
            'スペース大手町',
            'スペース神保町',
            'スペース水道橋',
            'スペース春日',
            'スペース白山',
            'スペース千石',
            'スペース巣鴨',
            'スペース西巣鴨',
            'スペース新板橋',
            'スペース板橋区役所前',
            'スペース板橋本町',
            'スペース本蓮沼',
            'スペース志村坂上',
            'スペース志村三丁目',
            'スペース蓮根',
            'スペース西台',
            'スペース高島平',
            'スペース新高島平',
            'スペース西高島平',
        ]

        try:
            img_count = 0
            for s in reversed(data):
                if img_count == 3:
                    img_count = 1

                Space.objects.create(
                    name=s,
                    description='多数の貸しスペースを提供しています。',
                    id=''.join([
                        random.choice(
                            string.ascii_letters + string.digits) for _ in
                        range(18)]),
                    price=1800000,
                    main_image=('https://res.cloudinary.com/'
                                'hga2z6dng/image/upload/'
                                'v1529502212/main.jpg'),
                    thumbnail_image=images[img_count]
                )
                img_count += 1

        except Exception as ex:
            print(str(ex))
