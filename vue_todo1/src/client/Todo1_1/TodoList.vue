<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Todo } from './types';
import type { TodoInput } from './schema';
import TodoDialog from './TodoDialog.vue';
import Test from './Test.vue';

const todos = ref<Todo[]>([]);
const searchQuery = ref('');
const dialog = ref({
  isOpen: false,
  mode: 'create' as const,
  todo: undefined as Todo | undefined,
});
//const editTodo = ref(undefined as Todo | undefined);
const edititem = ref(undefined as Todo | undefined);
const testitem = ref({a: 111});

const fetchTodos = async () => {
  try {
    const response = await fetch(`/api/todos${
      searchQuery.value ? `?search=${encodeURIComponent(searchQuery.value)}` : ''
    }`);
    todos.value = await response.json();
  } catch (error) {
    console.error('Failed to fetch todos:', error);
  }
};

const createTodo = async (todoData: TodoInput) => {
  try {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    });
    if (response.ok) {
      await fetchTodos();
      dialog.value.isOpen = false;
    }
  } catch (error) {
    console.error('Failed to create todo:', error);
  }
};

const updateTodo = async (id: number, todoData: TodoInput) => {
  try {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    });
    if (response.ok) {
      await fetchTodos();
      dialog.value.isOpen = false;
    }
  } catch (error) {
    console.error('Failed to update todo:', error);
  }
};

const deleteTodo = async (id: number) => {
  if (!confirm('本当に削除しますか？')) return;
  
  try {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      await fetchTodos();
    }
  } catch (error) {
    console.error('Failed to delete todo:', error);
  }
};

const openCreateDialog = () => {
  dialog.value = {
    isOpen: true,
    mode: 'create',
    todo: undefined,
  };
};

const openEditDialog = (todo: Todo) => {
console.log("#openEditDialog");
console.log(todo);
/*
  dialog.value = {
    isOpen: true,
    mode: 'edit',
    todo: todo,
  };
*/
  edititem.value = todo;
};

const handleDialogSave = (todoData: TodoInput) => {
  if (dialog.value.mode === 'edit' && dialog.value.todo) {
    updateTodo(dialog.value.todo.id, todoData);
  } else {
    createTodo(todoData);
  }
};

onMounted(fetchTodos);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6 flex justify-between items-center">
      <div class="flex-1 max-w-md">
        <input
          v-model="searchQuery"
          @input="fetchTodos"
          type="text"
          placeholder="TODOを検索..."
          class="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <button
        @click="openCreateDialog"
        class="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        新規作成
      </button>
    </div>

    <div class="bg-white shadow overflow-hidden rounded-lg">
      <ul class="divide-y divide-gray-200">
        <li v-for="todo in todos" :key="todo.id" class="p-4 hover:bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                type="checkbox"
                :checked="todo.completed"
                @change="updateTodo(todo.id, { ...todo, completed: !todo.completed })"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div class="ml-4">
                <h3 class="text-lg font-medium" :class="{ 'line-through': todo.completed }">
                  {{ todo.title }}
                </h3>
                <p v-if="todo.description" class="text-gray-500">{{ todo.description }}</p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                @click="openEditDialog(todo)"
                class="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900"
              >
                編集
              </button>
              <button
                @click="deleteTodo(todo.id)"
                class="px-3 py-1 text-sm text-red-600 hover:text-red-900"
              >
                削除
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <span>edititem {{ JSON.stringify(edititem) }}</span>
    <!--
    -->
    <Test 
    :mode="dialog.mode"
    :param1="1"
    :edititem = "edititem"
    :testitem = "testitem"
    />

    <TodoDialog
      :is-open="dialog.isOpen"
      :mode="dialog.mode"
      :todo="dialog.todo"
      :edititem = "edititem"
      @close="dialog.isOpen = false"
      @save="handleDialogSave"
    />
  </div>
</template>