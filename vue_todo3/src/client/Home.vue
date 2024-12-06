<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="container mx-auto px-6 py-4">
        <h1 class="text-2xl font-bold text-gray-900">Todo App</h1>
      </div>
    </header>
    <TodoList />
  </div>
</template>

<script setup>
import TodoList from './Home/TodoList.vue';
</script>
