"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";

const content = {
  crm: {
    eyebrow: "CRM / CUSTOMER RELATIONSHIP",
    title: "情報を集めて終わらず、次の仕事が動く。",
    intro: "顧客管理システム（CRM）は、顧客との関係をチームで育てるための仕組み。問い合わせから商談、契約後のフォローまで、情報と担当者の動きをつなぎます。",
    steps: [
      {name:"集める", title:"ばらばらの接点を、一つの顧客履歴に。", text:"フォーム、メール、面談メモなど、情報がどこで生まれるかを整理。顧客・担当者・商談の関係を定め、二重入力を減らす設計にします。", output:"顧客情報の設計・データ整理・既存ツールとの連携", human:"記録の出典と内容を担当者が確認する。"},
      {name:"見える化", title:"売上だけでなく、商談が止まる理由も見える。", text:"案件の段階、担当者、次回連絡日、未確認の条件を揃えます。会議のために別の表を作らず、日々の記録から進捗を確認できる画面へ。", output:"商談一覧・対応履歴・チームの進捗画面", human:"案件の確度と優先順位は、現場の判断で更新する。"},
      {name:"動かす", title:"記録から、次のアクションへ。", text:"フォローの期限や担当者への通知を設計。AIによるメモの整理・文面の下書きも組み合わせ、連絡漏れや準備の負担を減らします。", output:"対応タスク・期限通知・AIによる入力補助", human:"顧客への送信や重要な変更には確認を挟む。"},
      {name:"育てる", title:"現場で使い、仕事に合わせて直す。", text:"入力しづらい項目や使われない画面を確認し、運用を改善。担当者が変わっても引き継げるよう、ルールと使い方を残します。", output:"運用ルール・引き継ぎ手順・改善項目", human:"連絡漏れ・確認時間・引き継ぎやすさを一緒に確かめる。"},
    ],
    before:"顧客情報が点在し、担当者に聞かないと次の対応が分からない。",
    after:"履歴・担当者・次の行動がつながり、チームで顧客対応を進められる。",
    scope:["現在の営業・顧客対応フローの整理","必要な項目・画面・権限の設計","CRM構築と既存ツールの連携","導入時の説明と運用改善"],
    topic:"crm"
  },
  fde: {
    eyebrow:"FDE / FORWARD DEPLOYED ENGINEERING",
    title:"現場に入る。つくる。使われるまで伴走する。",
    intro:"FDEは、エンジニアが現場の仕事を理解し、課題の発見から開発・運用までつなぐ支援です。仕様が固まる前から一緒に考え、小さく動かして確かめます。",
    steps:[
      {name:"現場を知る",title:"困りごとの背景まで、一緒にたどる。",text:"実際の作業、情報の受け渡し、確認待ちを確認します。『このツールが欲しい』の一歩手前で、何が仕事を止めているかを整理します。",output:"業務フロー・課題の一覧・改善の優先順位",human:"現場担当者と、何を変えるか・何を守るかを決める。"},
      {name:"小さく試す",title:"まず一つの業務で、動く形にする。",text:"AI、既存ツールの連携、業務アプリから適した手段を選びます。試作品を実際の担当者に使ってもらい、操作と効果を確認します。",output:"試作品・確認用の業務例・実装する範囲",human:"期待する結果と、使えない条件を先に決める。"},
      {name:"実装する",title:"普段の仕事に、無理なく組み込む。",text:"画面や処理を開発し、既存システムにつなぎます。アクセス権限、誤操作への備え、失敗時の戻し方も含めて、運用できる状態をつくります。",output:"業務アプリ・AI連携・テスト・運用手順",human:"公開・顧客連絡・重要データの変更は責任者が判断する。"},
      {name:"定着させる",title:"導入後の例外から、次の改善へ。",text:"使われ方を確認し、手戻りや例外処理を直します。担当者への説明と引き継ぎを行い、継続して改善できる状態へつなげます。",output:"利用者への説明・引き継ぎ資料・改善計画",human:"利用状況と現場の負担を見て、次の開発を決める。"},
    ],
    before:"現場の困りごとと、開発側の仕様が離れ、導入しても仕事が変わらない。",
    after:"現場とエンジニアが同じ業務を見て、試作・実装・改善を繰り返す。",
    scope:["業務ヒアリングと改善テーマの選定","試作品・業務アプリ・AI連携の開発","既存システムへの組み込みと検証","運用・定着・次の改善への伴走"],
    topic:"fde"
  },
};

