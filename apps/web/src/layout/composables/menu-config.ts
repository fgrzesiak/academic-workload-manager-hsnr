import { MenuItem } from '../AppMenuItem.vue'

export const CONTROLLER_MENU: MenuItem[] = [
    {
        label: 'Start',
        items: [
            {
                label: 'Daten übertragen',
                icon: 'pi pi-fw pi-upload',
                to: '/controlling',
            },
        ],
    },
    {
        label: 'Datenverwaltung',
        items: [
            {
                label: 'Stammdaten',
                icon: 'pi pi-fw pi-globe',
                to: '/controlling/edit-data/global-data',
            },
            {
                label: 'Lehrveranstaltungen',
                icon: 'pi pi-fw pi-calendar',
                to: '/controlling/edit-data/courses',
            },
            {
                label: 'Betreuungen',
                icon: 'pi pi-fw pi-users',
                to: '/controlling/edit-data/mentoring',
            },
            {
                label: 'Ermäßigungen',
                icon: 'pi pi-fw pi-money-bill',
                to: '/controlling/edit-data/discounts',
            },
            {
                label: 'Deputate',
                icon: 'pi pi-fw pi-wallet',
                to: '/controlling/edit-data/deputats',
            },
        ],
    },
    {
        label: 'Datenauswertung',
        items: [
            {
                label: 'Einstellungen',
                icon: 'pi pi-fw pi-cog',
                to: '/controlling/evaluation/settings',
            },
            {
                label: 'Deputatsübersicht',
                icon: 'pi pi-fw pi-eye',
                to: '/controlling/evaluation/overview',
            },
            {
                label: 'Saldierung',
                icon: 'pi pi-fw pi-calculator',
                to: '/controlling/evaluation/saldation',
            },
            {
                label: 'Daten exportieren',
                icon: 'pi pi-fw pi-download',
                to: '/controlling/evaluation/export',
            },
        ],
    },
    {
        label: 'Nutzerverwaltung',
        items: [
            {
                label: 'Nutzer',
                icon: 'pi pi-fw pi-user',
                to: '/controlling/administration/users',
            },
            // {
            //     label: 'Rollen',
            //     icon: 'pi pi-fw pi-users',
            //     to: '/controlling/administration/roles',
            // },
            {
                label: 'Lehrgruppen',
                icon: 'pi pi-fw pi-window-maximize',
                to: '/controlling/administration/evaluationGroups',
            },
            {
                label: 'Ruhestände',
                icon: 'pi pi-fw pi-calendar-times',
                to: '/controlling/administration/retirements',
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
