import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/auth/login',
            name: 'Login',
            component: () => import('@/views/pages/auth/Login.vue')
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    const { isAuthenticated } = useAuthStore();
    if (isAuthenticated && to.name === 'Login') {
        next({ name: 'Dashboard' });
    } else if (!isAuthenticated && to.name !== 'Login') {
        next({ name: 'Login' });
    } else {
        next();
    }
});

export { router };
