import { usePage } from '@inertiajs/react';
import * as React from 'react';

import { BookOpenCheckIcon, BookOpenIcon, Command, FilePlus2Icon, GraduationCapIcon, LayoutDashboardIcon, SettingsIcon, ShieldCheckIcon } from 'lucide-react';

import { NavItem, NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import prestasi from '@/routes/admin/prestasi';
import profile from '@/routes/profile';

import users from '@/routes/admin/users';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage().props;
    const user = auth.user;

    let navMainItems: NavItem[] = [];

    const navSecondaryItems = [
        {
            title: 'Settings',
            url: profile.edit().url,             icon: SettingsIcon,
        },
    ];

    if ((user && user.role === 'validator') || (user && user.role === 'admin')) {
        navMainItems = [
            {
                title: 'Dashboard',
                url: dashboard().url,
                icon: LayoutDashboardIcon,
            },
            {
                title: 'Mahasiswa Prestasi',
                url: prestasi.index().url,
                icon: GraduationCapIcon,
                items: [
                    {
                        title: 'Terverifikasi',
                        url: prestasi.verified().url,
                        icon: BookOpenCheckIcon,
                    },
                    {
                        title: 'Belum Terverifikasi',
                        url: prestasi.unverified().url,
                        icon: BookOpenIcon,
                    },
                ],
            },

        ];
        if (user && user.role === 'admin') {
            navMainItems.push({
                title: 'Manajemen Akun',
                url: users.index.url(),
                icon: ShieldCheckIcon,
            });
        }
    } 

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="xl" asChild>
                            <a target='_blank' href="https://ft.unib.ac.id/" className='flex flex-col'>
                                <div className="flex aspect-square size-20 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground ">
                                    <img src="/assets/images/logo.png" className="size-15"/>
                                </div>
                                <div className="grid flex-1 text-left text-lg leading-tight">
                                    <span className="font-medium">Universitas Bengkulu</span>
                                    <span className="text-sm">Fakultas Teknik Informatika</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMainItems} />
                <NavSecondary items={navSecondaryItems} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
