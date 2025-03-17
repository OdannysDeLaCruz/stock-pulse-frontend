<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStocksStore } from '@/stores/stocks'
import { useMenusFilterStockStore } from '@/stores/menusFilterStock'

import StockList from '@/components/stocks/StockTableList.vue'
import StockHorizontal from '@/components/stocks/stock-vertical/StockListVertical.vue'
import BasicMenu from '@/components/menus/BasicMenu.vue'
import StockSearch from '@/components/InputSearch.vue'

const stocksStore = useStocksStore()
const menusFilterStock = useMenusFilterStockStore()

const searchQuery = ref('')

onMounted(() => {
  stocksStore.fetchStocks()
  stocksStore.fetchRecommendedStocks()
  stocksStore.fetchNotRecommendedStocks()
})

const handlerClear = () => {
  searchQuery.value = ''
}

const handleSearch = (query: string) => {
  searchQuery.value = query
}

// Computed property para filtrar los stocks
const filteredStocks = computed(() => {
  if (!searchQuery.value) return stocksStore.stocks

  const query = searchQuery.value.toLowerCase()
  return stocksStore.stocks.filter(stock =>
    stock.ticker.toLowerCase().includes(query) ||
    stock.company.toLowerCase().includes(query)
  )
})
</script>
<template>
  <div class="container mx-auto">
    <div class='grid grid-cols-12 gap-4'>
      <div class='col-span-9 bg-white rounded-xl shadow-lg p-4 pt-10'>
        <h1 class="text-4xl font-bold mb-8">Stock Overview</h1>

        <StockSearch v-model='searchQuery' @search="handleSearch" @clear="handlerClear" />

        <BasicMenu class='mb-8' :menuItems="menusFilterStock.items" />

        <StockList :stocks="filteredStocks" />
      </div>
      <!-- side -->
      <div class='col-span-3 bg-white rounded-xl shadow-lg h-screen'>
        <!-- Recommended stocks -->
        <div class="bg-white rounded-xl mb-6" v-if='stocksStore.recommendedStocks.length'>
          <h2 class="text-lg font-bold mb-4 p-4">Recommendations for today</h2>
          <StockHorizontal v-for="stock in stocksStore.recommendedStocks" :key="stock.id" :stock="stock" />
        </div>
        <!-- No recommended stocks -->
        <div class="bg-white rounded-xl shadow-lg p-4" v-if='stocksStore.notRecommendedStocks.length'>
          <h2 class="text-lg font-bold">No recommended stocks</h2>
          <StockHorizontal v-for="stock in stocksStore.notRecommendedStocks" :key="stock.id" :stock="stock" />
        </div>
      </div>
    </div>

  </div>
</template>
