import { getSkills } from "@/lib/queries";
import { SkillForm } from "@/components/admin/skill-form";
import { SkillsList } from "@/components/admin/skills-list";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Skills</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý danh sách kỹ năng.
          </p>
        </div>
        <SkillForm />
      </div>

      <Card>
        <CardContent>
          <SkillsList skills={skills} />
        </CardContent>
      </Card>
    </div>
  );
}
