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
                    path: '',
                    name: 'c.data-import',
                    component: () => import('@/views/controller/DataImport.vue'),
                },
                {
                    path: 'edit-data',
                    children: [
                        {
                            path: 'global-data',
                            name: 'c.global-data',
                            component: () =>
                                import(
                                    '@/views/controller/edit-data/GlobalData.vue'
                                ),
                            meta: {
                                label: 'Global Data',
                                icon: 'pi pi-fw pi-globe',
                            },
                        },
                        {
                            path: 'courses',
                            name: 'c.courses',
                            component: () =>
                                import(
                                    '@/views/controller/edit-data/Courses.vue'
                                ),
                            meta: {
                                label: 'Courses',
                                icon: 'pi pi-fw pi-calendar',
                            },
                        },
                        {
                            path: 'mentoring',
                            name: 'c.mentoring',
                            component: () =>
                                import(
                                    '@/views/controller/edit-data/Mentoring.vue'
                                ),
                            meta: {
                                label: 'Mentoring',
                                icon: 'pi pi-fw pi-users',
                            },
                        },
                        {
                            path: 'discounts',
                            name: 'c.discounts',
                            component: () =>
                                import(
                                    '@/views/controller/edit-data/Discounts.vue'
                                ),
                            meta: {
                                label: 'Discounts',
                                icon: 'pi pi-fw pi-money-bill',
                            },
                        },
                    ],
                },
                {
                    path: 'evaluation',
                    children: [
                        {
                            path: 'export',
                            name: 'c.export',
                            component: () =>
                                import(
                                    '@/views/controller/evaluation/Export.vue'
                                ),
                            meta: {
                                label: 'Export',
                                icon: 'pi pi-fw pi-download',
                            },
                        },
                        {
                            path: 'overview',
                            name: 'c.overview',
                            component: () =>
                                import(
                                    '@/views/controller/evaluation/Overview.vue'
                                ),
                            meta: {
                                label: 'Overview',
                                icon: 'pi pi-fw pi-chart-bar',
                            },
                        },
                        {
                            path: 'group-analysis',
                            name: 'c.groupanalysis',
                            component: () =>
                                import(
                                    '@/views/controller/evaluation/GroupAnalysis.vue'
                                ),
                            meta: {
                                label: 'Group Analysis',
                                icon: 'pi pi-fw pi-chart-line',
                            },
                        },
                    ],
                },
                {
                    path: 'administration',
                    children: [
                        {
                            path: 'users',
                            name: 'c.users',
                            component: () =>
                                import('@/views/controller/admin/Users.vue'),
                            meta: {
                                label: 'Users',
                                icon: 'pi pi-fw pi-users',
                            },
                        },
                    ],
                },
            ],
        },
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '',
                    name: 't.dashboard',
                    component: () => import('@/views/teacher/Dashboard.vue'),
                    meta: {
                        label: 'Lehrsaldo',
                        icon: 'pi pi-fw pi-chart-bar',
                    },
                },
                {
                    path: 'management',
                    children: [
                        {
                            path: 'report-data',
                            name: 't.report-data',
                            component: () =>
                                import(
                                    '@/views/teacher/management/ReportData.vue'
                                ),
                            meta: {
                                label: 'Daten melden',
                                icon: 'pi pi-fw pi-database',
                            },
                        },
                    ],
                },
            ],
        },
        {
            path: '/change-password',
            name: 'change-password',
            component: () => import('@/views/pages/auth/ChangePassword.vue'),
        },
        {
            path: '/403',
            name: 'access-denied',
            component: () => import('@/views/pages/auth/Access.vue'),
        },
        {
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: () => import('@/views/pages/NotFound.vue'),
        },
    ],
})

router.beforeEach(async (to, _from, next) => {
    const { isAuthenticated, isPasswordTemporary, role, logout } =
        useAuthStore()
    if (to.path.startsWith('/403')) {
        next()
    } else if (isAuthenticated && to.name === 'login') {
        if (isPasswordTemporary) {
            next({ name: 'change-password' })
        } else {
            next({
                name: role === 'CONTROLLER' ? 'c.dashboard' : 't.dashboard',
            })
        }
    } else if (!isAuthenticated) {
        if (to.name === 'login') {
            next()
        } else {
            next({ name: 'login' })
        }
    } else {
        if (isPasswordTemporary) {
            if (!to.path.startsWith('/change-password')) {
                next({ name: 'change-password' })
            } else {
                next()
            }
        } else if (
            role === 'CONTROLLER' &&
            to.path.startsWith('/controlling')
        ) {
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
