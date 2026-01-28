from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from shop.api import api  # Humari nayi API file

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', api.urls),  # Yahan humne API ka rasta khola
# ] befor online
urlpatterns = [
    path('admin/', admin.site.urls),
    # बाकी के paths...
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Media Files (Photos) dikhane ka code
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)