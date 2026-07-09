"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Experience } from "@prisma/client";
import { saveExperience } from "@/lib/actions";
import { emptyState } from "@/lib/action-state";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "./rich-text-editor";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

function toDateInputValue(date: Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function ExperienceForm({ experience }: { experience?: Experience }) {
  const [state, formAction, isPending] = useActionState(
    saveExperience,
    emptyState,
  );
  const router = useRouter();
  const [current, setCurrent] = useState(experience?.current ?? false);

  const isEdit = !!experience;

  useEffect(() => {
    if (state.success && state.timestamp) {
      toast.success(isEdit ? "Đã cập nhật Kinh nghiệm" : "Đã thêm Kinh nghiệm");
      router.refresh();
    }
  }, [state.timestamp, router, isEdit]);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant={experience ? "ghost" : "default"}
            size={experience ? "icon-sm" : "default"}
          >
            {experience ? (
              <Pencil className="size-4" />
            ) : (
              <>
                <Plus className="size-4" />
                Thêm Experience
              </>
            )}
          </Button>
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {experience ? "Sửa Experience" : "Thêm Experience"}
          </DialogTitle>
        </DialogHeader>
        <form key={experience ? JSON.stringify(experience) : "new"} action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="id" defaultValue={experience?.id ?? ""} />

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="type">Loại</Label>
            <Select name="type" defaultValue={experience?.type ?? "WORK"}>
              <SelectTrigger id="type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WORK">Công việc</SelectItem>
                <SelectItem value="EDUCATION">Học vấn</SelectItem>
              </SelectContent>
            </Select>
            <FieldError errors={state.fieldErrors?.type} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              name="title"
              defaultValue={experience?.title ?? ""}
            />
            <FieldError errors={state.fieldErrors?.title} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="organization">Tổ chức</Label>
            <Input
              id="organization"
              name="organization"
              defaultValue={experience?.organization ?? ""}
            />
            <FieldError errors={state.fieldErrors?.organization} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">Địa điểm</Label>
            <Input
              id="location"
              name="location"
              defaultValue={experience?.location ?? ""}
            />
            <FieldError errors={state.fieldErrors?.location} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={toDateInputValue(experience?.startDate)}
              />
              <FieldError errors={state.fieldErrors?.startDate} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                disabled={current}
                defaultValue={toDateInputValue(experience?.endDate)}
              />
              <FieldError errors={state.fieldErrors?.endDate} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="current"
              name="current"
              checked={current}
              onCheckedChange={setCurrent}
            />
            <Label htmlFor="current">Hiện tại</Label>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <RichTextEditor
              id="description"
              name="description"
              defaultValue={experience?.description ?? ""}
            />
            <FieldError errors={state.fieldErrors?.description} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="order">Thứ tự</Label>
            <Input
              id="order"
              name="order"
              type="number"
              defaultValue={experience?.order ?? 0}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-fit">
            {isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
