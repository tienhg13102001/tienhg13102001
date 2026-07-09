"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Post } from "@prisma/client";
import { savePost } from "@/lib/actions";
import { emptyState } from "@/lib/action-state";
import { Input } from "@/components/ui/input";
import { FileUpload } from "./file-upload";
import { RichTextEditor } from "./rich-text-editor";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil } from "lucide-react";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-xs text-destructive">{errors[0]}</p>;
}

export function PostForm({ post }: { post?: Post }) {
  const [state, formAction, isPending] = useActionState(savePost, emptyState);
  const router = useRouter();

  const isEdit = !!post;

  useEffect(() => {
    if (state.success && state.timestamp) {
      toast.success(isEdit ? "Đã cập nhật bài viết" : "Đã thêm bài viết");
      router.refresh();
    }
  }, [state.timestamp, router, isEdit]);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant={post ? "ghost" : "default"}
            size={post ? "icon-sm" : "default"}
          >
            {post ? (
              <Pencil className="size-4" />
            ) : (
              <>
                <Plus className="size-4" />
                Viết bài mới
              </>
            )}
          </Button>
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{post ? "Sửa bài viết" : "Viết bài mới"}</DialogTitle>
        </DialogHeader>
        <form key={post?.updatedAt?.toString() ?? "new"} action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="id" defaultValue={post?.id ?? ""} />

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input id="title" name="title" defaultValue={post?.title ?? ""} />
            <FieldError errors={state.fieldErrors?.title} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={post?.slug ?? ""} />
            <FieldError errors={state.fieldErrors?.slug} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="excerpt">Tóm tắt</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              defaultValue={post?.excerpt ?? ""}
            />
            <FieldError errors={state.fieldErrors?.excerpt} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="content">Nội dung</Label>
            <RichTextEditor
              id="content"
              name="content"
              defaultValue={post?.content ?? ""}
            />
            <FieldError errors={state.fieldErrors?.content} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="coverImage">Ảnh bìa URL</Label>
            <FileUpload
              id="coverImage"
              name="coverImage"
              defaultValue={post?.coverImage ?? ""}
              accept="image/*"
            />
            <FieldError errors={state.fieldErrors?.coverImage} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tags">Tags (phân cách bởi dấu phẩy)</Label>
            <Input
              id="tags"
              name="tags"
              defaultValue={post?.tags?.join(", ") ?? ""}
            />
            <FieldError errors={state.fieldErrors?.tags} />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="published"
              name="published"
              defaultChecked={post?.published ?? false}
            />
            <Label htmlFor="published">Công khai</Label>
          </div>

          <Button type="submit" disabled={isPending} className="w-fit">
            {isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
