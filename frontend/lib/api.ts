// ✅ Direct Hardcoded URL (No Env Variable confusion)
const API_BASE_URL = "https://www.nandanicollection.com/api";

// 1. Get Products (No Slash at end)
export async function getProducts(category: string = "", search: string = "", sort: string = "") {
  let url = `${API_BASE_URL}/shop/products?`; 
  
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  if (sort) params.append('sort', sort);
  
  try {
    const res = await fetch(url + params.toString(), { 
        next: { revalidate: 10 },
        headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) return [];
    
    const data = await res.json();
    
    // ✅ IMAGE REPAIR: Backend agar 'image' key bhej raha hai to use 'thumbnail' me copy kar do
    // Taki Search Page confuse na ho
    return data.map((p: any) => ({
      ...p,
      thumbnail: p.thumbnail || p.image || p.product_image || (p.variants?.[0]?.images?.[0]?.image) || null
    }));

  } catch (e) { 
    console.error("getProducts error:", e);
    return []; 
  }
}

// 2. Product Detail (No Slash at end)
export async function getProductDetail(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/shop/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    
    const data = await res.json();
    
    // ✅ DETAIL REPAIR: Detail page ke liye bhi image key fix
    return {
      ...data,
      thumbnail: data.thumbnail || data.image || (data.variants?.[0]?.images?.[0]?.image) || null
    };
  } catch (e) { return null; }
}

// 3. Shop Data (No Slash at end)
export async function getShopData() {
  try {
    const [cats, announcements, banners] = await Promise.all([
        fetch(`${API_BASE_URL}/shop/categories`).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE_URL}/shop/announcements`).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE_URL}/shop/banners`).then(r => r.ok ? r.json() : [])
    ]);
    
    return { 
        categories: cats, 
        announcements: announcements, 
        banners: banners 
    };
  } catch (e) { 
    return { categories: [], announcements: [], banners: [] }; 
  }
}

// 4. ✅ Get Order Details (For Invoice and Success Page)
export async function getOrderDetails(orderId: string) {
  try {
    // Ye order fetch karne ka API call hai
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, { cache: 'no-store' });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data;
  } catch (e) {
    console.error("getOrderDetails error:", e);
    return null;
  }
}