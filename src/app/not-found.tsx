import Link from "next/link";
import { PageHero } from "@/components/PageHero";
export default function NotFound(){return <main id="main" className="new-site"><PageHero section="404 / Not found" title="お探しのページが見つかりません。" lede="ページが移動したか、URLが変更された可能性があります。"/><section className="site-section"><Link className="pill-button orange" href="/">ホームへ戻る <span>↗</span></Link></section></main>;}
