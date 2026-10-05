import type { StationId } from "@/components/ui/agentic-factory-3d";

// Support offered by Lakkan's existing services page. Examples are public work;
// they are examples of the stated activity, not a claim of client results.
export const works = [
  { id: "web", station: "engine", label: "Web制作", name: "魅力が伝わるWebサイト", description: "会社やサービスの強みを整理し、相談や応募につながるサイトをつくります。", cover: "/works/central-medical.jpg", alt: "中央メディカルのコーポレートサイト制作例", example: "制作例：中央メディカル", url: "/works/central-medical", topic: "corp-site", items: [] },
  { id: "ai", station: "admin", label: "AI・業務改善", name: "仕事の負担を、AIで減らす", description: "転記や情報探しなど、いまの仕事を見直すところから。AIの導入・実装・運用を支援します。", cover: "/works/now-on-air.jpg", alt: "Lakkanが運用するNow on Airの情報収集・編集・公開の例", example: "自社運用例：Now on Air", url: "/works/now-on-air", topic: "ai-consult", items: [] },
  { id: "people", station: "storefront", label: "採用・人財支援", name: "人と組織の課題を考える", description: "必要な役割と採用要件を整理し、魅力の伝え方から人財支援まで一緒に考えます。", cover: "/works/plime-recruit.jpg", alt: "PLIMEの採用サイト制作例", example: "採用サイト制作例：PLIME", url: "/works/plime-recruit", topic: "placement", items: [] },
  { id: "crm", station: "cabinet", label: "CRM・業務アプリ", name: "情報と仕事をつなぐ", description: "顧客情報、対応履歴、次の仕事。チームの現場に合わせて、CRMや業務アプリを設計・開発します。", cover: null, alt: "", example: "支援内容", url: "/services#crm", topic: "crm", items: ["顧客情報・画面・権限の設計", "業務アプリ・ツールの開発", "既存システムとの連携・運用改善"] },
] satisfies { id: string; station: StationId; label: string; name: string; description: string; cover: string | null; alt: string; example: string; url: string; topic: string; items: string[] }[];
