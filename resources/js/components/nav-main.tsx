import { PlusCircleIcon, type LucideIcon } from 'lucide-react';

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';

export interface NavItem {
    title: string;
    url: string;
    icon: LucideIcon;
    items?: NavItem[];
}

export function NavMain({
    items,
}: {
    items: NavItem[];
}) {

    let currentURL = usePage().url;

    let activeClassName = "bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground";
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items.map((item) => (
                        <React.Fragment key={item.title}>
                            <Link href={item.url}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton tooltip={item.title} className={currentURL === item.url ? activeClassName : ""}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </Link>

                            {item.items?.length ? (
                                <SidebarMenuSub>
                                    {item.items.map((subItem) => (
                                        <Link href={subItem.url} key={subItem.title}>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton tooltip={subItem.title} className={currentURL === subItem.url ? activeClassName : ""}>
                                                    {subItem.icon && <subItem.icon />}
                                                    <span>{subItem.title}</span>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        </Link>
                                    ))}
                                </SidebarMenuSub>
                            ) : null}
                        </React.Fragment>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
