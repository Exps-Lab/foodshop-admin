<template>
  <h1>login page</h1>
  <h1>{{counter}}</h1>
</template>

<script setup>
import { testStore } from '@store/index.js'
import { storeToRefs } from 'pinia'
const store = testStore()
const { counter } = storeToRefs(store)
</script>

<style lang="less">
</style>
