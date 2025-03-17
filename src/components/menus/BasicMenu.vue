<template>
  <div class="flex">
    <BasicMenuItem v-for="item in menuItems" :key="item.name" :item="item" :is-active='isActive(item.slug)' />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import BasicMenuItem from './BasicMenuItem.vue'

defineProps<{
  menuItems: {
    name: string,
    slug: string
  }[]
}>()

const route = useRoute()
const filter = ref('')

const isActive = (slug: string) => {
  return filter.value === slug
}

onMounted(() => {
  if (route.query && route.query.filter) {
    filter.value = route.query.filter as string
  }
})

watch(() => route.query, () => {
  if (route.query && route.query.filter) {
    filter.value = route.query.filter as string
  } else {
    filter.value = ''
  }
})
</script>
