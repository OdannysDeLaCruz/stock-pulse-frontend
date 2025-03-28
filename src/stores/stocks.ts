import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchData } from '@/utils/apiClient.ts'
import type { Stock, StockPartialWebsocketResponse } from '@/types'
import { connectWebSocket, disconnectWebSocket } from '@/api/websocket'

export const useStocksStore = defineStore(
  'stocks',
  () => {
    const page = ref(1)
    const nextPage = ref(1)
    const totalItems = ref(0)
    const limit = ref(15)

    const stocks = ref<Stock[]>([])
    const recommendedStocks = ref<Stock[]>([])
    const notRecommendedStocks = ref<Stock[]>([])
    const loading = ref(false)
    const error = ref(null)

    // Get all stocks
    async function fetchStocks(_page: number = page.value, _limit: number = limit.value) {
      loading.value = true
      error.value = null
      try {
        const data = await fetchData<{ results: Stock[], current: number, count: number, next: number }>(`/stocks?page=${_page}&limit=${_limit}`)
        stocks.value = data.results || []
        page.value = data.current
        nextPage.value = data.next
        totalItems.value = data.count
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

    async function fetchStockBySymbol(ticker: string): Promise<Stock | null> {
      loading.value = true
      error.value = null
      try {
        const data = await fetchData<Stock>(`/stocks/${ticker}`)
        return data
      } catch (err: any) {
        error.value = err.message || 'Error fetching stock'
        return null
      } finally {
        loading.value = false
      }
    }

    async function searchStock(query: string) {
      loading.value = true
      error.value = null
      try {
        const data = await fetchData<Stock[]>(`/stocks/search?q=${query}`)
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

    const setStockWebsocket = (data: StockPartialWebsocketResponse) => {
      const stock = stocks.value.find((stock) => stock.ticker === data.ticker)
      if (stock) {
        stock.target_from = data.target_from
        stock.target_to = data.target_to
        stock.rating_from = data.rating_from
        stock.rating_to = data.rating_to
        stock.price_history.push(data?.new_item_price_history)
        stock.analysis.change_percentage = data.analysis.change_percentage
        stock.analysis.change_value = data.analysis.change_value
      }
    }

    const setStock = (data: Stock) => {
        stocks.value.push(data)
    }

    const subscribeToStock = (stockTicker: string) => {
      console.log(`Subscribiendo al WebSocket para stock ${stockTicker}`)
      connectWebSocket(stockTicker, setStockWebsocket)
    }

    const unsubscribeFromStock = () => {
      disconnectWebSocket()
    }

    return {
      page,
      nextPage,
      totalItems,
      limit,
      stocks,
      recommendedStocks,
      notRecommendedStocks,
      loading,
      error,
      fetchStocks,
      fetchRecommendedStocks,
      fetchNotRecommendedStocks,
      fetchStockBySymbol,
      setStock,
      sortedStocks,
      subscribeToStock,
      unsubscribeFromStock,
      searchStock,
    }
  },
  {
    // persist: true,
  },
)
