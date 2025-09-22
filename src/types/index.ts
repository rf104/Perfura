export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  volume: string;
  notes: string[];
  rating: number;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  user_name: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}