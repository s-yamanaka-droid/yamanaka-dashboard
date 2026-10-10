import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { raccoGoods } from "@/data/racco-goods";

export default function RaccoGoods() {
  return (
    <div className="bl-goods-grid">
      {raccoGoods.map(item => (
        <Link className="bl-goods-card" href={`/racco/goods/${item.slug}`} key={item.slug}>
          <Image
            src={item.image}
            width={item.width}
            height={item.height}
            alt={item.imageAlt}
            sizes="(max-width: 600px) calc(100vw - 44px), (max-width: 900px) 45vw, 340px"
          />
          <div>
            <span className="bl-goods-label">{item.statusLabel}</span>
            <h3>{item.title}</h3>
            <p>{item.subtitle}</p>
            <span className="bl-column-read">デザインを見る<ArrowRight size={15} aria-hidden="true"/></span>
          </div>
        </Link>
      ))}
    </div>
  );
}
