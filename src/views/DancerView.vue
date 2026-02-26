<script setup lang="ts">
withDefaults(
  defineProps<{
    nameId?: string
    title?: string
    introText?: string
    hasBorder?: boolean
  }>(),
  {
    hasBorder: true,
  },
)

const getImageUrl = (nameId: string) =>
  new URL(`../assets/imgs/dancers/${nameId}.webp`, import.meta.url).href
</script>

<template>
  <div
    :class="{ 'border-2': hasBorder ?? true }"
    class="border-blue-200 bg-clip-border p-6 rounded-xl"
  >
    <h2 v-if="title" class="text-3xl md:text-4xl font-bold text-blue-900 mb-4">{{ title }}</h2>

    <template v-if="title && nameId">
      <div class="md:hidden">
        <img :src="getImageUrl(nameId)" class="mx-auto mb-4 max-w-xs" />
        <p v-if="introText" class="text-sm text-blue-900 leading-relaxed">{{ introText }}</p>
      </div>

      <div class="hidden md:block">
        <img :src="getImageUrl(nameId)" class="float-right ml-5 mb-3 max-w-[45%]" />
        <p v-if="introText" class="text-sm text-blue-900 leading-relaxed">{{ introText }}</p>
        <div class="clear-both"></div>
      </div>
    </template>

    <template v-else>
      <img v-if="nameId" :src="getImageUrl(nameId)" />
      <div v-else class="text-center p-6 mt-20 text-blue-900 text-2xl font-bold">
        Dancer missing.
      </div>
    </template>
  </div>
</template>
