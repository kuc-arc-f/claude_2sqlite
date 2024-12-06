<template>
  <!-- v-if="show" -->
  <div  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h2 class="text-xl font-bold mb-4">{{ isEdit ? 'Edit Todo' : 'Add Todo' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Title</label>
          <input 
            type="text" 
            v-model="form.title"
            class="w-full border rounded-md p-2"
            :class="{ 'border-red-500': errors.title }"
          />
          <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Content</label>
          <textarea 
            v-model="form.content"
            class="w-full border rounded-md p-2"
            :class="{ 'border-red-500': errors.content }"
          ></textarea>
          <p v-if="errors.content" class="text-red-500 text-sm mt-1">{{ errors.content }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Content Type</label>
          <input type="text" v-model="form.content_type" class="w-full border rounded-md p-2" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium">Public</label>
          <div class="space-x-4">
            <label class="inline-flex items-center">
              <input type="radio" v-model="form.public" :value="1" class="mr-2" />
              <span>Public</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" v-model="form.public" :value="0" class="mr-2" />
              <span>Private</span>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div v-for="(fruit, key) in fruits" :key="key">
            <label class="inline-flex items-center">
              <input 
                type="checkbox" 
                v-model="form[`food_${fruit}`]"
                class="mr-2"
              />
              <span class="capitalize">{{ fruit }}</span>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div v-for="n in 6" :key="`${n}`">
            <label class="block text-sm font-medium mb-1">Date {{ n }}</label>
            <input 
              type="date" 
              v-model="form[`pub_date${n}`]"
              class="w-full border rounded-md p-2"
            />
          </div>
        </div>        

        <div class="grid grid-cols-2 gap-4">
          <div v-for="n in 6" :key="`qty${n}`">
            <label class="block text-sm font-medium mb-1">Quantity {{ n }}</label>
            <input 
              type="text" 
              v-model="form[`qty${n}`]"
              class="w-full border rounded-md p-2"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-2">
          <button 
            type="button"
            @click="closeDialog"
            class="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {{ isEdit ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { z } from 'zod';

const props = defineProps({
  show: Boolean,
  isEdit: Boolean,
  todoData: {
    type: Object,
    default: () => ({})
  },
  itemdata: {
    type: Object,
    default: () => ({})
  },
  idname: String,
});
console.log(props);

const emit = defineEmits(['close', 'submit']);

const fruits = ['orange', 'apple', 'banana', 'melon', 'grape'];

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  content_type: z.string(),
  public: z.number(),
  food_orange: z.boolean(),
  food_apple: z.boolean(),
  food_banana: z.boolean(),
  food_melon: z.boolean(),
  food_grape: z.boolean(),
  pub_date1: z.string().optional(),
  pub_date2: z.string().optional(),
  pub_date3: z.string().optional(),
  pub_date4: z.string().optional(),
  pub_date5: z.string().optional(),
  pub_date6: z.string().optional(),
  qty1: z.string().optional(),
  qty2: z.string().optional(),
  qty3: z.string().optional(),
  qty4: z.string().optional(),
  qty5: z.string().optional(),
  qty6: z.string().optional(),
});

const form = reactive({
  title: '',
  content: '',
  content_type: '',
  public: 1,
  food_orange: false,
  food_apple: false,
  food_banana: false,
  food_melon: false,
  food_grape: false,
  pub_date1: '',
  pub_date2: '',
  pub_date3: '',
  pub_date4: '',
  pub_date5: '',
  pub_date6: '',
  qty1: '',
  qty2: '',
  qty3: '',
  qty4: '',
  qty5: '',
  qty6: '',
});

const errors = reactive({});

const closeDialog = () => {
  console.log("#closeDialog.isEdit=", props.isEdit);
  console.log("idname=", props.idname);
  const modalDialog = document.getElementById(props.idname);
  if(modalDialog) { modalDialog.close(); }
  //emit('close');
  resetForm();
};

const resetForm = () => {
  Object.assign(form, {
    title: '',
    content: '',
    content_type: '',
    public: 1,
    food_orange: false,
    food_apple: false,
    food_banana: false,
    food_melon: false,
    food_grape: false,
    pub_date1: '',
    pub_date2: '',
    pub_date3: '',
    pub_date4: '',
    pub_date5: '',
    pub_date6: '',
    qty1: '',
    qty2: '',
    qty3: '',
    qty4: '',
    qty5: '',
    qty6: '',
  });
  Object.keys(errors).forEach(key => delete errors[key]);
};

const handleSubmit = () => {
  try {
console.log("#handleSubmit");
console.log(form);
    schema.parse(form);
    emit('submit', { ...form });
    closeDialog();
  } catch (err) {
    console.error(err);
    const zodErrors = err.errors || [];
    zodErrors.forEach(error => {
      errors[error.path[0]] = error.message;
    });
  }
};

if (props.todoData && props.isEdit) {
  Object.assign(form, props.todoData);
  console.log(form);
}
console.log("#todoData");
console.log(props.todoData);
</script>