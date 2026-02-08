import { z } from 'zod';
import { mockResendData } from '../mock-data';

const getKey = () => localStorage.getItem('RESEND_KEY');
const useMockData = () => !getKey() || getKey() === '';

export const resendTools = {
    list_emails: {
        name: 'list_resend_emails',
        description: 'List recently sent emails from Resend',
        inputSchema: z.object({
            limit: z.number().optional().default(10),
        }),
        outputSchema: z.array(z.object({
            id: z.string(),
            to: z.string(),
            subject: z.string(),
            created_at: z.string(),
        })),
        execute: async ({ limit = 10 }: { limit?: number }) => {
            if (useMockData()) {
                console.log('📦 Using mock Resend data');
                return mockResendData.emails.slice(0, limit);
            }

            const key = getKey();
            try {
                const res = await fetch('https://api.resend.com/emails', {
                    headers: { 'Authorization': `Bearer ${key}` },
                });

                if (!res.ok) return mockResendData.emails;

                const data = await res.json();
                return data.data.slice(0, limit).map((email: any) => ({
                    id: email.id,
                    to: Array.isArray(email.to) ? email.to[0] : email.to,
                    subject: email.subject,
                    created_at: new Date(email.created_at).toLocaleString(),
                }));
            } catch (e) {
                return mockResendData.emails;
            }
        },
    },

    send_email: {
        name: 'send_resend_email',
        description: 'Send an email via Resend',
        inputSchema: z.object({
            to: z.string().email().describe('Recipient email'),
            subject: z.string().describe('Email subject'),
            html: z.string().describe('Email HTML content'),
            from: z.string().optional().default('onboarding@resend.dev'),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            id: z.string().optional(),
            message: z.string(),
        }),
        execute: async ({ to, subject, html, from = 'onboarding@resend.dev' }: { to: string; subject: string; html: string; from?: string }) => {
            if (useMockData()) {
                console.log('📦 Mock: Email sent');
                return { success: true, id: 'em_demo_123', message: `[Demo] Email sent to ${to}` };
            }

            const key = getKey();
            try {
                const res = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${key}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ from, to, subject, html }),
                });

                if (!res.ok) return { success: false, message: 'Failed to send email' };

                const data = await res.json();
                return { success: true, id: data.id, message: 'Email sent successfully' };
            } catch (e) {
                return { success: false, message: 'Network error' };
            }
        },
    },
};
