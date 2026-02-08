import { z } from 'zod';
import { mockLinearData } from '../mock-data';

const getKey = () => localStorage.getItem('LINEAR_KEY');
const useMockData = () => !getKey() || getKey() === '';

export const linearTools = {
    list_issues: {
        name: 'list_linear_issues',
        description: 'List issues from Linear',
        inputSchema: z.object({
            limit: z.number().optional().default(10).describe('Number of issues to fetch'),
        }),
        outputSchema: z.array(z.object({
            id: z.string(),
            identifier: z.string(),
            title: z.string(),
            state: z.string(),
            priority: z.number(),
        })),
        execute: async ({ limit = 10 }: { limit?: number }) => {
            if (useMockData()) {
                console.log('📦 Using mock Linear data');
                return mockLinearData.issues.slice(0, limit);
            }

            const key = getKey();
            try {
                const res = await fetch('https://api.linear.app/graphql', {
                    method: 'POST',
                    headers: {
                        'Authorization': key!,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            query { 
                                issues(first: ${limit}) { 
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
                    }),
                });

                if (!res.ok) return mockLinearData.issues;

                const data = await res.json();
                return data.data.issues.nodes.map((issue: any) => ({
                    id: issue.id,
                    identifier: issue.identifier,
                    title: issue.title,
                    state: issue.state.name,
                    priority: issue.priority,
                }));
            } catch (e) {
                return mockLinearData.issues;
            }
        },
    },

    create_issue: {
        name: 'create_linear_issue',
        description: 'Create a new issue in Linear',
        inputSchema: z.object({
            title: z.string().describe('Issue title'),
            description: z.string().optional().describe('Issue description'),
            teamId: z.string().describe('Team ID'),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            id: z.string().optional(),
            message: z.string(),
        }),
        execute: async ({ title, description, teamId }: { title: string; description?: string; teamId: string }) => {
            if (useMockData()) {
                console.log('📦 Mock: Linear issue created');
                return { success: true, id: 'lin_demo_123', message: `[Demo] Issue "${title}" created` };
            }

            const key = getKey();
            try {
                const res = await fetch('https://api.linear.app/graphql', {
                    method: 'POST',
                    headers: {
                        'Authorization': key!,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            mutation CreateIssue($input: IssueCreateInput!) {
                                issueCreate(input: $input) {
                                    success
                                    issue { id identifier }
                                }
                            }
                        `,
                        variables: {
                            input: { title, description, teamId },
                        },
                    }),
                });

                if (!res.ok) return { success: false, message: 'Failed to create issue' };

                const data = await res.json();
                return {
                    success: true,
                    id: data.data.issueCreate.issue.id,
                    message: `Issue ${data.data.issueCreate.issue.identifier} created`,
                };
            } catch (e) {
                return { success: false, message: 'Network error' };
            }
        },
    },
};
