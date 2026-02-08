import { z } from 'zod';
import { mockSupabaseData } from '../mock-data';

const getKey = () => localStorage.getItem('SUPABASE_KEY');
const getUrl = () => localStorage.getItem('SUPABASE_URL') || 'https://your-project.supabase.co';
const useMockData = () => !getKey() || getKey() === '';

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
            if (useMockData()) {
                console.log('📦 Using mock Supabase user data');
                return mockSupabaseData.user;
            }

            const key = getKey();
            const url = getUrl();
            try {
                const res = await fetch(`${url}/rest/v1/${table}?email=eq.${encodeURIComponent(email)}&select=*`, {
                    headers: {
                        'apikey': key!,
                        'Authorization': `Bearer ${key}`,
                    },
                });

                if (!res.ok) return mockSupabaseData.user;

                const data = await res.json();
                if (data.length === 0) return mockSupabaseData.user;

                return {
                    id: data[0].id,
                    email: data[0].email,
                    plan: data[0].plan || data[0].subscription_tier,
                    created_at: new Date(data[0].created_at).toLocaleDateString(),
                };
            } catch (e) {
                return mockSupabaseData.user;
            }
        },
    },

    update_user: {
        name: 'update_supabase_user',
        description: 'Update a user record in Supabase',
        inputSchema: z.object({
            user_id: z.string().describe('User ID to update'),
            updates: z.record(z.string(), z.any()).describe('Fields to update'),
            table: z.string().optional().default('users'),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
        execute: async ({ user_id, updates, table = 'users' }: { user_id: string; updates: Record<string, any>; table?: string }) => {
            if (useMockData()) {
                console.log('📦 Mock: User updated');
                return { success: true, message: `[Demo] User ${user_id} updated successfully` };
            }

            const key = getKey();
            const url = getUrl();
            try {
                const res = await fetch(`${url}/rest/v1/${table}?id=eq.${user_id}`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': key!,
                        'Authorization': `Bearer ${key}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal',
                    },
                    body: JSON.stringify(updates),
                });

                if (!res.ok) return { success: false, message: 'Update failed' };
                return { success: true, message: 'User updated successfully' };
            } catch (e) {
                return { success: false, message: 'Network error' };
            }
        },
    },
};
