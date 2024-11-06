import { useAuthStore } from '@/stores/auth.store';
import { createFetch } from '@vueuse/core';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

const networkFetchClient = createFetch({
    baseUrl,
    combination: 'chain',
    options: {
        beforeFetch({ url, options }) {
            const { user } = useAuthStore();
            const isLoggedIn = !!user?.token;
            const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);
            if (isLoggedIn && isApiUrl) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${user.token}`
                };
            }
        },
        onFetchError(ctx) {
            if (ctx.data) {
                return ctx.data;
            }
            return ctx;
        },
        afterFetch(ctx) {
            // if the response contains a data property, return it
            if (ctx.data) {
                return ctx.data;
            }

            return ctx;
        }
    },
    fetchOptions: {
        mode: 'cors'
    }
});

class ApiClient {
    networkClient: typeof networkFetchClient;

    constructor(networkClient: typeof networkFetchClient) {
        this.networkClient = networkClient;
    }

    get<T>(url: string) {
        return this.networkClient(url, {
            afterFetch: (ctx) => ctx.data
        })
            .get()
            .json<T>();
    }

    post<T>(url: string, body: unknown) {
        return this.networkClient(url, {
            afterFetch: (ctx) => ctx.data
        })
            .post(body)
            .json<T>();
    }
}

export const apiClient = new ApiClient(networkFetchClient);
