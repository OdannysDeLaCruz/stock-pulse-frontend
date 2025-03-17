import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchData } from '@/utils/apiClient.ts'
import type { Stock, StockPartialWebsocketResponse } from '@/types'
import { connectWebSocket, disconnectWebSocket } from '@/api/websocket'

export const useStocksStore = defineStore(
  'stocks',
  () => {
    const stocks = ref<Stock[]>([])
    const recommendedStocks = ref<Stock[]>([])
    const notRecommendedStocks = ref<Stock[]>([])
    const loading = ref(false)
    const error = ref(null)

    // Get all stocks
    async function fetchStocks() {
      loading.value = true
      error.value = null
      try {
        const data = await fetchData<Stock[]>('/stocks')
        stocks.value = data || []
      } catch (err: any) {
        error.value = err.message || 'Error fetching stocks'
      } finally {
        loading.value = false
      }
    }

    async function fetchRecommendedStocks() {
      loading.value = true
      error.value = null
      try {
        const data = await fetchData<Stock[]>('/stocks/recommendations')
        recommendedStocks.value = data || []
      } catch (err: any) {
        error.value = err.message || 'Error fetching recommended stocks'
      } finally {
        loading.value = false
      }
    }

    async function fetchNotRecommendedStocks() {
      loading.value = true
      error.value = null
      try {
        const data = await fetchData<Stock[]>('/stocks/not-recommended')
        notRecommendedStocks.value = data || []
      } catch (err: any) {
        error.value = err.message || 'Error fetching not recommended stocks'
      } finally {
        loading.value = false
      }
    }

    async function fetchStockBySymbol(ticker: string) {
      loading.value = true
      error.value = null
      try {
        const data = await fetchData(`/stocks/${ticker}`)
        return data
      } catch (err: any) {
        error.value = err.message || 'Error fetching stock'
        return null
      } finally {
        loading.value = false
      }
    }

    // Sort stocks by current price
    const sortedStocks = computed(() => {
      return [...stocks.value].sort((a: Stock, b: Stock) => b.target_to - a.target_to)
    })

    const setStock = (data: StockPartialWebsocketResponse) => {
      const stock = stocks.value.find((stock) => stock.ticker === data.ticker)
      if (stock) {
        stock.target_from = data.target_from
        stock.target_to = data.target_to
        stock.rating_from = data.rating_from
        stock.rating_to = data.rating_to
        stock.price_history.push(data.new_item_price_history)
        stock.analysis.change_percentage = data.analysis.change_percentage
        stock.analysis.change_value = data.analysis.change_value
      }
    }

    const subscribeToStock = (stockTicker: string) => {
      console.log(`Subscribiendo al WebSocket para stock ${stockTicker}`)
      connectWebSocket(stockTicker, setStock)
    }

    const unsubscribeFromStock = () => {
      disconnectWebSocket()
    }

    return {
      stocks,
      recommendedStocks,
      notRecommendedStocks,
      loading,
      error,
      fetchStocks,
      fetchRecommendedStocks,
      fetchNotRecommendedStocks,
      fetchStockBySymbol,
      sortedStocks,
      subscribeToStock,
      unsubscribeFromStock
    }
  },
  {
    persist: true,
  },
)
