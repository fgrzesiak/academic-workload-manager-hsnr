import { useAuthStore } from '@/stores/auth.store' // import the auth store to manage user authentication state
import { createFetch } from '@vueuse/core' // import VueUse's createFetch to handle API requests

const baseUrl = `${import.meta.env.VITE_API_URL}` // set the base URL for the API from environment variables

// configure the network fetch client using VueUse's createFetch
const networkFetchClient = createFetch({
    baseUrl,
    combination: 'chain', // use chaining to handle multiple fetch options
    options: {
        // before sending a request, check if the user is logged in and if the URL is for the API
        beforeFetch({ url, options }) {
            const { user } = useAuthStore() // access the current user from the auth store
            const isLoggedIn = !!user?.token // check if the user is logged in by verifying the token
            const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL) // check if the URL is part of the API
            if (isLoggedIn && isApiUrl) {
                options.headers = {
                    ...options.headers, // spread existing headers
                    Authorization: `Bearer ${user.token}`, // add the Authorization header with the user's token
                }
            }
        },
        // handle fetch errors
        onFetchError(ctx) {
            if (ctx.response?.status === 401) { // if the status is 401 (Unauthorized), log the user out
                const { logout } = useAuthStore()
                logout() // call logout to clear the user's session
            }
            if (ctx.data && ctx.data.message) { // if there is an error message in the response, set it as the error
                ctx.error = ctx.data.message
            }
            return ctx
        },
        // after the request, return the data if it exists
        afterFetch(ctx) {
            if (ctx.data) {
                return ctx.data // return the response data if available
            }
            return ctx // return the context as is if no data is available
        },
    },
    fetchOptions: {
        mode: 'cors', // enable CORS for cross-origin requests
    },
})

// define the API client class to handle HTTP methods
class ApiClient {
    networkClient: typeof networkFetchClient

    // constructor accepts the network client instance
    constructor(networkClient: typeof networkFetchClient) {
        this.networkClient = networkClient
    }

    // GET request method
    get<T>(url: string) {
        return this.networkClient(url, {
            afterFetch: (ctx) => ctx.data, // extract data from the response
        })
            .get() // perform the GET request
            .json<T>() // parse the response as JSON
            .then((res) => {
                const { data, error } = res
                if (error.value) { // if there's an error, return it
                    return { data: null, error: new String(error.value) }
                } else if (!data.value) { // if no data is returned, return a generic error message
                    return {
                        data: null,
                        error: 'An unknown error occurred.',
                    }
                } else {
                    return { data: data.value, error: null } // return the data if everything is fine
                }
            })
    }

    // PUT request method
    put<T>(url: string, body: unknown) {
        return this.networkClient(url, {
            afterFetch: (ctx) => ctx.data, // extract data from the response
        })
            .put(body) // perform the PUT request with the given body
            .json<T>() // parse the response as JSON
            .then((res) => {
                const { data, error } = res
                if (error.value) { // if there's an error, return it
                    return { data: null, error: new String(error.value) }
                } else if (!data.value) { // if no data is returned, return a generic error message
                    return {
                        data: null,
                        error: 'An unknown error occurred.',
                    }
                } else {
                    return { data: data.value, error: null } // return the data if everything is fine
                }
            })
    }

    // POST request method
    post<T>(url: string, body: unknown) {
        return this.networkClient(url, {
            afterFetch: (ctx) => ctx.data, // extract data from the response
        })
            .post(body) // perform the POST request with the given body
            .json<T>() // parse the response as JSON
            .then((res) => {
                const { data, error } = res
                if (error.value) { // if there's an error, return it
                    return { data: null, error: new String(error.value) }
                } else if (!data.value) { // if no data is returned, return a generic error message
                    return {
                        data: null,
                        error: 'An unknown error occurred.',
                    }
                } else {
                    return { data: data.value, error: null } // return the data if everything is fine
                }
            })
    }

    // DELETE request method
    delete<T>(url: string, body: unknown) {
        return this.networkClient(url, {
            afterFetch: (ctx) => ctx.data, // extract data from the response
        })
            .delete(body) // perform the DELETE request with the given body
            .json<T>() // parse the response as JSON
            .then((res) => {
                const { data, error } = res
                if (error.value) { // if there's an error, return it
                    return { data: null, error: new String(error.value) }
                } else if (!data.value) { // if no data is returned, return a generic error message
                    return {
                        data: null,
                        error: 'An unknown error occurred.',
                    }
                } else {
                    return { data: data.value, error: null } // return the data if everything is fine
                }
            })
    }
}

// instantiate the API client with the network fetch client
export const apiClient = new ApiClient(networkFetchClient)
