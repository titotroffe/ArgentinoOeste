import { NextRequest, NextResponse } from 'next/server';
import MercadoPagoConfig, { Preference } from 'mercadopago';

// Initialize MercadoPago with Access Token from env
const accessToken = process.env.MP_ACCESS_TOKEN;
if (!accessToken) {
    console.error('MP_ACCESS_TOKEN is missing');
}
const client = new MercadoPagoConfig({ accessToken: accessToken || '' });

export async function POST(req: NextRequest) {
    if (!process.env.MP_ACCESS_TOKEN) {
        return NextResponse.json({ error: 'MP_ACCESS_TOKEN is missing' }, { status: 500 });
    }
    try {
        const body = await req.json();
        const { items } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in request' }, { status: 400 });
        }

        // Initialize Preference structure
        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: items.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    unit_price: Number(item.price),
                    quantity: Number(item.quantity),
                    currency_id: 'ARS',
                })),
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_BASE_URL}/tienda/success`,
                    failure: `${process.env.NEXT_PUBLIC_BASE_URL}/tienda/failure`,
                    pending: `${process.env.NEXT_PUBLIC_BASE_URL}/tienda/pending`,
                },
                auto_return: 'approved',
            },
        });

        return NextResponse.json({ id: result.id });
    } catch (error) {
        console.error('Error creating preference:', error);
        return NextResponse.json({ error: 'Error creating preference' }, { status: 500 });
    }
}
