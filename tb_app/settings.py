import os
import sys
import platform
import dj_database_url

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SECRET_KEY = 'y3^^67h#j^&daw*(b3(v(=$hqq!j425-paqe3_pc@9!&^(l)&('
DEBUG = os.environ.get('DEBUG', None) == 'True'
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '*').split(',')
TESTING = len(sys.argv) > 1 and sys.argv[1] == 'test'
FERNET_KEY = 'RpPX49a9uUKYSz63CC20wIVfsMEQRwe2Ua1WFz6NlqI='
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
IP_LIMIT = os.environ.get('IP_LIMIT', None) == 'True'
IPWARE_TRUSTED_PROXY_LIST = os.environ.get(
    'IPWARE_TRUSTED_PROXY_LIST', '').split(',')

ROOT_URLCONF = 'tb_app.urls'
WSGI_APPLICATION = 'tb_app.wsgi.application'
LANGUAGE_CODE = 'ja'
TIME_ZONE = 'Asia/Tokyo'
USE_I18N = True
USE_L10N = True
USE_TZ = False

SPACE_PERPAGE = 6
NEWS_PERPAGE = 9

EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_HOST_USER = os.environ.get('SENDGRID_USERNAME')
EMAIL_HOST_PASSWORD = os.environ.get('SENDGRID_PASSWORD')
EMAIL_PORT = 587
EMAIL_USE_TLS = True

INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'corsheaders',
    'graphene_django',
    'account',
    'account_token',
    'space',
    'news',
]

if 'local' in platform.node():
    INSTALLED_APPS += [
        'sslserver',
    ]

    CORS_ORIGIN_ALLOW_ALL = True


MIDDLEWARE = [
    'tb_app.access_restriction.AccessRestrictionMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

GRAPHENE = {
    'SCHEMA': 'tb_app.schema.schema',
    'MIDDLEWARE': [
        'graphene_django.debug.DjangoDebugMiddleware',
    ],
}

if TESTING:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }
else:
    db = dj_database_url.parse(os.environ.get('DATABASE_URL') +
                               '?currentSchema=public,salesforce')
    try:
        del db['OPTIONS']['currentSchema']
    except:
        pass

    DATABASES = {
        'default': db,
    }

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'APP_DIRS': True,
        'DIRS': ['templates']
    },
]

PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.BCryptPasswordHasher',
)

LOGGING = {
    'version': 1,
    'formatters': {
        'all': {
            'format': '\t'.join([
                "[%(levelname)s]",
                "asctime:%(asctime)s",
                "module:%(module)s",
                "message:%(message)s",
            ])
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'all'
        },
    },
    'loggers': {
        'command': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
        # 'django.db.backends': {
        #     'handlers': ['console'],
        #     'level': 'DEBUG',
        # },
        # 'django': {
        #     'handlers': ['console'],
        #     'level': 'DEBUG',
        #     'propagate': True,
        # },
    },
}
