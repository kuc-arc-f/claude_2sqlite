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
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  //
  const [sorting, setSorting] = useState([]);

  
  // テーブルのカラム定義
  const columns = [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          タイトル
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
    },
    {
      accessorKey: 'content',
      //header: 'コンテンツ',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >コンテンツ
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
    },
    {
      accessorKey: 'public',
      header: '公開設定',
      cell: ({ row }) => (
        <span>{row.original.public === 'public' ? '公開' : '非公開'}</span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const rowData = row.original;
        return (
        <div className="flex space-x-2">
          <PostFormDialog
            post={rowData}
            onSubmit={(rowData) => handleUpdate(rowData.id, rowData)}
            trigger={<Button variant="outline" size="sm">編集</Button>}
          />          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => handleDelete(row.original.id)}
          >
            削除
          </Button>
        </div>
      )},
    },
  ];
    // テーブルの設定
    const table = useReactTable({
      data: posts,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onSortingChange: setSorting,
      state: {
        sorting,
        globalFilter: searchTerm,
      },
      onGlobalFilterChange: setSearchTerm,
    });

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

  useEffect(() => {
    //fetchPosts();
    console.log(sorting);
  }, [sorting]);

  const handleCreate = async (data: PostInput) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create post');
      //fetchPosts();
      location.reload();
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
        {/* reactTable */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    データがありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}