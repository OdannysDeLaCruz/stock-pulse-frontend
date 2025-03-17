<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStocksStore } from '@/stores/stocks';
import StockList from '@/components/stocks/StockTableList.vue';
import type { Stock } from '@/types';

const stocksStore = useStocksStore()
const route = useRoute()
const router = useRouter()

const title = computed(() => {
  if (route.params.topic) {
    if (route.params.topic === 'recommended') {
      return 'Most Recommended Stocks'
    }
    if (route.params.topic === 'not-recommended') {
      return 'Not Recommended Stocks'
    }
  }
})

const stocks = ref<Stock[]>([])

async function fetchStocksFromTopic(topic: string) {
  if (topic === 'recommended') {
    await stocksStore.fetchRecommendedStocks()
    stocks.value = stocksStore.recommendedStocks
  }
  if (topic === 'not-recommended') {
    await stocksStore.fetchNotRecommendedStocks()
    stocks.value = stocksStore.notRecommendedStocks
  }
}

watch(() => route.params.topic, (newValue) => {
  if (newValue) {
    fetchStocksFromTopic(newValue as string)
  }
})

onMounted(() => {
  if (route.params.topic) {
    fetchStocksFromTopic(route.params.topic as string)
    return;
  }

  router.push({ path: '/' })
})
</script>
<template>
  <div class="container mx-auto">
    <div class='col-span-8 bg-white rounded-xl shadow-lg p-4 pt-10'>
      <template v-if='stocks.length'>
        <h1 class="text-4xl font-bold mb-8">{{ title }}</h1>
        <StockList :stocks="stocks" />
      </template>
      <template v-else>
        <p class="text-2xl font-bold mb-8 text-center">No se encontró registro</p>
      </template>
    </div>
  </div>
</template>
