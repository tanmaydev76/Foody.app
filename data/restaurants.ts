export interface Restaurant {
  id: number;
  name: string;
  image: string;
  cuisines: string[];
  rating: number;
  priceForOne: number;
  deliveryTime: number;
  promoted: boolean;
  offer?: string;
  category: string;
}

/* Curated Unsplash photo IDs — fast CDN, no search delay */
function u(id: string) {
  return `https://images.unsplash.com/${id}?w=600&h=400&fit=crop&auto=format&q=75`;
}

export const restaurants: Restaurant[] = [
  {
    id: 1,
    name: 'Pizza Palace',
    image: u('photo-1555396273-367ea4eb4db5'),
    cuisines: ['Pizza', 'Italian', 'Pasta'],
    rating: 4.5, priceForOne: 400, deliveryTime: 25,
    promoted: true, offer: '₹100 OFF', category: 'Pizza',
  },
  {
    id: 2,
    name: 'Burger Barn',
    image: u('photo-1561758033-d89a9ad46330'),
    cuisines: ['Burgers', 'Fast Food', 'Snacks'],
    rating: 4.3, priceForOne: 250, deliveryTime: 20,
    promoted: false, offer: '20% OFF', category: 'Burgers',
  },
  {
    id: 3,
    name: 'Biryani House',
    image: u('photo-1563379091339-03b21ab4a4f8'),
    cuisines: ['Biryani', 'North Indian', 'Kebab'],
    rating: 4.7, priceForOne: 350, deliveryTime: 35,
    promoted: true, offer: '₹100 OFF', category: 'Biryani',
  },
  {
    id: 4,
    name: 'Dragon Wok',
    image: u('photo-1569718212165-3a8278d5f624'),
    cuisines: ['Chinese', 'Asian', 'Noodles'],
    rating: 4.2, priceForOne: 300, deliveryTime: 30,
    promoted: false, offer: 'Free Delivery', category: 'Chinese',
  },
  {
    id: 5,
    name: 'South Spice',
    image: u('photo-1589301760014-d929f3979dbc'),
    cuisines: ['South Indian', 'Dosa', 'Idli'],
    rating: 4.6, priceForOne: 200, deliveryTime: 20,
    promoted: true, offer: '₹50 OFF', category: 'South Indian',
  },
  {
    id: 6,
    name: 'Punjabi Tadka',
    image: u('photo-1585937421612-70a008356fbe'),
    cuisines: ['North Indian', 'Mughlai', 'Tandoor'],
    rating: 4.4, priceForOne: 450, deliveryTime: 40,
    promoted: false, offer: '₹100 OFF', category: 'North Indian',
  },
  {
    id: 7,
    name: 'Roll Street',
    image: u('photo-1626700051175-6818013e1d4f'),
    cuisines: ['Rolls', 'Wraps', 'Fast Food'],
    rating: 4.1, priceForOne: 180, deliveryTime: 15,
    promoted: false, offer: 'Buy 2 Get 1', category: 'Rolls',
  },
  {
    id: 8,
    name: 'Snack Attack',
    image: u('photo-1576107232684-1279f390859f'),
    cuisines: ['Snacks', 'Street Food', 'Chaat'],
    rating: 4.3, priceForOne: 150, deliveryTime: 15,
    promoted: true, offer: '20% OFF', category: 'Snacks',
  },
  {
    id: 9,
    name: 'Sweet Tooth',
    image: u('photo-1567620905732-2d1ec7ab7445'),
    cuisines: ['Desserts', 'Ice Cream', 'Cakes'],
    rating: 4.5, priceForOne: 200, deliveryTime: 25,
    promoted: false, offer: '₹50 OFF', category: 'Desserts',
  },
  {
    id: 10,
    name: 'Brew & Sip',
    image: u('photo-1461023058943-07fcbe16d735'),
    cuisines: ['Beverages', 'Juices', 'Coffee'],
    rating: 4.4, priceForOne: 120, deliveryTime: 10,
    promoted: true, offer: 'Free Delivery', category: 'Beverages',
  },
  {
    id: 11,
    name: 'Trattoria Italia',
    image: u('photo-1565299624946-b28f40a0ae38'),
    cuisines: ['Pizza', 'Italian', 'Pasta', 'Conti'],
    rating: 4.2, priceForOne: 400, deliveryTime: 35,
    promoted: true, offer: '₹100 OFF', category: 'Pizza',
  },
  {
    id: 12,
    name: 'Behrouz Biryani',
    image: u('photo-1596797038530-2c107229654b'),
    cuisines: ['Biryani', 'Kebab', 'North Indian'],
    rating: 4.8, priceForOne: 500, deliveryTime: 45,
    promoted: true, offer: '₹100 OFF', category: 'Biryani',
  },
];
