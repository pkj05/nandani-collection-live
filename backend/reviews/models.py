from django.db import models
from django.contrib.auth import get_user_model
# ध्यान दें: 'shop.models' को अपनी प्रोडक्ट वाली ऐप के नाम से बदल लें अगर वो अलग है
from shop.models import Product 

User = get_user_model()

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Rating 1 से 5 तक होगी
    rating = models.IntegerField(default=5)
    comment = models.TextField(blank=True, null=True)
    
    # यह बताएगा कि असली खरीदार है या टाइमपास
    is_verified_buyer = models.BooleanField(default=False)
    
    # Max 3 Photos (WebP फॉर्मेट में फ्रंटएंड से आएंगी)
    image_1 = models.ImageField(upload_to='reviews/images/', blank=True, null=True)
    image_2 = models.ImageField(upload_to='reviews/images/', blank=True, null=True)
    image_3 = models.ImageField(upload_to='reviews/images/', blank=True, null=True)
    
    # ✅ NEW: Helpful (Likes) track karne ke liye ManyToManyField
    likes = models.ManyToManyField(User, related_name="liked_reviews", blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # एक यूजर एक प्रोडक्ट पर सिर्फ एक ही रिव्यु दे सकता है (Spam Protection)
        unique_together = ('product', 'user')
        ordering = ['-created_at'] # सबसे नए रिव्यु सबसे ऊपर दिखेंगे

    # ✅ NEW: Total likes count get karne ke liye property
    @property
    def helpful_count(self):
        return self.likes.count()

    def __str__(self):
        return f"{self.user.phone_number} - {self.product.name} ({self.rating} Stars)"