"use client";

import type { Experience } from "@prisma/client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExperienceForm } from "@/components/admin/experience-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteExperience } from "@/lib/actions";

function fmt(date: Date | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("vi-VN");
}

export function ExperiencesList({
  experiences,
}: {
  experiences: Experience[];
}) {
  if (experiences.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Chưa có Experience nào.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tiêu đề</TableHead>
          <TableHead>Tổ chức</TableHead>
          <TableHead>Loại</TableHead>
          <TableHead>Thời gian</TableHead>
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {experiences.map((exp) => (
          <TableRow key={exp.id}>
            <TableCell className="font-medium">{exp.title}</TableCell>
            <TableCell>{exp.organization}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {exp.type === "WORK" ? "Công việc" : "Học vấn"}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {fmt(exp.startDate)} — {exp.current ? "Hiện tại" : fmt(exp.endDate)}
            </TableCell>
            <TableCell className="flex justify-end gap-1">
              <ExperienceForm experience={exp} />
              <DeleteButton id={exp.id} action={deleteExperience} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
