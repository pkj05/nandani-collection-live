from ninja import Router, File, Form
from ninja.files import UploadedFile
from django.shortcuts import get_object_or_404
from typing import List, Optional
from .models import Review
from .schemas import ReviewOut
from shop.models import Product
# ध्यान दें: Orders ऐप से अपना मॉडल इम्पोर्ट करें जो बताता है कि यूजर ने क्या ख़रीदा है
from orders.models import OrderItem 
# ✅ FIX 1: JWTAuth import kar liya
from ninja_jwt.authentication import JWTAuth

router = Router()

# 1. किसी प्रोडक्ट के सारे रिव्यु लाने के लिए (Frontend पर दिखाने के लिए)
@router.get("/{product_id}", response=List[ReviewOut])
def get_product_reviews(request, product_id: int):
    reviews = Review.objects.filter(product_id=product_id).order_by('-created_at')
    return reviews


# 2. नया रिव्यु सबमिट करने के लिए (With Magic Logic & Images)
# ✅ FIX 2: Yahan auth=JWTAuth() add kiya taki token verify ho sake
@router.post("/{product_id}", auth=JWTAuth(), response={200: dict, 400: dict})
def create_review(
    request, 
    product_id: int,
    rating: int = Form(...),
    comment: str = Form(None),
    image_1: UploadedFile = File(None),
    image_2: UploadedFile = File(None),
    image_3: UploadedFile = File(None)
):
    # मान लेते हैं कि request.user आपके Firebase Auth से आ रहा है (Ab JWTAuth se aayega)
    user = request.user
    if not user.is_authenticated:
        return 400, {"error": "Please login to submit a review."}

    # ✅ FIX (Edit Review): Pehle yahan error throw ho raha tha, ab hum isse hatakar niche Update ka logic lagayenge.

    product = get_object_or_404(Product, id=product_id)

    # ==========================================
    # 🎩 THE MAGIC LOGIC (Verified Buyer Check)
    # ==========================================
    # चेक करें कि क्या इस यूजर के किसी आर्डर में यह प्रोडक्ट है और आर्डर सक्सेसफुल है
    has_purchased = OrderItem.objects.filter(
        order__user=user, 
        # ✅ FIX 3: Aapke OrderItem me direct product field nahi hai, size_variant linked hai. 
        # Isliye relation aise check hoga taaki server crash na ho:
        size_variant__variant__product=product,
        order__status='pending'  # ✅ Note: Maine isko temporarily 'pending' kiya hai testing ke liye. Jab actual order complete ho toh ise 'COMPLETED' kar lena.
    ).exists()

    final_rating = rating

    if has_purchased:
        is_verified = True
        # असली खरीदार कुछ भी रेटिंग दे सकता है (1 to 5)
        if final_rating < 1 or final_rating > 5:
            final_rating = 5
    else:
        is_verified = False
        # 🛡️ अगर नहीं ख़रीदा है, तो 4 से कम रेटिंग नहीं दे सकता! 
        if final_rating < 4:
            final_rating = 4  # जबरदस्ती 4 स्टार कर दो
        elif final_rating > 5:
            final_rating = 5

    # ✅ FIX: UPSERT LOGIC (Agar pehle se hai to update karo, warna naya banao)
    review = Review.objects.filter(product_id=product_id, user=user).first()
    
    if review:
        # Update existing review
        review.rating = final_rating
        review.comment = comment
        review.is_verified_buyer = is_verified
        # Agar nayi images aayi hain to purani replace ho jayengi
        if image_1: review.image_1.save(image_1.name, image_1)
        if image_2: review.image_2.save(image_2.name, image_2)
        if image_3: review.image_3.save(image_3.name, image_3)
        review.save()
        msg = "Review updated successfully!"
    else:
        # Create new review
        review = Review.objects.create(
            product=product,
            user=user,
            rating=final_rating,
            comment=comment,
            is_verified_buyer=is_verified
        )
        # इमेजेज सेव करें (Frontend से WebP ही आएंगी)
        if image_1:
            review.image_1.save(image_1.name, image_1)
        if image_2:
            review.image_2.save(image_2.name, image_2)
        if image_3:
            review.image_3.save(image_3.name, image_3)
        msg = "Review submitted successfully!"

    return 200, {
        "success": True, 
        "message": msg, 
        "is_verified": is_verified,
        "recorded_rating": final_rating
    }