import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenusFilterStockStore = defineStore(
  'menusFilterStock',
  () => {
    const items = ref([
      {
        name: 'Most Active',
        slug: 'most-active',
      },
      {
        name: 'Trending Now',
        slug: 'trending-now',
      },
      {
        name: 'Top Gainers',
        slug: 'top-gainers',
      },
      {
        name: 'Top Losers',
        slug: 'top-losers',
      },
    ])

    return {
      items,
    }
  },
  {
    persist: true,
  },
)
