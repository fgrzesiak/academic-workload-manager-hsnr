import { MenuItem } from '../AppMenuItem.vue'

export const CONTROLLER_MENU: MenuItem[] = [
    {
        label: 'Startseite',
        items: [
            {
                label: 'Übersicht',
                icon: 'pi pi-fw pi-home',
                to: '/controlling',
            },
        ],
    },
    {
        label: 'Daten bearbeiten',
        items: [
            {
                label: 'Lehrveranstaltungen',
                icon: 'pi pi-fw pi-calendar',
                to: '/controlling/edit-data/courses',
            },
            {
                label: 'Betreuung',
                icon: 'pi pi-fw pi-users',
                to: '/controlling/edit-data/mentoring',
            },
            {
                label: 'Ermäßigungen',
                icon: 'pi pi-fw pi-money-bill',
                to: '/controlling/edit-data/discounts',
            },
        ],
    },
    {
        label: 'Auswertung',
        items: [
            {
                label: 'Übersicht',
                icon: 'pi pi-fw pi-chart-bar',
                to: '/controlling/evaluation/overview',
            },
            {
                label: 'Gruppenauswertung',
                icon: 'pi pi-fw pi-chart-line',
                to: '/controlling/evaluation/group-analysis',
            },
        ],
    },
]

export const TEACHER_MENU: MenuItem[] = [
    {
        label: 'Startseite',
        items: [
            {
                label: 'Lehrsaldo',
                icon: 'pi pi-fw pi-chart-bar',
                to: '/',
            },
        ],
    },
    {
        label: 'Verwaltung',
        items: [
            {
                label: 'Daten melden',
                icon: 'pi pi-fw pi-database',
                to: '/management/report-data',
            },
        ],
    },
]
