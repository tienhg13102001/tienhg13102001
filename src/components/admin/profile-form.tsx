"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Profile } from "@prisma/client";
import { updateProfile } from "@/lib/actions";
import { emptyState } from "@/lib/action-state";
import { Input } from "@/components/ui/input";
import { FileUpload } from "./file-upload";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-xs text-destructive">{errors[0]}</p>;
}

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    emptyState,
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.timestamp) {
      toast.success("Đã lưu Profile");
      router.refresh();
    }
  }, [state.timestamp, router]);

  const socials = (profile?.socials as Record<string, string> | null) ?? {};

  return (
    <Card>
      <CardContent>
        <form key={profile?.updatedAt?.toString() ?? "new"} action={formAction} className="flex flex-col gap-4">
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fullName">Họ tên</Label>
              <Input
                id="fullName"
                name="fullName"
                defaultValue={profile?.fullName ?? ""}
              />
              <FieldError errors={state.fieldErrors?.fullName} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Chức danh</Label>
              <Input
                id="title"
                name="title"
                defaultValue={profile?.title ?? ""}
              />
              <FieldError errors={state.fieldErrors?.title} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              name="tagline"
              defaultValue={profile?.tagline ?? ""}
            />
            <FieldError errors={state.fieldErrors?.tagline} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bio">Giới thiệu</Label>
            <Textarea
              id="bio"
              name="bio"
              rows={5}
              defaultValue={profile?.bio ?? ""}
            />
            <FieldError errors={state.fieldErrors?.bio} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <FileUpload
                id="avatarUrl"
                name="avatarUrl"
                defaultValue={profile?.avatarUrl ?? ""}
                accept="image/*"
              />
              <FieldError errors={state.fieldErrors?.avatarUrl} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={profile?.email ?? ""}
              />
              <FieldError errors={state.fieldErrors?.email} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">Địa điểm</Label>
              <Input
                id="location"
                name="location"
                defaultValue={profile?.location ?? ""}
              />
              <FieldError errors={state.fieldErrors?.location} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="resumeUrl">Resume URL</Label>
              <FileUpload
                id="resumeUrl"
                name="resumeUrl"
                defaultValue={profile?.resumeUrl ?? ""}
                accept=".pdf,.doc,.docx"
              />
              <FieldError errors={state.fieldErrors?.resumeUrl} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                name="github"
                defaultValue={socials.github ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                defaultValue={socials.linkedin ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="facebook">Facebook</Label>
              <Input id="facebook" name="facebook" defaultValue={socials.facebook ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                defaultValue={socials.website ?? ""}
              />
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="w-fit">
            {isPending ? "Đang lưu..." : "Lưu Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
