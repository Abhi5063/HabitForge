import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true // needed for httpOnly refreshToken cookie routing
});

axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 Unauthorized via Refresh Token rotation
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Post to refresh. Cookie takes care of securely transmitting the payload
                const res = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
                const { accessToken } = res.data;
                
                // Keep the entire user object in store, just update the token
                const user = useAuthStore.getState().user;
                if (user) useAuthStore.getState().setAuth(user, accessToken);
                
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshErr) {
                useAuthStore.getState().clearAuth();
                window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
                return Promise.reject(refreshErr);
            }
        }
        return Promise.reject(error);
    }
);

// Modular Endpoints Layer
export const api = {
    auth: {
        login: (data: any) => axiosInstance.post('/auth/login', data),
        register: (data: any) => axiosInstance.post('/auth/register', data),
        logout: () => axiosInstance.post('/auth/logout'),
        refreshToken: () => axiosInstance.post('/auth/refresh'),
        forgotPassword: (email: string) => axiosInstance.post('/auth/forgot-password', { email }),
        resetPassword: (data: any) => axiosInstance.post('/auth/reset-password', data),
        me: () => axiosInstance.get('/auth/me')
    },
    habits: {
        getAll: () => axiosInstance.get('/habits'),
        getOne: (id: string) => axiosInstance.get(`/habits/${id}`),
        create: (data: any) => axiosInstance.post('/habits', data),
        update: (id: string, data: any) => axiosInstance.patch(`/habits/${id}`, data),
        complete: (id: string) => axiosInstance.post(`/habits/${id}/complete`),
        archive: (id: string) => axiosInstance.patch(`/habits/${id}/archive`),
        delete: (id: string) => axiosInstance.delete(`/habits/${id}`),
        getToday: () => axiosInstance.get('/habits/today')
    },
    paths: {
        getAll: () => axiosInstance.get('/paths'),
        getOne: (id: string) => axiosInstance.get(`/paths/${id}`),
        create: (data: any) => axiosInstance.post('/paths', data),
        completeTask: (id: string, data: any) => axiosInstance.post(`/paths/task/${id}/complete`, data),
        pause: (id: string) => axiosInstance.post(`/paths/${id}/pause`),
        resume: (id: string) => axiosInstance.post(`/paths/${id}/resume`),
        getTodayTask: (id: string) => axiosInstance.get(`/paths/${id}/today`)
    },
    analytics: {
        getSummary: () => axiosInstance.get('/analytics/summary'),
        getHeatmap: (year: number) => axiosInstance.get(`/analytics/heatmap?year=${year}`),
        getCompletion: (days: number) => axiosInstance.get(`/analytics/completion?days=${days}`),
        getBreakdown: () => axiosInstance.get('/analytics/breakdown'),
        getXPHistory: () => axiosInstance.get('/analytics/xp-history')
    },
    social: {
        getLeaderboard: () => axiosInstance.get('/social/leaderboard'),
        getFriendsLeaderboard: () => axiosInstance.get('/social/leaderboard?friends=true'),
        getFriends: () => axiosInstance.get('/social/friends'),
        searchUsers: (q: string) => axiosInstance.get(`/social/users/search?q=${q}`),
        sendRequest: (id: string) => axiosInstance.post(`/social/friends/request/${id}`),
        respondRequest: (id: string, accept: boolean) => axiosInstance.post(`/social/friends/respond/${id}`, { accept }),
        createGroup: (data: any) => axiosInstance.post('/social/groups', data),
        getGroups: () => axiosInstance.get('/social/groups')
    },
    notifications: {
        getAll: () => axiosInstance.get('/notifications'),
        markRead: (id: string) => axiosInstance.patch(`/notifications/${id}/read`),
        markAllRead: () => axiosInstance.patch('/notifications/read-all'),
        subscribe: (sub: any) => axiosInstance.post('/notifications/subscribe', sub)
    },
    gamification: {
        getUserStats: () => axiosInstance.get('/gamification/stats')
    }
};
