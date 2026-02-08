import { z } from 'zod';
import { mockStripeData } from '../mock-data';

const getKey = () => localStorage.getItem('STRIPE_KEY');
const useMockData = () => !getKey() || getKey() === '';

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
            if (useMockData()) {
                console.log('📦 Using mock Stripe customer data');
                return mockStripeData.customer;
            }

            const key = getKey();
            try {
                const res = await fetch(`https://api.stripe.com/v1/customers/search?query=email:"${email}"`, {
                    headers: { 'Authorization': `Bearer ${key}` },
                });

                if (!res.ok) return mockStripeData.customer;

                const data = await res.json();
                if (data.data.length === 0) return mockStripeData.customer;

                const customer = data.data[0];
                return {
                    id: customer.id,
                    email: customer.email,
                    name: customer.name,
                    created: new Date(customer.created * 1000).toLocaleDateString(),
                    balance: customer.balance / 100,
                };
            } catch (e) {
                return mockStripeData.customer;
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
            if (useMockData()) {
                console.log('📦 Using mock Stripe payments data');
                return mockStripeData.payments;
            }

            const key = getKey();
            try {
                const res = await fetch(`https://api.stripe.com/v1/payment_intents?customer=${customer_id}&limit=10`, {
                    headers: { 'Authorization': `Bearer ${key}` },
                });

                if (!res.ok) return mockStripeData.payments;

                const data = await res.json();
                return data.data.map((pi: any) => ({
                    id: pi.id,
                    amount: pi.amount / 100,
                    currency: pi.currency.toUpperCase(),
                    status: pi.status,
                    created: new Date(pi.created * 1000).toLocaleDateString(),
                }));
            } catch (e) {
                return mockStripeData.payments;
            }
        },
    },

    refund_payment: {
        name: 'refund_stripe_payment',
        description: 'Refund a Stripe payment',
        inputSchema: z.object({
            payment_id: z.string().describe('Payment intent ID to refund'),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
        execute: async ({ payment_id }: { payment_id: string }) => {
            if (useMockData()) {
                console.log('📦 Mock: Payment refunded');
                return { success: true, message: `[Demo] Refund processed for ${payment_id}` };
            }

            const key = getKey();
            try {
                const res = await fetch('https://api.stripe.com/v1/refunds', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${key}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `payment_intent=${payment_id}`,
                });

                if (!res.ok) return { success: false, message: 'Refund failed' };
                return { success: true, message: 'Refund processed successfully' };
            } catch (e) {
                return { success: false, message: 'Network error' };
            }
        },
    },
};
