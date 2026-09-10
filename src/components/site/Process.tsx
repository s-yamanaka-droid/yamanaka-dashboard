export function Process(){return <div className="process-grid">{[
 ["01","Discover","業務から、考える。","現場の流れと困りごとを整理。AIに任せること、人が判断すること、なくせる作業を見極めます。"],
 ["02","Build","動く形で、確かめる。","画面やプロトタイプで具体化。実際に使う人の反応を確かめながら、必要な機能を実装します。"],
 ["03","Grow","使いながら、育てる。","導入して終わりにせず、運用の結果を次の改善へ。仕事に根づく仕組みに育てていきます。"],
].map(([n,en,title,body])=><article key={n}><div className="process-top"><span>{n}</span><span>{en}</span></div><div className={"process-art process-art-"+n} aria-hidden="true"><i/><i/><i/><i/></div><h3>{title}</h3><p>{body}</p></article>)}</div>;}
