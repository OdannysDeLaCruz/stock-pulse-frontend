<template>
  <RouterLink :to="`/stocks/${stock.ticker}`">
    <div
      class="p-4 w-full mx-auto space-y-2 bg-white sm:py-4 flex items-center sm:space-y-0 sm:gap-x-6 border-b-gray-300 border-b border-dashed">
      <div class="space-y-2 text-left flex justify-between w-full items-center">
        <div class="w-full flex flex-col gap-2">
          <span class="flex items-center gap-2 justify-between">
            <span class="text-lg font-bold text-blue-600 hover:text-blue-800">{{ stock.ticker }}</span>
            <span class="text-slate-500 font-sm font-bold">{{ stock.target_to }}</span>
          </span>
          <span class="flex items-center gap-2 justify-between">
            <span>{{ stock.company }}</span>
            <span :class='stock.analysis.change_value > 0 ? "text-green-500" : "text-red-500"'>
              {{ stock.analysis.change_value > 0 ? "↑ + " : "↓" }} {{ stock.analysis.change_value }}%</span>
          </span>
        </div>
      </div>
    </div>
  </RouterLink>

</template>

<script setup lang="ts">
import type { Stock } from '@/types'

defineProps<{
  stock: Stock
}>()
</script>
