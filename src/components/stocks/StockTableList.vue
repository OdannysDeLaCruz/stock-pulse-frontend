<script setup lang="ts">
import { ref } from 'vue'
import type { DeepPartial, ChartOptions } from 'lightweight-charts'
import LWChart from '@/components/charts/LWChart.vue'
import type { Stock } from '@/types'
import { transformDataToLW } from '@/utils/index.ts'

defineProps<{
  stocks: Stock[]
}>()

const chartOptions = ref<DeepPartial<ChartOptions>>({
  height: 30,
  width: 80,
  layout: {
    textColor: 'transparent',
  },
  rightPriceScale: {
    visible: false, // Oculta el eje de precios
  },
  timeScale: {
    visible: false, // Oculta el eje de tiempo
  },
})
</script>
<template>
  <div class="w-full flex justify-center flex-wrap gap-4">
    <!-- Horizontal Scrollable Table -->
    <div class="w-full overflow-x-auto border-2 border-gray-300 rounded-lg">
      <div class="min-w-full inline-block align-middle">
        <table class="min-w-full bg-white shadow-md overflow-hidden">
          <thead>
            <tr>
              <th class="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Symbol
              </th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">company</th>
              <th class="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Metrics</th>
              <th class="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Target From
              </th>
              <th class="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Target To</th>
              <th class="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              <th class="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">change %</th>
              <th class="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating From
              </th>
              <th class="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating To</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">action</th>
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">brokerage</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="stock in stocks" :key="stock.id">
              <td class="left-0 bg-white z-30 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                <RouterLink :to="`/stocks/${stock.ticker}`" class='font-bold text-blue-600 hover:text-blue-800'>
                  {{ stock.ticker }}
                </RouterLink>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{{ stock.company }}</td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                <LWChart type="area" v-if='stock.price_history.length' :data="transformDataToLW(stock.price_history)"
                  :chartOptions='chartOptions' />
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class='w-24 text-center'>{{ stock.target_from }}</div>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class='w-24 text-center'>{{ stock.target_to }}</div>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class='w-24 text-center' :class="[
                  stock.analysis.change_value > 0 ? 'border-green-500' : 'border-red-500',
                  stock.analysis.change_value > 0 ? 'text-green-400' : 'text-red-400',
                ]">
                  {{ stock.analysis.change_value }}
                </div>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class='w-24 text-center' :class="[
                  stock.analysis.change_value > 0 ? 'border-green-500' : 'border-red-500',
                  stock.analysis.change_value > 0 ? 'text-green-400' : 'text-red-400',
                ]">
                  {{ stock.analysis.change_percentage }}%
                </div>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{{ stock.rating_from }}</td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class='w-24 text-center'>{{ stock.rating_to }}</div>
              </td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500 text-left">{{ stock.action }}</td>
              <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500 text-left">{{ stock.brokerage }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
