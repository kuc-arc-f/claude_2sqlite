
// src/App.vue
<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">TODO アプリケーション</h1>
    
    <!-- 検索フォーム -->
    <div class="mb-6">
      <input
        type="text"
        v-model="searchQuery"
        @input="searchTodos"
        placeholder="タイトルで検索..."
        class="w-full p-2 border rounded"
      >
    </div>

    <!-- TODOリスト -->
    <div class="grid gap-4 mb-6">
      <div v-for="todo in todos" :key="todo.id" class="p-4 border rounded bg-white shadow">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">{{ todo.title }}</h2>
          <div>
            <button
              @click="openEditDialog(todo)"
              class="bg-blue-500 text-white px-3 py-1 rounded mr-2"
            >
              編集
            </button>
            <button
              @click="deleteTodo(todo.id)"
              class="bg-red-500 text-white px-3 py-1 rounded"
            >
              削除
            </button>
          </div>
        </div>
        <p class="mt-2">{{ todo.content }}</p>
        <div class="mt-2 grid grid-cols-2 gap-4">
          <div>
            <p>公開状態: {{ todo.public ? '公開' : '非公開' }}</p>
            <p>公開日: {{ todo.pub_date }}</p>
          </div>
          <div>
            <p>選択した食べ物:</p>
            <ul class="list-disc list-inside">
              <li v-if="todo.food_orange">オレンジ</li>
              <li v-if="todo.food_apple">りんご</li>
              <li v-if="todo.food_banana">バナナ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 新規追加ボタン -->
    <button
      @click="openAddDialog"
      class="bg-green-500 text-white px-4 py-2 rounded fixed bottom-8 right-8"
    >
      新規追加
    </button>

    <!-- TODO追加/編集ダイアログ -->
    <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h2 class="text-2xl font-bold mb-4">
          {{ isEditing ? 'TODO編集' : '新規TODO追加' }}
        </h2>
        
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block mb-1">タイトル</label>
            <input
              type="text"
              v-model="formData.title"
              class="w-full p-2 border rounded"
              :class="{ 'border-red-500': errors.title }"
            >
            <p v-if="errors.title" class="text-red-500 text-sm mt-1">
              {{ errors.title }}
            </p>
          </div>

          <div>
            <label class="block mb-1">内容</label>
            <input
              type="text"
              v-model="formData.content"
              class="w-full p-2 border rounded"
              :class="{ 'border-red-500': errors.content }"
            >
            <p v-if="errors.content" class="text-red-500 text-sm mt-1">
              {{ errors.content }}
            </p>
          </div>

          <div>
            <label class="block mb-1">公開設定</label>
            <div class="space-x-4">
              <label>
                <input
                  type="radio"
                  v-model="formData.public"
                  :value="true"
                > 公開
              </label>
              <label>
                <input
                  type="radio"
                  v-model="formData.public"
                  :value="false"
                > 非公開
              </label>
            </div>
          </div>

          <div>
            <label class="block mb-1">好きな食べ物</label>
            <div class="space-x-4">
              <label>
                <input
                  type="checkbox"
                  v-model="formData.food_orange"
                > オレンジ
              </label>
              <label>
                <input
                  type="checkbox"
                  v-model="formData.food_apple"
                > りんご
              </label>
              <label>
                <input
                  type="checkbox"
                  v-model="formData.food_banana"
                > バナナ
              </label>
            </div>
          </div>

          <div>
            <label class="block mb-1">公開日</label>
            <input
              type="date"
              v-model="formData.pub_date"
              class="w-full p-2 border rounded"
            >
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block mb-1">数量1</label>
              <input
                type="text"
                v-model="formData.qty1"
                class="w-full p-2 border rounded"
              >
            </div>
            <div>
              <label class="block mb-1">数量2</label>
              <input
                type="text"
                v-model="formData.qty2"
                class="w-full p-2 border rounded"
              >
            </div>
            <div>
              <label class="block mb-1">数量3</label>
              <input
                type="text"
                v-model="formData.qty3"
                class="w-full p-2 border rounded"
              >
            </div>
          </div>

          <div class="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              @click="closeDialog"
              class="px-4 py-2 border rounded"
            >
              キャンセル
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {{ isEditing ? '更新' : '追加' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { z } from 'zod';

// バリデーションスキーマの定義
const todoSchema = z.object({
  title: z.string().min(1, { message: 'タイトルは必須です' }),
  content: z.string().min(1, { message: '内容は必須です' }),
  public: z.boolean(),
  food_orange: z.boolean(),
  food_apple: z.boolean(),
  food_banana: z.boolean(),
  pub_date: z.string(),
  qty1: z.string(),
  qty2: z.string(),
  qty3: z.string(),
});

// APIのベースURL
//const API_BASE_URL = 'http://localhost:3000/api';
const API_BASE_URL = '/api';

// 状態管理
const todos = ref([]);
const showDialog = ref(false);
const isEditing = ref(false);
const currentTodoId = ref(null);
const searchQuery = ref('');
const errors = ref({});

// フォームデータの初期値
const initialFormData = {
  title: '',
  content: '',
  public: false,
  food_orange: false,
  food_apple: false,
  food_banana: false,
  pub_date: '',
  qty1: '',
  qty2: '',
  qty3: '',
};

const formData = ref({ ...initialFormData });

// TODO一覧の取得
const fetchTodos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/todos`);
    todos.value = response.data;
  } catch (error) {
    console.error('TODOの取得に失敗しました:', error);
  }
};

// 検索機能
const searchTodos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/todos`, {
      params: { search: searchQuery.value }
    });
    todos.value = response.data;
  } catch (error) {
    console.error('検索に失敗しました:', error);
  }
};

// フォーム送信時のバリデーション
const validateForm = () => {
  try {
    todoSchema.parse(formData.value);
    errors.value = {};
    return true;
  } catch (error) {
    errors.value = error.errors.reduce((acc, curr) => {
      acc[curr.path[0]] = curr.message;
      return acc;
    }, {});
    return false;
  }
};

// フォームの送信
const submitForm = async () => {
  if (!validateForm()) return;

  try {
    if (isEditing.value) {
      await axios.put(`${API_BASE_URL}/todos/${currentTodoId.value}`, formData.value);
    } else {
      await axios.post(`${API_BASE_URL}/todos`, formData.value);
    }
    await fetchTodos();
    closeDialog();
  } catch (error) {
    console.error('送信に失敗しました:', error);
  }
};

// TODOの削除
const deleteTodo = async (id) => {
  if (!confirm('本当に削除しますか？')) return;
  
  try {
    await axios.delete(`${API_BASE_URL}/todos/${id}`);
    await fetchTodos();
  } catch (error) {
    console.error('削除に失敗しました:', error);
  }
};

// ダイアログを開く（新規追加）
const openAddDialog = () => {
  isEditing.value = false;
  currentTodoId.value = null;
  formData.value = { ...initialFormData };
  showDialog.value = true;
};

// ダイアログを開く（編集）
const openEditDialog = (todo) => {
  isEditing.value = true;
  currentTodoId.value = todo.id;
  formData.value = { ...todo };
  showDialog.value = true;
};

// ダイアログを閉じる
const closeDialog = () => {
  showDialog.value = false;
  errors.value = {};
};

// 初期データの取得
onMounted(fetchTodos);
</script>