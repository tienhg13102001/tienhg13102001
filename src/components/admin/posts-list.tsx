"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Post } from "@prisma/client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { PostForm } from "@/components/admin/post-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deletePost, savePost } from "@/lib/actions";

function PublishToggle({ post }: { post: Post }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(checked: boolean) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", post.id);
      fd.set("title", post.title);
      fd.set("slug", post.slug);
      fd.set("excerpt", post.excerpt ?? "");
      fd.set("content", post.content);
      fd.set("coverImage", post.coverImage ?? "");
      fd.set("tags", post.tags.join(", "));
      if (checked) fd.set("published", "on");

      const result = await savePost({}, fd);
      if (result.success) {
        toast.success(checked ? "Đã công khai bài viết" : "Đã ẩn bài viết");
        router.refresh();
      } else {
        toast.error("Cập nhật thất bại");
      }
    });
  }

  return (
    <Switch
      checked={post.published}
      disabled={isPending}
      onCheckedChange={handleChange}
    />
  );
}

export function PostsList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="text-sm text-muted-foreground">Chưa có bài viết nào.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tiêu đề</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Công khai</TableHead>
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell className="text-muted-foreground">{post.slug}</TableCell>
            <TableCell>
              <PublishToggle post={post} />
            </TableCell>
            <TableCell className="flex justify-end gap-1">
              <PostForm post={post} />
              <DeleteButton id={post.id} action={deletePost} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
