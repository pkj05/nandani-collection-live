import os
import environ
from pathlib import Path
from datetime import timedelta

# 1. Initialize Environment Variables
env = environ.Env(DEBUG=(bool, False))
BASE_DIR = Path(__file__).resolve().parent.parent
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# 2. Security Settings
SECRET_KEY = env('SECRET_KEY')
DEBUG = env('DEBUG')

ALLOWED_HOSTS = ['*']

# 3. Application Definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third Party Apps
    'rest_framework',
    'corsheaders',
    'nested_admin',
    'ninja_jwt',  # ✅ JWT के लिए
    
    # Internal Apps
    'accounts',  # ✅ ऑथेंटिकेशन ऐप
    'shop',
    'orders',
    'coupons',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# 4. Database Configuration (AWS RDS via .env)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env('DB_PORT'),
    }
}

# 5. Static & Media Files
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# 6. CORS & Other Settings
CORS_ALLOW_ALL_ORIGINS = True
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata' # ✅ India के टाइम के हिसाब से
USE_I18N = True
USE_TZ = True
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# 7. AUTHENTICATION SETTINGS
AUTH_USER_MODEL = 'accounts.User' # ✅ Custom User Model लिंक कर दिया

# ✅ JWT Settings (NextAuth के साथ कनेक्ट करने के लिए)
NINJA_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7), # टोकन 7 दिन तक चलेगा
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# 8. SOCIAL AUTH KEYS (इनको अपनी .env फाइल में डालना होगा)
GOOGLE_CLIENT_ID = env('GOOGLE_CLIENT_ID', default='')
WHATSAPP_API_KEY = env('WHATSAPP_API_KEY', default='')

CORS_ALLOWED_ORIGINS = [
    "https://nandanicollection.com",
    "https://www.nandanicollection.com",
]

# ✅ CSRF FIX: Isse Admin Panel ka 403 Error hat jayega
CSRF_TRUSTED_ORIGINS = [
    "https://nandanicollection.com",
    "https://www.nandanicollection.com",
]

CORS_ALLOW_CREDENTIALS = True
APPEND_SLASH = True