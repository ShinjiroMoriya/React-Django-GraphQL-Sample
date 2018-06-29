import re
from datetime import datetime


def string_to_date(date: str):
    """
    :StrをDate形式に変換
    """
    try:
        return datetime.strptime(str(date), '%Y-%m-%dT%H:%M:%S.%fZ')
    except:
        pass

    try:
        return datetime.strptime(str(date), '%Y-%m-%d %H:%M:%S.%f')
    except:
        pass

    try:
        return datetime.strptime(str(date), '%Y-%m-%d %H:%M:%S')
    except:
        pass

    try:
        return datetime.strptime(str(date), '%Y-%m-%d')
    except:
        pass

    return None


def get_auth_token(request):
    try:
        app_tk = request.META["HTTP_AUTHORIZATION"]
        m = re.search('(Bearer)(\s)(.*)', app_tk)
        return m.group(3)
    except:
        return None
