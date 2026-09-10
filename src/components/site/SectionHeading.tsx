import type { ReactNode } from "react";
export function SectionHeading({label,title,children}:{label:string;title:ReactNode;children?:ReactNode}){return <div className="section-heading"><p className="eyebrow">{label}</p><div><h2>{title}</h2>{children}</div></div>;}
