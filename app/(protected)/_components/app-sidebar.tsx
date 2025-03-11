import { Calendar, Home, Inbox, Search, Settings, Store, ArchiveX, Archive } from "lucide-react"
import { db } from "@/lib/db";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarMenuBadge,
} from "@/components/ui/sidebar"
import { UserButton } from "@/components/auth/user-button"
import { currentUser } from "@/lib/auth";

const stores = db.stores.count();
const pendingStores = db.stores.count({
    where: {
        Status: "PENDING",
    },
});

const archivedStores = db.stores.count({
    where: {
        Status: "ARCHIVED",
    },
});

// Menu items.
const items = [
    {
        title: "Home",
        url: "/admin",
        icon: Home
    },
    {
        title: "Stores",
        url: "/admin/stores",
        icon: Store,
        count: stores,
    },
    {
        title: "Pending Stores",
        url: "/admin/pending-stores",
        icon: ArchiveX,
        count: pendingStores, 
    },
    {
        title: "Archived Stores",
        url: "/admin/archived-stores",
        icon: Archive,
        count: archivedStores,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

export async function AppSidebar() {
    const user = await currentUser();
    const stores = await db.stores.count();

    return (
        <Sidebar collapsible="icon">
        <SidebarContent>
            <SidebarGroup>
            <SidebarGroupLabel>{user?.name}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive>
                        <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                        </a>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{item.count}</SidebarMenuBadge>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <UserButton /> 
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
        </Sidebar>
    )
}
