from django.contrib import admin
from django.urls import path, re_path, include  # 1. Yahan 'include' add kiya hai
from django.conf import settings
from django.views.static import serve
from shop.api import api 

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 2. YE LINE SABSE ZAROORI HAI (Iske bina nested form nahi chalega)
    path('nested_admin/', include('nested_admin.urls')),
    
    path('api/', api.urls),
]

# Media aur Static Files Serving
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
]