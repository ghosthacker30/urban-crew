import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const fallbackProducts = [
  {
    id: 'f1',
    name: 'Taccos',
    price: 1.5,
    description: 'Delicious authentic Mexican tacos with seasoned fillings, served with fresh lime, onions, cilantro, and traditional salsa.',
    calories: 320,
    ingredients: 'Corn tortillas, seasoned beef, cilantro, onion, lime, salsa',
    nutritionInfo: JSON.stringify({ carbs: '24g', fat: '14g', protein: '18g' }),
    category: 'Taccos',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    isAvailable: true
  },
  {
    id: 'f2',
    name: 'Urban Brew Cappuccino',
    price: 1.8,
    description: 'Perfect balance of rich espresso, steamed milk, and velvety smooth micro-foam, decorated with delicate award-winning barista leaf art.',
    calories: 120,
    ingredients: 'Organic espresso, Whole milk, Cocoa powder dusting',
    nutritionInfo: JSON.stringify({ carbs: '9g', fat: '5g', protein: '6g' }),
    category: 'Cold Coffee',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    isAvailable: true
  },
  {
    id: 'f3',
    name: 'Cold Brew Nitro Reserve',
    price: 2.0,
    description: 'Slow-steeped for 20 hours and infused with nitrogen. Pours a beautiful cascading head, offering a naturally sweet and creamy finish.',
    calories: 5,
    ingredients: 'Nitro cold brew, Filtered water',
    nutritionInfo: JSON.stringify({ carbs: '0g', fat: '0g', protein: '0.4g' }),
    category: 'Cold Coffee',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    isAvailable: true
  },
  {
    id: 'f4',
    name: 'Iced Rose Pistachio Latte',
    price: 2.2,
    description: 'Premium espresso served over ice with cream, natural organic rosewater, crushed slow-roasted pistachios, and sweetened with light agave.',
    calories: 220,
    ingredients: 'Espresso, Milk, Rose extract, Crushed pistachios, Agave nectar',
    nutritionInfo: JSON.stringify({ carbs: '24g', fat: '8g', protein: '7g' }),
    category: 'Cold Coffee',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    isAvailable: true
  },
  {
    id: 'f5',
    name: 'Ceremonial Matcha Latte',
    price: 1.9,
    description: 'Whisked Japanese ceremonial Uji matcha blended with steamed oat milk and a touch of raw organic honey.',
    calories: 140,
    ingredients: 'Ceremonial Uji matcha, Oat milk, Organic honey',
    nutritionInfo: JSON.stringify({ carbs: '18g', fat: '3g', protein: '2g' }),
    category: 'Tea',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    isAvailable: true
  },
  {
    id: 'f6',
    name: 'Golden Butter Croissant',
    price: 1.3,
    description: 'Classic French style light, flaky, multi-layered pastry rolled with premium churned Normandy butter, baked fresh every single morning.',
    calories: 270,
    ingredients: 'Unbleached flour, Normandy butter, Yeast, Sea salt',
    nutritionInfo: JSON.stringify({ carbs: '26g', fat: '16g', protein: '5g' }),
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    isAvailable: true
  },
  {
    id: 'f7',
    name: 'Barista Tiramisu Classico',
    price: 2.1,
    description: 'Fluffy sponge layers soaked in our signature espresso, loaded with thick mascarpone cheese, Marsala wine, and dusted heavily with premium dark cocoa powder.',
    calories: 380,
    ingredients: 'Ladyfinger biscuits, Steamed espresso, Mascarpone, Marsala, Cocoa dust',
    nutritionInfo: JSON.stringify({ carbs: '44g', fat: '19g', protein: '6g' }),
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    isAvailable: true
  },
  {
    id: 'f8',
    name: 'Skillet Baked Sunny Eggs',
    price: 2.3,
    description: 'Artisanal organic toast served with two free-range skillet eggs, grilled sausages, sautéed button mushrooms, and seasoned cherry tomatoes.',
    calories: 390,
    ingredients: 'Free-range eggs, Wheat toast, Sausages, Mushrooms, Cherry tomatoes',
    nutritionInfo: JSON.stringify({ carbs: '22g', fat: '19g', protein: '18g' }),
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    isAvailable: true
  },
  {
    id: 'f9',
    name: 'Belgian Chocolate Silkshake',
    price: 1.8,
    description: 'A rich, decadent milkshake blended with premium dark Belgian chocolate, whipped cream, and chocolate curls.',
    calories: 420,
    ingredients: 'Belgian dark chocolate, Whole milk, Vanilla ice cream, Whipped cream',
    nutritionInfo: JSON.stringify({ carbs: '52g', fat: '22g', protein: '8g' }),
    category: 'Milkshakes',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    isAvailable: true
  },
  {
    id: 'f10',
    name: 'Wild Berry Antioxidant Boost',
    price: 1.95,
    description: 'Organic blueberries, raspberries, strawberries, and Greek yogurt blended with fresh almond milk and chia seeds.',
    calories: 180,
    ingredients: 'Blueberries, Raspberries, Strawberries, Greek yogurt, Almond milk, Chia seeds',
    nutritionInfo: JSON.stringify({ carbs: '32g', fat: '4g', protein: '6g' }),
    category: 'Smoothies',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    isAvailable: true
  },
  {
    id: 'f11',
    name: 'Artisanal Salmon Poke Bowl',
    price: 2.4,
    description: 'Fresh sashimi-grade Atlantic salmon, avocado, edamame, pickled cucumber, and warm brown jasmine rice topped with light sriracha-aioli.',
    calories: 490,
    ingredients: 'Atlantic salmon, Brown rice, Edamame, Pickled cucumber, Sriracha-aioli',
    nutritionInfo: JSON.stringify({ carbs: '45g', fat: '15g', protein: '28g' }),
    category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    isAvailable: true
  },
  {
    id: 'f12',
    name: 'Truffle Wild Mushroom Risotto',
    price: 2.4,
    description: 'Slow-cooked Arborio rice in a rich vegetable broth with sautéed chanterelle mushrooms, Parmigiano-Reggiano, and topped with shaved black truffle.',
    calories: 520,
    ingredients: 'Arborio rice, Chanterelle mushrooms, Parmigiano-Reggiano, Black truffle shavings',
    nutritionInfo: JSON.stringify({ carbs: '62g', fat: '18g', protein: '14g' }),
    category: 'Dinner',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    isAvailable: true
  },
  {
    id: 'f13',
    name: 'Citrus Ginger Zen Tea',
    price: 1.4,
    description: 'A refreshing organic herbal blend of lemongrass, fresh raw ginger root, a splash of lemon juice, and served hot with a honey stick.',
    calories: 35,
    ingredients: 'Lemongrass, Organic ginger root, Lemon juice, Honey',
    nutritionInfo: JSON.stringify({ carbs: '9g', fat: '0g', protein: '0g' }),
    category: 'Tea',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop',
    rating: 4.7,
    isAvailable: true
  },
  {
    id: 'f14',
    name: 'Almond Frangipane Tart',
    price: 1.6,
    description: 'Crisp buttery pastry shell filled with sweet rich almond frangipane cream, topped with toasted sliced almonds and powdered sugar.',
    calories: 320,
    ingredients: 'Pastry flour, Almond flour, Butter, Eggs, Almond extract, Toasted almonds',
    nutritionInfo: JSON.stringify({ carbs: '38g', fat: '17g', protein: '6g' }),
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    isAvailable: true
  },
  {
    id: 'f15',
    name: 'Grilled Chicken Caesar Bowl',
    price: 2.2,
    description: 'Crisp organic romaine lettuce, herb-grilled chicken breast slices, garlic sourdough croutons, parmesan flakes, tossed in house Caesar dressing.',
    calories: 360,
    ingredients: 'Romaine lettuce, Grilled chicken breast, Sourdough croutons, Parmesan, Caesar dressing',
    nutritionInfo: JSON.stringify({ carbs: '14g', fat: '16g', protein: '24g' }),
    category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop',
    rating: 4.7,
    isAvailable: true
  },
  {
    id: 'f16',
    name: 'Artisanal Woodfired Pizza',
    price: 2.35,
    description: 'Light bubbly sourdough crust topped with rich organic tomato concasse, fresh buffalo mozzarella slices, wild basil leaves, and a drizzle of olive oil.',
    calories: 620,
    ingredients: 'Sourdough crust, Tomato concasse, Buffalo mozzarella, Fresh basil leaves, Olive oil',
    nutritionInfo: JSON.stringify({ carbs: '78g', fat: '18g', protein: '22g' }),
    category: 'Dinner',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    isAvailable: true
  }
];

export async function GET() {
  try {
    const products = await db.product.findMany();
    if (products && products.length > 0) {
      return NextResponse.json(products);
    }
    return NextResponse.json(fallbackProducts);
  } catch (err) {
    console.warn('Database connection error in products GET. Returning fallback data.', err);
    return NextResponse.json(fallbackProducts);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, description, calories, ingredients, nutritionInfo, category, image } = body;
    const newProduct = await db.product.create({
      data: {
        name,
        price,
        description,
        calories,
        ingredients,
        nutritionInfo: JSON.stringify(nutritionInfo || {}),
        category,
        image
      }
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 });
  }
}
