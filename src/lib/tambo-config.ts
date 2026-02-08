import { z } from 'zod';
import type { TamboComponent, TamboTool } from '@tambo-ai/react';

import { UniversalCard } from '../components/UniversalCard';
import { ActionGrid } from '../components/ActionGrid';
import { UnifiedTimeline } from '../components/UnifiedTimeline';
import { LiveMetricChart } from '../components/LiveMetricChart';

import { githubTools } from './tools/github';
import { stripeTools } from './tools/stripe';
import { supabaseTools } from './tools/supabase';
import { linearTools } from './tools/linear';
import { resendTools } from './tools/resend';

// Component Registrations
export const tamboComponents: TamboComponent[] = [
    {
        name: 'UniversalCard',
        description: 'Display data from any source (GitHub, Stripe, Supabase, Linear, Resend) in a styled card with status indicators',
        component: UniversalCard,
        propsSchema: z.object({
            source: z.enum(['github', 'stripe', 'supabase', 'resend', 'linear']).describe('Data source'),
            title: z.string().describe('Card title'),
            subtitle: z.string().optional().describe('Card subtitle'),
            status: z.enum(['success', 'error', 'warning', 'pending']).optional().describe('Status indicator'),
            dataPoints: z.array(z.object({
                label: z.string(),
                value: z.string(),
            })).describe('Key-value data points to display'),
        }),
    },
    {
        name: 'ActionGrid',
        description: 'Display a grid of action buttons with different intents (primary, danger, success) for user to take actions',
        component: ActionGrid,
        propsSchema: z.object({
            actions: z.array(z.object({
                id: z.string(),
                label: z.string(),
                intent: z.enum(['primary', 'success', 'warning', 'danger', 'default']),
                icon: z.string().optional().describe('Icon name: zap, refresh, rollback, send, delete, add, check, warning'),
                isLoading: z.boolean().optional(),
            })),
        }),
    },
    {
        name: 'UnifiedTimeline',
        description: 'Display a timeline of events from multiple sources interleaved chronologically',
        component: UnifiedTimeline,
        propsSchema: z.object({
            title: z.string().optional(),
            events: z.array(z.object({
                id: z.string(),
                source: z.enum(['github', 'stripe', 'supabase', 'resend', 'linear']),
                timestamp: z.string(),
                description: z.string(),
                type: z.enum(['info', 'success', 'error', 'warning']),
            })),
        }),
    },
    {
        name: 'LiveMetricChart',
        description: 'Display a chart visualization of numeric data',
        component: LiveMetricChart,
        propsSchema: z.object({
            title: z.string(),
            data: z.array(z.object({
                name: z.string(),
                value: z.number(),
            })),
            chartType: z.enum(['line', 'bar', 'area']).optional(),
            color: z.string().optional().describe('Hex color for the chart'),
            unit: z.string().optional().describe('Unit suffix for values'),
        }),
    },
];

// Tool Registrations
export const tamboToolsList: TamboTool[] = [
    // GitHub Tools
    {
        name: githubTools.list_issues.name,
        description: githubTools.list_issues.description,
        tool: githubTools.list_issues.execute,
        inputSchema: githubTools.list_issues.inputSchema,
        outputSchema: githubTools.list_issues.outputSchema,
    },
    {
        name: githubTools.get_repo_info.name,
        description: githubTools.get_repo_info.description,
        tool: githubTools.get_repo_info.execute,
        inputSchema: githubTools.get_repo_info.inputSchema,
        outputSchema: githubTools.get_repo_info.outputSchema,
    },
    {
        name: githubTools.close_issue.name,
        description: githubTools.close_issue.description,
        tool: githubTools.close_issue.execute,
        inputSchema: githubTools.close_issue.inputSchema,
        outputSchema: githubTools.close_issue.outputSchema,
    },
    // Stripe Tools
    {
        name: stripeTools.get_customer.name,
        description: stripeTools.get_customer.description,
        tool: stripeTools.get_customer.execute,
        inputSchema: stripeTools.get_customer.inputSchema,
        outputSchema: stripeTools.get_customer.outputSchema,
    },
    {
        name: stripeTools.list_payments.name,
        description: stripeTools.list_payments.description,
        tool: stripeTools.list_payments.execute,
        inputSchema: stripeTools.list_payments.inputSchema,
        outputSchema: stripeTools.list_payments.outputSchema,
    },
    {
        name: stripeTools.refund_payment.name,
        description: stripeTools.refund_payment.description,
        tool: stripeTools.refund_payment.execute,
        inputSchema: stripeTools.refund_payment.inputSchema,
        outputSchema: stripeTools.refund_payment.outputSchema,
    },
    // Supabase Tools
    {
        name: supabaseTools.get_user.name,
        description: supabaseTools.get_user.description,
        tool: supabaseTools.get_user.execute,
        inputSchema: supabaseTools.get_user.inputSchema,
        outputSchema: supabaseTools.get_user.outputSchema,
    },
    {
        name: supabaseTools.update_user.name,
        description: supabaseTools.update_user.description,
        tool: supabaseTools.update_user.execute,
        inputSchema: supabaseTools.update_user.inputSchema,
        outputSchema: supabaseTools.update_user.outputSchema,
    },
    // Linear Tools
    {
        name: linearTools.list_issues.name,
        description: linearTools.list_issues.description,
        tool: linearTools.list_issues.execute,
        inputSchema: linearTools.list_issues.inputSchema,
        outputSchema: linearTools.list_issues.outputSchema,
    },
    {
        name: linearTools.create_issue.name,
        description: linearTools.create_issue.description,
        tool: linearTools.create_issue.execute,
        inputSchema: linearTools.create_issue.inputSchema,
        outputSchema: linearTools.create_issue.outputSchema,
    },
    // Resend Tools
    {
        name: resendTools.list_emails.name,
        description: resendTools.list_emails.description,
        tool: resendTools.list_emails.execute,
        inputSchema: resendTools.list_emails.inputSchema,
        outputSchema: resendTools.list_emails.outputSchema,
    },
    {
        name: resendTools.send_email.name,
        description: resendTools.send_email.description,
        tool: resendTools.send_email.execute,
        inputSchema: resendTools.send_email.inputSchema,
        outputSchema: resendTools.send_email.outputSchema,
    },
];
