import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { products, locations } from "../../db/schema.js";

const SEED_PRODUCTS = [
  { name: "Samsung Galaxy S25 Ultra", nameHi: "Samsung Galaxy S25 Ultra", category: "electronics", price: 89999, original: 129999, rating: "4.8", reviews: 2847, discount: 31, badge: "sale", emoji: "📱", stock: 42, description: "Latest flagship smartphone with 200MP camera, AI-powered video, and long battery life.", images: ["https://via.placeholder.com/600x600?text=Samsung+S25+Ultra"], seller: "Samsung Official Store", sellerLocation: "Noida, UP" },
  { name: "Apple AirPods Pro 3", nameHi: "Apple AirPods Pro 3", category: "electronics", price: 24999, original: 29999, rating: "4.7", reviews: 1923, discount: 17, badge: "new", emoji: "🎧", stock: 15, description: "Wireless noise-cancelling earbuds with spatial audio and adaptive transparency.", images: ["https://via.placeholder.com/600x600?text=AirPods+Pro+3"], seller: "Apple Store", sellerLocation: "Bengaluru, KA" },
  { name: 'Sony 4K OLED TV 55"', nameHi: 'Sony 4K OLED TV 55"', category: "electronics", price: 89999, original: 120000, rating: "4.6", reviews: 876, discount: 25, badge: "sale", emoji: "📺", stock: 8, description: "55-inch 4K OLED smart TV with Dolby Vision and voice assistant support.", images: ["https://via.placeholder.com/600x600?text=Sony+OLED+TV"], seller: "Sony Electronics", sellerLocation: "Mumbai, MH" },
  { name: "Dell XPS 15 Laptop", nameHi: "Dell XPS 15 लैपटॉप", category: "electronics", price: 119999, original: 149999, rating: "4.9", reviews: 654, discount: 20, badge: "hot", emoji: "💻", stock: 23, description: "High-performance laptop for professionals with premium build and fast processor.", images: ["https://via.placeholder.com/600x600?text=Dell+XPS+15"], seller: "Dell Official", sellerLocation: "Pune, MH" },
  { name: "Floral Summer Dress", nameHi: "फ्लोरल समर ड्रेस", category: "fashion", price: 1299, original: 2999, rating: "4.5", reviews: 3241, discount: 57, badge: "sale", emoji: "👗", stock: 120, description: "Lightweight floral summer dress with breathable fabric and modern fit.", images: ["https://via.placeholder.com/600x600?text=Floral+Summer+Dress"], seller: "Fashion Hub", sellerLocation: "Jaipur, RJ" },
  { name: "Men's Slim Fit Blazer", nameHi: "मेन्स स्लिम फिट ब्लेजर", category: "fashion", price: 2499, original: 5999, rating: "4.4", reviews: 1567, discount: 58, badge: "sale", emoji: "🧥", stock: 67, description: "Slim-fit blazer crafted for formal events and sharp everyday styling.", images: ["https://via.placeholder.com/600x600?text=Slim+Fit+Blazer"], seller: "Urban Attire", sellerLocation: "Chennai, TN" },
  { name: "Running Shoes Pro X", nameHi: "रनिंग शूज प्रो X", category: "fashion", price: 3499, original: 6999, rating: "4.6", reviews: 2109, discount: 50, badge: "hot", emoji: "👟", stock: 89, description: "Professional running shoes with responsive cushioning and durable grip.", images: ["https://via.placeholder.com/600x600?text=Running+Shoes"], seller: "Sportify", sellerLocation: "Kolkata, WB" },
  { name: "Designer Handbag", nameHi: "डिज़ाइनर हैंडबैग", category: "fashion", price: 4999, original: 12000, rating: "4.3", reviews: 876, discount: 58, badge: "new", emoji: "👜", stock: 34, description: "Designer handbag in premium leather with secure compartments and chic styling.", images: ["https://via.placeholder.com/600x600?text=Designer+Handbag"], seller: "Luxury Bags", sellerLocation: "New Delhi, DL" },
  { name: "Smart LED Desk Lamp", nameHi: "स्मार्ट LED डेस्क लैम्प", category: "home", price: 1899, original: 3499, rating: "4.5", reviews: 2341, discount: 46, badge: "new", emoji: "💡", stock: 56, description: "Smart LED desk lamp with adjustable brightness and USB charging port.", images: ["https://via.placeholder.com/600x600?text=LED+Desk+Lamp"], seller: "Home Essentials", sellerLocation: "Ahmedabad, GJ" },
  { name: "Air Purifier HEPA", nameHi: "Air Purifier HEPA", category: "home", price: 12999, original: 19999, rating: "4.7", reviews: 1234, discount: 35, badge: "sale", emoji: "🌬️", stock: 18, description: "HEPA air purifier with quiet mode and multi-stage filtration for clean air.", images: ["https://via.placeholder.com/600x600?text=Air+Purifier"], seller: "PureAir", sellerLocation: "Surat, GJ" },
  { name: "Non-Stick Cookware Set", nameHi: "नॉन-स्टिक कुकवेयर सेट", category: "home", price: 3999, original: 7999, rating: "4.6", reviews: 3456, discount: 50, badge: "hot", emoji: "🍳", stock: 73, description: "Non-stick cookware set for convenient everyday cooking and easy cleanup.", images: ["https://via.placeholder.com/600x600?text=Cookware+Set"], seller: "Chef Select", sellerLocation: "Hyderabad, TS" },
  { name: "Memory Foam Pillow", nameHi: "मेमोरी फोम तकिया", category: "home", price: 1499, original: 2999, rating: "4.4", reviews: 987, discount: 50, badge: "new", emoji: "🛏️", stock: 200, description: "Memory foam pillow designed for better neck support and restful sleep.", images: ["https://via.placeholder.com/600x600?text=Memory+Foam+Pillow"], seller: "SleepWell", sellerLocation: "Lucknow, UP" },
  { name: "Vitamin C Serum", nameHi: "विटामिन C सीरम", category: "beauty", price: 699, original: 1499, rating: "4.6", reviews: 5678, discount: 53, badge: "hot", emoji: "✨", stock: 300, description: "Vitamin C serum for brightening and hydration with antioxidant protection.", images: ["https://via.placeholder.com/600x600?text=Vitamin+C+Serum"], seller: "Beauty Bliss", sellerLocation: "Gurugram, HR" },
  { name: "Luxury Perfume Set", nameHi: "लग्जरी परफ्यूम सेट", category: "beauty", price: 2999, original: 5999, rating: "4.5", reviews: 1234, discount: 50, badge: "sale", emoji: "🌸", stock: 45, description: "Luxury perfume set with rich notes and elegant presentation for gifting.", images: ["https://via.placeholder.com/600x600?text=Perfume+Set"], seller: "Fragrance World", sellerLocation: "Kanpur, UP" },
  { name: "Hair Dryer Pro 2000W", nameHi: "हेयर ड्रायर प्रो 2000W", category: "beauty", price: 2499, original: 4999, rating: "4.4", reviews: 2109, discount: 50, badge: "new", emoji: "💇", stock: 60, description: "2000W hair dryer with fast drying and multiple heat-speed settings.", images: ["https://via.placeholder.com/600x600?text=Hair+Dryer"], seller: "Salon Pro", sellerLocation: "Noida, UP" },
  { name: "Skincare Ritual Kit", nameHi: "स्किनकेयर रिचुअल किट", category: "beauty", price: 1999, original: 3999, rating: "4.7", reviews: 876, discount: 50, badge: "hot", emoji: "🧴", stock: 88, description: "Complete skincare ritual kit with cleanser, toner, moisturizer, and glow serum.", images: ["https://via.placeholder.com/600x600?text=Skincare+Kit"], seller: "Glow Cosmetics", sellerLocation: "Chandigarh, PB" },
];

