interface MenuItem {
    title: string;
    links: {
        text: string;
        url: string;
    }[];
}

interface FooterProps {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    tagline?: string;
    menuItems?: MenuItem[];
    copyright?: string;
    bottomLinks?: {
        text: string;
        url: string;
    }[];
}

const Footer = ({
    tagline = 'Sistem Pengelola Laporan Prestasi',
    menuItems = [
        {
            title: 'Menu',
            links: [
                { text: 'Prestasi', url: '/prestasi' },
                { text: 'Berita', url: '/berita' },
            ],
        },
        {
            title: 'Pengelola',
            links: [{ text: 'Login', url: '/login' }],
        },
        {
            title: 'Alamat',
            links: [{ text: 'Google Maps', url: 'https://maps.app.goo.gl/KRq4FAHWtRukM5xD6' }],
        },
    ],
    copyright = '© 2025 Universitas Bengkulu All rights reserved.',
}: FooterProps) => {
    return (
        <section className="bg-sidebar-accent pt-8 pb-8">
            <div className="px-4 pt-6 sm:px-12">
                <footer>
                    <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
                        <div className="col-span-2 mb-8 lg:mb-0">
                            <div className="flex items-center gap-2 lg:justify-start">
                                <div className="flex aspect-square size-20 items-center justify-start gap-2 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                                    <img src="/assets/images/logo.png" className="size-15" />
                                    <p className="text-3xl font-bold">PRESTASI</p>
                                </div>
                            </div>
                            <p className="mt-4 font-medium text-muted-foreground">{tagline}</p>
                        </div>
                        <div className="col-span-2 grid grid-cols-3">
                            {menuItems.map((section, sectionIdx) => (
                                <div key={sectionIdx} className="col-span-1">
                                    <h3 className="mb-4 font-bold">{section.title}</h3>
                                    <ul className="space-y-4 text-muted-foreground">
                                        {section.links.map((link, linkIdx) => (
                                            <li key={linkIdx} className="font-medium hover:text-primary">
                                                <a href={link.url}>{link.text}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="col-span-2 mt-8 flex flex-col justify-end gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
                            <p>{copyright}</p>
                        </div>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export { Footer };
