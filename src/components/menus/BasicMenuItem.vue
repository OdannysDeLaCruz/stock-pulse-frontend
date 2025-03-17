<template>
  <div class="flex justify-center items-center">
    <button class=" hover:text-blue-800 px-4 py-2">
      <RouterLink @click='unSelect' :to="`/stocks?filter=${item.slug}`" class="text-black" :class="isActive ? 'link-active' : ''">
        <span>{{ item.name }}</span>
      </RouterLink>
    </button>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  item: {
    name: string,
    slug: string
  },
  isActive: boolean
}>()

const route = useRoute()
const router = useRouter()

const unSelect = () => {
  if (props.isActive && route.query.filter) {
    router.push({path: '/stocks'})
  }
}
</script>

<style scoped>
.link-active {
  color: #2563eb;
  font-weight: bold;
}
</style>
