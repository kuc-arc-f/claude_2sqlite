// app/page.tsx

import { useState, useEffect } from 'react';
import { Post, PostInput } from './post/scheme';
import { PostFormDialog } from './post/PostFormDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts${searchTerm ? `?search=${searchTerm}` : ''}`);
      //const response = await fetch(`/api/posts`);
      const data = await response.json();
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [searchTerm]);

  const handleCreate = async (data: PostInput) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create post');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleUpdate = async (id: number, data: PostInput) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update post');
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete post');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  return (
    <>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">投稿一覧</h1>
          <PostFormDialog
            onSubmit={handleCreate}
            trigger={<Button>新規投稿</Button>}
          />
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        {/* table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>タイトル</TableHead>
              <TableHead>内容</TableHead>
              <TableHead>種類</TableHead>
              <TableHead>年齢</TableHead>
              <TableHead>公開</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.content}</TableCell>
                <TableCell>{post.contentType}</TableCell>
                <TableCell>{post.age}</TableCell>
                <TableCell>{post.public ? '公開' : '非公開'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <PostFormDialog
                      post={post}
                      onSubmit={(data) => handleUpdate(post.id, data)}
                      trigger={<Button variant="outline" size="sm">編集</Button>}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      削除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}