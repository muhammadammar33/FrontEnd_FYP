"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { StoreCategories, User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { AlertModal } from "@/components/modals/alert-modal";

interface StoreCategoryWithUser extends StoreCategories {
  CreatedBy: User | null;
}

interface StoreCategoryListProps {
  items: StoreCategoryWithUser[];
}

export const StoreCategoryList = ({ items }: StoreCategoryListProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/admin/store-categories/${id}`);
      toast.success("Store category deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
      setOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deletingId && onDelete(deletingId)}
        loading={loading}
      />
      <Card>
        <CardHeader>
          <CardTitle>Store Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No store categories found.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.Id} 
                  className="flex items-center justify-between p-4 border rounded-md"
                >
                  <div className="max-w-[80%] overflow-hidden">
                    <h3 className="font-medium truncate">{item.Name}</h3>
                    {item.Description && (
                      <p className="text-sm text-muted-foreground text-align break-words line-clamp-3">
                        {item.Description}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                      <p>Created by: {item.CreatedBy?.name || 'Unknown'}</p>
                      <p>Created: {format(item.CreatedAt, 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    disabled={loading}
                    onClick={() => {
                      setDeletingId(item.Id);
                      setOpen(true);
                    }}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
