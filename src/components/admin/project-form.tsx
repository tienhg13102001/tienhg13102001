"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Project } from "@prisma/client";
import { saveProject } from "@/lib/actions";
import { emptyState } from "@/lib/action-state";
import { Input } from "@/components/ui/input";
import { FileUpload } from "./file-upload";
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

export function ProjectForm({ project }: { project?: Project }) {
  const [state, formAction, isPending] = useActionState(
    saveProject,
    emptyState,
  );
  const router = useRouter();

  const isEdit = !!project;

  useEffect(() => {
    if (state.success && state.timestamp) {
      toast.success(isEdit ? "Đã cập nhật Project" : "Đã thêm Project");
      router.refresh();
    }
  }, [state.timestamp, router, isEdit]);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant={project ? "ghost" : "default"}
            size={project ? "icon-sm" : "default"}
          >
            {project ? (
              <Pencil className="size-4" />
            ) : (
              <>
                <Plus className="size-4" />
                Thêm Project
              </>
            )}
          </Button>
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{project ? "Sửa Project" : "Thêm Project"}</DialogTitle>
        </DialogHeader>
        <form key={project?.updatedAt?.toString() ?? "new"} action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="id" defaultValue={project?.id ?? ""} />

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input id="title" name="title" defaultValue={project?.title ?? ""} />
            <FieldError errors={state.fieldErrors?.title} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={project?.slug ?? ""} />
            <FieldError errors={state.fieldErrors?.slug} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="summary">Tóm tắt</Label>
            <Textarea
              id="summary"
              name="summary"
              rows={2}
              defaultValue={project?.summary ?? ""}
            />
            <FieldError errors={state.fieldErrors?.summary} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              name="content"
              rows={6}
              defaultValue={project?.content ?? ""}
            />
            <FieldError errors={state.fieldErrors?.content} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="coverImage">Ảnh bìa URL</Label>
            <FileUpload
              id="coverImage"
              name="coverImage"
              defaultValue={project?.coverImage ?? ""}
              accept="image/*"
            />
            <FieldError errors={state.fieldErrors?.coverImage} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="liveUrl">Live URL</Label>
              <Input
                id="liveUrl"
                name="liveUrl"
                defaultValue={project?.liveUrl ?? ""}
              />
              <FieldError errors={state.fieldErrors?.liveUrl} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="repoUrl">Repo URL</Label>
              <Input
                id="repoUrl"
                name="repoUrl"
                defaultValue={project?.repoUrl ?? ""}
              />
              <FieldError errors={state.fieldErrors?.repoUrl} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tags">Tags (phân cách bởi dấu phẩy)</Label>
            <Input
              id="tags"
              name="tags"
              defaultValue={project?.tags?.join(", ") ?? ""}
            />
            <FieldError errors={state.fieldErrors?.tags} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                name="featured"
                defaultChecked={project?.featured ?? false}
              />
              <Label htmlFor="featured">Nổi bật</Label>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="order">Thứ tự</Label>
              <Input
                id="order"
                name="order"
                type="number"
                defaultValue={project?.order ?? 0}
              />
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="w-fit">
            {isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
