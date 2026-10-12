export type RaccoGoodsItem = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  width: number;
  height: number;
  designNote: string;
  collectionHref: string;
  statusLabel: "商品化準備中";
};

// Generated design concepts, not manufactured products or items offered for sale.
export const raccoGoods: RaccoGoodsItem[] = [
  {
    slug: "lakkan-wordmark",
    title: "Lakkan 英字ロゴ",
    subtitle: "英字ロゴだけを、服や帽子に。",
    description: "Lakkanの英字ロゴを使った、服・帽子・シールのデザインです。",
    image: "/brand-book/lakkan-wordmark-only-v1.png",
    imageAlt: "Lakkanの英字ロゴだけを入れた服・帽子・シールの生成デザインボード",
    width: 1536,
    height: 1024,
    designNote: "商品に入れるマークは英字ロゴひとつ。縦書きの「楽観」やRaccoの顔とは組み合わせません。",
    collectionHref: "/racco#gallery-apparel",
    statusLabel: "商品化準備中",
  },
  {
    slug: "rakkan-seal",
    title: "楽観 縦書きロゴ",
    subtitle: "縦書きの「楽観」を、ひとつ。",
    description: "縦書きの「楽観」を使った、服・帽子・シールのデザインです。",
    image: "/brand-book/rakkan-seal-only-v1.png",
    imageAlt: "縦書きの「楽観」だけを入れた服・帽子・シールの生成デザインボード",
    width: 1536,
    height: 1024,
    designNote: "商品に入れるのは縦書きの「楽観」だけ。英字ロゴやRaccoの顔は添えません。",
    collectionHref: "/racco#gallery-apparel",
    statusLabel: "商品化準備中",
  },
  {
    slug: "racco-face",
    title: "Racco フェイス",
    subtitle: "Raccoの顔だけを、ワンポイントに。",
    description: "Raccoの顔を使った、服・帽子・シールのデザインです。",
    image: "/brand-book/racco-face-only-v1.png",
    imageAlt: "Raccoの顔だけを入れた服・帽子・シールの生成デザインボード",
    width: 1536,
    height: 1024,
    designNote: "顔のマークを単独で使います。英字ロゴや縦書きの「楽観」は入れません。",
    collectionHref: "/racco#gallery-apparel",
    statusLabel: "商品化準備中",
  },
  {
    slug: "glasses-sticker",
    title: "いつものRacco ステッカー",
    subtitle: "太縁メガネと、いつもの顔。",
    description: "頑張りすぎない顔で、今日も隣に。太縁メガネのRaccoを、身近なところに置いておきたくなるステッカーのデザインです。",
    image: "/brand-book/racco-self-sticker.png",
    imageAlt: "太縁メガネと灰色パーカーのRaccoを描いたステッカーの生成デザイン",
    width: 1254,
    height: 1254,
    designNote: "太縁メガネと、のんびりした表情。いつものRaccoらしさを、そのまま一枚にしました。",
    collectionHref: "/racco#gallery-self",
    statusLabel: "商品化準備中",
  },
  {
    slug: "holo-sticker",
    title: "だるい天才 ホロシール",
    subtitle: "ラクするために、考え中。",
    description: "ソファで寝転びながら、PCをひらくRacco。レトロなホロシールをイメージした、ちょっと得意げな一枚です。",
    image: "/brand-book/racco-sticker-lazy-genius.png",
    imageAlt: "ソファで寝転びPCを開くRaccoを描いた、コーラルのホロシールの生成デザイン",
    width: 1254,
    height: 1254,
    designNote: "半目のRaccoと、コーラルのきらめき。ホロの表現は画像上のイメージで、実際の加工や素材はまだ決まっていません。",
    collectionHref: "/racco#gallery-stickers",
    statusLabel: "商品化準備中",
  },
];
