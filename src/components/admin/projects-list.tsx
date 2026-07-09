"use client";

import type { Project } from "@prisma/client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProjectForm } from "@/components/admin/project-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProject } from "@/lib/actions";

export function ProjectsList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Chưa có Project nào.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tiêu đề</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Nổi bật</TableHead>
          <TableHead>Thứ tự</TableHead>
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.title}</TableCell>
            <TableCell className="text-muted-foreground">
              {project.slug}
            </TableCell>
            <TableCell>
              {project.featured ? (
                <Badge>Nổi bật</Badge>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell>{project.order}</TableCell>
            <TableCell className="flex justify-end gap-1">
              <ProjectForm project={project} />
              <DeleteButton id={project.id} action={deleteProject} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
