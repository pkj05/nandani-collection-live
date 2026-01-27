from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    has_size = models.BooleanField(default=False, verbose_name="Has Size?")
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    SIZE_CHOICES = [
        ('FREE', 'Free Size (Sarees/Unstitched)'),
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
        ('XL', 'Extra Large'),
        ('XXL', 'Double Extra Large'),
    ]

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField()
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2) 
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Restored Fields (Inhe nahi cheda hai)
    sku = models.CharField(max_length=50, unique=True, null=True, blank=True)
    supplier = models.CharField(max_length=255, null=True, blank=True)
    color = models.CharField(max_length=50, null=True, blank=True) 
    color_name = models.CharField(max_length=50, null=True, blank=True)
    size = models.CharField(max_length=10, choices=SIZE_CHOICES, default='FREE')
    
    # Media & Stock
    thumbnail = models.ImageField(upload_to='products/thumbnails/')
    video = models.FileField(upload_to='products/videos/', null=True, blank=True)
    fabric = models.CharField(max_length=100, null=True, blank=True)
    stock = models.IntegerField(default=10)
    
    # System logic
    group_id = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/gallery/')

class Banner(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='banners/')
    link = models.URLField(max_length=500, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    def __str__(self): return self.title