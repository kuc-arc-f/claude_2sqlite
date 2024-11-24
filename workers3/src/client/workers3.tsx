// types.ts
import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.string().min(1, "内容は必須です"),
  contentType: z.string().min(1, "コンテンツタイプは必須です"),
  age: z.string().optional(),
  public: z.boolean().optional(),
  foodOrange: z.boolean().optional(),
  foodApple: z.boolean().optional(),
  foodBanana: z.boolean().optional(),
  foodMelon: z.boolean().optional(),
  foodGrape: z.boolean().optional(),
  datePublish: z.string().optional(),
  dateUpdate: z.string().optional(),
  postNumber: z.string().optional(),
  addressCountry: z.string().optional(),
  addressPref: z.string().optional(),
  addressCity: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  textOption1: z.string().optional(),
  textOption2: z.string().optional(),
});

export type Todo = z.infer<typeof todoSchema>;

// TodoDialog.tsx
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
//import { todoSchema, Todo } from './types';

interface TodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Todo) => Promise<void>;
  initialData?: Todo;
  mode: 'create' | 'edit';
}

export function TodoDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}: TodoDialogProps) {
  const [formData, setFormData] = useState<Partial<Todo>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({});
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = todoSchema.parse(formData);
      await onSubmit(validatedData);
      onClose();
    } catch (error) {
        console.error(error);
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'TODO追加' : 'TODO編集'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Required fields with validation */}
            <div className="grid gap-2">
              <Label htmlFor="title">タイトル *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">内容 *</Label>
              <Input
                id="content"
                name="content"
                value={formData.content || ''}
                onChange={handleChange}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contentType">コンテンツタイプ *</Label>
              <Input
                id="contentType"
                name="contentType"
                value={formData.contentType || ''}
                onChange={handleChange}
              />
              {errors.contentType && (
                <p className="text-sm text-red-500">{errors.contentType}</p>
              )}
            </div>

            {/* Optional fields */}
            <div className="grid gap-2">
              <Label htmlFor="age">年齢</Label>
              <Input
                id="age"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label>公開設定</Label>
              <RadioGroup
                name="public"
                value={formData.public ? 'true' : 'false'}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, public: value === 'true' }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="public-true" />
                  <Label htmlFor="public-true">公開</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="public-false" />
                  <Label htmlFor="public-false">非公開</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label>フルーツ選択</Label>
              <div className="flex flex-wrap gap-4">
                {[
                  { name: 'foodOrange', label: 'オレンジ' },
                  { name: 'foodApple', label: 'りんご' },
                  { name: 'foodBanana', label: 'バナナ' },
                  { name: 'foodMelon', label: 'メロン' },
                  { name: 'foodGrape', label: 'ぶどう' },
                ].map(({ name, label }) => (
                  <div key={name} className="flex items-center space-x-2">
                    <Checkbox
                      id={name}
                      name={name}
                      checked={formData[name as keyof Todo] || false}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, [name]: checked }))
                      }
                    />
                    <Label htmlFor={name}>{label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="datePublish">公開日</Label>
                <Input
                  id="datePublish"
                  name="datePublish"
                  type="date"
                  value={formData.datePublish || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dateUpdate">更新日</Label>
                <Input
                  id="dateUpdate"
                  name="dateUpdate"
                  type="date"
                  value={formData.dateUpdate || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="postNumber">郵便番号</Label>
              <Input
                id="postNumber"
                name="postNumber"
                value={formData.postNumber || ''}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-4">
              {[
                { name: 'addressCountry', label: '国' },
                { name: 'addressPref', label: '都道府県' },
                { name: 'addressCity', label: '市区町村' },
                { name: 'address1', label: '住所1' },
                { name: 'address2', label: '住所2' },
              ].map(({ name, label }) => (
                <div key={name} className="grid gap-2">
                  <Label htmlFor={name}>{label}</Label>
                  <Input
                    id={name}
                    name={name}
                    value={formData[name as keyof Todo] || ''}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="textOption1">オプション1</Label>
                <Input
                  id="textOption1"
                  name="textOption1"
                  value={formData.textOption1 || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="textOption2">オプション2</Label>
                <Input
                  id="textOption2"
                  name="textOption2"
                  value={formData.textOption2 || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit">
              {mode === 'create' ? '追加' : '更新'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// TodoList.tsx
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
//import { TodoDialog } from './TodoDialog';
//import { Todo } from './types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Head from '../components/Head'
import ClientUtil from "./lib/ClientUtil";

//const API_URL = 'http://localhost:8787';
let API_URL = '';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');

  const fetchTodos = async () => {
    const response = await fetch(`${API_URL}/api/todo3${searchQuery ? `?search=${searchQuery}` : ''}`);
    const data = await response.json();
    console.log(data);
    setTodos(data);
  };

  useEffect(() => {
    (async() => {
    })();
  }, []);

  useEffect(() => {
    (async() => {
      API_URL = await ClientUtil.getSysApiUrl();
      //console.log("API_URL=", API_URL);
      fetchTodos();
    })();
  }, [searchQuery]);

  const handleCreate = async (data: Todo) => {
    await fetch(`${API_URL}/api/todo3`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    fetchTodos();
  };

  const handleUpdate = async (data: Todo) => {
    if (!selectedTodo?.id) return;
    await fetch(`${API_URL}/api/todo3/${selectedTodo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    fetchTodos();
  };

  const handleDelete = async (id: number) => {
    if (confirm('本当に削除しますか？')) {
      await fetch(`${API_URL}/api/todo3/${id}`, {
        method: 'DELETE',
      });
      fetchTodos();
    }
  };

  const openCreateDialog = () => {
    setSelectedTodo(undefined);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const openEditDialog = (todo: Todo) => {
    setSelectedTodo(todo);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  return (
  <>
    <Head />
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">TODO リスト</h1>
        <Button onClick={openCreateDialog}>新規作成</Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead>内容</TableHead>
            <TableHead>公開状態</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>{todo.title}</TableCell>
              <TableCell>{todo.content}</TableCell>
              <TableCell>{todo.public ? '公開' : '非公開'}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(todo)}
                  >
                    編集
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(todo.id!)}
                  >
                    削除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TodoDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={dialogMode === 'create' ? handleCreate : handleUpdate}
        initialData={selectedTodo}
        mode={dialogMode}
      />
    </div>
  </>

  );
}