export function ServiceDepth({kind}:{kind:"crm"|"fde"}) {
  const [active,setActive]=useState(0);
  const data=content[kind], step=data.steps[active];
  return <div className={"service-depth depth-"+kind}>
    <div className="depth-heading"><span>{data.eyebrow}</span><h3>{data.title}</h3><p>{data.intro}</p></div>
    <div className="depth-diagram" aria-label={kind==="crm"?"顧客情報から継続フォローまでの流れ":"現場理解から開発・定着までの流れ"}>
      <p className="diagram-instruction">各工程を選ぶと、支援内容が分かります。</p>
      <div className="depth-stages" role="group" aria-label="工程を選択">{data.steps.map((s,i)=><button key={s.name} aria-pressed={active===i} aria-controls={kind+"-process-detail"} onClick={()=>setActive(i)}><small>0{i+1}</small><span>{s.name}</span><ArrowRight size={18} aria-hidden="true"/></button>)}</div>
      <div className="depth-active" id={kind+"-process-detail"} aria-live="polite"><div><span className="depth-kicker">0{active+1} / {step.name}</span><h4>{step.title}</h4><p>{step.text}</p></div><dl><dt>一緒につくるもの</dt><dd>{step.output}</dd><dt>人が担う判断・確認</dt><dd>{step.human}</dd></dl></div>
      <div className="depth-return"><span>現場の声・結果を、次の改善へ</span><span aria-hidden="true">↶</span></div>
    </div>
    <div className="depth-outcome"><div><small>いまの課題</small><p>{data.before}</p></div><ArrowRight aria-hidden="true"/><div><small>目指す状態</small><p>{data.after}</p></div></div>
    <div className="depth-scope"><h4>Lakkanの支援範囲</h4><ul>{data.scope.map(s=><li key={s}><Check size={16} aria-hidden="true"/>{s}</li>)}</ul><p>既存環境・必要な機能・運用体制を確認し、範囲と進め方をご提案します。</p><Link href={"/contact?topic="+data.topic}>具体的な課題を相談する<ArrowUpRight size={18}/></Link></div>
  </div>;
}

export function PeopleApproach(){
  return <div className="people-approach"><div className="depth-heading"><span>PEOPLE × TECHNOLOGY</span><h3>人が足りない。その解決を、<br/>採用だけに閉じない。</h3><p>忙しさの原因を仕事の流れから整理する。技術で負担を減らす。人が担う役割を見直し、必要な人財との出会いを支援する。採用の考え方をアップデートすることも、私たちの仕事です。</p></div><div className="people-origin">事業の目標と、現場の「手が足りない」を整理</div><div className="people-paths"><div><small>01 / WORK</small><h4>仕事を組み直す</h4><p>重複入力や確認待ちを見つけ、続ける仕事・減らす仕事・任せる仕事を整理する。</p><b>業務フロー・役割の整理</b></div><div><small>02 / TECHNOLOGY</small><h4>技術で支える</h4><p>Luna AI、CRM、業務アプリを組み合わせ、情報整理や定型作業の負担を減らす。</p><b>AI活用・CRM構築・FDE</b></div><div><small>03 / PEOPLE</small><h4>必要な人財を考える</h4><p>人に任せたい判断と役割を明確にし、採用要件・魅力の伝え方・人材紹介をつなぐ。</p><b>採用設計・人財支援</b></div></div><p className="people-destination">人が力を発揮できる仕事と、それを支える仕組みをつくる。</p><div className="depth-scope"><h4>採用の前から、考えること</h4><ul><li><Check size={16}/>今の業務で、本当に足りない役割は何か</li><li><Check size={16}/>AIや仕組みで減らせる負担は何か</li><li><Check size={16}/>その人に任せる仕事と、入社後の受け入れをどう設計するか</li></ul><Link href="/contact?topic=placement">人と組織の課題を相談する<ArrowUpRight size={18}/></Link></div></div>;
}
