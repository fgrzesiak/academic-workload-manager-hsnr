import { computed, reactive, readonly } from 'vue'

interface LayoutConfig {
    preset: string
    primary: string
    surface: string
    darkTheme: boolean
    menuMode: string
}

interface LayoutState {
    staticMenuDesktopInactive: boolean
    overlayMenuActive: boolean
    profileSidebarVisible: boolean
    configSidebarVisible: boolean
    staticMenuMobileActive: boolean
    menuHoverActive: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    activeMenuItem: any | null
}

const layoutConfig = reactive<LayoutConfig>({
    preset: 'Lara',
    primary: 'blue',
    surface: 'slate',
    darkTheme: false,
    menuMode: 'static',
})

const layoutState = reactive<LayoutState>({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null,
})

export function useLayout() {
    const setPrimary = (value: string) => {
        layoutConfig.primary = value
    }

    const setSurface = (value: string) => {
        layoutConfig.surface = value
    }

    const setPreset = (value: string) => {
        layoutConfig.preset = value
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setActiveMenuItem = (item: any) => {
        layoutState.activeMenuItem = item.value || item
    }

    const setMenuMode = (mode: string) => {
        layoutConfig.menuMode = mode
    }

    const toggleDarkMode = () => {
        if (!document.startViewTransition) {
            executeDarkModeToggle()

            return
        }

        document.startViewTransition(() => executeDarkModeToggle())
    }

    const executeDarkModeToggle = () => {
        layoutConfig.darkTheme = !layoutConfig.darkTheme
        document.documentElement.classList.toggle('app-dark')
    }

    const onMenuToggle = () => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive =
                !layoutState.staticMenuDesktopInactive
        } else {
            layoutState.staticMenuMobileActive =
                !layoutState.staticMenuMobileActive
        }
    }

    const resetMenu = () => {
        layoutState.overlayMenuActive = false
        layoutState.staticMenuMobileActive = false
        layoutState.menuHoverActive = false
    }

    const isSidebarActive = computed(
        () =>
            layoutState.overlayMenuActive || layoutState.staticMenuMobileActive
    )

    const isDarkTheme = computed(() => layoutConfig.darkTheme)

    const getPrimary = computed(() => layoutConfig.primary)

    const getSurface = computed(() => layoutConfig.surface)

    return {
        layoutConfig: readonly(layoutConfig),
        layoutState: readonly(layoutState),
        onMenuToggle,
        isSidebarActive,
        isDarkTheme,
        getPrimary,
        getSurface,
        setActiveMenuItem,
        toggleDarkMode,
        setPrimary,
        setSurface,
        setPreset,
        resetMenu,
        setMenuMode,
    }
}
