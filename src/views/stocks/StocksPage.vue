<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useStocksStore } from '@/stores/stocks'
import { useMenusFilterStockStore } from '@/stores/menusFilterStock'

import StockTableList from '@/components/stocks/StockTableList.vue'
import StockHorizontal from '@/components/stocks/stock-vertical/StockListVertical.vue'
import BasicMenu from '@/components/menus/BasicMenu.vue'
import StockSearch from '@/components/InputSearch.vue'
import type { Stock } from '@/types'

const stocksStore = useStocksStore()
const menusFilterStock = useMenusFilterStockStore()

const searchQuery = ref('')
const filteredStocks = ref<Stock[]>([])

onMounted(async () => {
  await stocksStore.fetchStocks()
  await stocksStore.fetchRecommendedStocks()
  await stocksStore.fetchNotRecommendedStocks()

  filteredStocks.value = stocksStore.stocks
})

const fetchMoreStocks = async (page: number) => {
  await stocksStore.fetchStocks(page)
  filteredStocks.value = stocksStore.stocks
}

const handlerClear = () => {
  searchQuery.value = ''
}

const handleSearch = (query: string) => {
  searchQuery.value = query
}

// Watcher para buscar stocks
watch(searchQuery, async (newValue) => {
  if (newValue) {
    const query = newValue.toLowerCase()

    filteredStocks.value = stocksStore.stocks.filter(stock =>
      stock.ticker.toLowerCase().includes(query) ||
      stock.company.toLowerCase().includes(query)
    )

    if (filteredStocks.value.length) {
      return filteredStocks
    } else {
      // Si no hay resultados, realizar una búsqueda en la API
      const queryResponse = await stocksStore.searchStock(query)
      console.log(queryResponse)

      if (queryResponse) {
        filteredStocks.value = queryResponse
        queryResponse.forEach(stock => {
          stocksStore.setStock(stock)
        })
      }
    }
  } else {
    filteredStocks.value = stocksStore.stocks
  }
})
</script>
<template>
  <div class="container mx-auto">
    <div class='grid grid-cols-12 gap-4'>
      <div class='col-span-9 bg-white rounded-xl shadow-lg p-4 pt-10'>
        <h1 class="text-4xl font-bold mb-8">Stock Overview</h1>

        <StockSearch v-model='searchQuery' @search="handleSearch" @clear="handlerClear" />

        <BasicMenu class='mb-8' :menuItems="menusFilterStock.items" />

        <StockTableList :stocks="filteredStocks" />

        <!-- Paginator -->
        <div class="w-full flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div class="w-full flex flex-1 justify-between">
            <a href="#"
              v-if='stocksStore.page > 1'
              @click='fetchMoreStocks(stocksStore.page - 1)'
              class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Anterior
            </a>
            <a href="#"
              class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              {{ stocksStore.page }} </a>
            <a href="#"
              @click='fetchMoreStocks(stocksStore.page + 1)'
              class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Siguiente
            </a>
          </div>
        </div>
      </div>
      <!-- side -->
      <div class='col-span-3 bg-white rounded-xl shadow-lg h-screen'>
        <template v-if='stocksStore.recommendedStocks.length || stocksStore.notRecommendedStocks.length'>
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
        </template>
        <template v-else>
          <div class="bg-gray-100 rounded-xl h-[100px] flex items-center justify-center p-4 m-5">
            Nada que ver por aquí.
          </div>
        </template>
      </div>
    </div>

  </div>
</template>
