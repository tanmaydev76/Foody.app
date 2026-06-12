import { FoodItem } from '@/context/CartContext';

/* One curated Unsplash photo ID per category — served instantly from Unsplash CDN */
const CATEGORY_IMAGES: Record<string, string> = {
  Pizza:          'photo-1565299624946-b28f40a0ae38',
  Burgers:        'photo-1568901346375-23c9450c58cd',
  Biryani:        'photo-1563379091339-03b21ab4a4f8',
  Chinese:        'photo-1569718212165-3a8278d5f624',
  'South Indian': 'photo-1589301760014-d929f3979dbc',
  'North Indian': 'photo-1585937421612-70a008356fbe',
  Rolls:          'photo-1626700051175-6818013e1d4f',
  Snacks:         'photo-1576107232684-1279f390859f',
  Desserts:       'photo-1567620905732-2d1ec7ab7445',
  Beverages:      'photo-1544145945-f90425340c7e',
};

/* Per-item overrides for visual variety within a category */
const ITEM_IMAGES: Record<string, string> = {
  'Margherita Pizza':           'photo-1513104890138-7c749659a591',
  'Farmhouse Pizza':            'photo-1565299624946-b28f40a0ae38',
  'Peppy Paneer Pizza':         'photo-1574071318508-1cdbab80d002',
  'Chicken Pepperoni Pizza':    'photo-1534308983496-4fabb1a015ee',
  'BBQ Chicken Pizza':          'photo-1528735602780-2552fd46c7af',
  'Cheese Burst Pizza':         'photo-1571407970349-bc81e7e96d47',
  'Classic Veg Burger':         'photo-1550547660-d9450f859349',
  'Cheese Veggie Burger':       'photo-1571091718767-18b5b1457add',
  'Chicken Zinger Burger':      'photo-1568901346375-23c9450c58cd',
  'Double Patty Beef Burger':   'photo-1553979459-d2229ba7433a',
  'Paneer Tikka Burger':        'photo-1586816001966-79b736744398',
  'Hyderabadi Chicken Biryani': 'photo-1563379091339-03b21ab4a4f8',
  'Veg Dum Biryani':            'photo-1596797038530-2c107229654b',
  'Mutton Biryani':             'photo-1589302168068-964664d93dc0',
  'Egg Biryani':                'photo-1606491956689-2ea866880c84',
  'Paneer Biryani':             'photo-1631515243349-e0cb75fb8d3a',
  'Veg Hakka Noodles':          'photo-1569718212165-3a8278d5f624',
  'Chicken Manchurian':         'photo-1609501676725-7186f017a4b7',
  'Veg Spring Rolls':           'photo-1510130387422-82bed34b37e9',
  'Chilli Paneer':              'photo-1604908177453-7462950a6a3b',
  'Schezwan Fried Rice':        'photo-1603133872878-684f208fb84b',
  'Chicken Fried Rice':         'photo-1617093727343-374698b1b08d',
  'Masala Dosa':                'photo-1589301760014-d929f3979dbc',
  'Idli Sambar':                'photo-1630383249896-483b1a6e98a9',
  'Medu Vada':                  'photo-1668236543090-82eba5ee5976',
  'Uttapam':                    'photo-1567620832903-9fc6debc209f',
  'Curd Rice':                  'photo-1516714435131-44d6b64dc6a2',
  'Butter Chicken':             'photo-1585937421612-70a008356fbe',
  'Paneer Butter Masala':       'photo-1631452180519-c014fe946bc7',
  'Dal Makhani':                'photo-1546833998-877b37c2e5c6',
  'Chole Bhature':              'photo-1606491956689-2ea866880c84',
  'Tandoori Chicken':           'photo-1599487488170-d11ec9c172f0',
  'Butter Naan':                'photo-1565557623262-b51c2513a641',
  'Palak Paneer':               'photo-1645112411341-6c4fd023882a',
  'Chicken Kathi Roll':         'photo-1626700051175-6818013e1d4f',
  'Paneer Tikka Roll':          'photo-1552539618-7eec9b4d1796',
  'Egg Roll':                   'photo-1619895862022-09114b41f16f',
  'French Fries':               'photo-1576107232684-1279f390859f',
  'Chicken Nuggets':            'photo-1562802378-063ec186a863',
  'Veg Samosa (2pc)':           'photo-1601050690597-df0568f70950',
  'Paneer Pakora':              'photo-1627662168223-7df99068099a',
  'Chicken Wings':              'photo-1527477396000-e27163b481c2',
  'Gulab Jamun (2pc)':          'photo-1605197788044-61fd270cbf90',
  'Chocolate Brownie':          'photo-1606313564200-e75d5e30476c',
  'Rasmalai':                   'photo-1567620905732-2d1ec7ab7445',
  'Vanilla Ice Cream':          'photo-1501443762994-82bd5dace89a',
  'Chocolate Lava Cake':        'photo-1624353365286-3f8d62daad51',
  'Masala Chai':                'photo-1571934811356-5cc061b6821f',
  'Cold Coffee':                'photo-1461023058943-07fcbe16d735',
  'Mango Lassi':                'photo-1544145945-f90425340c7e',
  'Fresh Lime Soda':            'photo-1437418747212-8d9709afab22',
  'Masala Coke':                'photo-1527960669566-f882ba85a4c6',
};

