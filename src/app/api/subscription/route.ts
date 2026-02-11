import { NextRequest, NextResponse } from 'next/server';
import MercadoPagoConfig, { PreApproval } from 'mercadopago';

// Initialize MercadoPago
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
        const { email } = body; // You might want to pass user email

        const preapproval = new PreApproval(client);

        const result = await preapproval.create({
            body: {
                reason: 'Socio Activo - Club Argentino Oeste',
                external_reference: 'SOCIO_SUBSCRIPTION',
                payer_email: email || 'test_user@test.com', // In production, get real email
                auto_recurring: {
                    frequency: 1,
                    frequency_type: 'months',
                    transaction_amount: 10000,
                    currency_id: 'ARS',
                },
                back_url: `${process.env.NEXT_PUBLIC_BASE_URL}/asociate/success`,
                status: 'pending',
            },
        });

        return NextResponse.json({ init_point: result.init_point });
    } catch (error) {
        console.error('Error creating subscription:', error);
        return NextResponse.json({ error: 'Error creating subscription', details: error }, { status: 500 });
    }
}
