import { z } from 'zod';

const getKey = () => localStorage.getItem('LINEAR_KEY');

export const linearTools = {
    list_issues: {
        name: 'list_linear_issues',
        description: 'List recent issues from Linear',
        inputSchema: z.object({
            limit: z.number().optional().default(10),
        }),
        outputSchema: z.array(z.object({
            id: z.string(),
            identifier: z.string(),
            title: z.string(),
            state: z.string(),
            priority: z.number(),
        })),
        execute: async ({ limit = 10 }: { limit?: number }) => {
            const key = getKey();
            if (!key) return { error: 'Linear key not configured. Please add it in Settings.' };

            try {
                const res = await fetch('https://api.linear.app/graphql', {
                    method: 'POST',
                    headers: {
                        'Authorization': key,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
              query Issues($limit: Int!) {
                issues(first: $limit) {
                  nodes {
                    id
                    identifier
                    title
                    state { name }
                    priority
                  }
                }
              }
            `,
                        variables: { limit },
                    }),
                });

                if (!res.ok) return { error: 'Failed to fetch Linear issues' };

                const data = await res.json();
                if (data.errors) return { error: data.errors[0].message };

                return data.data.issues.nodes.map((issue: any) => ({
                    id: issue.id,
                    identifier: issue.identifier,
                    title: issue.title,
                    state: issue.state?.name || 'Unknown',
                    priority: issue.priority,
                }));
            } catch (e) {
                return { error: 'Network error' };
            }
        },
    },

    create_issue: {
        name: 'create_linear_issue',
        description: 'Create a new issue in Linear',
        inputSchema: z.object({
            title: z.string().describe('Issue title'),
            description: z.string().optional().describe('Issue description'),
            team_id: z.string().describe('Linear team ID'),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            identifier: z.string().optional(),
            message: z.string(),
        }),
        execute: async ({ title, description, team_id }: {
            title: string;
            description?: string;
            team_id: string
        }) => {
            const key = getKey();
            if (!key) return { success: false, message: 'Linear key not configured' };

            try {
                const res = await fetch('https://api.linear.app/graphql', {
                    method: 'POST',
                    headers: {
                        'Authorization': key,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
              mutation CreateIssue($title: String!, $description: String, $teamId: String!) {
                issueCreate(input: { title: $title, description: $description, teamId: $teamId }) {
                  success
                  issue { identifier }
                }
              }
            `,
                        variables: { title, description, teamId: team_id },
                    }),
                });

                if (!res.ok) return { success: false, message: 'Failed to create issue' };

                const data = await res.json();
                if (data.errors) return { success: false, message: data.errors[0].message };

                const result = data.data.issueCreate;
                return {
                    success: result.success,
                    identifier: result.issue?.identifier,
                    message: result.success ? `Created issue ${result.issue.identifier}` : 'Failed to create',
                };
            } catch (e) {
                return { success: false, message: 'Network error' };
            }
        },
    },
};
