// components/post-form-dialog.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Post, PostInput } from './scheme';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  contentType: z.string().min(1, "コンテンツタイプを入力してください"),
});

interface PostFormDialogProps {
  post?: Post;
  onSubmit: (data: PostInput) => Promise<void>;
  trigger: React.ReactNode;
}

export function PostFormDialog({ post, onSubmit, trigger }: PostFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<PostInput>(post || {
    title: '',
    content: '',
    contentType: '',
    age: '',
    public: false,
    foodOrange: false,
    foodApple: false,
    foodBanana: false,
    foodMelon: false,
    foodGrape: false,
    datePublish: null,
    dateUpdate: null,
    postNumber: '',
    addressCountry: '',
    addressPref: '',
    addressCity: '',
    address1: '',
    address2: '',
    textOption1: '',
    textOption2: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      postSchema.parse(formData);
      await onSubmit(formData);
      setOpen(false);
      setErrors({});
    } catch (error) {
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

  const handleChange = (field: keyof PostInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? '投稿を編集' : '新規投稿'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">内容 *</Label>
            <Input
              id="content"
              value={formData.content}
              onChange={e => handleChange('content', e.target.value)}
            />
            {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentType">コンテンツタイプ *</Label>
            <Input
              id="contentType"
              value={formData.contentType}
              onChange={e => handleChange('contentType', e.target.value)}
            />
            {errors.contentType && <p className="text-red-500 text-sm">{errors.contentType}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">年齢</Label>
            <Input
              id="age"
              value={formData.age || ''}
              onChange={e => handleChange('age', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>公開設定</Label>
            <RadioGroup
              value={formData.public ? 'public' : 'private'}
              onValueChange={value => handleChange('public', value === 'public')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">公開</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">非公開</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>食べ物</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="foodOrange"
                  checked={formData.foodOrange}
                  onCheckedChange={value => handleChange('foodOrange', value)}
                />
                <Label htmlFor="foodOrange">オレンジ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="foodApple"
                  checked={formData.foodApple}
                  onCheckedChange={value => handleChange('foodApple', value)}
                />
                <Label htmlFor="foodApple">りんご</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="foodBanana"
                  checked={formData.foodBanana}
                  onCheckedChange={value => handleChange('foodBanana', value)}
                />
                <Label htmlFor="foodBanana">バナナ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="foodMelon"
                  checked={formData.foodMelon}
                  onCheckedChange={value => handleChange('foodMelon', value)}
                />
                <Label htmlFor="foodMelon">メロン</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="foodGrape"
                  checked={formData.foodGrape}
                  onCheckedChange={value => handleChange('foodGrape', value)}
                />
                <Label htmlFor="foodGrape">ぶどう</Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="datePublish">公開日</Label>
              <Input
                type="date"
                id="datePublish"
                value={formData.datePublish || ''}
                onChange={e => handleChange('datePublish', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateUpdate">更新日</Label>
              <Input
                type="date"
                id="dateUpdate"
                value={formData.dateUpdate || ''}
                onChange={e => handleChange('dateUpdate', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="postNumber">郵便番号</Label>
            <Input
              id="postNumber"
              value={formData.postNumber || ''}
              onChange={e => handleChange('postNumber', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="addressCountry">国</Label>
              <Input
                id="addressCountry"
                value={formData.addressCountry || ''}
                onChange={e => handleChange('addressCountry', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressPref">都道府県</Label>
              <Input
                id="addressPref"
                value={formData.addressPref || ''}
                onChange={e => handleChange('addressPref', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressCity">市区町村</Label>
            <Input
              id="addressCity"
              value={formData.addressCity || ''}
              onChange={e => handleChange('addressCity', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address1">住所1</Label>
            <Input
              id="address1"
              value={formData.address1 || ''}
              onChange={e => handleChange('address1', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address2">住所2</Label>
            <Input
              id="address2"
              value={formData.address2 || ''}
              onChange={e => handleChange('address2', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="textOption1">オプション1</Label>
              <Input
                id="textOption1"
                value={formData.textOption1 || ''}
                onChange={e => handleChange('textOption1', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="textOption2">オプション2</Label>
              <Input
                id="textOption2"
                value={formData.textOption2 || ''}
                onChange={e => handleChange('textOption2', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit">
              {post ? '更新' : '作成'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
