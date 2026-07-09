"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteButton({
  id,
  action,
  confirmMessage = "Bạn có chắc muốn xoá mục này?",
}: {
  id: string;
  action: (id: string) => Promise<void>;
  confirmMessage?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      try {
        await action(id);
        toast.success("Đã xoá");
        router.refresh();
      } catch {
        toast.error("Xoá thất bại");
      } finally {
        setConfirming(false);
      }
    });
  }

  return (
    <Button
      type="button"
      variant={confirming ? "destructive" : "ghost"}
      size="icon-sm"
      disabled={isPending}
      onClick={handleClick}
      onBlur={() => setConfirming(false)}
      title={confirming ? confirmMessage : "Xoá"}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
