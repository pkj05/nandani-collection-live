from django.db import models
from django.utils.text import slugify

class Announcement(models.Model):
    text = models.CharField(max_length=255)
    link = models.CharField(max_length=200, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    background_color = models.CharField(max_length=20, default="#000000")
    text_color = models.CharField(max_length=20, default="#ffffff")
    def __str__(self): return self.text

class Category(models.Model):
    name = models.CharField(max_length=100)
    has_size = models.BooleanField(default=False)
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    slug = models.SlugField(unique=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.slug: self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    def __str__(self): return self.name

class Banner(models.Model):
    title = models.CharField(max_length=200, blank=True, null=True)
    image = models.ImageField(upload_to='banners/')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    description = models.TextField()
    fabric = models.CharField(max_length=100, blank=True, null=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.name

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    color_name = models.CharField(max_length=50)
    color_code = models.CharField(max_length=10)
    thumbnail = models.ImageField(upload_to='products/thumbnails/')
    video = models.FileField(upload_to='products/videos/', null=True, blank=True)
    # Note: Stock ab SizeVariant handle karega, ye field sirf reference ke liye hai
    stock = models.IntegerField(default=10, help_text="Suits/Saree ke liye master stock")
    def __str__(self): return f"{self.product.name} - {self.color_name}"

class ProductImage(models.Model):
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/gallery/')

class SizeVariant(models.Model):
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='sizes')
    size = models.CharField(max_length=10, default='FREE')
    stock = models.IntegerField(default=0)
    price_adjustment = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    sku = models.CharField(max_length=50, blank=True) # Length increased for safety
    
    def save(self, *args, **kwargs):
        if not self.sku:
            self.sku = f"{self.variant.product.id}-{self.variant.id}-{self.size}"
        super().save(*args, **kwargs)

    def __str__(self): return f"{self.variant.product.name} ({self.size})"