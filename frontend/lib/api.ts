// ✅ Direct Hardcoded URL (No Env Variable confusion)
const API_BASE_URL = "https://www.nandanicollection.com/api";

// 1. Get Products (No Slash at end)
export async function getProducts(category: string = "", search: string = "", sort: string = "") {
  // 👇 लिंक सही किया (shop/products)
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
    return await res.json();
  } catch (e) { return []; }
}

// 2. Product Detail (No Slash at end)
export async function getProductDetail(id: string) {
  try {
    // 👇 लिंक सही किया
    const res = await fetch(`${API_BASE_URL}/shop/products/${id}`, { cache: 'no-store' });
    return res.ok ? res.json() : null;
  } catch (e) { return null; }
}

// 3. Shop Data (No Slash at end)
// 3. Shop Data (Corrected)
export async function getShopData() {
  try {
    // 👇 यहाँ 3 नाम होने चाहिए, क्योंकि हम 3 चीज़ें मांग रहे हैं
    const [cats, announcements, banners] = await Promise.all([
        fetch(`${API_BASE_URL}/shop/categories`).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE_URL}/shop/announcements`).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE_URL}/shop/banners`).then(r => r.ok ? r.json() : [])
    ]);
    
    // ✅ अब सही डेटा return होगा
    return { 
        categories: cats, 
        announcements: announcements, 
        banners: banners 
    };
  } catch (e) { 
    return { categories: [], announcements: [], banners: [] }; 
  }
}
