from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# ✅ IMPORT FIX: Relative import ('.') ki jagah pura naam likha hai taaki error na aaye
from backend.api_main import api 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls), # ✅ Ab ye API chalegi
    path('nested_admin/', include('nested_admin.urls')), # ✅ Ye line DELETE NAHI KI HAI
]

# Media aur Static files ke liye (Images dikhane ke liye)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)