function img(name: string, category: string): string {
  const id = ITEM_IMAGES[name] ?? CATEGORY_IMAGES[category] ?? 'photo-1504674900247-0877df9cc836';
  return `https://images.unsplash.com/${id}?w=480&h=360&fit=crop&auto=format&q=75`;
}

interface RawItem {
  name: string; description: string; price: number;
  category: string; rating: number; veg: boolean;
}

const raw: RawItem[] = [
  // Pizzas
  { name: 'Margherita Pizza',        description: 'Classic delight with 100% real mozzarella cheese',    price: 219, category: 'Pizza',        rating: 4.5, veg: true },
  { name: 'Farmhouse Pizza',         description: 'Loaded with onion, capsicum, tomato & mushroom',      price: 299, category: 'Pizza',        rating: 4.4, veg: true },
  { name: 'Peppy Paneer Pizza',      description: 'Spicy paneer, capsicum & red pepper toppings',        price: 319, category: 'Pizza',        rating: 4.3, veg: true },
  { name: 'Chicken Pepperoni Pizza', description: 'Spicy chicken pepperoni with extra cheese',           price: 379, category: 'Pizza',        rating: 4.6, veg: false },
  { name: 'BBQ Chicken Pizza',       description: 'Tangy BBQ sauce loaded with grilled chicken',         price: 399, category: 'Pizza',        rating: 4.5, veg: false },
  { name: 'Cheese Burst Pizza',      description: 'Extra layer of cheese stuffed in the crust',          price: 349, category: 'Pizza',        rating: 4.7, veg: true },
  // Burgers
  { name: 'Classic Veg Burger',      description: 'Crispy veg patty with lettuce, tomato & mayo',       price: 99,  category: 'Burgers',      rating: 4.2, veg: true },
  { name: 'Cheese Veggie Burger',    description: 'Veg patty topped with melted cheese slice',          price: 129, category: 'Burgers',      rating: 4.3, veg: true },
  { name: 'Chicken Zinger Burger',   description: 'Crispy fried chicken fillet with spicy mayo',        price: 179, category: 'Burgers',      rating: 4.6, veg: false },
  { name: 'Double Patty Beef Burger',description: 'Double juicy patties with cheddar cheese',           price: 249, category: 'Burgers',      rating: 4.5, veg: false },
  { name: 'Paneer Tikka Burger',     description: 'Smoky paneer tikka patty with mint mayo',            price: 149, category: 'Burgers',      rating: 4.4, veg: true },
  // Biryani
  { name: 'Hyderabadi Chicken Biryani', description: 'Aromatic basmati rice cooked with spiced chicken', price: 249, category: 'Biryani',  rating: 4.7, veg: false },
  { name: 'Veg Dum Biryani',         description: 'Fragrant rice layered with mixed vegetables',         price: 199, category: 'Biryani',      rating: 4.3, veg: true },
  { name: 'Mutton Biryani',          description: 'Slow cooked tender mutton with basmati rice',         price: 329, category: 'Biryani',      rating: 4.8, veg: false },
  { name: 'Egg Biryani',             description: 'Boiled eggs tossed in spicy biryani rice',            price: 179, category: 'Biryani',      rating: 4.2, veg: false },
  { name: 'Paneer Biryani',          description: 'Soft paneer cubes cooked in fragrant rice',           price: 219, category: 'Biryani',      rating: 4.4, veg: true },
  // Chinese
  { name: 'Veg Hakka Noodles',       description: 'Stir fried noodles with fresh vegetables',            price: 159, category: 'Chinese',      rating: 4.2, veg: true },
  { name: 'Chicken Manchurian',      description: 'Crispy chicken balls in tangy Manchurian sauce',      price: 219, category: 'Chinese',      rating: 4.5, veg: false },
  { name: 'Veg Spring Rolls',        description: 'Crispy rolls stuffed with veggies & glass noodles',   price: 139, category: 'Chinese',      rating: 4.1, veg: true },
  { name: 'Chilli Paneer',           description: 'Crispy paneer tossed in spicy chilli sauce',          price: 229, category: 'Chinese',      rating: 4.4, veg: true },
  { name: 'Schezwan Fried Rice',     description: 'Spicy schezwan style fried rice with veggies',        price: 169, category: 'Chinese',      rating: 4.3, veg: true },
  { name: 'Chicken Fried Rice',      description: 'Wok tossed rice with shredded chicken',               price: 199, category: 'Chinese',      rating: 4.4, veg: false },
  // South Indian
  { name: 'Masala Dosa',             description: 'Crispy rice crepe filled with spiced potato masala',  price: 119, category: 'South Indian', rating: 4.6, veg: true },
  { name: 'Idli Sambar',             description: 'Steamed rice cakes served with sambar & chutney',     price: 89,  category: 'South Indian', rating: 4.4, veg: true },
  { name: 'Medu Vada',               description: 'Crispy fried lentil donuts served with chutney',      price: 79,  category: 'South Indian', rating: 4.3, veg: true },
  { name: 'Uttapam',                 description: 'Thick savoury pancake topped with onion & tomato',    price: 109, category: 'South Indian', rating: 4.2, veg: true },
  { name: 'Curd Rice',               description: 'Comforting rice mixed with fresh curd & tempering',   price: 99,  category: 'South Indian', rating: 4.1, veg: true },
  // North Indian
  { name: 'Butter Chicken',          description: 'Tender chicken in rich tomato butter gravy',          price: 289, category: 'North Indian', rating: 4.8, veg: false },
  { name: 'Paneer Butter Masala',    description: 'Soft paneer cubes in creamy tomato gravy',            price: 249, category: 'North Indian', rating: 4.6, veg: true },
  { name: 'Dal Makhani',             description: 'Slow cooked black lentils with butter & cream',       price: 189, category: 'North Indian', rating: 4.5, veg: true },
  { name: 'Chole Bhature',           description: 'Spicy chickpea curry with fluffy fried bread',        price: 159, category: 'North Indian', rating: 4.5, veg: true },
  { name: 'Tandoori Chicken',        description: 'Char grilled chicken marinated in yogurt & spices',   price: 329, category: 'North Indian', rating: 4.7, veg: false },
  { name: 'Butter Naan',             description: 'Soft leavened bread brushed with butter',             price: 49,  category: 'North Indian', rating: 4.4, veg: true },
  { name: 'Palak Paneer',            description: 'Cottage cheese cubes in creamy spinach gravy',        price: 219, category: 'North Indian', rating: 4.4, veg: true },
  // Rolls
  { name: 'Chicken Kathi Roll',      description: 'Spiced chicken wrapped in flaky paratha',             price: 159, category: 'Rolls',        rating: 4.5, veg: false },
  { name: 'Paneer Tikka Roll',       description: 'Smoky paneer tikka wrapped with mint chutney',        price: 139, category: 'Rolls',        rating: 4.3, veg: true },
  { name: 'Egg Roll',                description: 'Fluffy egg wrapped in crispy paratha',                price: 99,  category: 'Rolls',        rating: 4.2, veg: false },
  // Snacks
  { name: 'French Fries',            description: 'Crispy golden fries served with ketchup',             price: 99,  category: 'Snacks',       rating: 4.3, veg: true },
  { name: 'Chicken Nuggets',         description: 'Crunchy bite sized chicken nuggets',                  price: 159, category: 'Snacks',       rating: 4.4, veg: false },
  { name: 'Veg Samosa (2pc)',        description: 'Crispy pastry filled with spiced potato filling',     price: 49,  category: 'Snacks',       rating: 4.5, veg: true },
  { name: 'Paneer Pakora',           description: 'Crispy gram flour battered paneer fritters',         price: 139, category: 'Snacks',       rating: 4.3, veg: true },
  { name: 'Chicken Wings',           description: 'Spicy fried chicken wings tossed in sauce',           price: 219, category: 'Snacks',       rating: 4.6, veg: false },
  // Desserts
  { name: 'Gulab Jamun (2pc)',       description: 'Soft milk solids dumplings soaked in sugar syrup',   price: 79,  category: 'Desserts',     rating: 4.6, veg: true },
  { name: 'Chocolate Brownie',       description: 'Rich fudgy brownie topped with chocolate sauce',     price: 129, category: 'Desserts',     rating: 4.7, veg: true },
  { name: 'Rasmalai',                description: 'Soft cottage cheese discs in sweet saffron milk',    price: 99,  category: 'Desserts',     rating: 4.5, veg: true },
  { name: 'Vanilla Ice Cream',       description: 'Creamy classic vanilla ice cream scoop',             price: 89,  category: 'Desserts',     rating: 4.3, veg: true },
  { name: 'Chocolate Lava Cake',     description: 'Warm chocolate cake with molten center',             price: 149, category: 'Desserts',     rating: 4.8, veg: true },
  // Beverages
  { name: 'Masala Chai',             description: 'Hot Indian spiced tea brewed with milk',             price: 39,  category: 'Beverages',    rating: 4.4, veg: true },
  { name: 'Cold Coffee',             description: 'Chilled coffee blended with ice cream',              price: 109, category: 'Beverages',    rating: 4.5, veg: true },
  { name: 'Mango Lassi',             description: 'Refreshing yogurt drink blended with mango',         price: 99,  category: 'Beverages',    rating: 4.6, veg: true },
  { name: 'Fresh Lime Soda',         description: 'Tangy lime juice with soda & mint',                  price: 59,  category: 'Beverages',    rating: 4.2, veg: true },
  { name: 'Masala Coke',             description: 'Chilled cola with a tangy masala twist',             price: 69,  category: 'Beverages',    rating: 4.1, veg: true },
];

export const foodItems: FoodItem[] = raw.map((item, index) => ({
  id: index + 1,
  name: item.name,
  description: item.description,
  price: item.price,
  category: item.category,
  rating: item.rating,
  veg: item.veg,
  image: img(item.name, item.category),
}));

export const categories = Array.from(new Set(foodItems.map((f) => f.category)));