const SEED_LOCATIONS = [
  { id: "delhi", city: "Delhi", state: "Delhi", pin: "110001", courier: "Ecom Express", deliveryDays: "2-4" },
  { id: "mumbai", city: "Mumbai", state: "Maharashtra", pin: "400001", courier: "BlueDart", deliveryDays: "2-5" },
  { id: "bangalore", city: "Bengaluru", state: "Karnataka", pin: "560001", courier: "DTDC", deliveryDays: "2-5" },
  { id: "hyderabad", city: "Hyderabad", state: "Telangana", pin: "500001", courier: "Delhivery", deliveryDays: "2-5" },
];

export default async (req: Request) => {
  if (req.method !== "POST") {
    return Response.json({ success: false, message: "POST only" }, { status: 405 });
  }

  try {
    // Check if already seeded
    const existing = await db.select().from(products).limit(1);
    if (existing.length > 0) {
      return Response.json({ success: true, message: "Database already seeded", seeded: false });
    }

    // Insert products
    await db.insert(products).values(SEED_PRODUCTS);

    // Insert locations (upsert to be safe)
    for (const loc of SEED_LOCATIONS) {
      await db.insert(locations).values(loc).onConflictDoNothing();
    }

    return Response.json({ success: true, message: "Database seeded successfully", seeded: true, counts: { products: SEED_PRODUCTS.length, locations: SEED_LOCATIONS.length } }, { status: 201 });
  } catch (e) {
    console.error("[seed]", e);
    return Response.json({ success: false, message: "Seed failed" }, { status: 500 });
  }
};

export const config: Config = {
  path: "/api/seed",
};
