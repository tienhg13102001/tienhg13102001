import { getExperiences } from "@/lib/queries";
import { ExperienceForm } from "@/components/admin/experience-form";
import { ExperiencesList } from "@/components/admin/experiences-list";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Experience</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý quá trình làm việc và học vấn.
          </p>
        </div>
        <ExperienceForm />
      </div>

      <Card>
        <CardContent>
          <ExperiencesList experiences={experiences} />
        </CardContent>
      </Card>
    </div>
  );
}
