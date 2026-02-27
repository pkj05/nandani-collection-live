from django.db import models
from django.core.validators import RegexValidator
from shop.models import SizeVariant
from django.conf import settings # ✅ User model refer karne ke liye
from coupons.models import Coupon # ✅ Coupon model import kiya

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'), ('confirmed', 'Confirmed'), ('shipped', 'Shipped'),
        ('delivered', 'Delivered'), ('return_requested', 'Return Requested'),
        ('returned', 'Returned & Refunded'), ('cancelled', 'Cancelled'),
    ]
    PAYMENT_CHOICES = [
        ('upi', 'UPI / QR'), ('card', 'Card / Netbanking'), ('cod', 'Cash on Delivery'),
    ]

    # ✅ User linkage
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='orders'
    )

    full_name = models.CharField(max_length=100)
    phone_regex = RegexValidator(regex=r'^\+91\d{10}$', message="Phone number must be: +91XXXXXXXXXX")
    phone_number = models.CharField(validators=[phone_regex], max_length=13)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField()
    pincode = models.CharField(max_length=6)
    
    # --- Money Related Fields ---
    total_amount = models.DecimalField(max_digits=10, decimal_places=2) # Final Payable Amount
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    shipping_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # ✅ Coupon Linkage
    # SET_NULL rakha hai taaki agar kabhi admin coupon delete bhi kar de, toh order history kharab na ho
    applied_coupon = models.ForeignKey(
        Coupon, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='orders'
    )
    
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='upi')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # ✅ New field for Invoice / Bill (Added here)
    invoice_no = models.CharField(max_length=50, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self): 
        return f"Order #{self.id} - {self.full_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    size_variant = models.ForeignKey(SizeVariant, on_delete=models.SET_NULL, null=True) 
    product_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2) # Price per item
    quantity = models.PositiveIntegerField(default=1)
    size = models.CharField(max_length=20)
    color = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self): 
        return f"{self.quantity} x {self.product_name} ({self.size})"