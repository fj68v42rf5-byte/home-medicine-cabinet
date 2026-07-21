// Database of common medications with pre-filled details for Barcode Scans & Auto-Lookup
export const MOCK_BARCODE_DATABASE = [
  {
    barcode: "5000223456789",
    name: "Ibuprofen 400mg",
    brand: "Advil Extra",
    category: "Pain Relief",
    form: "Tablets",
    unit: "pills",
    defaultQuantity: 24,
    location: "Medicine Cabinet",
    notes: "Take with food for pain or inflammation. Max 3/day.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80"
  },
  {
    barcode: "030045044908",
    name: "Paracetamol 500mg",
    brand: "Tylenol Regular Strength",
    category: "Pain Relief",
    form: "Caplets",
    unit: "pills",
    defaultQuantity: 50,
    location: "First Aid Kit",
    notes: "For fever and headaches. Do not exceed 4000mg/day.",
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&auto=format&fit=crop&q=80"
  },
  {
    barcode: "300450449087",
    name: "Amoxicillin 500mg",
    brand: "Amoxil",
    category: "Antibiotics",
    form: "Capsules",
    unit: "pills",
    defaultQuantity: 21,
    location: "Refrigerator",
    notes: "Finish entire course prescribed by physician.",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80"
  },
  {
    barcode: "4008400000000",
    name: "Cetirizine 10mg",
    brand: "Zyrtec Allergy",
    category: "Allergy",
    form: "Tablets",
    unit: "pills",
    defaultQuantity: 30,
    location: "Bedside Drawer",
    notes: "Non-drowsy 24 hour relief for seasonal allergies.",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=80"
  },
  {
    barcode: "8712345678901",
    name: "Multivitamin Complete",
    brand: "Centrum Adult",
    category: "Vitamins",
    form: "Tablets",
    unit: "pills",
    defaultQuantity: 90,
    location: "Kitchen Shelf",
    notes: "Daily dietary supplement with breakfast.",
    image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=300&auto=format&fit=crop&q=80"
  },
  {
    barcode: "3595890001002",
    name: "Saline Nasal Spray 50ml",
    brand: "Otrivin",
    category: "Cold & Flu",
    form: "Spray",
    unit: "bottles",
    defaultQuantity: 1,
    location: "Bathroom Cabinet",
    notes: "Relieves nasal congestion instantly.",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&auto=format&fit=crop&q=80"
  }
];

export const PRESET_CATEGORIES = [
  "Pain Relief",
  "Cold & Flu",
  "Antibiotics",
  "Allergy",
  "Vitamins",
  "Digestive Health",
  "First Aid",
  "Eye & Ear Care",
  "Skin & Topical",
  "Other"
];

export const PRESET_FORMS = [
  "Tablets",
  "Capsules",
  "Caplets",
  "Liquid (ml)",
  "Syrup",
  "Spray",
  "Drops",
  "Ointment / Cream",
  "Inhaler",
  "Patch",
  "Packs / Sachets"
];

export const PRESET_LOCATIONS = [
  "Medicine Cabinet",
  "First Aid Kit",
  "Bathroom Cabinet",
  "Kitchen Shelf",
  "Refrigerator",
  "Bedside Drawer",
  "Travel Bag",
  "Office Desk"
];
