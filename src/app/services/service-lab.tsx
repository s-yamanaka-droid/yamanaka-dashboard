import { RaccoGuide } from "@/components/site/RaccoGuide";

export function ServiceLab() {
  return <div className="racco-service-hero">
    <div><p className="racco-eyebrow">できること / LAKKAN</p><h1><span>仕事のクセを、</span><span>ほどく。</span></h1><p className="racco-service-lead">仕事の流れ、顧客との接点、人の役割。<br/>つくる前から、動かしたあとまで。</p></div>
    <RaccoGuide eager />
  </div>;
}
