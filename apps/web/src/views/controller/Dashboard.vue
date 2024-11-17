<script setup lang="ts">
import UserService from '@/service/user.service'
import { onMounted, ref } from 'vue'

const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' },
])

onMounted(async () => {
    const { data } = await UserService.getProfile()
})
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="mb-4 flex justify-between">
                    <div>
                        <span class="mb-4 block font-medium text-muted-color"
                            >Orders</span
                        >
                        <div
                            class="text-xl font-medium text-surface-900 dark:text-surface-0"
                        >
                            152
                        </div>
                    </div>
                    <div
                        class="flex items-center justify-center bg-blue-100 rounded-border dark:bg-blue-400/10"
                        style="width: 2.5rem; height: 2.5rem"
                    >
                        <i
                            class="pi pi-shopping-cart !text-xl text-blue-500"
                        ></i>
                    </div>
                </div>
                <span class="font-medium text-primary">24 new </span>
                <span class="text-muted-color">since last visit</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="mb-4 flex justify-between">
                    <div>
                        <span class="mb-4 block font-medium text-muted-color"
                            >Revenue</span
                        >
                        <div
                            class="text-xl font-medium text-surface-900 dark:text-surface-0"
                        >
                            $2.100
                        </div>
                    </div>
                    <div
                        class="flex items-center justify-center bg-orange-100 rounded-border dark:bg-orange-400/10"
                        style="width: 2.5rem; height: 2.5rem"
                    >
                        <i class="pi pi-dollar !text-xl text-orange-500"></i>
                    </div>
                </div>
                <span class="font-medium text-primary">%52+ </span>
                <span class="text-muted-color">since last week</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="mb-4 flex justify-between">
                    <div>
                        <span class="mb-4 block font-medium text-muted-color"
                            >Customers</span
                        >
                        <div
                            class="text-xl font-medium text-surface-900 dark:text-surface-0"
                        >
                            28441
                        </div>
                    </div>
                    <div
                        class="flex items-center justify-center bg-cyan-100 rounded-border dark:bg-cyan-400/10"
                        style="width: 2.5rem; height: 2.5rem"
                    >
                        <i class="pi pi-users !text-xl text-cyan-500"></i>
                    </div>
                </div>
                <span class="font-medium text-primary">520 </span>
                <span class="text-muted-color">newly registered</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="mb-4 flex justify-between">
                    <div>
                        <span class="mb-4 block font-medium text-muted-color"
                            >Comments</span
                        >
                        <div
                            class="text-xl font-medium text-surface-900 dark:text-surface-0"
                        >
                            152 Unread
                        </div>
                    </div>
                    <div
                        class="flex items-center justify-center bg-purple-100 rounded-border dark:bg-purple-400/10"
                        style="width: 2.5rem; height: 2.5rem"
                    >
                        <i class="pi pi-comment !text-xl text-purple-500"></i>
                    </div>
                </div>
                <span class="font-medium text-primary">85 </span>
                <span class="text-muted-color">responded</span>
            </div>
        </div>

        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="mb-4 text-xl font-semibold">Recent Sales</div>
            </div>
            <div class="card">
                <div class="mb-6 flex items-center justify-between">
                    <div class="text-xl font-semibold">
                        Best Selling Products
                    </div>
                    <div>
                        <Menu
                            ref="menu2"
                            :popup="true"
                            :model="items"
                            class="!min-w-40"
                        ></Menu>
                    </div>
                </div>
                <ul class="m-0 list-none p-0">
                    <li
                        class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between"
                    >
                        <div>
                            <span
                                class="mb-1 mr-2 font-medium text-surface-900 md:mb-0 dark:text-surface-0"
                                >Space T-Shirt</span
                            >
                            <div class="mt-1 text-muted-color">Clothing</div>
                        </div>
                        <div class="mt-2 flex items-center md:mt-0">
                            <div
                                class="w-40 overflow-hidden bg-surface-300 rounded-border lg:w-24 dark:bg-surface-500"
                                style="height: 8px"
                            >
                                <div
                                    class="h-full bg-orange-500"
                                    style="width: 50%"
                                ></div>
                            </div>
                            <span class="ml-4 font-medium text-orange-500"
                                >%50</span
                            >
                        </div>
                    </li>
                    <li
                        class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between"
                    >
                        <div>
                            <span
                                class="mb-1 mr-2 font-medium text-surface-900 md:mb-0 dark:text-surface-0"
                                >Portal Sticker</span
                            >
                            <div class="mt-1 text-muted-color">Accessories</div>
                        </div>
                        <div
                            class="ml-0 mt-2 flex items-center md:ml-20 md:mt-0"
                        >
                            <div
                                class="w-40 overflow-hidden bg-surface-300 rounded-border lg:w-24 dark:bg-surface-500"
                                style="height: 8px"
                            >
                                <div
                                    class="h-full bg-cyan-500"
                                    style="width: 16%"
                                ></div>
                            </div>
                            <span class="ml-4 font-medium text-cyan-500"
                                >%16</span
                            >
                        </div>
                    </li>
                    <li
                        class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between"
                    >
                        <div>
                            <span
                                class="mb-1 mr-2 font-medium text-surface-900 md:mb-0 dark:text-surface-0"
                                >Supernova Sticker</span
                            >
                            <div class="mt-1 text-muted-color">Accessories</div>
                        </div>
                        <div
                            class="ml-0 mt-2 flex items-center md:ml-20 md:mt-0"
                        >
                            <div
                                class="w-40 overflow-hidden bg-surface-300 rounded-border lg:w-24 dark:bg-surface-500"
                                style="height: 8px"
                            >
                                <div
                                    class="h-full bg-pink-500"
                                    style="width: 67%"
                                ></div>
                            </div>
                            <span class="ml-4 font-medium text-pink-500"
                                >%67</span
                            >
                        </div>
                    </li>
                    <li
                        class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between"
                    >
                        <div>
                            <span
                                class="mb-1 mr-2 font-medium text-surface-900 md:mb-0 dark:text-surface-0"
                                >Wonders Notebook</span
                            >
                            <div class="mt-1 text-muted-color">Office</div>
                        </div>
                        <div
                            class="ml-0 mt-2 flex items-center md:ml-20 md:mt-0"
                        >
                            <div
                                class="w-40 overflow-hidden bg-surface-300 rounded-border lg:w-24 dark:bg-surface-500"
                                style="height: 8px"
                            >
                                <div
                                    class="h-full bg-green-500"
                                    style="width: 35%"
                                ></div>
                            </div>
                            <span class="ml-4 font-medium text-primary"
                                >%35</span
                            >
                        </div>
                    </li>
                    <li
                        class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between"
                    >
                        <div>
                            <span
                                class="mb-1 mr-2 font-medium text-surface-900 md:mb-0 dark:text-surface-0"
                                >Mat Black Case</span
                            >
                            <div class="mt-1 text-muted-color">Accessories</div>
                        </div>
                        <div
                            class="ml-0 mt-2 flex items-center md:ml-20 md:mt-0"
                        >
                            <div
                                class="w-40 overflow-hidden bg-surface-300 rounded-border lg:w-24 dark:bg-surface-500"
                                style="height: 8px"
                            >
                                <div
                                    class="h-full bg-purple-500"
                                    style="width: 75%"
                                ></div>
                            </div>
                            <span class="ml-4 font-medium text-purple-500"
                                >%75</span
                            >
                        </div>
                    </li>
                    <li
                        class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between"
                    >
                        <div>
                            <span
                                class="mb-1 mr-2 font-medium text-surface-900 md:mb-0 dark:text-surface-0"
                                >Robots T-Shirt</span
                            >
                            <div class="mt-1 text-muted-color">Clothing</div>
                        </div>
                        <div
                            class="ml-0 mt-2 flex items-center md:ml-20 md:mt-0"
                        >
                            <div
                                class="w-40 overflow-hidden bg-surface-300 rounded-border lg:w-24 dark:bg-surface-500"
                                style="height: 8px"
                            >
                                <div
                                    class="h-full bg-teal-500"
                                    style="width: 40%"
                                ></div>
                            </div>
                            <span class="ml-4 font-medium text-teal-500"
                                >%40</span
                            >
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="mb-4 text-xl font-semibold">Revenue Stream</div>
            </div>
            <div class="card">
                <div class="mb-6 flex items-center justify-between">
                    <div class="text-xl font-semibold">Notifications</div>
                    <div>
                        <Menu
                            ref="menu1"
                            :popup="true"
                            :model="items"
                            class="!min-w-40"
                        ></Menu>
                    </div>
                </div>

                <span class="mb-4 block font-medium text-muted-color"
                    >TODAY</span
                >
                <ul class="mx-0 mb-6 mt-0 list-none p-0">
                    <li class="flex items-center border-b py-2 border-surface">
                        <div
                            class="mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-400/10"
                        >
                            <i class="pi pi-dollar !text-xl text-blue-500"></i>
                        </div>
                        <span
                            class="leading-normal text-surface-900 dark:text-surface-0"
                            >Richard Jones
                            <span class="text-surface-700 dark:text-surface-100"
                                >has purchased a blue t-shirt for
                                <span class="font-bold text-primary"
                                    >$79.00</span
                                ></span
                            >
                        </span>
                    </li>
                    <li class="flex items-center py-2">
                        <div
                            class="mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-400/10"
                        >
                            <i
                                class="pi pi-download !text-xl text-orange-500"
                            ></i>
                        </div>
                        <span
                            class="leading-normal text-surface-700 dark:text-surface-100"
                            >Your request for withdrawal of
                            <span class="font-bold text-primary">$2500.00</span>
                            has been initiated.</span
                        >
                    </li>
                </ul>

                <span class="mb-4 block font-medium text-muted-color"
                    >YESTERDAY</span
                >
                <ul class="m-0 mb-6 list-none p-0">
                    <li class="flex items-center border-b py-2 border-surface">
                        <div
                            class="mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-400/10"
                        >
                            <i class="pi pi-dollar !text-xl text-blue-500"></i>
                        </div>
                        <span
                            class="leading-normal text-surface-900 dark:text-surface-0"
                            >Keyser Wick
                            <span class="text-surface-700 dark:text-surface-100"
                                >has purchased a black jacket for
                                <span class="font-bold text-primary"
                                    >$59.00</span
                                ></span
                            >
                        </span>
                    </li>
                    <li class="flex items-center border-b py-2 border-surface">
                        <div
                            class="mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-400/10"
                        >
                            <i
                                class="pi pi-question !text-xl text-pink-500"
                            ></i>
                        </div>
                        <span
                            class="leading-normal text-surface-900 dark:text-surface-0"
                            >Jane Davis
                            <span class="text-surface-700 dark:text-surface-100"
                                >has posted a new questions about your
                                product.</span
                            >
                        </span>
                    </li>
                </ul>
                <span class="mb-4 block font-medium text-muted-color"
                    >LAST WEEK</span
                >
                <ul class="m-0 list-none p-0">
                    <li class="flex items-center border-b py-2 border-surface">
                        <div
                            class="mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-400/10"
                        >
                            <i
                                class="pi pi-arrow-up !text-xl text-green-500"
                            ></i>
                        </div>
                        <span
                            class="leading-normal text-surface-900 dark:text-surface-0"
                            >Your revenue has increased by
                            <span class="font-bold text-primary">%25</span
                            >.</span
                        >
                    </li>
                    <li class="flex items-center border-b py-2 border-surface">
                        <div
                            class="mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-400/10"
                        >
                            <i class="pi pi-heart !text-xl text-purple-500"></i>
                        </div>
                        <span
                            class="leading-normal text-surface-900 dark:text-surface-0"
                            ><span class="font-bold text-primary">12</span>
                            users have added your products to their
                            wishlist.</span
                        >
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
