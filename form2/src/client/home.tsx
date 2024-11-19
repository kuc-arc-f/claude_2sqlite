import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const todoSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  contentType: z.string().min(1, "コンテントタイプを入力してください"),
  age: z.string().optional(),
  public: z.boolean(),
  foodOrange: z.boolean(),
  foodApple: z.boolean(),
  foodBanana: z.boolean(),
  foodMelon: z.boolean(),
  foodGrape: z.boolean(),
  datePublish: z.string().optional().nullable(),
  dateUpdate: z.string().optional().nullable(),
  postNumber: z.string().optional(),
  addressCountry: z.string().optional(),
  addressPref: z.string().optional(),
  addressCity: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  textOption1: z.string().optional(),
  textOption2: z.string().optional(),
});

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    contentType: "",
    age: "",
    public: false,
    foodOrange: false,
    foodApple: false,
    foodBanana: false,
    foodMelon: false,
    foodGrape: false,
    datePublish: "",
    dateUpdate: "",
    postNumber: "",
    addressCountry: "",
    addressPref: "",
    addressCity: "",
    address1: "",
    address2: "",
    textOption1: "",
    textOption2: "",
  });

  const fetchTodos = async () => {
    try {
      //const response = await fetch(`/api/todos?search=${search}`);
      const response = await fetch(`/api/todos`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      todoSchema.parse(formData);
      
      const url = editingTodo
        ? `/api/todos/${editingTodo.id}`
        : '/api/todos';
      
      const method = editingTodo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(rror.errors);
        setErrors(error.errors);
        return;
      }

      setIsOpen(false);
      setEditingTodo(null);
      setFormData({
        title: "",
        content: "",
        contentType: "",
        age: "",
        public: false,
        foodOrange: false,
        foodApple: false,
        foodBanana: false,
        foodMelon: false,
        foodGrape: false,
        datePublish: "",
        dateUpdate: "",
        postNumber: "",
        addressCountry: "",
        addressPref: "",
        addressCity: "",
        address1: "",
        address2: "",
        textOption1: "",
        textOption2: "",
      });
      fetchTodos();
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('本当に削除しますか？')) {
      try {
        await fetch(`/api/todos/${id}`, {
          method: 'DELETE',
        });
        fetchTodos();
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setFormData({
      ...todo,
      datePublish: todo.datePublish ? todo.datePublish.split('T')[0] : '',
      dateUpdate: todo.dateUpdate ? todo.dateUpdate.split('T')[0] : '',
    });
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingTodo(null);
              setFormData({
                title: "",
                content: "",
                contentType: "",
                age: "",
                public: false,
                foodOrange: false,
                foodApple: false,
                foodBanana: false,
                foodMelon: false,
                foodGrape: false,
                datePublish: "",
                dateUpdate: "",
                postNumber: "",
                addressCountry: "",
                addressPref: "",
                addressCity: "",
                address1: "",
                address2: "",
                textOption1: "",
                textOption2: "",
              });
            }}>
              新規作成
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTodo ? '編集' : '新規作成'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  タイトル
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="col-span-3"
                />
                {errors.title && <p className="text-red-500 col-span-3 col-start-2">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">
                  内容
                </Label>
                <Input
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="col-span-3"
                />
                {errors.content && <p className="text-red-500 col-span-3 col-start-2">{errors.content}</p>}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contentType" className="text-right">
                contentType
                </Label>
                <Input
                  id="contentType"
                  value={formData.contentType}
                  onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                  className="col-span-3"
                />
                {errors.contentType && (
                  <p className="text-red-500 col-span-3 col-start-2">{errors.contentType}</p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age"  className="text-right">年齢</Label>
                <Input
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">公開設定</Label>
                <RadioGroup
                  name="public"
                  value={formData.public}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, public: value }))}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={true} id="public" />
                    <Label htmlFor="public">公開</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={false} id="private" />
                    <Label htmlFor="private">非公開</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">好きな果物</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'foodOrange', label: 'オレンジ' },
                    { id: 'foodApple', label: 'りんご' },
                    { id: 'foodBanana', label: 'バナナ' },
                    { id: 'foodMelon', label: 'メロン' },
                    { id: 'foodGrape', label: 'ぶどう' }
                  ].map(({ id, label }) => (
                    <div key={id} className="flex items-center space-x-2">
                      <Checkbox
                        id={id}
                        name={id}
                        checked={formData[id]}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, [id]: checked }))
                        }
                      />
                      <Label htmlFor={id} className="">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div>
                  <Label htmlFor="datePublish">公開日</Label>
                  <Input
                    type="date"
                    id="datePublish"
                    name="datePublish"
                    value={formData.datePublish}
                    onChange={(e) => setFormData({ ...formData, datePublish: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="dateUpdate">更新日</Label>
                  <Input
                    type="date"
                    id="dateUpdate"
                    name="dateUpdate"
                    value={formData.dateUpdate}
                    onChange={(e) => setFormData({ ...formData, dateUpdate: e.target.value })}
                  />
                </div>
              </div>     
              <div>
                <Label htmlFor="postNumber">郵便番号</Label>
                <Input
                  id="postNumber"
                  name="postNumber"
                  value={formData.postNumber}
                  onChange={(e) => setFormData({ ...formData, postNumber: e.target.value })}
                />
              </div>                       

              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'addressCountry', label: '国' },
                  { id: 'addressPref', label: '都道府県' },
                  { id: 'addressCity', label: '市区町村' },
                  { id: 'address1', label: '住所1' },
                  { id: 'address2', label: '住所2' }
                ].map(({ id, label }) => (
                  <div key={id}>
                    <Label htmlFor={id}>{label}</Label>
                    <Input
                      id={id}
                      name={id}
                      value={formData[id]}
                      onChange={handleInputChange}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="textOption1">オプション1</Label>
                  <Input
                    id="textOption1"
                    name="textOption1"
                    value={formData.textOption1}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="textOption2">オプション2</Label>
                  <Input
                    id="textOption2"
                    name="textOption2"
                    value={formData.textOption2}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
                         
              {/* 以下同様のパターンで他のフィールドも追加 */}
              {/* ... */}

              <div className="flex justify-end gap-2">
                <Button type="submit">
                  {editingTodo ? '更新' : '作成'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead>内容</TableHead>
            <TableHead>アクション</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>{todo.title}</TableCell>
              <TableCell>{todo.content}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(todo)}>
                    編集
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(todo.id)}>
                    削除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TodoApp;
