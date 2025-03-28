<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { Disclosure } from '@headlessui/vue'
import StockCarousel from '@/components/stocks/stock-carousel/StockCarousel.vue'

const navigation = [
  { name: 'Stocks', href: '/stocks', current: true },
  { name: 'Most recommended', href: '/stocks/topics/recommended', current: false },
  { name: 'No recommended', href: '/stocks/topics/not-recommended', current: false },
]

</script>

<template>
  <div class="min-h-full">
    <Disclosure as="nav" class="sticky top-0 z-10 bg-gray-900">
      <div class="mx-auto container px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <!-- Logo -->
            <div class="shrink-0 flex items-center">
              <img class="size-10" src="/images/stockpulse.webp"
                alt="Stock pulse" />
              <span class='ml-5 text-2xl text-white font-bold'>Stock Pulse</span>
            </div>
            <!-- Navigation -->
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <RouterLink v-for="item in navigation" :key="item.name" :to="{ path: item.href}" :class="[
                  item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium',
                ]" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Disclosure>
    <!-- Carousel Infinite of stocks -->
    <div class="w-full">
      <StockCarousel />
    </div>

    <main>
      <div>
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: #2d3748;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

nav {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

nav a {
  color: #e2e8f0;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

nav a:hover {
  background-color: #4a5568;
}

nav a.router-link-active {
  background-color: #4a5568;
  color: white;
}
</style>
