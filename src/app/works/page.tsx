import type { Metadata } from "next";
import { WorksClient } from "./WorksClient";

export const metadata: Metadata = {
  title: "Works — Lakkan Inc.",
  description:
    "Lakkan が手掛けたプロダクト一覧。AIエージェント・採用LP・コーポレートサイト・社内ダッシュボード。",
  openGraph: {
    title: "Works — Lakkan Inc.",
    description: "Lakkan のプロダクトポートフォリオ。",
  },
};

export default function WorksPage() {
  return <WorksClient />;
}
