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
            path: '/controlling',
            component: AppLayout,
            children: [
                {
                    path: '/controlling',
                    name: 'c.dashboard',
                    component: () => import('@/views/controller/Dashboard.vue'),
                },
            ],
        },
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 't.dashboard',
                    component: () => import('@/views/teacher/Dashboard.vue'),
                },
            ],
        },
    ],
})

router.beforeEach(async (to, _from, next) => {
    const { isAuthenticated, role, logout } = useAuthStore()
    console.log('isAuthenticated', isAuthenticated)
    console.log('role', role)
    console.log('to', to)
    if (isAuthenticated && to.name === 'login') {
        next({ name: role === 'CONTROLLER' ? 'c.dashboard' : 't.dashboard' })
    } else if (!isAuthenticated) {
        if (to.name === 'login') {
            next()
        } else {
            next({ name: 'login' })
        }
    } else {
        if (role === 'CONTROLLER' && to.path.startsWith('/controlling')) {
            next()
        } else if (role === 'TEACHER' && !to.path.startsWith('/controlling')) {
            next()
        } else if (role === 'CONTROLLER') {
            next({ name: 'c.dashboard' })
        } else if (role === 'TEACHER') {
            next({ name: 't.dashboard' })
        } else {
            logout()
        }
    }
})

export { router }
