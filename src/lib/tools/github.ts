import { z } from 'zod';

const getToken = () => localStorage.getItem('GITHUB_TOKEN');

export const githubTools = {
    list_issues: {
        name: 'list_github_issues',
        description: 'List issues from a GitHub repository',
        inputSchema: z.object({
            owner: z.string().describe('Repository owner (username or org)'),
            repo: z.string().describe('Repository name'),
            state: z.enum(['open', 'closed', 'all']).optional().default('open'),
        }),
        outputSchema: z.array(z.object({
            id: z.number(),
            number: z.number(),
            title: z.string(),
            user: z.string(),
            state: z.string(),
            created_at: z.string(),
        })),
        execute: async ({ owner, repo, state = 'open' }: { owner: string; repo: string; state?: string }) => {
            const token = getToken();
            if (!token) return { error: 'GitHub token not configured. Please add it in Settings.' };

            try {
                const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=${state}&per_page=10`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/vnd.github.v3+json',
                    },
                });

                if (!res.ok) {
                    const err = await res.json();
                    return { error: err.message || 'Failed to fetch issues' };
                }

                const data = await res.json();
                return data.map((issue: any) => ({
                    id: issue.id,
                    number: issue.number,
                    title: issue.title,
                    user: issue.user.login,
                    state: issue.state,
                    created_at: new Date(issue.created_at).toLocaleDateString(),
                }));
            } catch (e) {
                return { error: 'Network error fetching issues' };
            }
        },
    },

    get_repo_info: {
        name: 'get_github_repo',
        description: 'Get information about a GitHub repository',
        inputSchema: z.object({
            owner: z.string().describe('Repository owner'),
            repo: z.string().describe('Repository name'),
        }),
        outputSchema: z.object({
            name: z.string(),
            description: z.string().nullable(),
            stars: z.number(),
            forks: z.number(),
            open_issues: z.number(),
            language: z.string().nullable(),
        }),
        execute: async ({ owner, repo }: { owner: string; repo: string }) => {
            const token = getToken();
            if (!token) return { error: 'GitHub token not configured' };

            try {
                const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/vnd.github.v3+json',
                    },
                });

                if (!res.ok) return { error: 'Repository not found' };

                const data = await res.json();
                return {
                    name: data.full_name,
                    description: data.description,
                    stars: data.stargazers_count,
                    forks: data.forks_count,
                    open_issues: data.open_issues_count,
                    language: data.language,
                };
            } catch (e) {
                return { error: 'Network error' };
            }
        },
    },

    close_issue: {
        name: 'close_github_issue',
        description: 'Close a GitHub issue',
        inputSchema: z.object({
            owner: z.string(),
            repo: z.string(),
            issue_number: z.number(),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
        execute: async ({ owner, repo, issue_number }: { owner: string; repo: string; issue_number: number }) => {
            const token = getToken();
            if (!token) return { success: false, message: 'GitHub token not configured' };

            try {
                const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ state: 'closed' }),
                });

                if (!res.ok) return { success: false, message: 'Failed to close issue' };
                return { success: true, message: `Issue #${issue_number} closed successfully` };
            } catch (e) {
                return { success: false, message: 'Network error' };
            }
        },
    },
};
