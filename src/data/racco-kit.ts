export type AssetGroup = "self" | "cast" | "social";
export type RaccoAsset = { title: string; kind: string; src: string; width: number; height: number; alt: string; group?: AssetGroup };

export const assetGroups: { id: AssetGroup; label: string }[] = [
  { id: "self", label: "本人のRacco" },
  { id: "cast", label: "3人の仲間" },
  { id: "social", label: "SNSの画像" },
];

export const raccoAssets: RaccoAsset[] = [
  { title: "朝は、ゆっくり。", kind: "朝の風景", src: "/brand-book/racco-self-morning.png", width: 1672, height: 941, alt: "太縁の黒いメガネと灰色パーカーのRacco。眠そうに頬づえをつき、自分のステッカーを貼ったPCと朝のコーヒー", group: "self" },
  { title: "雨の日は、ここで。", kind: "カフェの風景", src: "/brand-book/racco-self-cafe.png", width: 1672, height: 941, alt: "雨のカフェで太縁メガネのRaccoがノートPCを開いている", group: "self" },
  { title: "いつもの顔。", kind: "プロフィール", src: "/brand-book/racco-self-avatar.png", width: 1254, height: 1254, alt: "太い黒縁メガネに半目、灰色パーカーを着たRaccoの顔", group: "self" },
  { title: "持ちものにも、自分。", kind: "グッズのイメージ", src: "/brand-book/racco-self-merch.png", width: 1672, height: 941, alt: "太縁メガネのRaccoをあしらったPCやスマホ、カード、ステッカーの生成モック", group: "self" },
  { title: "ぺたっと、Racco。", kind: "ステッカー", src: "/brand-book/racco-self-sticker.png", width: 1254, height: 1254, alt: "自分の顔のステッカーを貼ったPCを抱える、太縁メガネのRaccoの白ふちシール", group: "self" },
  { title: "Raccoと、ふたりの仲間。", kind: "3人の朝の場面", src: "/brand-book/racco-trio.png", width: 1672, height: 941, alt: "朝の部屋で集まる、灰色パーカーののんびりRacco、コーラルのテキパキ担当、丸メガネの自動化オタク担当", group: "cast" },
  { title: "それぞれ、こんな顔。", kind: "3人の造形見本", src: "/brand-book/racco-cast.png", width: 1536, height: 1024, alt: "顔の形、体格、服装の違いが分かるRaccoの3人のキャラクター見本", group: "cast" },
  { title: "横長のヘッダー", kind: "X・noteなど / 初期絵柄", src: "/brand-book/racco-social-header.png", width: 2172, height: 724, alt: "通常版Raccoの横長SNSヘッダー見本", group: "social" },
  { title: "Facebookのカバー", kind: "カバー / 初期絵柄", src: "/brand-book/racco-facebook-cover.png", width: 2034, height: 773, alt: "通常版RaccoのFacebookカバー見本", group: "social" },
  { title: "Instagramの表紙", kind: "フィード表紙 / 初期絵柄", src: "/brand-book/racco-instagram-feed.png", width: 1122, height: 1402, alt: "RaccoのInstagram向け縦長フィード表紙見本", group: "social" },
  { title: "リールの表紙", kind: "縦長の静止画 / 動画ではありません", src: "/brand-book/racco-reels-cover.png", width: 940, height: 1672, alt: "Raccoのリール向け縦長カバー画像", group: "social" },
  { title: "言葉を主役に", kind: "投稿の表現見本", src: "/brand-book/racco-words-post.png", width: 1254, height: 1254, alt: "短い言葉を主役にしたRaccoの投稿画像見本", group: "social" },
  { title: "顔と、ひとこと", kind: "投稿の表現見本", src: "/brand-book/racco-speech-post.png", width: 1254, height: 1254, alt: "Raccoの表情と吹き出しを組み合わせた投稿画像見本", group: "social" },
  { title: "試したことを並べる", kind: "実験の説明用レイアウト見本", src: "/brand-book/racco-experiment-post.png", width: 1122, height: 1402, alt: "試したことと修正を並べて説明するRaccoの投稿レイアウト見本", group: "social" },
];

export const raccoCast = [
  { id: "racco", role: "のんびり担当", name: "Racco", quote: "それ、明日もやるやつ？", detail: "毎日の面倒を見つける。何をAIに頼むか、最後に使うかも自分で決める。", look: "丸い顔・灰色パーカー・眠そうな目" },
  { id: "practical", role: "テキパキ担当", name: "まず、ひとつ。", quote: "じゃあ、今日の分だけやろ。", detail: "話を小さく整理して、手を動かす。急かす上司じゃなく、隣で一緒に進める役。", look: "小柄・すっきりした頬・コーラルの上着" },
  { id: "automation", role: "自動化オタク担当", name: "つい、凝っちゃう。", quote: "この往復、減らせそう。", detail: "繰り返す作業を減らす方法を考える。便利にしたくて、たまに凝りすぎる。", look: "細長い顔・寝ぐせ・丸メガネ" },
];

export const channelAssetPaths = {
  threads: ["/brand-book/racco-self-avatar.png", "/brand-book/racco-speech-post.png"],
  x: ["/brand-book/racco-social-header.png", "/brand-book/racco-words-post.png"],
  instagram: ["/brand-book/racco-instagram-feed.png", "/brand-book/racco-reels-cover.png"],
  note: ["/brand-book/racco-social-header.png", "/brand-book/racco-experiment-post.png"],
};
