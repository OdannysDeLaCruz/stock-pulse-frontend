<template>
  <div class="flex items-center px-6 border-r hover:bg-gray-700" :class="[
    stock.analysis.change_value > 0 ? 'border-green-500' : 'border-red-500',
    stock.analysis.change_value > 0 ? 'text-green-400' : 'text-red-400',
  ]">
    <RouterLink :to="`/stocks/${stock.ticker}`">
      <span class="font-medium">{{ stock.ticker }}</span>
    </RouterLink>
    <span class="ml-2">
      {{ stock.analysis.change_value > 0 ? '+' : '' }}{{ stock.analysis.change_value.toFixed(2) }}%
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Stock } from '@/types'
import { RouterLink } from 'vue-router'

defineProps<{
  stock: Stock
}>()
</script>
