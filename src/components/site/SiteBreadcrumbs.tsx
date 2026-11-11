"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import projects from "@/data/projects.json";
import { jsonLd, siteUrl } from "@/lib/seo";

const labels: Record<string, string> = {
  "/about": "会社情報", "/services": "できること", "/works": "制作・開発実績",
  "/contact": "お問い合わせ", "/changelog": "更新情報", "/privacy": "プライバシーポリシー", "/atelier": "Atelier",
};

// Shelf breadcrumb: ordered home-to-current links; the current page is text.
export function SiteBreadcrumbs() {
  const pathname = usePathname();
  const work = pathname.startsWith("/works/") ? projects.find(p => `/works/${p.id}` === pathname) : undefined;
  const current = labels[pathname] || (pathname === "/works/crm-development" ? "CRM・営業支援ツール" : work?.name);
  if (!current) return null;
  const crumbs = [{ label: "ホーム", path: "/" }, ...(pathname.startsWith("/works/") ? [{ label: "制作・開発実績", path: "/works" }] : []), { label: current, path: pathname }];
  return <nav className="site-breadcrumbs" aria-label="パンくず">
    <ol className="xf-crumbs">{crumbs.map((item, index) => <li key={item.path}>{index === crumbs.length - 1 ? <span aria-current="page">{item.label}</span> : <Link className="xf-crumb" href={item.path}>{item.label}</Link>}</li>)}</ol>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, item: `${siteUrl}${item.path}` })) }) }}/>
  </nav>;
}
