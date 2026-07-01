import { PrismaClient, Role, OrderStatus, PaymentStatus, ReservationStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting DB Seed...');

  // 1. Clean existing tables in correct dependency order
  await prisma.auditLog.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.reservation.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.blog.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.newsletter.deleteMany({});

  console.log('Existing DB records cleared.');

  // 2. Create Users
  const customerPassword = await bcrypt.hash('customer123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  const customer = await prisma.user.create({
    data: {
      name: 'Shardul',
      email: 'customer@urbanbrew.com',
      passwordHash: customerPassword,
      role: Role.USER,
      rewardPoints: 150,
      referrals: 2,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Brew Master',
      email: 'admin@urbanbrew.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      rewardPoints: 500,
      referrals: 5,
    },
  });

  console.log('Seed users created:', { customer: customer.email, admin: admin.email });

  // 3. Create Products
  const productsData = [
    // Hot Coffee
    {
      name: 'Gold Flaked Espresso',
      price: 1.5,
      description: 'Our signature double shot of espresso topped with subtle 24k edible gold flakes. Elegant, rich, and highly aromatic, made from premium organic single-origin Arabica beans.',
      calories: 5,
      ingredients: 'Double shot espresso, 24k gold flakes, spring water',
      nutritionInfo: JSON.stringify({ carbs: '0g', fat: '0.2g', protein: '0.3g', caffeine: '150mg' }),
      category: 'Hot Coffee',
      image: 'https://images.unsplash.com/photo-1579888944880-d98341245702?q=80&w=600&auto=format&fit=crop',
      rating: 4.9,
    },
    {
      name: 'Urban Brew Cappuccino',
      price: 1.8,
      description: 'Perfect balance of rich espresso, steamed milk, and velvety smooth micro-foam, decorated with delicate award-winning barista leaf art.',
      calories: 120,
      ingredients: 'Organic espresso, Whole milk, Cocoa powder dusting',
      nutritionInfo: JSON.stringify({ carbs: '9g', fat: '5g', protein: '6g', caffeine: '75mg' }),
      category: 'Hot Coffee',
      image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop',
      rating: 4.8,
    },
    {
      name: 'Vanilla Bean Macchiato',
      price: 1.9,
      description: 'Freshly steamed milk marked with vanilla bean syrup and espresso, drizzled with our house-made dark caramel sauce.',
      calories: 180,
      ingredients: 'Organic espresso, Whole milk, Madagascar vanilla syrup, House caramel sauce',
      nutritionInfo: JSON.stringify({ carbs: '22g', fat: '6g', protein: '5g', caffeine: '75mg' }),
      category: 'Hot Coffee',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop',
      rating: 4.7,
    },
    {
      name: 'Velvet Flat White',
      price: 1.7,
      description: 'Smooth ristretto shots blended with steamed whole milk to create a dense, velvety texture with a sweet, bold coffee profile.',
      calories: 110,
      ingredients: 'Ristretto shots, Micro-foamed milk',
      nutritionInfo: JSON.stringify({ carbs: '8g', fat: '5g', protein: '6g', caffeine: '130mg' }),
      category: 'Hot Coffee',
      image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=600&auto=format&fit=crop',
      rating: 4.8,
    },
    // Cold Coffee
    {
      name: 'Cold Brew Nitro Reserve',
      price: 2.0,
      description: 'Slow-steeped for 20 hours and infused with nitrogen. Pours a beautiful cascading head resembling a dark craft beer, offering a naturally sweet and creamy finish.',
      calories: 5,
      ingredients: 'Nitro cold brew, Filtered water',
      nutritionInfo: JSON.stringify({ carbs: '0g', fat: '0g', protein: '0.4g', caffeine: '200mg' }),
      category: 'Cold Coffee',
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop',
      rating: 4.9,
    },
    {
      name: 'Iced Rose Pistachio Latte',
      price: 2.2,
      description: 'Premium espresso served over ice with cream, natural organic rosewater, crushed slow-roasted pistachios, and sweetened with light agave.',
      calories: 220,
      ingredients: 'Espresso, Milk, Rose extract, Crushed pistachios, Agave nectar',
      nutritionInfo: JSON.stringify({ carbs: '24g', fat: '8g', protein: '7g', caffeine: '75mg' }),
      category: 'Cold Coffee',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop',
      rating: 4.9,
    },
    {
      name: 'Vietnamese Salted Ice Coffee',
      price: 1.85,
      description: 'Traditional slow-dripped Robusta coffee mixed with sweetened condensed milk and a touch of sea salt, served over crushed ice for a rich, sweet, and savory hit.',
      calories: 250,
      ingredients: 'Robusta drip coffee, Condensed milk, Sea salt, Ice',
      nutritionInfo: JSON.stringify({ carbs: '32g', fat: '9g', protein: '5g', caffeine: '180mg' }),
      category: 'Cold Coffee',
      image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?q=80&w=600&auto=format&fit=crop',
      rating: 4.7,
    },
    // Tea
    {
      name: 'Ceremonial Matcha Latte',
      price: 1.9,
      description: 'Whisked Japanese ceremonial Uji matcha blended with steamed oat milk and a touch of raw organic honey.',
      calories: 140,
      ingredients: 'Ceremonial Uji matcha, Oat milk, Organic honey',
      nutritionInfo: JSON.stringify({ carbs: '18g', fat: '3g', protein: '2g', caffeine: '35mg' }),
      category: 'Tea',
      image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop',
      rating: 4.8,
    },
    {
      name: 'Royal Masala Chai',
      price: 1.5,
      description: 'Robust black tea brewed with fresh ginger, crushed cardamom, cloves, cinnamon, and black pepper, simmered with creamy whole milk.',
      calories: 160,
      ingredients: 'Assam black tea, Cinnamon, Cardamom, Cloves, Ginger, Whole milk, Cane sugar',
      nutritionInfo: JSON.stringify({ carbs: '20g', fat: '4g', protein: '4g', caffeine: '40mg' }),
      category: 'Tea',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop',
      rating: 4.9,
    },
    {
      name: 'Citrus Ginger Zen Tea',
      price: 1.4,
      description: 'A refreshing organic herbal blend of lemongrass, fresh raw ginger root, a splash of lemon juice, and served hot with a honey stick.',
      calories: 35,
      ingredients: 'Lemongrass, Organic ginger root, Lemon juice, Honey',
      nutritionInfo: JSON.stringify({ carbs: '9g', fat: '0g', protein: '0g', caffeine: '0mg' }),
      category: 'Tea',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop',
      rating: 4.7,
    },
    // Shakes & Smoothies
    {
      name: 'Hazelnut Praline Shake',
      price: 2.1,
      description: 'Rich dark chocolate syrup, premium vanilla gelato, roasted hazelnuts, and fresh cream whipped into a luxurious, thick milkshake.',
      calories: 450,
      ingredients: 'Vanilla gelato, Dark chocolate, Roasted hazelnuts, Whipped cream, Whole milk',
      nutritionInfo: JSON.stringify({ carbs: '52g', fat: '22g', protein: '8g', caffeine: '10mg' }),
      category: 'Milkshakes',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop',
      rating: 4.8,
    },
    {
      name: 'Belgian Chocolate Silkshake',
      price: 1.8,
      description: 'A rich, decadent milkshake blended with premium dark Belgian chocolate, whipped cream, and chocolate curls.',
      calories: 420,
      ingredients: 'Belgian dark chocolate, Whole milk, Vanilla ice cream, Whipped cream',
      nutritionInfo: JSON.stringify({ carbs: '52g', fat: '22g', protein: '8g', caffeine: '10mg' }),
      category: 'Milkshakes',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop',
      rating: 4.8,
    },
    {
      name: 'Avocado Spinach Super-Smoothie',
      price: 2.2,
      description: 'Organic avocado, baby spinach, green apple, dates, and almond milk blended to creamy, health-packed perfection.',
      calories: 290,
      ingredients: 'Avocado, Spinach, Green apple, Medjool dates, Almond milk',
      nutritionInfo: JSON.stringify({ carbs: '38g', fat: '14g', protein: '5g', caffeine: '0mg' }),
      category: 'Smoothies',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=600&auto=format&fit=crop',
      rating: 4.6,
    },
    {
      name: 'Wild Berry Antioxidant Boost',
      price: 1.95,
      description: 'Organic blueberries, raspberries, strawberries, and Greek yogurt blended with fresh almond milk and chia seeds.',
      calories: 180,
      ingredients: 'Blueberries, Raspberries, Strawberries, Greek yogurt, Almond milk, Chia seeds',
      nutritionInfo: JSON.stringify({ carbs: '32g', fat: '4g', protein: '6g', caffeine: '0mg' }),
      category: 'Smoothies',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=600&auto=format&fit=crop',
      rating: 4.9,
    },
    // Bakery & Desserts
    {
      name: 'Golden Butter Croissant',
      price: 1.3,
      description: 'Classic French style light, flaky, multi-layered pastry rolled with premium churned Normandy butter, baked fresh every single morning.',
      calories: 270,
      ingredients: 'Unbleached flour, Normandy butter, Yeast, Sea salt',
      nutritionInfo: JSON.stringify({ carbs: '26g', fat: '16g', protein: '5g', caffeine: '0mg' }),
      category: 'Bakery',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop',
      rating: 4.9,
    },
    {
      name: 'Barista Tiramisu Classico',
      price: 2.1,
      description: 'Fluffy sponge layers soaked in our signature espresso, loaded with thick mascarpone cheese, Marsala wine, and dusted heavily with premium dark cocoa powder.',
      calories: 380,
      ingredients: 'Ladyfinger biscuits, Steamed espresso, Mascarpone, Marsala, Cocoa dust',
      nutritionInfo: JSON.stringify({ carbs: '44g', fat: '19g', protein: '6g', caffeine: '50mg' }),
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=600&auto=format&fit=crop',
      rating: 4.9,
    },
    {
      name: 'Pain au Chocolat',
      price: 1.4,
      description: 'Flaky puff pastry stuffed with dark Belgian chocolate bars. Crispy on the outside, warm and melted chocolate on the inside.',
      calories: 320,
      ingredients: 'Normandy butter, Puff pastry flour, 70% dark Belgian chocolate',
      nutritionInfo: JSON.stringify({ carbs: '34g', fat: '18g', protein: '6g', caffeine: '5mg' }),
      category: 'Bakery',
      image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=600&auto=format&fit=crop',
      rating: 4.8,
    },
    {
      name: 'Almond Frangipane Tart',
      price: 1.6,
      description: 'Crisp buttery pastry shell filled with sweet rich almond frangipane cream, topped with toasted sliced almonds and powdered sugar.',
      calories: 320,
      ingredients: 'Pastry flour, Almond flour, Butter, Eggs, Almond extract, Toasted almonds',
      nutritionInfo: JSON.stringify({ carbs: '38g', fat: '17g', protein: '6g', caffeine: '0mg' }),
      category: 'Bakery',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
      rating: 4.8,
    },
    // Breakfast
    {
      name: 'Skillet Baked Sunny Eggs',
      price: 2.3,
      description: 'Artisanal organic toast served with two free-range skillet eggs, grilled sausages, sautéed button mushrooms, and seasoned cherry tomatoes.',
      calories: 390,
      ingredients: 'Free-range eggs, Wheat toast, Sausages, Mushrooms, Cherry tomatoes',
      nutritionInfo: JSON.stringify({ carbs: '22g', fat: '19g', protein: '18g', caffeine: '0mg' }),
      category: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop',
      rating: 4.8,
    },
    // Lunch
    {
      name: 'Smoked Salmon Bagel',
      price: 2.2,
      description: 'Toasted sesame bagel layered with thick dill cream cheese, wild cold-smoked salmon slices, capers, pickled red onion, and fresh arugula leaves.',
      calories: 420,
      ingredients: 'Sesame bagel, Cream cheese, Smoked salmon, Capers, Arugula, Red onion',
      nutritionInfo: JSON.stringify({ carbs: '45g', fat: '14g', protein: '22g', caffeine: '0mg' }),
      category: 'Lunch',
      image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop',
      rating: 4.8,
    },
    {
      name: 'Artisanal Salmon Poke Bowl',
      price: 2.4,
      description: 'Fresh sashimi-grade Atlantic salmon, avocado, edamame, pickled cucumber, and warm brown jasmine rice topped with light sriracha-aioli.',
      calories: 490,
      ingredients: 'Atlantic salmon, Brown rice, Edamame, Pickled cucumber, Sriracha-aioli',
      nutritionInfo: JSON.stringify({ carbs: '45g', fat: '15g', protein: '28g', caffeine: '0mg' }),
      category: 'Lunch',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop',
      rating: 4.8,
    },
    {
      name: 'Grilled Chicken Caesar Bowl',
      price: 2.2,
      description: 'Crisp organic romaine lettuce, herb-grilled chicken breast slices, garlic sourdough croutons, parmesan flakes, tossed in house Caesar dressing.',
      calories: 360,
      ingredients: 'Romaine lettuce, Grilled chicken breast, Sourdough croutons, Parmesan, Caesar dressing',
      nutritionInfo: JSON.stringify({ carbs: '14g', fat: '16g', protein: '24g', caffeine: '0mg' }),
      category: 'Lunch',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop',
      rating: 4.7,
    },
    // Dinner
    {
      name: 'Truffle Mushroom Linguine',
      price: 2.0,
      description: 'Linguine pasta tossed in a creamy parmesan sauce infused with wild porcini mushrooms, fresh thyme, and topped with shaved winter black truffles.',
      calories: 580,
      ingredients: 'Linguine, Porcini mushrooms, Thyme, Parmesan cream, Shaved truffles',
      nutritionInfo: JSON.stringify({ carbs: '68g', fat: '24g', protein: '16g', caffeine: '0mg' }),
      category: 'Dinner',
      image: 'https://images.unsplash.com/photo-1612450865753-5ab70c487739?q=80&w=600&auto=format&fit=crop',
      rating: 4.9,
    },
    {
      name: 'Truffle Wild Mushroom Risotto',
      price: 2.4,
      description: 'Slow-cooked Arborio rice in a rich vegetable broth with sautéed chanterelle mushrooms, Parmigiano-Reggiano, and topped with shaved black truffle.',
      calories: 520,
      ingredients: 'Arborio rice, Chanterelle mushrooms, Parmigiano-Reggiano, Black truffle shavings',
      nutritionInfo: JSON.stringify({ carbs: '62g', fat: '18g', protein: '14g', caffeine: '0mg' }),
      category: 'Dinner',
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=600&auto=format&fit=crop',
      rating: 4.9,
    },
    {
      name: 'Artisanal Woodfired Pizza',
      price: 2.35,
      description: 'Light bubbly sourdough crust topped with rich organic tomato concasse, fresh buffalo mozzarella slices, wild basil leaves, and a drizzle of olive oil.',
      calories: 620,
      ingredients: 'Sourdough crust, Tomato concasse, Buffalo mozzarella, Fresh basil leaves, Olive oil',
      nutritionInfo: JSON.stringify({ carbs: '78g', fat: '18g', protein: '22g', caffeine: '0mg' }),
      category: 'Dinner',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop',
      rating: 4.9,
    },
  ];

  const dbProducts = [];
  for (const item of productsData) {
    const p = await prisma.product.create({ data: item });
    dbProducts.push(p);
  }

  console.log(`Created ${dbProducts.length} menu items.`);

  // 4. Create Coupons
  const coupons = [
    { code: 'BREW20', discountType: 'PERCENTAGE', value: 20, minPurchase: 15, expiryDate: new Date('2027-12-31') },
    { code: 'WELCOME10', discountType: 'FIXED', value: 10, minPurchase: 25, expiryDate: new Date('2027-12-31') },
    { code: 'GOLDENHOUR', discountType: 'PERCENTAGE', value: 15, minPurchase: 10, expiryDate: new Date('2027-12-31') },
  ];

  for (const c of coupons) {
    await prisma.coupon.create({ data: c });
  }
  console.log('Seed promo coupons created.');

  // 5. Create Reviews
  if (dbProducts.length > 0) {
    await prisma.review.create({
      data: {
        productId: dbProducts[0].id,
        userId: customer.id,
        userName: customer.name,
        rating: 5,
        comment: 'Absolutely amazing! The gold flakes feel so premium and the espresso is extremely smooth with zero bitterness. Will definitely order again.',
      },
    });
    await prisma.review.create({
      data: {
        productId: dbProducts[1].id,
        userId: customer.id,
        userName: customer.name,
        rating: 5,
        comment: 'Beautiful latte art, perfect microfoam temperature. Reminds me of the local coffee houses in Melbourne!',
      },
    });
  }
  console.log('Customer reviews seeded.');

  // 6. Create Reservations
  await prisma.reservation.create({
    data: {
      userId: customer.id,
      guestName: 'Shardul',
      guestEmail: 'customer@urbanbrew.com',
      guestPhone: '+1234567890',
      date: '2026-07-05',
      timeSlot: '11:30 AM - 01:00 PM',
      tableNumber: 'Table 4 (Window Seat)',
      guestsCount: 2,
      status: ReservationStatus.CONFIRMED,
    },
  });
  console.log('Reservation seeded.');

  // 7. Create Orders
  await prisma.order.create({
    data: {
      userId: customer.id,
      totalAmount: 16.5,
      tax: 1.5,
      deliveryCharge: 2.0,
      discount: 3.3,
      couponCode: 'BREW20',
      status: OrderStatus.PREPARING,
      paymentMethod: 'STRIPE',
      paymentStatus: PaymentStatus.COMPLETED,
      deliveryMethod: 'DELIVERY',
      address: 'Apartment 4B, Baker Street, London',
      items: JSON.stringify([
        {
          id: dbProducts[0].id,
          name: dbProducts[0].name,
          price: dbProducts[0].price,
          quantity: 2,
          customization: { size: 'Regular', milk: 'Whole Milk', sweetness: 'Standard' },
        },
      ]),
    },
  });
  console.log('Orders seeded.');

  // 8. Create Blogs
  const blogs = [
    {
      title: 'The Art of Sourcing Single-Origin Arabica Beans',
      slug: 'art-of-sourcing-arabica-beans',
      excerpt: 'Discover how Urban Brew Café travels to the misty mountains of Ethiopia and Colombia to source the finest coffee beans.',
      content: 'At Urban Brew Café, coffee is more than just a morning routine; it is a fine art. The journey of your morning espresso starts thousands of miles away on small, family-owned coffee estates in high-altitude regions. These estates offer optimal soil composition, shaded canopy covers, and pure natural spring waters which give the beans their distinct flavor notes.\n\nOur baristas and tasters visit these locations twice a year to verify that farming practices are organic and fair-trade. By dealing directly with the farmers, we ensure they receive a premium price, allowing them to reinvest in sustainable farming technologies.',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop',
      readTime: '4 min read',
      author: 'Jane Doe, Head Roaster',
    },
    {
      title: 'Mastering the Golden Pour: A Guide to Perfect Latte Art',
      slug: 'mastering-latte-art-guide',
      excerpt: 'Learn the micro-foam science and pitcher pouring angles used by our baristas to draw perfect rosettes and hearts.',
      content: 'Pouring latte art requires practice, hand-eye coordination, and an understanding of milk protein chemistry. To achieve that glossy, wet-paint-like milk consistency, you must steam your milk to exactly 140°F (60°C). Steaming higher breaks down the sweetness and destroys the micro-foam structure.\n\nStart your pour high to let the milk slide underneath the dark crema of the espresso. Then, bring the spout of your pitcher down close to the cup and tilt it to increase flow velocity. Flick your wrist gently back and forth to create waves, forming the leaves of a beautiful rosette.',
      image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop',
      readTime: '6 min read',
      author: 'Brew Master',
    },
  ];

  for (const b of blogs) {
    await prisma.blog.create({ data: b });
  }
  console.log('Blog posts seeded.');

  console.log('DB Seed successfully finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
