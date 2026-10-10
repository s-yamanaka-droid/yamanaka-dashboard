import { raccoColumns } from "@/data/racco-columns";
import { raccoGoods } from "@/data/racco-goods";

const sourceLabels = {
  "racco-home": "Raccoのホーム",
  "racco-column": "Raccoのコラム",
  "racco-gallery": "Raccoのギャラリー",
  "racco-goods": "Raccoのグッズ",
} as const;

const intentTopics = {
  ai: "ai-consult",
  goods: "racco-goods",
  design: "racco-design",
} as const;

export type RaccoInquirySource = keyof typeof sourceLabels;
export type RaccoInquiryIntent = keyof typeof intentTopics;
export type RaccoInquiryInput = {
  source: RaccoInquirySource;
  article?: string;
  product?: string;
  intent?: RaccoInquiryIntent;
};

export type RaccoInquiryContext = {
  source: RaccoInquirySource;
  sourceLabel: string;
  intent: RaccoInquiryIntent;
  topic: (typeof intentTopics)[RaccoInquiryIntent];
  article?: { slug: string; title: string };
  product?: { slug: string; title: string };
  initialMessage: string;
  bodyLines: string[];
};

const hasOwn = <T extends object>(object: T, key: unknown): key is keyof T =>
  typeof key === "string" && Object.prototype.hasOwnProperty.call(object, key);

/** Only known public references enter the form; query strings are never echoed. */
export function resolveRaccoInquiryContext(
  searchParams: Record<string, unknown> | null | undefined,
): RaccoInquiryContext | undefined {
  if (!searchParams || !hasOwn(sourceLabels, searchParams.source)) return undefined;

  const source = searchParams.source;
  const sourceLabel = sourceLabels[source];
  const defaultIntent = source === "racco-goods" ? "goods" : source === "racco-gallery" ? "design" : "ai";
  const intent = hasOwn(intentTopics, searchParams.intent) ? searchParams.intent : defaultIntent;
  const article = source === "racco-column" && typeof searchParams.article === "string"
    ? raccoColumns.find(item => item.slug === searchParams.article)
    : undefined;
  const product = source === "racco-goods" && typeof searchParams.product === "string"
    ? raccoGoods.find(item => item.slug === searchParams.product)
    : undefined;
  const reference = article ? `コラム「${article.title}」` : product ? `「${product.title}」` : sourceLabel;
  const purpose = intent === "goods" ? "グッズについて相談したいです。" : intent === "design" ? "キャラクター・デザインについて相談したいです。" : "AI・業務について相談したいです。";

  return {
    source,
    sourceLabel,
    intent,
    topic: intentTopics[intent],
    article: article ? { slug: article.slug, title: article.title } : undefined,
    product: product ? { slug: product.slug, title: product.title } : undefined,
    initialMessage: `${reference}を見て、${purpose}\n\n`,
    bodyLines: [
      `きっかけ：${sourceLabel}`,
      ...(article ? [`見ていた記事：${article.title}`] : []),
      ...(product ? [`見ていたグッズ：${product.title}`] : []),
    ],
  };
}

export function buildRaccoInquiryHref(input: RaccoInquiryInput): string {
  const context = resolveRaccoInquiryContext(input);
  if (!context) return "/contact#inquiry";
  const query = new URLSearchParams({ source: context.source, intent: context.intent });
  if (context.article) query.set("article", context.article.slug);
  if (context.product) query.set("product", context.product.slug);
  return `/contact?${query.toString()}#inquiry`;
}
