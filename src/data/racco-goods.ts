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
  {
    slug: "hina-sticker",
    title: "ひなラッコ ステッカー",
    subtitle: "きちんと、やさしく。番外編。",
    description: "書類とペンを持って、ひとつずつ。いつものRaccoとは少し違う、きれいめなひなラッコのステッカーデザインです。",
    image: "/brand-book/racco-hina-sticker.png",
    imageAlt: "白いブラウスとチャコールのカーディガン姿で書類とペンを持つ、ひなラッコのステッカーの生成デザイン",
    width: 1254,
    height: 1254,
    designNote: "シックな服と、やわらかな表情。ひなラッコは番外編のキャラクターとして、いつもと少し違う雰囲気を楽しむデザインです。",
    collectionHref: "/racco#gallery-hina",
    statusLabel: "商品化準備中",
  },
];
