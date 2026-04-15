import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:4000/habits';

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

export function useHabits() {
    const queryClient = useQueryClient();

    const queryInfo = useQuery({
        queryKey: ['habits'],
        queryFn: () => fetchAuth(API_URL)
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => fetchAuth(API_URL, { method: 'POST', body: JSON.stringify(data) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
            toast.success('Habit created successfully! 🔥');
        },
        onError: (err: Error) => toast.error(`Failed to create: ${err.message}`)
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => fetchAuth(`${API_URL}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
        onError: (err: Error) => toast.error(`Failed to update: ${err.message}`)
    });

    const completeMutation = useMutation({
        mutationFn: (id: string) => fetchAuth(`${API_URL}/${id}/complete`, { method: 'POST' }),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['habits'] });
            const previousHabits = queryClient.getQueryData(['habits']);
            
            // Optimistic update
            queryClient.setQueryData(['habits'], (old: any) => {
                if (!Array.isArray(old)) return old;
                return old.map(h => {
                    if (h.id === id) {
                        return { ...h, currentStreak: h.currentStreak + 1, lastCompletedAt: new Date().toISOString() };
                    }
                    return h;
                });
            });

            return { previousHabits };
        },
        onError: (err: Error, id, context) => {
            toast.error(`Completion failed: ${err.message}`);
            queryClient.setQueryData(['habits'], context?.previousHabits);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => fetchAuth(`${API_URL}/${id}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
            toast.success('Habit deleted.');
        },
        onError: (err: Error) => toast.error(`Failed to delete: ${err.message}`)
    });

    return {
        habits: queryInfo.data || [],
        isLoading: queryInfo.isLoading,
        error: queryInfo.error,
        createHabit: createMutation.mutate,
        isCreating: createMutation.isPending,
        updateHabit: updateMutation.mutate,
        completeHabit: completeMutation.mutate,
        deleteHabit: deleteMutation.mutate
    };
}
