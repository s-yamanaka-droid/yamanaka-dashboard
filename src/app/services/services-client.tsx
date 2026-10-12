"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Plus } from "lucide-react";
import { serviceStories } from "@/data/service-stories";
import { WorkStory } from "@/components/site/WorkStory";

export function ServiceExplorer() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const change = () => {
      const hash = window.location.hash.slice(1);
      const i = serviceStories.findIndex(s => s.id === (hash === "product" ? "crm" : hash));
      if (i >= 0) setActive(i);
    };
    change(); window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  const s = serviceStories[active];
  function select(i: number) {
    setActive(i);
    window.history.replaceState(null, "", `#${serviceStories[i].id}`);
  }
  return <div className="racco-service-explorer">
    <div className="racco-service-tabs" role="tablist" aria-label="変えたいことから支援を選ぶ">{serviceStories.map((item, i) => <button type="button" key={item.id} id={`tab-${item.id}`} role="tab" aria-selected={active === i} aria-controls="service-panel" tabIndex={active === i ? 0 : -1} onClick={() => select(i)} onKeyDown={e => {
      let next = i;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % serviceStories.length;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i + serviceStories.length - 1) % serviceStories.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = serviceStories.length - 1;
      else return;
      e.preventDefault(); select(next); document.getElementById(`tab-${serviceStories[next].id}`)?.focus();
    }}><span id={item.id} className="service-hash-anchor"/>{item.id === "crm" && <span id="product" className="service-hash-anchor"/>}<strong>{item.label.map(part => <span key={part}>{part}</span>)}</strong><small>{item.category.split("・").map((part, index, parts) => <span key={part}>{part}{index < parts.length - 1 ? "・" : ""}</span>)}</small>{active === i && <Check className="service-selected-mark" size={17} aria-hidden="true"/>}</button>)}</div>
    <div id="service-panel" role="tabpanel" aria-labelledby={`tab-${s.id}`} tabIndex={0} className="racco-service-panel">
      <div key={s.id} className="racco-service-panel-content">
        <div className="service-poster-title"><p className="racco-eyebrow">{s.category}</p><h2>{s.poster.map(part => <span key={part}>{part}</span>)}</h2><h3>{s.title}</h3><p>{s.text}</p></div>
        <WorkStory kind={s.id} captions={s.scenes}/>
        <ul className="service-practical-steps">{s.steps.map(step => <li key={step}><Check size={18} aria-hidden="true"/>{step}</li>)}</ul>
        <Link className="racco-ticket service-ticket" href={`/contact?topic=${s.topic}#inquiry`}>{s.cta}<ArrowRight size={22} aria-hidden="true"/></Link>
        <details className="service-detail-note"><summary>支援の中身をひらく<Plus size={18} aria-hidden="true"/></summary><ul>{s.details.map(item => <li key={item}>{item}</li>)}</ul></details>
      </div>
    </div>
  </div>;
}
