<template>
  <div class="relative w-full overflow-hidden bg-gray-800 py-4">
    <div class="stock-ticker" :style="{ '--duration': `${stocksStore.stocks.length * 9}s` }">
      <div class="ticker-content flex">
        <StockCarouselItem v-for="stock in duplicatedStocks" :key="stock.ticker" :stock="stock" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import StockCarouselItem from './StockCarouselItem.vue'
import { useStocksStore } from '@/stores/stocks'

const stocksStore = useStocksStore()

// Duplicar los stocks para crear el efecto infinito
const duplicatedStocks = computed(() => [...stocksStore.stocks, ...stocksStore.stocks])
</script>

<style scoped>
.stock-ticker {
  display: flex;
  width: fit-content;
  animation: ticker var(--duration) linear infinite;
  cursor: pointer;
}

.ticker-content {
  white-space: nowrap;
}

@keyframes ticker {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

/* Pausar la animación al hacer hover */
.stock-ticker:hover {
  animation-play-state: paused;
}
</style>
