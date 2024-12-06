<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <input 
          type="text"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Search todos..."
          class="border rounded-md p-2"
        />
      </div>
      <button 
        @click="openAddDialog"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add Todo
      </button>
    </div>

    <div class="space-y-4">
      <div v-for="todo in todos" :key="todo.id" class="border rounded-lg p-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold">{{ todo.title }}</h3>
            <p class="text-gray-600">{{ todo.content }}</p>
            <div class="mt-2 space-x-2">
              <span class="text-sm text-gray-500">Type: {{ todo.content_type }}</span>
              <span class="text-sm text-gray-500">Public: {{ todo.public ? 'Yes' : 'No' }}</span>
            </div>
          </div>
          <div class="space-x-2">
            <dialog v-bind:id="'dialog_edit_' + todo.id"
            class="bg-white rounded-lg p-6 w-full max-w-md">
            <TodoDialog
              :show="showDialog"
              :is-edit="true"
              :todo-data="todo"
              :itemdata="selectedTodo"
              :idname="'dialog_edit_' + todo.id"
              @close="closeDialog"
              @submit="handleSubmit"
            />
            </dialog>
            <button 
              @click="editTodo(todo)"
              class="px-3 py-1 text-sm border rounded hover:bg-gray-100"
            >
              Edit
            </button>
            <button 
              @click="deleteTodo(todo.id)"
              class="px-3 py-1 text-sm text-red-600 border rounded hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <dialog id="dialog_create"
      class="bg-white rounded-lg p-6 w-full max-w-md">
      <TodoDialog
        :show="showDialog"
        :is-edit="isEdit"
        :todo-data="selectedTodo"
        :itemdata="selectedTodo"
        idname="dialog_create"
        @close="closeDialog"
        @submit="handleSubmit"
      />
    </dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TodoDialog from './TodoDialog.vue';

const todos = ref([]);
const showDialog = ref(false);
const isEdit = ref(false);
const selectedTodo = ref(null);
const searchQuery = ref('');

const fetchTodos = async (search = '') => {
  try {
    const queryParams = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await fetch(`http://localhost:3000/api/todos${queryParams}`);
    const data = await response.json();
    todos.value = data;
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
};

const handleSearch = () => {
  fetchTodos(searchQuery.value);
};

const openAddDialog = () => {
  isEdit.value = false;
  selectedTodo.value = null;
  //showDialog.value = true;
  const modalDialog = document.getElementById("dialog_create");
  if(modalDialog) { modalDialog.showModal(); }
};

const editTodo = (todo) => {
  console.log("#openEditDialog=", todo.id);
  console.log(JSON.stringify(todo));
  isEdit.value = true;
  selectedTodo.value = todo;
  //showDialog.value = true;
  const modalDialog = document.getElementById("dialog_edit_" + todo.id);
  if(modalDialog) { modalDialog.showModal(); }
};

const closeDialog = () => {
  showDialog.value = false;
  selectedTodo.value = null;
};

const handleSubmit = async (formData) => {
  try {
    const url = isEdit.value 
      ? `http://localhost:3000/api/todos/${selectedTodo.value.id}`
      : 'http://localhost:3000/api/todos';
    
    const method = isEdit.value ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      fetchTodos(searchQuery.value);
    }
  } catch (error) {
    console.error('Error saving todo:', error);
  }
};

const deleteTodo = async (id) => {
  if (!confirm('Are you sure you want to delete this todo?')) return;
  
  try {
    const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      fetchTodos(searchQuery.value);
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};

onMounted(() => {
  fetchTodos();
});
</script>