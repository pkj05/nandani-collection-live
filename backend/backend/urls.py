from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from shop.api import api  # आपकी API file

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),  # यह चालू होना ज़रूरी है वरना डेटा नहीं दिखेगा
]

# Media और Static Files दिखाने का पक्का जुगाड़ (Server के लिए)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)