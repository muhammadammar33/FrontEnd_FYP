import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { StoreCategoryForm } from "./_components/store-category-form";
import { StoreCategoryList } from "./_components/store-category-list";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

const StoreCategoriesPage = async () => {
  const session = await auth();
  
  if (!session || session.user.role !== UserRole.ADMIN) {
    return redirect("/");
  }

  const storeCategories = await db.storeCategories.findMany({
    include: {
      CreatedBy: true
    },
    orderBy: {
      CreatedAt: 'desc'
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <Heading 
          title="Store Categories" 
          description="Manage store categories for your marketplace"
        />
        <Separator />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <StoreCategoryForm />
          <div>
            <StoreCategoryList items={storeCategories} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCategoriesPage;
