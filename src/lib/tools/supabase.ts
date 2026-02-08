import { z } from 'zod';

const getKey = () => localStorage.getItem('SUPABASE_KEY');
const getUrl = () => localStorage.getItem('SUPABASE_URL') || 'https://your-project.supabase.co';

export const supabaseTools = {
    get_user: {
        name: 'get_supabase_user',
        description: 'Get user info from Supabase by email',
        inputSchema: z.object({
            email: z.string().email().describe('User email to look up'),
            table: z.string().optional().default('users').describe('Table name'),
        }),
        outputSchema: z.object({
            id: z.string(),
            email: z.string(),
            plan: z.string().nullable(),
            created_at: z.string(),
        }),
        execute: async ({ email, table = 'users' }: { email: string; table?: string }) => {
            const key = getKey();
            const url = getUrl();
            if (!key) return { error: 'Supabase key not configured. Please add it in Settings.' };

            try {
                const res = await fetch(`${url}/rest/v1/${table}?email=eq.${encodeURIComponent(email)}&select=*`, {
                    headers: {
                        'apikey': key,
                        'Authorization': `Bearer ${key}`,
                    },
                });

                if (!res.ok) return { error: 'Failed to fetch user' };

                const data = await res.json();
                if (data.length === 0) return { error: 'User not found' };

                const user = data[0];
                return {
                    id: user.id,
                    email: user.email,
                    plan: user.plan || user.plan_tier || null,
                    created_at: user.created_at || 'Unknown',
                };
            } catch (e) {
                return { error: 'Network error' };
            }
        },
    },

    update_user: {
        name: 'update_supabase_user',
        description: 'Update a user field in Supabase',
        inputSchema: z.object({
            user_id: z.string().describe('User ID'),
            field: z.string().describe('Field to update'),
            value: z.string().describe('New value'),
            table: z.string().optional().default('users'),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
        execute: async ({ user_id, field, value, table = 'users' }: {
            user_id: string;
            field: string;
            value: string;
            table?: string
        }) => {
            const key = getKey();
            const url = getUrl();
            if (!key) return { success: false, message: 'Supabase key not configured' };

            try {
                const res = await fetch(`${url}/rest/v1/${table}?id=eq.${user_id}`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': key,
                        'Authorization': `Bearer ${key}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal',
                    },
                    body: JSON.stringify({ [field]: value }),
                });

                if (!res.ok) return { success: false, message: 'Failed to update user' };
                return { success: true, message: `Updated ${field} to ${value}` };
            } catch (e) {
                return { success: false, message: 'Network error' };
            }
        },
    },
};
