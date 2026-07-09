import { getProfile } from "@/lib/queries";
import { ProfileForm } from "@/components/admin/profile-form";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Thông tin cá nhân hiển thị trên trang chủ.
        </p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
