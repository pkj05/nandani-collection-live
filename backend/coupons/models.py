from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator

class Coupon(models.Model):
    COUPON_TYPES = (
        ('FLAT', 'Flat Amount (₹)'),
        ('PERCENTAGE', 'Percentage (%)'),
    )

    code = models.CharField(max_length=20, unique=True, help_text="e.g. WELCOME100")
    description = models.TextField(blank=True, null=True)
    
    # Logic
    coupon_type = models.CharField(max_length=15, choices=COUPON_TYPES, default='PERCENTAGE')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    max_discount_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Percentage coupon ke liye max limit")
    
    # Eligibility
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Validity
    valid_from = models.DateTimeField(default=timezone.now)
    valid_until = models.DateTimeField()
    active = models.BooleanField(default=True)
    
    # Usage Control
    limit_per_user = models.IntegerField(default=1, help_text="Ek user kitni baar use kar sakta hai")
    total_usage_limit = models.IntegerField(null=True, blank=True, help_text="Puri duniya ke liye total limit (e.g. First 100 users)")
    times_used = models.IntegerField(default=0, editable=False)

    # --- 🎡 SPIN THE WHEEL FIELDS ---
    is_wheel_coupon = models.BooleanField(
        default=False, 
        help_text="Kya ye coupon Success Page ke Spin Wheel mein dikhana hai?"
    )
    wheel_label = models.CharField(
        max_length=50, 
        blank=True, 
        null=True, 
        help_text="Wheel ke slice par kya dikhega? e.g. '10% OFF' ya 'Free Gift'"
    )
    wheel_color = models.CharField(
        max_length=20, 
        default="#8B3E48", 
        help_text="Wheel ke us slice ka background color (Hex Code)"
    )

    # --- 🛡️ SMART CONTROLS (NEW) ---
    win_probability = models.IntegerField(
        default=50, 
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Is coupon ke jitne ka chance kitna hai? (0-100)%. High value = High chance."
    )
    daily_global_limit = models.IntegerField(
        default=10, 
        help_text="Ek din mein ye coupon wheel se maximum kitni baar diya ja sakta hai?"
    )

    # --- TRACKING FOR DAILY LIMIT ---
    last_used_date = models.DateField(auto_now=True)
    today_usage_count = models.IntegerField(default=0, editable=False)

    def save(self, *args, **kwargs):
        # Agar naya din shuru ho gaya hai, toh today_usage_count ko reset karein
        if self.last_used_date != timezone.now().date():
            self.today_usage_count = 0
        super().save(*args, **kwargs)

    def is_valid(self):
        now = timezone.now()
        if not self.active:
            return False, "Bhai, ye coupon abhi active nahi hai."
        if now < self.valid_from or now > self.valid_until:
            return False, "Coupon ki date nikal gayi hai."
        if self.total_usage_limit and self.times_used >= self.total_usage_limit:
            return False, "Ye coupon sab khatam ho chuke hain."
        
        # Wheel Specific Daily Limit Check
        if self.is_wheel_coupon and self.today_usage_count >= self.daily_global_limit:
            return False, "Aaj ki limit khatam ho gayi hai."
            
        return True, "Valid"

    def __str__(self):
        return f"{self.code} - {self.discount_value}"

# --- 🔒 NEW MODEL: WHEEL LOCKING SYSTEM ---
class WheelUsage(models.Model):
    order_id = models.CharField(
        max_length=50, 
        unique=True, 
        help_text="Order ID jiske liye wheel use ho chuka hai"
    )
    coupon_won = models.ForeignKey(
        Coupon, 
        on_delete=models.CASCADE, 
        help_text="User ne kaunsa coupon jeeta tha"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.order_id} - Won {self.coupon_won.code}"