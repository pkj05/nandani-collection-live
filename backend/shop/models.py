from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    slug = models.SlugField(unique=True)
    def __str__(self): return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2) 
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    sku = models.CharField(max_length=50, unique=True, null=True, blank=True)
    thumbnail = models.ImageField(upload_to='products/thumbnails/')
    video = models.FileField(upload_to='products/videos/', null=True, blank=True)
    group_id = models.CharField(max_length=100, blank=True, null=True)
    color = models.CharField(max_length=50, blank=True, null=True)
    color_name = models.CharField(max_length=50, blank=True, null=True)
    has_size = models.BooleanField(default=False)
    size = models.CharField(max_length=100, blank=True, null=True)
    fabric = models.CharField(max_length=100, null=True, blank=True)
    supplier = models.CharField(max_length=100, null=True, blank=True)
    stock = models.IntegerField(default=10)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/gallery/')

class Banner(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='banners/')
    link = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True) # API use karti hai
    active = models.BooleanField(default=True) # Safety ke liye
    def __str__(self): return self.title