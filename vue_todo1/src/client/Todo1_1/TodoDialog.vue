<script setup lang="ts">
import { ref } from 'vue';
import { todoSchema, type TodoInput } from './schema';
import type { Todo } from './types';

const props = defineProps<{
  isOpen: boolean;
  todo?: Todo;
  mode: 'create' | 'edit';
  edititem?: string;
}>();
console.log("#TodoDialog");
console.log(props);
console.log(props.edititem);

const emit = defineEmits<{
  'close': [];
  'save': [todo: TodoInput];
}>();

const errors = ref<Record<string, string>>({});
const formData = ref<TodoInput>({
  title: props.todo?.title ?? '',
  description: props.todo?.description ?? '',
  completed: props.todo?.completed ?? false,
});

const validateAndSave = () => {
  try {
    const validatedData = todoSchema.parse(formData.value);
    emit('save', validatedData);
    errors.value = {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value = error.formErrors.fieldErrors;
    }
  }
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">
        {{ mode === 'create' ? 'TODOの追加' : 'TODOの編集' }}
      </h2>
      
      <form @submit.prevent="validateAndSave" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">タイトル</label>
          <input
            v-model="formData.title"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">説明</label>
          <textarea
            v-model="formData.description"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          ></textarea>
        </div>
        
        <div class="flex items-center">
          <input
            v-model="formData.completed"
            type="checkbox"
            class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label class="ml-2 text-sm text-gray-700">完了</label>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  </div>
</template>