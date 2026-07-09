"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Skill } from "@prisma/client";
import { saveSkill } from "@/lib/actions";
import { emptyState } from "@/lib/action-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

export function SkillForm({ skill }: { skill?: Skill }) {
  const [state, formAction, isPending] = useActionState(
    saveSkill,
    emptyState,
  );
  const router = useRouter();

  const isEdit = !!skill;

  useEffect(() => {
    if (state.success && state.timestamp) {
      toast.success(isEdit ? "Đã cập nhật Skill" : "Đã thêm Skill");
      router.refresh();
    }
  }, [state.timestamp, router, isEdit]);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant={skill ? "ghost" : "default"} size={skill ? "icon-sm" : "default"}>
            {skill ? <Pencil className="size-4" /> : (
              <>
                <Plus className="size-4" />
                Thêm Skill
              </>
            )}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{skill ? "Sửa Skill" : "Thêm Skill"}</DialogTitle>
        </DialogHeader>
        <form key={skill ? JSON.stringify(skill) : "new"} action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="id" defaultValue={skill?.id ?? ""} />

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Tên</Label>
            <Input id="name" name="name" defaultValue={skill?.name ?? ""} />
            <FieldError errors={state.fieldErrors?.name} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">Danh mục</Label>
            <Input
              id="category"
              name="category"
              defaultValue={skill?.category ?? ""}
            />
            <FieldError errors={state.fieldErrors?.category} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="level">Mức độ (1-5)</Label>
              <Input
                id="level"
                name="level"
                type="number"
                min={1}
                max={5}
                defaultValue={skill?.level ?? 3}
              />
              <FieldError errors={state.fieldErrors?.level} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="order">Thứ tự</Label>
              <Input
                id="order"
                name="order"
                type="number"
                defaultValue={skill?.order ?? 0}
              />
              <FieldError errors={state.fieldErrors?.order} />
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
