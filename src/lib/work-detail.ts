import projects from "@/data/projects.json";

export const publicWorks = projects.filter(p => p.status === "live");
export function workSupport(id: string) {
 if (["lakkan-brand", "luna-ai", "luna-design"].includes(id)) return {id:"digital", label:"ブランド・Web体験の設計", topic:"corp-site"};
 return {id:"ai-operations", label:"AI導入・業務改善", topic:"ai-consult"};
}
export const workNotes: Record<string, {headline:string; theme:string; points:[string,string][]}> = {
 "luna-design": {
  headline:"表現を見つけ、制作につなげる。",
  theme:"動く作例、レイアウト、ビジュアルの参考を見比べる公開ライブラリ。表現を探す時間から、構成を考え、制作する時間へつなぐためのデザインです。",
  points:[["用途から、作例を探す","表紙、特徴・比較、工程・流れ、範囲・構造。使う場面から絞り込み、作例名や用途で検索できる一覧です。"],["選んだ作例を、その場で読む","一覧の選択と詳細を連動させ、構図、用途、出典、利用条件をまとめて表示。別の画面へ移動せず、候補を見比べられる構成です。"],["動きと、制作の入口まで","動く試作や制作プロンプトへ進める導線を用意。公開ライブラリで見る・選ぶところから、ログイン後の編集・保存へつなげています。"]],
 },
 "lakkan-brand": {
  headline:"小さなロゴから、ひとつの世界へ。",
  theme:"朱赤、自然白の紙、大きなワードマーク。名刺とレコードを主役に、Lakkanの仕事と、そのまわりにあるブランドの世界を見せるサイトです。",
  points:[["ロゴと手触り","既存のワードマークと、コットン紙を思わせる素材感。名刺やレコードへの展開を、生成イメージと実際の文字を組み合わせて見せます。"],["Raccoのいる風景","会社の顔はLakkanのロゴ。太縁メガネのRaccoは、日々の話を届けるもうひとつの顔として配置しています。"],["見る、読む、聴く","ブランドから、Raccoの読みものやLakkan Recordsへ。ページを移って、違う表情に触れられる構成です。"]],
 },
 "luna-ai": {
  headline:"Lunaの世界を、体験から伝える。",
  theme:"月から宇宙へ、スクロールに合わせて視点が移るLunaTechの公式サイト。ブランドの理念、各サービス、お知らせ、会社情報へとつながる体験を、ひとつの旅として組み立てています。",
  points:[
   ["ロゴを、体験の入口に", "銀と緑の金属調のLunaTechロゴを大きく配置。暗い背景とのコントラストで、最初の画面に焦点をつくっています。"],
   ["サービスを、ひとつの宇宙に", "ドラッグで見渡せる宇宙に、サービスの名前と入口を配置。視覚的なつながりと、各サービスへの案内を同じ場面で見せています。"],
   ["表現の先に、必要な情報を置く", "理念と行動指針、サービス、お知らせ、コラム、会社情報へと展開。世界観に触れた後も、知りたい情報を読み進められる構成です。"],
  ],
 },
 "now-on-air": {
  headline:"流れるニュースを、考える材料に。",
  theme:"AI業界の主要ニュースを、事業判断に使える論点へ編集して届けるモーニングディスパッチ。情報の収集、要約、公開をつなぐ取り組みです。",
  points:[
   ["その日の主役を、ひと目で", "主要ニュースを大きく扱い、ほかの記事と視覚的な重みを分けています。公開号の日付も示し、いつの情報を読んでいるかがわかる入口です。"],
   ["関心から、記事へたどる", "モデル・製品、研究、ビジネス、セキュリティ・政策に分類。検索やバックナンバーと合わせて、読みたい情報に進める構成です。"],
   ["記事と原典を、行き来する", "記事を読む入口と、原典へのリンクを用意。見出しと要約から全体をつかみ、必要なところは元の発表で確認できるようにしています。"],
  ],
 },
};

type WorkScreen = {
 focus: string[];
 src: string; width: number; height: number; alt: string;
 title: string; description: string; url: string; note?: string;
};

// Native captures of the public sites. They document the website being made,
// not separate client work or proof that every linked product is available.
export const workScreens: Record<string, WorkScreen> = {
 "now-on-air": {
  focus:["メディアの情報設計", "記事の読みやすさ", "原典への導線"],
  src:"/works/now-on-air-categories-20261020.jpg",width:1280,height:900,
  alt:"Now on AIrの公開記事一覧。分野の見出しと記事カードを、新聞のような文字組みで配置している。",
  title:"関心のある分野から、読み進める。",
  description:"カテゴリごとに見出し・要約・出典をまとめた記事一覧。大きなニュースから入るトップ画面と、関心から探す一覧を分けています。",
  url:"https://nowonair.vercel.app/#all-news",
  note:"公開画面の撮影時点の記事です。現在の記事は公開サイトでご覧いただけます。",
 },
 "luna-design": {
  focus:["作例の検索と選択", "一覧と詳細の連動", "制作への受け渡し"],
  src:"/works/luna-design-library-20261020.jpg",width:1276,height:718,
  alt:"Luna Designの公開ライブラリ。用途の絞り込み、作例の一覧、選択中の作例の詳細が同じ画面に並ぶ。",
  title:"一覧から選ぶと、詳細が見える。",
  description:"用途から絞り込み、作例を選ぶと、右側にその構成と使いどころを表示。画像の印象だけでなく、制作に使うための情報を一緒に見せています。",
  url:"https://harness-dashboard-eight.vercel.app/#design-library",
  note:"公開ライブラリの制作事例です。作例の閲覧はログイン不要。編集・保存にはLunaへのログインが必要です。",
 },
 "lakkan-brand": {
  focus:["ロゴと素材感", "キャラクターの展開", "音楽への導線"],
  src:"/works/lakkan-brand-collection-20261020.jpg",width:1276,height:718,
  alt:"Lakkan Brandの公開コレクション。ロゴを配した名刺、Racco、レコードを、それぞれの入口として並べている。",
  title:"ロゴも、Raccoも、音楽も。",
  description:"名刺に載せたワードマーク、太縁メガネのRacco、余白に流れる音楽。それぞれの表情をひとつのブランドにまとめ、続きの体験へ進める構成です。",
  url:"https://lakkan-inc.vercel.app/brand#identity",
  note:"掲載しているのは実装済みのWeb画面です。画面内の名刺・レコードの物撮りは、ブランド展開を示す生成イメージです。",
 },
 "luna-ai": {
  focus:["ブランドの世界観", "宇宙のインタラクション", "サービスへの案内"],
  src:"/works/lunatech-universe-20261020.jpg",width:1280,height:720,
  alt:"LunaTechの公開サイト。光る中心と周回するサービス名を宇宙に配置し、各サービスへの入口にしている。",
  title:"サービスのつながりを、宇宙で見せる。",
  description:"LunaTechを中心にサービスが周回するインタラクティブなシーン。宇宙を見渡す操作と、各サービスを知るための入口を重ねています。",
  url:"https://luna-tech-public-site.vercel.app/#signal",
  note:"公式ブランドサイトのWeb制作事例です。各サービスの提供状況は、リンク先の案内に準じます。",
 },
};
