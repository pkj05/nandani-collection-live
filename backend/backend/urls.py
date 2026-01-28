from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from shop.api import api  # आपकी API file

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),  # API का रास्ता
]

# Media और Static Files दिखाने का सबसे पावरफुल तरीका (Server के लिए)
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
]