import { getAllProjects } from "@/lib/queries";
import { ProjectForm } from "@/components/admin/project-form";
import { ProjectsList } from "@/components/admin/projects-list";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý các dự án hiển thị trên portfolio.
          </p>
        </div>
        <ProjectForm />
      </div>

      <Card>
        <CardContent>
          <ProjectsList projects={projects} />
        </CardContent>
      </Card>
    </div>
  );
}
