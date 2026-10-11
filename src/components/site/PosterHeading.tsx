import Image from "next/image";
import { BrandHeading } from "./BrandHeading";

export function PosterRule({ index }: { index: string }) {
  return <div className="poster-rule" aria-hidden="true"><span>{index}</span><i /></div>;
}

export function StudioPeople({ scene = "team", className = "" }: { scene?: "team" | "wave"; className?: string }) {
  return <Image className={`studio-people ${className}`} src={`/people/studio-${scene}.png`} alt="" width={scene === "team" ? 1536 : 1207} height={scene === "team" ? 1024 : 1303} sizes="(max-width:760px) 280px, 500px" />;
}

export function PosterHeading({ index, label, title, description, people = true }: {
  index: string; label: string; title: string; description: string; people?: boolean;
}) {
  return <header className={`poster-heading${people ? " has-people" : ""}`}>
    <PosterRule index={index} />
    <div className="poster-heading-grid">
      <p className="poster-page-name" aria-hidden="true">{label}</p>
      <div className="poster-heading-copy"><BrandHeading as="h1" reveal={false}>{title}</BrandHeading><p>{description}</p></div>
      {people && <StudioPeople scene={label === "WORKS" ? "wave" : "team"} />}
    </div>
  </header>;
}
