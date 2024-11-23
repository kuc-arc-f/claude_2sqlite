// TodoSchema.ts
import { z } from "zod";

export const TodoSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.string().min(1, "内容は必須です"),
  public: z.boolean(),
  foodOrange: z.boolean(),
  foodApple: z.boolean(),
  foodBanana: z.boolean(),
  pubDate: z.string(),
  qty1: z.string(),
  qty2: z.string(),
  qty3: z.string(),
});

export type TodoType = z.infer<typeof TodoSchema>;

// TodoDialog.tsx
import React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
//import { TodoSchema, TodoType } from './TodoSchema';

interface TodoDialogProps {
  mode: 'create' | 'edit';
  todo?: TodoType;
  onSubmit: (data: TodoType) => void;
  trigger?: React.ReactNode;
}

export function TodoDialog({ mode, todo, onSubmit, trigger }: TodoDialogProps) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<TodoType>(() => ({
    title: todo?.title ?? '',
    content: todo?.content ?? '',
    public: todo?.public ?? false,
    foodOrange: todo?.foodOrange ?? false,
    foodApple: todo?.foodApple ?? false,
    foodBanana: todo?.foodBanana ?? false,
    pubDate: todo?.pubDate ?? new Date().toISOString().split('T')[0],
    qty1: todo?.qty1 ?? '',
    qty2: todo?.qty2 ?? '',
    qty3: todo?.qty3 ?? '',
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log("#handleSubmit");
      const validatedData = TodoSchema.parse(formData);
      onSubmit(validatedData);
      setErrors({});
      setOpen(false);
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        const errorMap: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errorMap[err.path[0].toString()] = err.message;
          }
        });
        setErrors(errorMap);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">{mode === 'create' ? '新規作成' : '編集'}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'TODO 新規作成' : 'TODO 編集'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">内容</Label>
            <Input
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={errors.content ? "border-red-500" : ""}
            />
            {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
          </div>

          <div className="space-y-2">
            <Label>公開設定</Label>
            <RadioGroup
              name="public"
              value={formData.public.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, public: value === "true" }))}
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

          <div className="space-y-2">
            <Label>食べ物</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="foodOrange"
                  name="foodOrange"
                  checked={formData.foodOrange}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, foodOrange: checked === true }))
                  }
                />
                <Label htmlFor="foodOrange">オレンジ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="foodApple"
                  name="foodApple"
                  checked={formData.foodApple}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, foodApple: checked === true }))
                  }
                />
                <Label htmlFor="foodApple">りんご</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="foodBanana"
                  name="foodBanana"
                  checked={formData.foodBanana}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, foodBanana: checked === true }))
                  }
                />
                <Label htmlFor="foodBanana">バナナ</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pubDate">公開日</Label>
            <Input
              type="date"
              id="pubDate"
              name="pubDate"
              value={formData.pubDate}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qty1">数量1</Label>
              <Input
                type="text"
                id="qty1"
                name="qty1"
                value={formData.qty1}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qty2">数量2</Label>
              <Input
                type="text"
                id="qty2"
                name="qty2"
                value={formData.qty2}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qty3">数量3</Label>
              <Input
                type="text"
                id="qty3"
                name="qty3"
                value={formData.qty3}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            {mode === 'create' ? '作成' : '更新'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// TodoList.tsx
import { useState } from 'react';
//import { TodoType } from './TodoSchema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
//import { TodoDialog } from './TodoDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const API_URL = "http://localhost:8787";
//
export function TodoList() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreate = async (data: TodoType) => {
    try {
      const response = await fetch(API_URL + '/api/todo2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Create failed');
      const newTodo = await response.json();
      setTodos(prev => [newTodo, ...prev]);
    } catch (error) {
      console.error('Create error:', error);
    }
  };

  const handleUpdate = async (id: number, data: TodoType) => {
    try {
      const response = await fetch(`${API_URL}/api/todo2/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Update failed');
      const updatedTodo = await response.json();
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/todo2/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Delete failed');
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${API_URL}/api/todo2/search?q=${searchTerm}`);
      if (!response.ok) throw new Error('Search failed');
      const searchResults = await response.json();
      setTodos(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Input
            placeholder="検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleSearch}>検索</Button>
        </div>
        <TodoDialog mode="create" onSubmit={handleCreate} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead>内容</TableHead>
            <TableHead>公開設定</TableHead>
            <TableHead>食べ物</TableHead>
            <TableHead>公開日</TableHead>
            <TableHead>数量</TableHead>
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
                {[
                  todo.foodOrange && 'オレンジ',
                  todo.foodApple && 'りんご',
                  todo.foodBanana && 'バナナ'
                ].filter(Boolean).join(', ')}
              </TableCell>
              <TableCell>{todo.pubDate}</TableCell>
              <TableCell>
                {[todo.qty1, todo.qty2, todo.qty3].filter(Boolean).join(', ')}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <TodoDialog
                    mode="edit"
                    todo={todo}
                    onSubmit={(data) => handleUpdate(todo.id!, data)}
                    trigger={<Button variant="outline" size="sm">編集</Button>}
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">削除</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                        <AlertDialogDescription>
                          この操作は取り消せません。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(todo.id!)}
                        >
                          削除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// App.tsx
export default function App() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">TODO 管理</h1>
      <TodoList />
    </div>
  );
}
