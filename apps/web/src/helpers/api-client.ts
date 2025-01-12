import { useAuthStore } from '@/stores/auth.store'
import { createFetch } from '@vueuse/core'

const baseUrl = `${import.meta.env.VITE_API_URL}`

const networkFetchClient = createFetch({
    baseUrl,
    combination: 'chain',
    options: {
        beforeFetch({ url, options }) {
            const { user } = useAuthStore()
            const isLoggedIn = !!user?.token
            const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL)
            if (isLoggedIn && isApiUrl) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${user.token}`,
                }
            }
        },
        onFetchError(ctx) {
            if (ctx.response?.status === 401) {
                const { logout } = useAuthStore()
                logout()
            }
            if (ctx.data && ctx.data.message) {
                ctx.error = ctx.data.message
            }
            return ctx
        },
        afterFetch(ctx) {
            if (ctx.data) {
                return ctx.data
            }
            return ctx
        },
    },
    fetchOptions: {
        mode: 'cors',
    },
})

class ApiClient {
    networkClient: typeof networkFetchClient

    constructor(networkClient: typeof networkFetchClient) {
        this.networkClient = networkClient
    }

    get<T>(url: string) {
        return this.networkClient(url, {
            afterFetch: (ctx) => ctx.data,
        })
            .get()
            .json<T>()
            .then((res) => {
                const { data, error } = res
                if (error.value) {
                    return { data: null, error: new String(error.value) }
                } else if (!data.value) {
                    return {
                        data: null,
                        error: 'Ein unbekannter Fehler ist aufgetreten.',
                    }
                } else {
                    return { data: data.value, error: null }
                }
            })
    }

    put<T>(url: string, body: unknown) {
        return this.networkClient(url, {
            afterFetch: (ctx) => ctx.data,
        })
            .put(body)
            .json<T>()
            .then((res) => {
                const { data, error } = res
                if (error.value) {
                    return { data: null, error: new String(error.value) }
                } else if (!data.value) {
                    return {
                        data: null,
                        error: 'Ein unbekannter Fehler ist aufgetreten.',
                    }
                } else {
                    return { data: data.value, error: null }
                }
            })
    }

    post<T>(url: string, body: unknown) {
        return this.networkClient(url, {
            afterFetch: (ctx) => ctx.data,
        })
            .post(body)
            .json<T>()
            .then((res) => {
                const { data, error } = res
                if (error.value) {
                    return { data: null, error: new String(error.value) }
                } else if (!data.value) {
                    return {
                        data: null,
                        error: 'Ein unbekannter Fehler ist aufgetreten.',
                    }
                } else {
                    return { data: data.value, error: null }
                }
            })
    }

    delete<T>(url: string, body: unknown) {
        return this.networkClient(url, {
            afterFetch: (ctx) => ctx.data,
        })
            .delete(body)
            .json<T>()
            .then((res) => {
                const { data, error } = res
                if (error.value) {
                    return { data: null, error: new String(error.value) }
                } else if (!data.value) {
                    return {
                        data: null,
                        error: 'Ein unbekannter Fehler ist aufgetreten.',
                    }
                } else {
                    return { data: data.value, error: null }
                }
            })
    }
}

export const apiClient = new ApiClient(networkFetchClient)
