import type { FoodItem } from '@/context/CartContext';

export interface Restaurant {
  id: number;
  name: string;
  image: string;
  cuisines: string[];
  rating: number;
  priceForOne: number;
  costForTwo?: number;
  deliveryTime: number;
  promoted: boolean;
  offer?: string;
  category: string;
  lat: number;
  lng: number;
  area: string;
  /** Brand color used as fallback background when logo fails to load */
  brandColor?: string;
  /** Fallback initials shown if logo image fails */
  brandInitials?: string;
  /** URL for the brand logo image (shown inside white circle) */
  logoUrl?: string;
  /** Per-restaurant menu; present only for brand restaurants */
  menu?: BrandMenuItem[];
}

export interface BrandMenuItem extends FoodItem {
  restaurantId: number;
  restaurantName: string;
}

/* ── Unsplash helper ──────────────────────────────────────────── */
function u(id: string, w = 600, h = 400) {
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=75`;
}

/* ── Existing generic restaurants (unchanged) ─────────────────── */
export const restaurants: Restaurant[] = [
  {
    id: 1, name: 'Pizza Palace',
    image: u('photo-1555396273-367ea4eb4db5'),
    cuisines: ['Pizza', 'Italian', 'Pasta'],
    rating: 4.5, priceForOne: 400, deliveryTime: 25,
    promoted: true, offer: '₹100 OFF', category: 'Pizza',
    lat: 19.0596, lng: 72.8295, area: 'Bandra West',
  },
  {
    id: 2, name: 'Burger Barn',
    image: u('photo-1561758033-d89a9ad46330'),
    cuisines: ['Burgers', 'Fast Food', 'Snacks'],
    rating: 4.3, priceForOne: 250, deliveryTime: 20,
    promoted: false, offer: '20% OFF', category: 'Burgers',
    lat: 19.1136, lng: 72.8697, area: 'Andheri West',
  },
  {
    id: 3, name: 'Biryani House',
    image: u('photo-1563379091339-03b21ab4a4f8'),
    cuisines: ['Biryani', 'North Indian', 'Kebab'],
    rating: 4.7, priceForOne: 350, deliveryTime: 35,
    promoted: true, offer: '₹100 OFF', category: 'Biryani',
    lat: 19.0760, lng: 72.8777, area: 'Dadar',
  },
  {
    id: 4, name: 'Dragon Wok',
    image: u('photo-1569718212165-3a8278d5f624'),
    cuisines: ['Chinese', 'Asian', 'Noodles'],
    rating: 4.2, priceForOne: 300, deliveryTime: 30,
    promoted: false, offer: 'Free Delivery', category: 'Chinese',
    lat: 19.0330, lng: 72.8656, area: 'Kurla',
  },
  {
    id: 5, name: 'South Spice',
    image: u('photo-1589301760014-d929f3979dbc'),
    cuisines: ['South Indian', 'Dosa', 'Idli'],
    rating: 4.6, priceForOne: 200, deliveryTime: 20,
    promoted: true, offer: '₹50 OFF', category: 'South Indian',
    lat: 19.1724, lng: 72.9570, area: 'Thane West',
  },
  {
    id: 6, name: 'Punjabi Tadka',
    image: u('photo-1585937421612-70a008356fbe'),
    cuisines: ['North Indian', 'Mughlai', 'Tandoor'],
    rating: 4.4, priceForOne: 450, deliveryTime: 40,
    promoted: false, offer: '₹100 OFF', category: 'North Indian',
    lat: 19.0176, lng: 72.8562, area: 'Chembur',
  },
  {
    id: 7, name: 'Roll Street',
    image: u('photo-1626700051175-6818013e1d4f'),
    cuisines: ['Rolls', 'Wraps', 'Fast Food'],
    rating: 4.1, priceForOne: 180, deliveryTime: 15,
    promoted: false, offer: 'Buy 2 Get 1', category: 'Rolls',
    lat: 19.1041, lng: 72.8370, area: 'Goregaon West',
  },
  {
    id: 8, name: 'Snack Attack',
    image: u('photo-1576107232684-1279f390859f'),
    cuisines: ['Snacks', 'Street Food', 'Chaat'],
    rating: 4.3, priceForOne: 150, deliveryTime: 15,
    promoted: true, offer: '20% OFF', category: 'Snacks',
    lat: 19.0454, lng: 72.8710, area: 'Sion',
  },
  {
    id: 9, name: 'Sweet Tooth',
    image: u('photo-1567620905732-2d1ec7ab7445'),
    cuisines: ['Desserts', 'Ice Cream', 'Cakes'],
    rating: 4.5, priceForOne: 200, deliveryTime: 25,
    promoted: false, offer: '₹50 OFF', category: 'Desserts',
    lat: 19.0821, lng: 72.8908, area: 'Ghatkopar West',
  },
  {
    id: 10, name: 'Brew & Sip',
    image: u('photo-1461023058943-07fcbe16d735'),
    cuisines: ['Beverages', 'Juices', 'Coffee'],
    rating: 4.4, priceForOne: 120, deliveryTime: 10,
    promoted: true, offer: 'Free Delivery', category: 'Beverages',
    lat: 18.9388, lng: 72.8354, area: 'Colaba',
  },
  {
    id: 11, name: 'Trattoria Italia',
    image: u('photo-1565299624946-b28f40a0ae38'),
    cuisines: ['Pizza', 'Italian', 'Pasta', 'Conti'],
    rating: 4.2, priceForOne: 400, deliveryTime: 35,
    promoted: true, offer: '₹100 OFF', category: 'Pizza',
    lat: 19.0178, lng: 72.8478, area: 'Matunga',
  },
  {
    id: 12, name: 'Behrouz Biryani (Powai)',
    image: u('photo-1596797038530-2c107229654b'),
    cuisines: ['Biryani', 'Kebab', 'North Indian'],
    rating: 4.8, priceForOne: 500, deliveryTime: 45,
    promoted: true, offer: '₹100 OFF', category: 'Biryani',
    lat: 19.1215, lng: 72.9050, area: 'Powai',
  },
];

/* ── Brand restaurant menus ───────────────────────────────────── */

function menuItem(
  id: number, name: string, description: string, price: number,
  category: string, rating: number, veg: boolean, photoId: string,
  restaurantId: number, restaurantName: string,
): BrandMenuItem {
  return {
    id, name, description, price, category, rating, veg,
    image: u(photoId, 480, 360),
    restaurantId, restaurantName,
  };
}

const mcMenu: BrandMenuItem[] = [
  menuItem(1001, 'McAloo Tikki Burger', 'Crispy aloo tikki patty with mint mayo & veggies', 49,  'Burgers', 4.4, true,  'photo-1550547660-d9450f859349', 101, "McDonald's"),
  menuItem(1002, 'McVeggie Burger',     'Crunchy veggie patty with edam cheese & sauce',   99,  'Burgers', 4.3, true,  'photo-1571091718767-18b5b1457add', 101, "McDonald's"),
  menuItem(1003, 'McChicken Burger',    'Juicy chicken patty with mustard & mayonnaise',   129, 'Burgers', 4.5, false, 'photo-1568901346375-23c9450c58cd', 101, "McDonald's"),
  menuItem(1004, 'McSpicy Chicken',     'Extra crispy spicy chicken fillet, rich sauce',   179, 'Burgers', 4.6, false, 'photo-1586816001966-79b736744398', 101, "McDonald's"),
  menuItem(1005, 'Filet-O-Fish',        'Crispy fish fillet with tartar sauce',            159, 'Burgers', 4.2, false, 'photo-1512621776951-a57141f2eefd', 101, "McDonald's"),
  menuItem(1006, 'Large Fries',         'Golden crispy fries, lightly salted',             149, 'Snacks',  4.5, true,  'photo-1576107232684-1279f390859f', 101, "McDonald's"),
  menuItem(1007, 'Chicken McNuggets 6pc','Tender white-meat chicken, golden battered',     179, 'Snacks',  4.4, false, 'photo-1562802378-063ec186a863',   101, "McDonald's"),
  menuItem(1008, 'McFlurry Oreo',       'Creamy vanilla soft serve with Oreo pieces',      119, 'Desserts',4.7, true,  'photo-1501443762994-82bd5dace89a', 101, "McDonald's"),
  menuItem(1009, 'McCafé Cold Coffee',  'Smooth chilled coffee blended to perfection',     129, 'Beverages',4.5,true, 'photo-1461023058943-07fcbe16d735', 101, "McDonald's"),
  menuItem(1010, 'Soft Serve Cone',     'Classic creamy soft-serve ice cream cone',        29,  'Desserts',4.3, true,  'photo-1497034825429-c343d7c6a68f', 101, "McDonald's"),
];

const bkMenu: BrandMenuItem[] = [
  menuItem(1020, 'Crispy Veg Burger',   'Crispy veggie patty with fresh lettuce & sauce',  79,  'Burgers', 4.2, true,  'photo-1550547660-d9450f859349', 102, 'Burger King'),
  menuItem(1021, 'Veg Whopper',         'Flame-grilled veggie patty, the Whopper way',     179, 'Burgers', 4.3, true,  'photo-1571091718767-18b5b1457add', 102, 'Burger King'),
  menuItem(1022, 'Chicken Whopper',     'Flame-grilled chicken, lettuce, tomato, mayo',    249, 'Burgers', 4.6, false, 'photo-1568901346375-23c9450c58cd', 102, 'Burger King'),
  menuItem(1023, 'Double Whopper',      'Double flame-grilled beef-style patty',           329, 'Burgers', 4.7, false, 'photo-1553979459-d2229ba7433a',   102, 'Burger King'),
  menuItem(1024, 'Paneer King Burger',  'Smoky paneer patty with jalapeño sauce',          149, 'Burgers', 4.4, true,  'photo-1586816001966-79b736744398', 102, 'Burger King'),
  menuItem(1025, 'Chicken Fries',       'Crispy strips of chicken in a fun fries shape',   149, 'Snacks',  4.4, false, 'photo-1527477396000-e27163b481c2', 102, 'Burger King'),
  menuItem(1026, 'Onion Rings',         'Golden crispy battered onion rings',              99,  'Snacks',  4.3, true,  'photo-1576107232684-1279f390859f', 102, 'Burger King'),
  menuItem(1027, 'Mozzarella Nuggets',  'Gooey mozzarella bites in crunchy coating',       119, 'Snacks',  4.5, true,  'photo-1562802378-063ec186a863',   102, 'Burger King'),
  menuItem(1028, 'BK Chocolate Shake',  'Thick creamy chocolate milkshake',                139, 'Beverages',4.4,true, 'photo-1541658016709-82535e94bc69', 102, 'Burger King'),
  menuItem(1029, 'Crispy Chicken Burger','Extra crispy chicken fillet, spicy BK sauce',   159, 'Burgers', 4.5, false, 'photo-1562802378-063ec186a863',   102, 'Burger King'),
];

const dominosMenu: BrandMenuItem[] = [
  menuItem(1040, 'Margherita Pizza',      'Classic delight with 100% real mozzarella',    199, 'Pizza',    4.4, true,  'photo-1513104890138-7c749659a591',   103, "Domino's"),
  menuItem(1041, 'Farm House Pizza',      'Loaded onion, capsicum, tomato & mushroom',    349, 'Pizza',    4.5, true,  'photo-1565299624946-b28f40a0ae38',   103, "Domino's"),
  menuItem(1042, 'Peppy Paneer Pizza',    'Spicy paneer, capsicum & red pepper',          349, 'Pizza',    4.3, true,  'photo-1574071318508-1cdbab80d002',   103, "Domino's"),
  menuItem(1043, 'Chicken Dominator',     'Loaded with chicken, jalapeños & extra cheese',499, 'Pizza',    4.7, false, 'photo-1534308983496-4fabb1a015ee',   103, "Domino's"),
  menuItem(1044, 'Veg Extravaganza',      'A pizza loaded with 7 fresh veggies',          399, 'Pizza',    4.4, true,  'photo-1571407970349-bc81e7e96d47',   103, "Domino's"),
  menuItem(1045, 'Chicken Golden Delight','Roasted chicken, golden corn & exotic sauce',  399, 'Pizza',    4.6, false, 'photo-1528735602780-2552fd46c7af',   103, "Domino's"),
  menuItem(1046, 'Garlic Breadsticks',    'Soft baked breadsticks with garlic butter',    119, 'Sides',    4.5, true,  'photo-1565557623262-b51c2513a641',   103, "Domino's"),
  menuItem(1047, 'Stuffed Garlic Bread',  'Cheesy garlic bread stuffed with veggies',     149, 'Sides',    4.6, true,  'photo-1565557623262-b51c2513a641',   103, "Domino's"),
  menuItem(1048, 'Pasta Italiano',        'Al dente pasta in creamy red sauce',           189, 'Sides',    4.3, true,  'photo-1555396273-367ea4eb4db5',      103, "Domino's"),
  menuItem(1049, 'Choco Lava Cake',       'Warm chocolate cake with molten center',       109, 'Desserts', 4.8, true,  'photo-1624353365286-3f8d62daad51',   103, "Domino's"),
];

const kfcMenu: BrandMenuItem[] = [
  menuItem(1060, 'Original Recipe Chicken 2pc','Herb & spice secret recipe fried chicken',269, 'Chicken', 4.7, false, 'photo-1527477396000-e27163b481c2', 104, 'KFC'),
  menuItem(1061, 'Hot & Crispy Chicken 2pc',   'Extra crispy golden fried chicken',       269, 'Chicken', 4.6, false, 'photo-1562802378-063ec186a863',   104, 'KFC'),
  menuItem(1062, 'Popcorn Chicken',             'Bite-sized crispy chicken pieces',        189, 'Chicken', 4.5, false, 'photo-1599487488170-d11ec9c172f0', 104, 'KFC'),
  menuItem(1063, 'Zinger Burger',               'Extra crispy chicken fillet, zesty sauce',229, 'Burgers', 4.7, false, 'photo-1568901346375-23c9450c58cd', 104, 'KFC'),
  menuItem(1064, 'Hot Wings 5pc',               'Spicy fried chicken wings with dip',      249, 'Chicken', 4.6, false, 'photo-1527477396000-e27163b481c2', 104, 'KFC'),
  menuItem(1065, 'Veg Zinger Burger',           'Crispy veggie fillet in spicy sauce',     179, 'Burgers', 4.3, true,  'photo-1550547660-d9450f859349',   104, 'KFC'),
  menuItem(1066, 'Smoky Grilled Chicken',       'Smoky flame-grilled whole leg',           319, 'Chicken', 4.5, false, 'photo-1599487488170-d11ec9c172f0', 104, 'KFC'),
  menuItem(1067, 'KFC Rice Bowl',               'Seasoned rice topped with chicken strips',239, 'Combos',  4.4, false, 'photo-1617093727343-374698b1b08d', 104, 'KFC'),
  menuItem(1068, 'Coleslaw',                    'Fresh creamy homestyle coleslaw',          69, 'Sides',   4.2, true,  'photo-1576107232684-1279f390859f', 104, 'KFC'),
  menuItem(1069, 'Chocolate Mousse Cake',       'Rich creamy chocolate mousse slice',      149, 'Desserts',4.5, true,  'photo-1606313564200-e75d5e30476c', 104, 'KFC'),
];

const pizzaHutMenu: BrandMenuItem[] = [
  menuItem(1080, 'Margherita Pizza',    'Classic tomato & mozzarella perfection',         249, 'Pizza',    4.3, true,  'photo-1513104890138-7c749659a591',   105, 'Pizza Hut'),
  menuItem(1081, 'Veggie Supreme',      'Fresh garden veggies on tangy tomato base',      399, 'Pizza',    4.4, true,  'photo-1565299624946-b28f40a0ae38',   105, 'Pizza Hut'),
  menuItem(1082, 'Hawaiian Chicken',    'Chicken & pineapple on sweet tomato sauce',      449, 'Pizza',    4.5, false, 'photo-1534308983496-4fabb1a015ee',   105, 'Pizza Hut'),
  menuItem(1083, 'Pepperoni Feast',     'Loaded double pepperoni with extra cheese',      499, 'Pizza',    4.7, false, 'photo-1571407970349-bc81e7e96d47',   105, 'Pizza Hut'),
  menuItem(1084, 'BBQ Chicken Pizza',   'Smoky BBQ chicken with caramelised onions',      449, 'Pizza',    4.6, false, 'photo-1528735602780-2552fd46c7af',   105, 'Pizza Hut'),
  menuItem(1085, 'Stuffed Crust Cheese','Cheese-stuffed golden crust, rich topping',      349, 'Pizza',    4.6, true,  'photo-1574071318508-1cdbab80d002',   105, 'Pizza Hut'),
  menuItem(1086, 'Garlic Bread',        'Soft bread glazed with butter & garlic',         129, 'Sides',    4.5, true,  'photo-1565557623262-b51c2513a641',   105, 'Pizza Hut'),
  menuItem(1087, 'Pasta in Arrabiata',  'Penne in spicy Italian arrabiata sauce',         219, 'Sides',    4.3, true,  'photo-1555396273-367ea4eb4db5',      105, 'Pizza Hut'),
  menuItem(1088, 'Choco Volcano',       'Warm chocolate cake with flowing lava center',   109, 'Desserts', 4.7, true,  'photo-1624353365286-3f8d62daad51',   105, 'Pizza Hut'),
];

const subwayMenu: BrandMenuItem[] = [
  menuItem(1100, 'Veggie Delite Sub',     'Fresh veggies on Italian herb bread',          189, 'Subs',    4.2, true,  'photo-1553909489-cd47e0907980', 106, 'Subway'),
  menuItem(1101, 'Paneer Tikka Sub',      'Smoky paneer tikka with mint chutney',         229, 'Subs',    4.5, true,  'photo-1553909489-cd47e0907980', 106, 'Subway'),
  menuItem(1102, 'Chicken Teriyaki Sub',  'Teriyaki glazed chicken strips',               289, 'Subs',    4.6, false, 'photo-1553909489-cd47e0907980', 106, 'Subway'),
  menuItem(1103, 'BLT Sub',              'Crispy bacon, fresh lettuce, ripe tomato',      269, 'Subs',    4.4, false, 'photo-1553909489-cd47e0907980', 106, 'Subway'),
  menuItem(1104, 'Chicken Melt Sub',     'Grilled chicken topped with melted cheese',     309, 'Subs',    4.5, false, 'photo-1553909489-cd47e0907980', 106, 'Subway'),
  menuItem(1105, 'Subway Club Sub',      'Ham, turkey, roast beef, classic combo',        329, 'Subs',    4.6, false, 'photo-1553909489-cd47e0907980', 106, 'Subway'),
  menuItem(1106, 'Veggie Wrap',          'Fresh garden veggies in a wheat tortilla',      219, 'Wraps',   4.3, true,  'photo-1626700051175-6818013e1d4f', 106, 'Subway'),
  menuItem(1107, 'Chicken Wrap',         'Grilled chicken strips in herb tortilla',       269, 'Wraps',   4.5, false, 'photo-1626700051175-6818013e1d4f', 106, 'Subway'),
  menuItem(1108, 'Oatmeal Raisin Cookie','Soft-baked cookie with raisins & oats',          59, 'Snacks',  4.4, true,  'photo-1606313564200-e75d5e30476c', 106, 'Subway'),
];

const naturalMenu: BrandMenuItem[] = [
  menuItem(1120, 'Sitaphal (Custard Apple)', 'Seasonal custard apple ice cream',        80,  'Ice Cream', 4.8, true, 'photo-1501443762994-82bd5dace89a', 107, 'Natural Ice Cream'),
  menuItem(1121, 'Alphonso Mango',           'Premium Alphonso mango ice cream',        90,  'Ice Cream', 4.9, true, 'photo-1497034825429-c343d7c6a68f', 107, 'Natural Ice Cream'),
  menuItem(1122, 'Strawberry',               'Fresh strawberry with real fruit bits',   70,  'Ice Cream', 4.6, true, 'photo-1501443762994-82bd5dace89a', 107, 'Natural Ice Cream'),
  menuItem(1123, 'Tender Coconut',           'Light & refreshing tender coconut',       80,  'Ice Cream', 4.7, true, 'photo-1497034825429-c343d7c6a68f', 107, 'Natural Ice Cream'),
  menuItem(1124, 'Chocolate',                'Rich dark chocolate ice cream',           70,  'Ice Cream', 4.5, true, 'photo-1501443762994-82bd5dace89a', 107, 'Natural Ice Cream'),
  menuItem(1125, 'Kesar Pista',              'Saffron & pistachio — a royal classic',  90,  'Ice Cream', 4.8, true, 'photo-1497034825429-c343d7c6a68f', 107, 'Natural Ice Cream'),
  menuItem(1126, 'Butterscotch',             'Creamy butterscotch with crunchy bits',   70,  'Ice Cream', 4.4, true, 'photo-1501443762994-82bd5dace89a', 107, 'Natural Ice Cream'),
  menuItem(1127, 'Rajbhog',                  'Royal saffron & dry fruits flavour',      80,  'Ice Cream', 4.7, true, 'photo-1497034825429-c343d7c6a68f', 107, 'Natural Ice Cream'),
  menuItem(1128, 'Ice Cream Sandwich',       'Two scoops between crispy wafer',         60,  'Combos',   4.3, true, 'photo-1501443762994-82bd5dace89a', 107, 'Natural Ice Cream'),
  menuItem(1129, 'Sundae',                   'Ice cream with caramel & dry fruits',     120, 'Combos',   4.6, true, 'photo-1567620905732-2d1ec7ab7445',  107, 'Natural Ice Cream'),
];

const starbucksMenu: BrandMenuItem[] = [
  menuItem(1140, 'Caramel Macchiato',       'Espresso with vanilla syrup & caramel drizzle', 370, 'Coffee',   4.7, true, 'photo-1461023058943-07fcbe16d735', 108, 'Starbucks'),
  menuItem(1141, 'Java Chip Frappuccino',   'Mocha sauce blended with coffee & chocolate',   395, 'Coffee',   4.8, true, 'photo-1495474472287-4d71bcdd2085', 108, 'Starbucks'),
  menuItem(1142, 'Cold Brew Coffee',        'Smooth slow-steeped cold brew',                 325, 'Coffee',   4.6, true, 'photo-1461023058943-07fcbe16d735', 108, 'Starbucks'),
  menuItem(1143, 'Vanilla Latte',           'Rich espresso with creamy steamed milk',        345, 'Coffee',   4.5, true, 'photo-1495474472287-4d71bcdd2085', 108, 'Starbucks'),
  menuItem(1144, 'Mocha',                   'Espresso with bittersweet mocha sauce',         345, 'Coffee',   4.6, true, 'photo-1461023058943-07fcbe16d735', 108, 'Starbucks'),
  menuItem(1145, 'Chai Tea Latte',          'Black tea infused with spices & steamed milk',  295, 'Tea',      4.5, true, 'photo-1571934811356-5cc061b6821f', 108, 'Starbucks'),
  menuItem(1146, 'Green Tea Latte',         'Premium matcha blended with steamed milk',      325, 'Tea',      4.4, true, 'photo-1571934811356-5cc061b6821f', 108, 'Starbucks'),
  menuItem(1147, 'Butter Croissant',        'Flaky golden croissant baked fresh',            195, 'Snacks',   4.5, true, 'photo-1565299624946-b28f40a0ae38', 108, 'Starbucks'),
  menuItem(1148, 'Blueberry Muffin',        'Moist blueberry muffin with sugar crumble',     175, 'Snacks',   4.4, true, 'photo-1606313564200-e75d5e30476c', 108, 'Starbucks'),
  menuItem(1149, 'Grilled Chicken Sandwich','Grilled chicken on toasted sourdough',           395, 'Snacks',   4.3, false,'photo-1553909489-cd47e0907980',   108, 'Starbucks'),
];

const haldiramMenu: BrandMenuItem[] = [
  menuItem(1160, 'Veg Thali',            'Dal, paneer, rice, roti, salad & sweet',      299, 'Meals',   4.6, true, 'photo-1585937421612-70a008356fbe', 109, "Haldiram's"),
  menuItem(1161, 'Chole Bhature',        'Spicy chickpea curry with fluffy bhatura',    130, 'Meals',   4.7, true, 'photo-1606491956689-2ea866880c84', 109, "Haldiram's"),
  menuItem(1162, 'Dal Makhani',          'Slow cooked black lentils with butter',       210, 'Meals',   4.6, true, 'photo-1546833998-877b37c2e5c6',   109, "Haldiram's"),
  menuItem(1163, 'Paneer Tikka',         'Marinated paneer grilled in tandoor',         260, 'Snacks',  4.5, true, 'photo-1631452180519-c014fe946bc7', 109, "Haldiram's"),
  menuItem(1164, 'Pani Puri',            'Crispy puris with spicy tangy water',          80, 'Snacks',  4.8, true, 'photo-1601050690597-df0568f70950', 109, "Haldiram's"),
  menuItem(1165, 'Samosa Chole (2pc)',   'Crispy samosas topped with chole & chutney',   90, 'Snacks',  4.7, true, 'photo-1601050690597-df0568f70950', 109, "Haldiram's"),
  menuItem(1166, 'Gulab Jamun (4pc)',    'Soft dumplings soaked in rose sugar syrup',    80, 'Sweets',  4.7, true, 'photo-1605197788044-61fd270cbf90', 109, "Haldiram's"),
  menuItem(1167, 'Kaju Barfi',           'Premium cashew fudge cut into diamond slabs', 250, 'Sweets',  4.8, true, 'photo-1605197788044-61fd270cbf90', 109, "Haldiram's"),
  menuItem(1168, 'Moong Dal Halwa',      'Rich slow-cooked moong dal halwa with ghee',  150, 'Sweets',  4.6, true, 'photo-1567620905732-2d1ec7ab7445',  109, "Haldiram's"),
  menuItem(1169, 'Masala Lassi',         'Chilled yogurt drink with roasted cumin',      70, 'Beverages',4.6,true, 'photo-1544145945-f90425340c7e',   109, "Haldiram's"),
  menuItem(1170, 'Mixed Namkeen',        'Crispy assorted namkeen snack mix',             80, 'Snacks',  4.4, true, 'photo-1576107232684-1279f390859f', 109, "Haldiram's"),
  menuItem(1171, 'Aloo Bhujia',          'Thin crispy potato noodles, classic snack',    50, 'Snacks',  4.5, true, 'photo-1576107232684-1279f390859f', 109, "Haldiram's"),
];

const wowMomoMenu: BrandMenuItem[] = [
  menuItem(1180, 'Classic Veg Steamed Momo',     'Soft steamed dumplings with veggie filling',  129, 'Steamed', 4.3, true,  'photo-1496116218417-1a781b1c416c', 110, 'Wow Momo'),
  menuItem(1181, 'Classic Chicken Steamed Momo', 'Juicy chicken in soft steamed wrappers',       149, 'Steamed', 4.5, false, 'photo-1496116218417-1a781b1c416c', 110, 'Wow Momo'),
  menuItem(1182, 'Veg Fried Momo',               'Golden deep-fried dumplings with veg',         149, 'Fried',   4.4, true,  'photo-1496116218417-1a781b1c416c', 110, 'Wow Momo'),
  menuItem(1183, 'Chicken Fried Momo',           'Crispy fried chicken dumplings',               169, 'Fried',   4.6, false, 'photo-1496116218417-1a781b1c416c', 110, 'Wow Momo'),
  menuItem(1184, 'Kurkure Veg Momo',             'Extra crunchy momo coated in kurkure',         159, 'Fried',   4.5, true,  'photo-1496116218417-1a781b1c416c', 110, 'Wow Momo'),
  menuItem(1185, 'Kurkure Chicken Momo',         'Crunchy coated momo with spicy chicken',       179, 'Fried',   4.7, false, 'photo-1496116218417-1a781b1c416c', 110, 'Wow Momo'),
  menuItem(1186, 'Paneer Momo',                  'Soft steamed momo with spiced paneer',         149, 'Steamed', 4.4, true,  'photo-1496116218417-1a781b1c416c', 110, 'Wow Momo'),
  menuItem(1187, 'Momo Soup Bowl',               'Steamed momo in clear spiced broth',           179, 'Soup',    4.4, true,  'photo-1569718212165-3a8278d5f624',  110, 'Wow Momo'),
  menuItem(1188, 'Chilli Chicken Momo',          'Tossed in spicy chilli sauce',                 189, 'Specials',4.6, false, 'photo-1609501676725-7186f017a4b7', 110, 'Wow Momo'),
  menuItem(1189, 'Momowich',                     'Momo patty inside a soft bun — like a burger', 149, 'Specials',4.5, false, 'photo-1562802378-063ec186a863',   110, 'Wow Momo'),
];

const behrouzMenu: BrandMenuItem[] = [
  menuItem(1200, 'Dum Chicken Biryani',    'Slow-cooked whole chicken leg in dum handi',   349, 'Biryani', 4.8, false, 'photo-1563379091339-03b21ab4a4f8', 111, 'Behrouz Biryani'),
  menuItem(1201, 'Shahi Paneer Biryani',   'Regal paneer dum biryani with saffron rice',   299, 'Biryani', 4.6, true,  'photo-1596797038530-2c107229654b', 111, 'Behrouz Biryani'),
  menuItem(1202, 'Mutton Dum Biryani',     'Tender slow-cooked mutton in fragrant rice',   449, 'Biryani', 4.9, false, 'photo-1589302168068-964664d93dc0', 111, 'Behrouz Biryani'),
  menuItem(1203, 'Chicken Tikka Biryani',  'Smoky tikka pieces layered in basmati rice',   399, 'Biryani', 4.7, false, 'photo-1563379091339-03b21ab4a4f8', 111, 'Behrouz Biryani'),
  menuItem(1204, 'Veg Dum Biryani',        'Seasonal veggies cooked in Mughal dum style',  249, 'Biryani', 4.5, true,  'photo-1631515243349-e0cb75fb8d3a', 111, 'Behrouz Biryani'),
  menuItem(1205, 'Egg Dum Biryani',        'Whole boiled eggs in spiced dum biryani',      299, 'Biryani', 4.5, false, 'photo-1606491956689-2ea866880c84', 111, 'Behrouz Biryani'),
  menuItem(1206, 'Dal Ghost',              'Rich dal cooked with tender mutton & spices',  549, 'Sides',   4.7, false, 'photo-1585937421612-70a008356fbe', 111, 'Behrouz Biryani'),
  menuItem(1207, 'Shorba',                 'Aromatic Mughal-style biryani soup',           129, 'Sides',   4.4, false, 'photo-1569718212165-3a8278d5f624',  111, 'Behrouz Biryani'),
  menuItem(1208, 'Burhani Raita',          'Cooling yogurt with roasted spices',            79, 'Sides',   4.5, true,  'photo-1567620832903-9fc6debc209f', 111, 'Behrouz Biryani'),
  menuItem(1209, 'Firni',                  'Creamy rice pudding with rose & dry fruits',   119, 'Desserts',4.6, true,  'photo-1567620905732-2d1ec7ab7445',  111, 'Behrouz Biryani'),
];

const burgerSinghMenu: BrandMenuItem[] = [
  menuItem(1220, 'Amritsari Veg Burger',   'Spiced amritsari patty with desi sauces',       109, 'Burgers', 4.4, true,  'photo-1550547660-d9450f859349',   112, 'Burger Singh'),
  menuItem(1221, 'Punjabi Chicken Burger', 'Crispy chicken marinated in Punjabi masala',    159, 'Burgers', 4.6, false, 'photo-1568901346375-23c9450c58cd', 112, 'Burger Singh'),
  menuItem(1222, 'Gabbar Singh Veg',       'Double patty veg burger with desi toppings',    149, 'Burgers', 4.3, true,  'photo-1571091718767-18b5b1457add', 112, 'Burger Singh'),
  menuItem(1223, 'Triple Decker Chicken',  'Three layers of crispy chicken — beast mode',   229, 'Burgers', 4.7, false, 'photo-1553979459-d2229ba7433a',   112, 'Burger Singh'),
  menuItem(1224, 'Singh Is King Burger',   'Signature chicken burger with special sauce',   199, 'Burgers', 4.6, false, 'photo-1586816001966-79b736744398', 112, 'Burger Singh'),
  menuItem(1225, 'Chicken Tikka Burger',   'Tandoori chicken tikka patty, buttery bun',     179, 'Burgers', 4.5, false, 'photo-1562802378-063ec186a863',   112, 'Burger Singh'),
  menuItem(1226, 'Desi Bhatura Burger',    'Spiced patty inside a fluffy bhatura bun',      139, 'Burgers', 4.4, true,  'photo-1550547660-d9450f859349',   112, 'Burger Singh'),
  menuItem(1227, 'Garlic Fries',           'Crispy fries tossed in garlic butter & herbs',   99, 'Sides',   4.5, true,  'photo-1576107232684-1279f390859f', 112, 'Burger Singh'),
  menuItem(1228, 'Masala Onion Rings',     'Crispy onion rings dusted with desi masala',     89, 'Sides',   4.3, true,  'photo-1576107232684-1279f390859f', 112, 'Burger Singh'),
  menuItem(1229, 'Lassi Shake',            'Thick sweet lassi blended smooth',               99, 'Beverages',4.5,true, 'photo-1544145945-f90425340c7e',   112, 'Burger Singh'),
];

/* ── Brand restaurant entries ─────────────────────────────────── */
export const brandRestaurants: Restaurant[] = [
  {
    id: 101, name: "McDonald's",
    image: u('photo-1561758033-d89a9ad46330'),
    brandColor: '#DA291C', brandInitials: 'M',
    logoUrl: '/brands/mcdonalds.svg',
    cuisines: ['Burgers', 'Fast Food', 'Snacks'],
    rating: 4.4, priceForOne: 200, costForTwo: 400, deliveryTime: 25,
    promoted: true, offer: 'McSaver Meals from ₹49', category: 'Burgers',
    lat: 19.1136, lng: 72.8697, area: 'Andheri West',
    menu: mcMenu,
  },
  {
    id: 102, name: 'Burger King',
    image: u('photo-1568901346375-23c9450c58cd'),
    brandColor: '#F5C518', brandInitials: 'BK',
    logoUrl: '/brands/burgerking.svg',
    cuisines: ['Burgers', 'Fast Food', 'Sides'],
    rating: 4.3, priceForOne: 220, costForTwo: 440, deliveryTime: 25,
    promoted: false, offer: '₹79 Burgers', category: 'Burgers',
    lat: 19.0596, lng: 72.8295, area: 'Bandra West',
    menu: bkMenu,
  },
  {
    id: 103, name: "Domino's",
    image: u('photo-1513104890138-7c749659a591'),
    brandColor: '#006491', brandInitials: "D's",
    logoUrl: '/brands/dominos.svg',
    cuisines: ['Pizza', 'Pasta', 'Sides'],
    rating: 4.5, priceForOne: 350, costForTwo: 700, deliveryTime: 30,
    promoted: true, offer: '2 Pizzas @ ₹99 each', category: 'Pizza',
    lat: 19.0178, lng: 72.8428, area: 'Dadar West',
    menu: dominosMenu,
  },
  {
    id: 104, name: 'KFC',
    image: u('photo-1562802378-063ec186a863'),
    brandColor: '#C8102E', brandInitials: 'KFC',
    logoUrl: '/brands/kfc.svg',
    cuisines: ['Chicken', 'Burgers', 'Fast Food'],
    rating: 4.4, priceForOne: 300, costForTwo: 600, deliveryTime: 30,
    promoted: false, offer: 'Bucket for 2 @ ₹499', category: 'Burgers',
    lat: 19.1215, lng: 72.9050, area: 'Powai',
    menu: kfcMenu,
  },
  {
    id: 105, name: 'Pizza Hut',
    image: u('photo-1565299624946-b28f40a0ae38'),
    brandColor: '#EE3124', brandInitials: 'PH',
    logoUrl: '/brands/pizzahut.svg',
    cuisines: ['Pizza', 'Pasta', 'Italian'],
    rating: 4.3, priceForOne: 380, costForTwo: 760, deliveryTime: 35,
    promoted: true, offer: 'Buy 1 Get 1 Free', category: 'Pizza',
    lat: 19.1724, lng: 72.9570, area: 'Thane West',
    menu: pizzaHutMenu,
  },
  {
    id: 106, name: 'Subway',
    image: u('photo-1553909489-cd47e0907980'),
    brandColor: '#009639', brandInitials: 'Sub',
    logoUrl: '/brands/subway.svg',
    cuisines: ['Sandwiches', 'Wraps', 'Salads'],
    rating: 4.2, priceForOne: 260, costForTwo: 520, deliveryTime: 25,
    promoted: false, offer: 'Footlong @ ₹299', category: 'Snacks',
    lat: 19.0659, lng: 72.8792, area: 'Kurla West',
    menu: subwayMenu,
  },
  {
    id: 107, name: 'Natural Ice Cream',
    image: u('photo-1497034825429-c343d7c6a68f'),
    brandColor: '#FF6B35', brandInitials: 'Nat',
    logoUrl: '/brands/natural.svg',
    cuisines: ['Ice Cream', 'Desserts'],
    rating: 4.7, priceForOne: 90, costForTwo: 180, deliveryTime: 20,
    promoted: false, offer: '3 Scoops @ ₹199', category: 'Desserts',
    lat: 19.0986, lng: 72.8353, area: 'Juhu',
    menu: naturalMenu,
  },
  {
    id: 108, name: 'Starbucks',
    image: u('photo-1495474472287-4d71bcdd2085'),
    brandColor: '#00704A', brandInitials: 'SB',
    logoUrl: '/brands/starbucks.svg',
    cuisines: ['Coffee', 'Tea', 'Snacks'],
    rating: 4.5, priceForOne: 360, costForTwo: 720, deliveryTime: 30,
    promoted: true, offer: 'Free size upgrade', category: 'Beverages',
    lat: 19.0658, lng: 72.8660, area: 'BKC',
    menu: starbucksMenu,
  },
  {
    id: 109, name: "Haldiram's",
    image: u('photo-1585937421612-70a008356fbe'),
    brandColor: '#FF6B00', brandInitials: 'H',
    logoUrl: '/brands/haldirams.svg',
    cuisines: ['North Indian', 'Sweets', 'Snacks'],
    rating: 4.5, priceForOne: 200, costForTwo: 400, deliveryTime: 25,
    promoted: false, offer: '₹99 Thali', category: 'North Indian',
    lat: 19.0524, lng: 72.8988, area: 'Chembur',
    menu: haldiramMenu,
  },
  {
    id: 110, name: 'Wow Momo',
    image: u('photo-1496116218417-1a781b1c416c'),
    brandColor: '#E31837', brandInitials: 'WM',
    logoUrl: '/brands/wowmomo.svg',
    cuisines: ['Momos', 'Chinese', 'Fast Food'],
    rating: 4.3, priceForOne: 160, costForTwo: 320, deliveryTime: 20,
    promoted: false, offer: '2 plates @ ₹229', category: 'Chinese',
    lat: 19.0866, lng: 72.9089, area: 'Ghatkopar East',
    menu: wowMomoMenu,
  },
  {
    id: 111, name: 'Behrouz Biryani',
    image: u('photo-1596797038530-2c107229654b'),
    brandColor: '#8B1A1A', brandInitials: 'BB',
    logoUrl: '/brands/behrouz.svg',
    cuisines: ['Biryani', 'Mughlai', 'Kebab'],
    rating: 4.8, priceForOne: 380, costForTwo: 760, deliveryTime: 35,
    promoted: true, offer: '₹100 OFF on ₹399+', category: 'Biryani',
    lat: 19.0178, lng: 72.8478, area: 'Matunga',
    menu: behrouzMenu,
  },
  {
    id: 112, name: 'Burger Singh',
    image: u('photo-1586816001966-79b736744398'),
    brandColor: '#FF4500', brandInitials: 'BS',
    logoUrl: '/brands/burgersingh.svg',
    cuisines: ['Burgers', 'North Indian', 'Fast Food'],
    rating: 4.4, priceForOne: 180, costForTwo: 360, deliveryTime: 25,
    promoted: false, offer: 'Combos from ₹149', category: 'Burgers',
    lat: 19.1451, lng: 72.8442, area: 'Goregaon West',
    menu: burgerSinghMenu,
  },
];

/** All restaurants (generic + brand) for listing pages */
export const allRestaurants: Restaurant[] = [...restaurants, ...brandRestaurants];
