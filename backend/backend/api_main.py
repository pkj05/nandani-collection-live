from ninja import NinjaAPI
from shop.api import router as shop_router

# ✅ FIX: Wapas 'accounts.api' kar diya (Jaisa aap chahte the)
from accounts.api import router as accounts_router

from orders.api import router as orders_router
from coupons.api import router as coupon_router
from reviews.api import router as reviews_router

api = NinjaAPI(
    title="Nandani Collection API",
    version="2.0.0",
    description="Backend for Nandani Ethnic Wear Store"
)

api.add_router("/shop", shop_router, tags=["Shop"])
api.add_router("/accounts", accounts_router, tags=["Accounts"])
api.add_router("/orders", orders_router, tags=["Orders"])
api.add_router("/coupons", coupon_router, tags=["Coupons"])
api.add_router("/reviews", reviews_router, tags=["Reviews"])
print("🚀 Nandani API Routers successfully loaded!")