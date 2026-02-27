"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
// ✅ ThumbsUp icon added for Helpful button
import { Star, Upload, X, Loader2, Image as ImageIcon, BadgeCheck, Pencil, ThumbsUp } from "lucide-react";
import imageCompression from "browser-image-compression";
import Image from "next/image";

interface ReviewProps {
  productId: number;
}

// ---------------------------------------------------------
// ⭐ Review Badge Component
// ---------------------------------------------------------
export function ReviewBadge({ reviews, onClick }: { reviews: any[], onClick: () => void }) {
  if (reviews.length === 0) return null;

  const avgRating = (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1);

  return (
    <div 
      onClick={onClick}
      className="inline-flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm"
    >
      <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-sm font-bold">
        {avgRating} <Star size={12} fill="white" />
      </div>
      <span className="text-sm font-medium text-gray-500">
        {reviews.length} Ratings & {reviews.filter(r => r.comment).length} Reviews
      </span>
    </div>
  );
}

export default function ProductReviews({ productId }: ReviewProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ✅ New State for Like Loading
  const [likingId, setLikingId] = useState<number | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://nandanicollection.com";

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ HELPFUL / LIKE LOGIC
  const handleLike = async (reviewId: number) => {
    if (!user) {
        alert("Please login to vote!");
        return;
    }
    setLikingId(reviewId);
    try {
        const token = localStorage.getItem("token") || localStorage.getItem("nandani_token");
        const res = await fetch(`${API_URL}/api/reviews/like/${reviewId}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
            // Optimistically update or just refetch
            fetchReviews();
        }
    } catch (err) {
        console.error("Error liking review:", err);
    } finally {
        setLikingId(null);
    }
  };

  const scrollToReviews = () => {
    const section = document.getElementById("reviews-display-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const getFullImageUrl = (path: string) => {
    if (!path) return "";
    let finalPath = path.replace("http://", "https://");
    if (finalPath.startsWith("http")) return finalPath;
    const cleanPath = finalPath.startsWith("/") ? finalPath : `/${finalPath}`;
    let baseUrl = API_URL.replace("http://", "https://");
    baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${baseUrl}${cleanPath}`;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
      setErrorMsg("You can only upload a maximum of 3 photos.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    const options = { maxSizeMB: 0.2, maxWidthOrHeight: 1024, useWebWorker: true, fileType: "image/webp" };
    const newImages = [...images];
    const newPreviews = [...previews];
    for (const file of files) {
      if (newImages.length >= 3) break;
      try {
        const compressedFile = await imageCompression(file, options);
        const webpFile = new File([compressedFile], `${file.name.split('.')[0]}.webp`, { type: "image/webp" });
        newImages.push(webpFile);
        newPreviews.push(URL.createObjectURL(webpFile));
      } catch (error) {
        console.error("Compression error:", error);
      }
    }
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleEditReview = (rev: any) => {
    setRating(rev.rating);
    setComment(rev.comment || "");
    setImages([]);
    setPreviews([]);
    setErrorMsg("Note: Uploading new photos will replace the old ones.");
    const formElement = document.getElementById("review-form-box");
    if (formElement) formElement.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    const formData = new FormData();
    formData.append("rating", rating.toString());
    formData.append("comment", comment);
    if (images[0]) formData.append("image_1", images[0]);
    if (images[1]) formData.append("image_2", images[1]);
    if (images[2]) formData.append("image_3", images[2]);

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("nandani_token"); 
      const res = await fetch(`${API_URL}/api/reviews/${productId}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData, 
      });
      const data = await res.json();
      if (res.ok) {
        setComment(""); setRating(5); setImages([]); setPreviews([]);
        setSuccessMsg(data.message || "Review submitted successfully!");
        setTimeout(() => setSuccessMsg(""), 4000);
        fetchReviews(); 
      } else {
        setErrorMsg(data.error || "Something went wrong.");
      }
    } catch (error) {
      setErrorMsg("Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-10 border-t border-gray-100 max-w-4xl mx-auto px-4 font-sans">
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Customer Reviews</h2>
        <ReviewBadge reviews={reviews} onClick={scrollToReviews} />
      </div>

      {/* --- FORM SECTION --- */}
      <div id="review-form-box" className="bg-gray-50 p-6 rounded-2xl mb-12 border border-gray-100 shadow-sm transition-all">
        {user ? (
          <form onSubmit={submitReview} className="space-y-4">
            <h3 className="font-bold text-gray-900 mb-2">Write / Edit Review</h3>
            {errorMsg && <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-lg uppercase tracking-widest">{errorMsg}</div>}
            {successMsg && <div className="bg-green-50 text-green-600 text-xs font-bold p-3 rounded-lg uppercase tracking-widest">{successMsg}</div>}

            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button type="button" key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                  <Star fill={star <= rating ? "#F59E0B" : "none"} color={star <= rating ? "#F59E0B" : "#D1D5DB"} size={28} />
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you love about this product? (Optional)"
              className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-700 outline-none focus:border-[#8B3E48] transition-colors resize-none h-28"
            ></textarea>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex justify-between">
                <span>Add Photos (Optional)</span>
                <span>{images.length}/3</span>
              </p>
              <div className="flex flex-wrap gap-4">
                {previews.map((preview, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-[#8B3E48]/20 group">
                    <Image src={preview} alt={`preview-${idx}`} fill className="object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                  </div>
                ))}
                {images.length < 3 && (
                  <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl text-gray-400 cursor-pointer hover:border-[#8B3E48] hover:text-[#8B3E48] transition-colors bg-white">
                    <Upload size={20} />
                    <span className="text-[10px] font-bold mt-1">Upload</span>
                    <input type="file" accept="image/png, image/jpeg, image/jpg" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="mt-4 bg-[#8B3E48] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#72323a] transition-colors disabled:opacity-50 flex items-center gap-2">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Submit / Update Review"}
            </button>
          </form>
        ) : (
          <div className="text-center py-6">
            <h3 className="font-bold text-gray-900 mb-2">Have you purchased this?</h3>
            <p className="text-sm text-gray-500 mb-4">Log in to share your experience with others.</p>
            <a href="/login" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors">Login to Review</a>
          </div>
        )}
      </div>

      {/* --- DISPLAY SECTION --- */}
      <div id="reviews-display-section">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-400" size={32} /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 text-gray-400 italic font-serif">No reviews yet. Be the first to review this!</div>
        ) : (
          <div className="space-y-8">
            {reviews.map((rev) => {
              
              // ✅ BUG FIX 1: PERFECT EDIT LOGIC (Ab ID se direct match karega)
              // Agar user_id backend se aa raha hai (schemas.py me add karne ke baad), toh exact match hoga
              const isMyReview = user && rev.user_id && String(rev.user_id) === String(user.id);

              // ✅ BUG FIX 2: PERFECT NAME LOGIC
              // Jo backend bhejega (चाहे पंकज हो या Customer), वही सीधा दिखेगा, कोई फालतू चेकिंग नहीं।
              const displayName = rev.user_name || "Customer";

              // State ya City nikalna
              let displayLocation = "";
              if (displayName.toLowerCase() !== "customer") {
                if (rev.state && rev.state.trim() !== "") {
                  displayLocation = `, ${rev.state}`;
                } else if (rev.city && rev.city.trim() !== "") {
                  displayLocation = `, ${rev.city}`;
                }
              }

              const finalDisplayString = `${displayName}${displayLocation}`;
              const avatarLetter = displayName.charAt(0).toUpperCase();

              return (
                <div key={rev.id} className="border-b border-gray-100 pb-8 last:border-0 relative">
                  
                  {/* Edit Button */}
                  {isMyReview && (
                    <button onClick={() => handleEditReview(rev)} className="absolute top-0 right-0 text-xs font-bold text-[#8B3E48] bg-[#8B3E48]/5 px-3 py-1.5 rounded-full hover:bg-[#8B3E48]/10 transition-colors flex items-center gap-1.5">
                      <Pencil size={12} /> Edit
                    </button>
                  )}

                  <div className="flex items-center justify-between mb-3 pr-20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 border border-gray-200">
                        {avatarLetter}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-gray-900">{finalDisplayString}</p>
                          <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                            <BadgeCheck size={12} className="text-green-600" />
                            <span className="text-[9px] font-bold text-green-700 uppercase tracking-tight">Verified Purchase</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">{new Date(rev.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} fill={i < rev.rating ? "#F59E0B" : "none"} color={i < rev.rating ? "#F59E0B" : "#D1D5DB"} size={14} />
                    ))}
                  </div>
                  {rev.comment && <p className="text-sm text-gray-600 leading-relaxed mb-4">{rev.comment}</p>}
                  
                  {/* Review Images */}
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide mb-4">
                    {[rev.image_1, rev.image_2, rev.image_3].filter(Boolean).map((img, idx) => (
                      <div key={idx} className="relative w-24 h-32 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        <Image src={getFullImageUrl(img)} alt="Review Image" fill className="object-cover" sizes="96px" />
                      </div>
                    ))}
                  </div>

                  {/* ✅ HELPFUL BUTTON SECTION */}
                  <div className="flex items-center gap-4">
                    <button 
                        onClick={() => handleLike(rev.id)}
                        disabled={likingId === rev.id}
                        className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${rev.is_liked ? 'text-[#8B3E48] bg-[#8B3E48]/5' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                    >
                        {likingId === rev.id ? <Loader2 size={12} className="animate-spin" /> : <ThumbsUp size={12} fill={rev.is_liked ? "currentColor" : "none"} />}
                        Helpful {rev.helpful_count > 0 && `(${rev.helpful_count})`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}