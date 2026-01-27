from django.db import models
from shop.models import Product # Shop app se product link karne ke liye
from django.core.validators import RegexValidator

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('return_requested', 'Return Requested'),
        ('returned', 'Returned & Refunded'),
        ('cancelled', 'Cancelled'),
    ]

    PAYMENT_CHOICES = [
        ('upi', 'UPI / QR'),
        ('card', 'Card / Netbanking'),
        ('cod', 'Cash on Delivery'),
    ]

    # Customer Info
    full_name = models.CharField(max_length=100)
    phone_regex = RegexValidator(regex=r'^\+91\d{10}$', message="Phone number must be: +91XXXXXXXXXX")
    phone_number = models.CharField(validators=[phone_regex], max_length=13)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField()
    pincode = models.CharField(max_length=6)
    
    # Order Info
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    shipping_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='upi')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Return Logic
    delivery_date = models.DateTimeField(blank=True, null=True)
    return_reason = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Order #{self.id} - {self.full_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=255) # Backup name if product is deleted
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    size = models.CharField(max_length=10)
    color = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.quantity} x {self.product_name} ({self.size})"