export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  originalPrice?: number;
  category: string;
  tags: string[];
  details: {
    beadCount?: number;
    material?: string;
    certification?: string;
    origin?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  subcategories?: Category[];
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl: string;
}
