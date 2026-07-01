import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, currency = 'INR', receipt } = await request.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.includes('mock') || keyId.includes('test_mock')) {
      // Return a mock order for demo/testing
      return NextResponse.json({
        id: `order_mock_${Math.random().toString(36).slice(2, 11)}`,
        amount: Math.round(amount * 100),
        currency,
        receipt,
        isMock: true
      });
    }

    // Real Razorpay API call
    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // in paise
        currency,
        receipt,
        payment_capture: 1
      })
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.error?.description || 'Razorpay order creation failed' }, { status: 400 });
    }

    const order = await res.json();
    return NextResponse.json(order);

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
