import Link from "next/link";
import { ArrowUpRight, ArrowRight, Users, Columns3, NotebookPen, ListChecks } from "lucide-react";

export function CrmDiagram() {
  return <div className="crm-case-diagram" aria-label="顧客、商談、活動履歴、次のアクションを一つの流れにつなぐCRMの構成図">
    {[[Users,"顧客"],[Columns3,"商談"],[NotebookPen,"活動履歴"],[ListChecks,"次の一手"]].map(([Icon,label],i)=>{
      const Symbol=Icon as typeof Users;
      return <div className="crm-case-node" key={String(label)}><span>0{i+1}</span><Symbol size={34} strokeWidth={1.3} aria-hidden="true"/><strong>{String(label)}</strong>{i<3&&<ArrowRight className="crm-case-arrow" size={20} aria-hidden="true"/>}</div>;
    })}
  </div>;
}

export function CrmCaseCard() {
  return <article className="crm-case-card">
    <div><p className="case-kicker">SYSTEM / CRM</p><h2>情報がつながる。<br/>次の仕事が見える。</h2><p>顧客・商談・活動履歴・タスクをまとめるCRMの開発事例。</p><Link className="brand-text-link" href="/works/crm-development#main">開発内容を見る <ArrowUpRight size={18}/></Link></div>
    <CrmDiagram/>
  </article>;
}
