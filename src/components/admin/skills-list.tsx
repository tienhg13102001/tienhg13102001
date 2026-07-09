"use client";

import type { Skill } from "@prisma/client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SkillForm } from "@/components/admin/skill-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteSkill } from "@/lib/actions";

export function SkillsList({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Chưa có Skill nào.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên</TableHead>
          <TableHead>Danh mục</TableHead>
          <TableHead>Mức độ</TableHead>
          <TableHead>Thứ tự</TableHead>
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skills.map((skill) => (
          <TableRow key={skill.id}>
            <TableCell className="font-medium">{skill.name}</TableCell>
            <TableCell>
              {skill.category ? (
                <Badge variant="outline">{skill.category}</Badge>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell>{skill.level}/5</TableCell>
            <TableCell>{skill.order}</TableCell>
            <TableCell className="flex justify-end gap-1">
              <SkillForm skill={skill} />
              <DeleteButton id={skill.id} action={deleteSkill} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
