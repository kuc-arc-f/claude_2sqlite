// src/types.ts
import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().min(1, "説明は必須です"),
});

export type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type TodoInput = z.infer<typeof todoSchema>;

// src/components/TodoDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
//import { todoSchema, type TodoInput } from "../types";

type TodoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TodoInput) => Promise<void>;
  initialData?: TodoInput;
  mode: "create" | "edit";
};

export function TodoDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
  formData,
  setFormData,
}: TodoDialogProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
console.log("#mode", mode);
console.log("#formData");
console.log(formData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = todoSchema.parse(formData);
      await onSubmit(validatedData);
      onOpenChange(false);
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        const errorMap: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errorMap[err.path[0].toString()] = err.message;
          }
        });
        setErrors(errorMap);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "TODOの追加" : "TODOの編集"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                value={formData?.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {mode === "create" ? "追加" : "更新"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// src/App.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search } from "lucide-react";
import Head from '../components/Head'

const initialData = {
  title: '',
  description: '',
}

async function getSysApiUrl(){
  try{
    let ret = "";
    const response = await fetch(`/api/common/get_sys_items`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );
    if (!response.ok) throw new Error("error, getSystemParam");
    const data = await response.json();
    //console.log(data.data);
    ret = data.data.api_url;
    return ret;
  } catch (err) {
    console.error(err);
  }
}
export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoInput | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const fetchTodos = async (query = "") => {
    try {
      setIsLoading(true);
      const apiUrl = await getSysApiUrl();
      //console.log("apiUrl=", apiUrl)
      const url = query
        ? `${apiUrl}/api/todos/search?q=${encodeURIComponent(query)}`
        : `${apiUrl}/api/todos`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("TODOの取得に失敗しました");
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTodos(searchQuery);
  };

  const handleCreate = async (data: TodoInput) => {
    try {
      const apiUrl = await getSysApiUrl();
      const response = await fetch(`${apiUrl}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("TODOの作成に失敗しました");
      fetchTodos();
      location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    }
  };

  const handleUpdate = async (data: TodoInput) => {
console.log("#handleUpdate.editingTodo" ,editingTodo);
console.log(formData);
    if (!formData) return;
    try {
      const apiUrl = await getSysApiUrl();
      const response = await fetch(
        `${apiUrl}/api/todos/${(formData as Todo).id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, completed: (formData as Todo).completed }),
        }
      );
      if (!response.ok) throw new Error("TODOの更新に失敗しました");
      fetchTodos();
      setEditingTodo(null);
      setFormData(initialData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("このTODOを削除しますか？")) return;
    try {
      const apiUrl = await getSysApiUrl();
      const response = await fetch(`${apiUrl}/api/todos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("TODOの削除に失敗しました");
      fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    }
  };

  const handleEdit = (todo: Todo) => {
    setIsEditMode(true);
    setFormData(todo);
    setDialogOpen(true);
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const apiUrl = await getSysApiUrl();
      const response = await fetch(`${apiUrl}/api/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });
      if (!response.ok) throw new Error("状態の更新に失敗しました");
      fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    }
  };

  return (
  <>
    <Head />
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">TODOリスト</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="flex gap-2">
            <Input
              placeholder="検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
        <Button
          onClick={() => {
            setIsEditMode(false);
            setEditingTodo(null);
            setDialogOpen(true);
          }}
        >
          新規作成
        </Button>
      </div>

      {isLoading ? (
        <div>読み込み中...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>状態</TableHead>
              <TableHead>タイトル</TableHead>
              <TableHead>説明</TableHead>
              <TableHead>作成日時</TableHead>
              <TableHead>アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo)}
                    className="h-4 w-4"
                  />
                </TableCell>
                <TableCell>{todo.title}</TableCell>
                <TableCell>{todo.description}</TableCell>
                <TableCell>
                  {new Date(todo.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleEdit(todo);
                        //console.log(todo);
                      }}
                    >
                      編集
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(todo.id)}
                    >
                      削除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {isEditMode ? (
          <TodoDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleUpdate}
          initialData={editingTodo}
          mode="edit"
          formData={formData}
          setFormData={setFormData}
        />
      ): (
        <TodoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
        initialData={null}
        mode="create"
        formData={formData}
        setFormData={setFormData}
     />
      )}
    </div>  
  </>
  );
}
