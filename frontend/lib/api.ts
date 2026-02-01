const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.8:8000/api";

// Catalog Page (List of Products)
export async function getProducts(category?: string) {
  const url = category 
    ? `${API_BASE_URL}/products?category=${category}` 
    : `${API_BASE_URL}/products`;
  
  try {
    const res = await fetch(url, { next: { revalidate: 10 } });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}

// Product Detail Page (Single Product) - FIXED
export async function getProductDetail(id: string) {
  try {
    // FIX: '?id=' hata kar slash '/' lagaya hai taaki single object mile
    const res = await fetch(`${API_BASE_URL}/products/${id}`, { cache: 'no-store' });
    
    if (!res.ok) return null;
    return res.json(); 
  } catch (error) {
    console.error("Detail API Error:", error);
    return null;
  }
}