import { z } from 'zod';

const getKey = () => localStorage.getItem('STRIPE_KEY');

export const stripeTools = {
    get_customer: {
        name: 'get_stripe_customer',
        description: 'Find a Stripe customer by email',
        inputSchema: z.object({
            email: z.string().email().describe('Customer email address'),
        }),
        outputSchema: z.object({
            id: z.string(),
            email: z.string(),
            name: z.string().nullable(),
            created: z.string(),
            balance: z.number(),
        }),
        execute: async ({ email }: { email: string }) => {
            const key = getKey();
            if (!key) return { error: 'Stripe key not configured. Please add it in Settings.' };

            try {
                const res = await fetch(`https://api.stripe.com/v1/customers/search?query=email:"${email}"`, {
                    headers: {
                        'Authorization': `Bearer ${key}`,
                    },
                });

                if (!res.ok) return { error: 'Failed to search customers' };

                const data = await res.json();
                if (data.data.length === 0) return { error: 'No customer found with that email' };

                const customer = data.data[0];
                return {
                    id: customer.id,
                    email: customer.email,
                    name: customer.name,
                    created: new Date(customer.created * 1000).toLocaleDateString(),
                    balance: customer.balance / 100,
                };
            } catch (e) {
                return { error: 'Network error' };
            }
        },
    },

    list_payments: {
        name: 'list_stripe_payments',
        description: 'List recent payments for a customer',
        inputSchema: z.object({
            customer_id: z.string().describe('Stripe customer ID'),
        }),
        outputSchema: z.array(z.object({
            id: z.string(),
            amount: z.number(),
            currency: z.string(),
            status: z.string(),
            created: z.string(),
        })),
        execute: async ({ customer_id }: { customer_id: string }) => {
            const key = getKey();
            if (!key) return { error: 'Stripe key not configured' };

            try {
                const res = await fetch(`https://api.stripe.com/v1/payment_intents?customer=${customer_id}&limit=10`, {
                    headers: {
                        'Authorization': `Bearer ${key}`,
                    },
                });

                if (!res.ok) return { error: 'Failed to fetch payments' };

                const data = await res.json();
                return data.data.map((pi: any) => ({
                    id: pi.id,
                    amount: pi.amount / 100,
                    currency: pi.currency.toUpperCase(),
                    status: pi.status,
                    created: new Date(pi.created * 1000).toLocaleDateString(),
                }));
            } catch (e) {
                return { error: 'Network error' };
            }
        },
    },

    refund_payment: {
        name: 'refund_stripe_payment',
        description: 'Refund a Stripe payment',
        inputSchema: z.object({
            payment_intent_id: z.string().describe('Payment Intent ID to refund'),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
        execute: async ({ payment_intent_id }: { payment_intent_id: string }) => {
            const key = getKey();
            if (!key) return { success: false, message: 'Stripe key not configured' };

            try {
                const res = await fetch('https://api.stripe.com/v1/refunds', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${key}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `payment_intent=${payment_intent_id}`,
                });

                if (!res.ok) return { success: false, message: 'Failed to process refund' };
                return { success: true, message: 'Refund processed successfully' };
            } catch (e) {
                return { success: false, message: 'Network error' };
            }
        },
    },
};
