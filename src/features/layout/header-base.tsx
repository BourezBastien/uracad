import { SiteConfig } from "@/site-config";
import Image from "next/image";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { Layout } from "../page/layout";
import { ThemeToggle } from "../theme/theme-toggle";

export function HeaderBase({ children }: PropsWithChildren) {
  return (
    <header className="bg-muted/40 sticky top-0 flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
      <Layout className="my-2">
        <div className="flex items-center gap-2">
          <Image
            src={SiteConfig.appIcon}
            alt="app logo"
            width={48}
            height={48}
          />
          <Link href="/" className="text-xl font-bold">
            {SiteConfig.title}
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {children}
            <ThemeToggle />
          </nav>
        </div>
      </Layout>
    </header>
  );
}
