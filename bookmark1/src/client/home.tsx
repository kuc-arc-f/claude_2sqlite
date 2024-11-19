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
import { Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Zodスキーマ
const bookmarkSchema = z.object({
  title: z.string().min(1, { message: "タイトルは必須です" }),
  url: z.string().min(1, { message: "URLは必須です" })
});

const BookmarkApp = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentBookmark, setCurrentBookmark] = useState(null);
  const [formData, setFormData] = useState({ title: "", url: "" });
  const [errors, setErrors] = useState({});

  // ブックマーク取得
  const fetchBookmarks = async (search = "") => {
    try {
      const response = await fetch(`/api/bookmarks${search ? `?search=${search}` : ""}`);
      const data = await response.json();
      setBookmarks(data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  useEffect(() => {
    fetchBookmarks(searchTerm);
  }, [searchTerm]);

  // フォームバリデーション
  const validateForm = (data) => {
    try {
      bookmarkSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      const formattedErrors = {};
      error.errors.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }
  };

  // ブックマーク追加
  const handleAdd = async () => {
    if (!validateForm(formData)) return;

    try {
      await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsAddDialogOpen(false);
      setFormData({ title: "", url: "" });
      fetchBookmarks(searchTerm);
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  // ブックマーク編集
  const handleEdit = async () => {
    if (!validateForm(formData)) return;

    try {
      await fetch(`/api/bookmarks/${currentBookmark.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsEditDialogOpen(false);
      setFormData({ title: "", url: "" });
      setCurrentBookmark(null);
      fetchBookmarks(searchTerm);
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  // ブックマーク削除
  const handleDelete = async (id) => {
    if (!window.confirm('このブックマークを削除してもよろしいですか？')) return;

    try {
      await fetch(`/api/bookmarks/${id}`, {
        method: 'DELETE'
      });
      fetchBookmarks(searchTerm);
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ブックマーク管理</h1>
      
      {/* 検索バー */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          新規作成
        </Button>
      </div>

      {/* ブックマークリスト */}
      <div className="space-y-2">
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id} className="flex items-center justify-between p-4 border rounded">
            <div>
              <h3 className="font-medium">{bookmark.title}</h3>
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {bookmark.url}
              </a>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentBookmark(bookmark);
                  setFormData({ title: bookmark.title, url: bookmark.url });
                  setIsEditDialogOpen(true);
                }}
              >
                編集
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(bookmark.id)}
              >
                削除
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* 追加ダイアログ */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新規ブックマーク</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errors.title}</AlertDescription>
                </Alert>
              )}
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
              {errors.url && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errors.url}</AlertDescription>
                </Alert>
              )}
            </div>
            <Button onClick={handleAdd}>保存</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 編集ダイアログ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ブックマークを編集</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">タイトル</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errors.title}</AlertDescription>
                </Alert>
              )}
            </div>
            <div>
              <Label htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
              {errors.url && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errors.url}</AlertDescription>
                </Alert>
              )}
            </div>
            <Button onClick={handleEdit}>更新</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookmarkApp;
