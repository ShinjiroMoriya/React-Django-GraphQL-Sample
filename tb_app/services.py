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
