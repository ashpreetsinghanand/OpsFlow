// Mock data for demos - no API keys required!
// These tools return realistic demo data

export const mockGitHubData = {
    issues: [
        { id: 1, number: 142, title: 'Login button not responding on mobile', user: 'alex-dev', state: 'open', created_at: 'Jan 15, 2026' },
        { id: 2, number: 141, title: 'Dark mode toggle persists incorrectly', user: 'sarah-ui', state: 'open', created_at: 'Jan 14, 2026' },
        { id: 3, number: 140, title: 'API rate limiting not working', user: 'mike-backend', state: 'open', created_at: 'Jan 13, 2026' },
        { id: 4, number: 139, title: 'Memory leak in dashboard component', user: 'alex-dev', state: 'closed', created_at: 'Jan 12, 2026' },
        { id: 5, number: 138, title: 'Stripe webhook failing silently', user: 'payment-bot', state: 'open', created_at: 'Jan 11, 2026' },
    ],
    repo: {
        name: 'acme/web-platform',
        description: 'Main web application for Acme Corp',
        stars: 1247,
        forks: 89,
        open_issues: 23,
        language: 'TypeScript',
    },
};

export const mockStripeData = {
    customer: {
        id: 'cus_Qx7mN9kL2pR4',
        email: 'alex@startup.io',
        name: 'Alex Thompson',
        created: 'Mar 15, 2025',
        balance: -50.00,
    },
    payments: [
        { id: 'pi_3Nx9mK2eZv', amount: 299.00, currency: 'USD', status: 'succeeded', created: 'Jan 15, 2026' },
        { id: 'pi_3Nx8jL1fYw', amount: 299.00, currency: 'USD', status: 'succeeded', created: 'Dec 15, 2025' },
        { id: 'pi_3Nx7kM0gXx', amount: 99.00, currency: 'USD', status: 'refunded', created: 'Nov 15, 2025' },
        { id: 'pi_3Nx6lN9hYy', amount: 299.00, currency: 'USD', status: 'succeeded', created: 'Oct 15, 2025' },
    ],
};

export const mockSupabaseData = {
    user: {
        id: 'usr_8f7e6d5c4b3a',
        email: 'alex@startup.io',
        plan: 'Pro',
        created_at: 'Mar 15, 2025',
    },
};

export const mockLinearData = {
    issues: [
        { id: 'lin_1', identifier: 'ENG-423', title: 'Implement SSO authentication', state: 'In Progress', priority: 1 },
        { id: 'lin_2', identifier: 'ENG-422', title: 'Fix dashboard loading performance', state: 'Todo', priority: 2 },
        { id: 'lin_3', identifier: 'ENG-421', title: 'Add export to CSV feature', state: 'Done', priority: 3 },
        { id: 'lin_4', identifier: 'ENG-420', title: 'Update API documentation', state: 'In Review', priority: 2 },
    ],
};

export const mockResendData = {
    emails: [
        { id: 'em_1', to: 'alex@startup.io', subject: 'Welcome to OpsFlow!', created_at: 'Jan 15, 2026 10:30 AM' },
        { id: 'em_2', to: 'alex@startup.io', subject: 'Your invoice is ready', created_at: 'Jan 14, 2026 2:15 PM' },
        { id: 'em_3', to: 'team@startup.io', subject: 'Weekly metrics report', created_at: 'Jan 13, 2026 9:00 AM' },
    ],
};

export const mockTimelineEvents = [
    { id: '1', source: 'github' as const, timestamp: '10:42 AM', description: 'Issue #142 opened: Login button not responding', type: 'info' as const },
    { id: '2', source: 'stripe' as const, timestamp: '10:38 AM', description: 'Payment of $299.00 succeeded', type: 'success' as const },
    { id: '3', source: 'supabase' as const, timestamp: '10:35 AM', description: 'User alex@startup.io upgraded to Pro', type: 'success' as const },
    { id: '4', source: 'linear' as const, timestamp: '10:30 AM', description: 'ENG-423 moved to In Progress', type: 'info' as const },
    { id: '5', source: 'resend' as const, timestamp: '10:25 AM', description: 'Welcome email sent to alex@startup.io', type: 'success' as const },
    { id: '6', source: 'github' as const, timestamp: '10:20 AM', description: 'PR #89 merged to main', type: 'success' as const },
    { id: '7', source: 'stripe' as const, timestamp: '10:15 AM', description: 'Refund processed for $99.00', type: 'warning' as const },
];

export const mockChartData = {
    revenue: [
        { name: 'Mon', value: 4200 },
        { name: 'Tue', value: 3800 },
        { name: 'Wed', value: 5100 },
        { name: 'Thu', value: 4600 },
        { name: 'Fri', value: 5800 },
        { name: 'Sat', value: 3200 },
        { name: 'Sun', value: 2900 },
    ],
    activeUsers: [
        { name: 'Mon', value: 1240 },
        { name: 'Tue', value: 1380 },
        { name: 'Wed', value: 1520 },
        { name: 'Thu', value: 1450 },
        { name: 'Fri', value: 1680 },
        { name: 'Sat', value: 890 },
        { name: 'Sun', value: 760 },
    ],
};
