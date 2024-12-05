<script setup lang="ts">
import TodoList from './Home/TodoList.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4">
        <h1 class="text-3xl font-bold text-gray-900">TODOアプリ</h1>
      </div>
    </header>
    <main>
      <TodoList />
    </main>
  </div>
</template>
