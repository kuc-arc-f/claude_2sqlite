<script setup lang="ts">
import { ref , defineProps } from 'vue';
import { todoSchema, type TodoInput } from './schema';
import type { Todo } from './types';

const props = defineProps(['rowitem', 'rowid', 'mode'])

console.log(props.rowitem)
//console.log("id=", props.rowitem?.id);
console.log("id=", props.rowid);
console.log("mode=", props.mode);

const emit = defineEmits<{
  'close': [];
  'save': [todo: TodoInput];
}>();
console.log("#Test");
console.log(props);

let dialogName = ref('dialog_create');
if(props.mode === "edit"){
  dialogName.value = 'dialog_edit_' + props.rowid;
}
const errors = ref<Record<string, string>>({});
const formData = ref<TodoInput>({
  title: props.rowitem?.title ?? '',
  description: props.rowitem?.description ?? '',
  completed: props.rowitem?.completed ?? false,
});

const ediClose = function(){
  //dialogName.value
  //const modalDialog = document.getElementById('dialog_edit_' + props.rowid);
  const modalDialog = document.getElementById(dialogName.value);
  if(modalDialog) { modalDialog.close();}
}
const validateAndSave = () => {
  try {
    console.log(formData);
    const validatedData = todoSchema.parse(formData.value);
    emit('save', validatedData);
    errors.value = {};
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      errors.value = error.formErrors.fieldErrors;
    }
  }
};
</script>

<template>
  <!-- v-bind:id="'dialog_edit_' + rowid" -->
  
  <dialog v-bind:id="dialogName"
    class="bg-white rounded-lg p-6 w-full max-w-md">
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
        <hr class="my-2"/>
        <button type="button" @click="ediClose">[ close ]</button>
        <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
          保存
        </button>      
      </form>
  </dialog>

</template>
<!--
id= {{ props.rowid }}
title = {{ props.todo?.title }}
-->
