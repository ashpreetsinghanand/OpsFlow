import { z } from 'zod';

const getKey = () => localStorage.getItem('RESEND_KEY');

export const resendTools = {
    list_emails: {
        name: 'list_resend_emails',
        description: 'List recent emails sent via Resend',
        inputSchema: z.object({}),
        outputSchema: z.array(z.object({
            id: z.string(),
            to: z.string(),
            subject: z.string(),
            created_at: z.string(),
        })),
        execute: async () => {
            const key = getKey();
            if (!key) return { error: 'Resend key not configured. Please add it in Settings.' };

            try {
                const res = await fetch('https://api.resend.com/emails', {
                    headers: {
                        'Authorization': `Bearer ${key}`,
                    },
                });

                if (!res.ok) return { error: 'Failed to fetch emails' };

                const data = await res.json();
                return (data.data || []).slice(0, 10).map((email: any) => ({
                    id: email.id,
                    to: Array.isArray(email.to) ? email.to.join(', ') : email.to,
                    subject: email.subject,
                    created_at: new Date(email.created_at).toLocaleString(),
                }));
            } catch (e) {
                return { error: 'Network error' };
            }
        },
    },

    send_email: {
        name: 'send_resend_email',
        description: 'Send an email via Resend',
        inputSchema: z.object({
            to: z.string().email().describe('Recipient email'),
            subject: z.string().describe('Email subject'),
            html: z.string().describe('HTML body content'),
            from: z.string().optional().default('OpsFlow <noreply@resend.dev>'),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
            email_id: z.string().optional(),
        }),
        execute: async ({ to, subject, html, from = 'OpsFlow <noreply@resend.dev>' }: {
            to: string;
            subject: string;
            html: string;
            from?: string;
        }) => {
            const key = getKey();
            if (!key) return { success: false, message: 'Resend key not configured' };

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
                return {
                    success: true,
                    message: 'Email sent successfully',
                    email_id: data.id,
                };
            } catch (e) {
                return { success: false, message: 'Network error' };
            }
        },
    },
};
