<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import LWChart from '../../components/charts/LWChart.vue';
import type { AreaData, ChartOptions, DeepPartial } from 'lightweight-charts';
import { formatDate, transformDataToLW } from '@/utils';
import { useStocksStore } from '@/stores/stocks';
import { useRoute } from "vue-router"
import type { Stock } from '@/types';

const myChart = ref();
const chartOptions = ref<DeepPartial<ChartOptions>>({})
const stocksStore = useStocksStore()
const route = useRoute()
const stock = ref<Stock | null>(null)
const stockTicker = ref()

// Initial data
const data = ref<AreaData[]>([
  { time: formatDate("2025-03-11T01:35:08.180590815Z"), value: 120 },
  { time: formatDate("2025-03-11T01:35:10.359020470Z"), value: 125 },
  { time: formatDate("2025-03-11T01:35:12.741095661Z"), value: 130 },
  { time: formatDate("2025-03-11T01:35:14.278369404Z"), value: 128 },
  { time: formatDate("2025-03-11T01:35:16.123590815Z"), value: 132 },
  { time: formatDate("2025-03-11T01:35:18.180590815Z"), value: 135 },
  { time: formatDate("2025-03-11T01:35:20.359020470Z"), value: 137 },
  { time: formatDate("2025-03-11T01:35:22.741095661Z"), value: 120 },
  { time: formatDate("2025-03-11T01:35:24.278369404Z"), value: 150 },
  { time: formatDate("2025-03-11T01:35:26.123590815Z"), value: 160 },
])

onMounted(() => {
  stockTicker.value = route.params.ticker
  stocksStore.subscribeToStock(stockTicker.value)

  const existingStock = stocksStore.stocks.find((stock: Stock) => stock.ticker === stockTicker.value)
  if (existingStock) {
    stock.value = existingStock
  } else {
    const data = stocksStore.fetchStockBySymbol(stockTicker.value)
    console.log('DATA', data)
  }

  data.value = transformDataToLW(stock.value?.price_history || [])
})

onUnmounted(() => {
  stocksStore.unsubscribeFromStock()
})

const fitContent = () => {
  myChart.value.fitContent();
};

watch(() => stock.value?.price_history, (newHistory) => {
  if (newHistory) {
    data.value = transformDataToLW(newHistory)
  }
}, { deep: true })
</script>
<template>
  <div class="container mx-auto mt-10">

    <div class="flex flex-col mb-10" v-if='stock'>
      <p class="text-lg">Nasdaq </p>
      <h1 class="text-2xl font-bold mb-5">{{ stock.company }} ({{ stock.ticker }})</h1>

      <div class="w-full h-px bg-gray-200 mb-10"></div>

      <div class="flex justify-between mb-10">
        <div class="flex items-center">
          <p class="text-4xl font-bold mr-5">{{ stock.target_to }}</p>
          <!-- Diff in value -->
          <p class="text-lg text-green-500 mr-2" :class="[
            stock.analysis.change_value > 0 ? 'border-green-500' : 'border-red-500',
            stock.analysis.change_value > 0 ? 'text-green-400' : 'text-red-400',
          ]">
            {{ stock.analysis.change_value > 0 ? '+' : '' }}{{ stock.analysis.change_value }}
          </p>
          <!-- Diff in percentage -->
          <p class="text-lg text-green-500" :class="[
            stock.analysis.change_percentage > 0 ? 'border-green-500' : 'border-red-500',
            stock.analysis.change_percentage > 0 ? 'text-green-400' : 'text-red-400',
          ]">
            ({{ stock.analysis.change_percentage > 0 ? '+' : '' }}{{ stock.analysis.change_percentage }}%)
          </p>
        </div>
        <div class="flex items-center">
          <p class="text-lg font-bold mr-5">Change</p>
          <p class="text-lg text-green-500" :class="[
            stock.analysis.change_value > 0 ? 'border-green-500' : 'border-red-500',
            stock.analysis.change_value > 0 ? 'text-green-400' : 'text-red-400',
          ]">
            {{ stock.analysis.change_value > 0 ? '+' : '' }}{{ stock.analysis.change_value }}
          </p>
        </div>
      </div>

      <div div class='w-fu ll h-96 flex items-center justify-center flex-col'>
        <LWChart type=" area" :data="data" ref="myChart" :chartOptions='chartOptions' />
        <button class='border p-2 rounded mt-5' type="button" @click="fitContent">Fit Metrics</button>
      </div>
    </div>
    <div>

    </div>

    <!-- Data stock table -->
  </div>
</template>
