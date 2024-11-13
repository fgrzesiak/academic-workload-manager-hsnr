import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppLayout from '@/layout/AppLayout.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue'),
        },
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                },
            ],
        },
    ],
})

router.beforeEach(async (to, _from, next) => {
    const { isAuthenticated } = useAuthStore()
    if (isAuthenticated && to.name === 'login') {
        next({ name: 'dashboard' })
    } else if (!isAuthenticated && to.name !== 'login') {
        next({ name: 'login' })
    } else {
        next()
    }
})

export { router }
