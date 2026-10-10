"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export default function ColumnPrompt({ text }: { text: string }) {
  const [status, setStatus] = useState("");
  const [manual, setManual] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setManual(false);
      setStatus("コピーしました。自分の仕事に合わせて書き換えてください。");
    } catch {
      setManual(true);
      setStatus("自動コピーが使えません。下の文章を選択してコピーしてください。");
    }
  }
  return <div className="bl-column-prompt">
    <div className="bl-section-head"><h2>たとえば、こう頼む。</h2><button type="button" className="bl-pill" onClick={copy}>依頼文をコピー<Copy size={14}/></button></div>
    <p className="bl-prompt-text">{text}</p>
    <p className="bl-prompt-caution">業務で使う前に、会社のルールと入力してよい情報の範囲を確認してください。</p>
    <p role="status" aria-live="polite">{status}</p>
    {manual && <textarea aria-label="手動コピー用の依頼文" readOnly value={text} onFocus={event => event.target.select()}/>}
  </div>;
}
