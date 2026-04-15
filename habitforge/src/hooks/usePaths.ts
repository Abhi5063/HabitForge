import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:4000/path'; // Ensure maps to backend RestController mapping

const fetchAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        }
    });
    if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.message || 'Network request failed');
    }
    const text = await res.text();
    return text ? JSON.parse(text) : {};
};

export function usePaths() {
    const queryClient = useQueryClient();

    const queryInfo = useQuery({
        queryKey: ['paths'],
        queryFn: () => fetchAuth(API_URL)
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => fetchAuth(API_URL, { method: 'POST', body: JSON.stringify(data) }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['paths'] }),
        onError: (err: Error) => toast.error(`Failed to generate path: ${err.message}`)
    });

    return {
        paths: queryInfo.data || [],
        isLoading: queryInfo.isLoading,
        createPath: createMutation.mutateAsync, // Async for UI awaited loading states
        isCreating: createMutation.isPending
    };
}

export function usePathDetail(id: string) {
    const queryClient = useQueryClient();

    const pathQuery = useQuery({
        queryKey: ['paths', id],
        queryFn: () => fetchAuth(`${API_URL}/${id}`),
        enabled: !!id
    });

    const completeTaskMutation = useMutation({
        mutationFn: ({ taskId, notes, difficulty }: any) => fetchAuth(`${API_URL}/task/${taskId}/complete`, { 
            method: 'POST', 
            body: JSON.stringify({ notes, difficulty }) 
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['paths', id] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
            toast.success('Task Completed! XP Awarded. ⚡');
        },
        onError: (err: Error) => toast.error(`Failed to complete: ${err.message}`)
    });

    return {
        path: pathQuery.data,
        isLoading: pathQuery.isLoading,
        completeTask: completeTaskMutation.mutateAsync,
        isCompleting: completeTaskMutation.isPending
    };
}
