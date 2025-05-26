
import { User, Product, Order, UserRole } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock users data with different roles
export const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "client@example.com",
    role: "client" as UserRole,
    password: "password123"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "seller@example.com",
    role: "seller" as UserRole,
    password: "password123"
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin" as UserRole,
    password: "password123"
  }
];

// Mock products with various car parts
export const products: Product[] = [
  {
    id: "1",
    title: "Performance Air Filter",
    description: "High-flow air filter for increased horsepower and acceleration. Washable and reusable for long service life.",
    price: 49.99,
    keywords: ["air filter", "performance", "engine", "intake"],
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    sellerId: "2",
    createdAt: new Date(2023, 1, 15).toISOString()
  },
  {
    id: "2",
    title: "Ceramic Brake Pads Set",
    description: "Premium ceramic brake pads for reduced noise and dust. Superior stopping power and long-lasting performance.",
    price: 79.99,
    keywords: ["brakes", "ceramic", "pads", "safety"],
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    sellerId: "2",
    createdAt: new Date(2023, 2, 10).toISOString()
  },
  {
    id: "3",
    title: "LED Headlight Conversion Kit",
    description: "Upgrade to energy-efficient LED headlights with this easy-to-install conversion kit. Brighter illumination for safer night driving.",
    price: 129.99,
    keywords: ["LED", "headlights", "lighting", "conversion"],
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    sellerId: "2",
    createdAt: new Date(2023, 3, 5).toISOString()
  },
  {
    id: "4",
    title: "Synthetic Motor Oil 5W-30",
    description: "Full synthetic motor oil for superior engine protection under extreme conditions. Extended oil change intervals.",
    price: 32.99,
    keywords: ["oil", "synthetic", "engine", "lubrication"],
    imageUrl: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    sellerId: "2",
    createdAt: new Date(2023, 3, 12).toISOString()
  },
  {
    id: "5",
    title: "Performance Exhaust System",
    description: "Stainless steel performance exhaust system for enhanced sound and power. Improves exhaust flow for better engine efficiency.",
    price: 349.99,
    keywords: ["exhaust", "performance", "stainless steel", "sound"],
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    sellerId: "2",
    createdAt: new Date(2023, 4, 3).toISOString()
  },
  {
    id: "6",
    title: "Heavy Duty Car Battery",
    description: "Maintenance-free car battery with high cold cranking amps for reliable starting in all weather conditions.",
    price: 119.99,
    keywords: ["battery", "power", "starting", "electrical"],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    sellerId: "2",
    createdAt: new Date(2023, 5, 20).toISOString()
  },
  {
    id: "7",
    title: "Alloy Wheel Set 18-inch",
    description: "Lightweight alloy wheels for improved handling and aesthetics. Set of four with contemporary design.",
    price: 599.99,
    keywords: ["wheels", "alloy", "rims", "18-inch"],
    imageUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    sellerId: "2",
    createdAt: new Date(2023, 6, 10).toISOString()
  },
  {
    id: "8",
    title: "Shock Absorber Kit",
    description: "Gas-charged shock absorbers for improved ride comfort and handling. Sold as a set of four with mounting hardware.",
    price: 249.99,
    keywords: ["suspension", "shocks", "ride quality", "handling"],
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    sellerId: "2",
    createdAt: new Date(2023, 7, 5).toISOString()
  }
];

// Mock orders with various statuses (single product per order per new Order type)
export const orders: Order[] = [
  {
    id: "1",
    client_id: "1",
    product_id: "1",
    seller_id: "2",
    quantity: 1,
    status: "completed",
    created_at: new Date(2023, 7, 10).toISOString(),
    updated_at: new Date(2023, 7, 15).toISOString()
  },
  {
    id: "2",
    client_id: "1",
    product_id: "2",
    seller_id: "2",
    quantity: 1,
    status: "confirmed",
    created_at: new Date(2023, 8, 5).toISOString(),
    updated_at: new Date(2023, 8, 6).toISOString()
  },
  {
    id: "3",
    client_id: "1",
    product_id: "5",
    seller_id: "2",
    quantity: 1,
    status: "pending",
    created_at: new Date(2023, 8, 20).toISOString(),
    updated_at: new Date(2023, 8, 20).toISOString()
  }
];

// Helper functions to simulate API calls with delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to generate a unique ID
export const generateId = () => uuidv4();

