"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, X } from "lucide-react";
import projectsData from "@/data/projects.json";
import { Project, WorkType, resolveWorkType } from "@/types";
import styles from "./works.module.css";

const projects = projectsData as Project[];

const TYPE_META: Record<WorkType | "all", { label: string; short: string; description: string }> = {
  all: { label: "All work", short: "All", description: "公開しているすべて" },
  client: { label: "Client work", short: "Client", description: "実案件・クライアントワーク" },
  own: { label: "Owned products", short: "Owned", description: "Lakkan・関係会社のプロダクト" },
  "ai-concept": { label: "AI concept", short: "AI Concept", description: "架空ブランドのデザイン実験" },
};

const FEATURED_IDS = ["central-medical", "now-on-air", "luna-ai"];

function projectById(id: string) {
  return projects.find((project) => project.id === id) ?? projects[0];
}

function WorkLabel({ project }: { project: Project }) {
  const type = resolveWorkType(project);
  return <span className={`${styles.workLabel} ${styles[`workLabel_${type}`]}`}>{TYPE_META[type].short}</span>;
}

function BrowserImage({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <div className={styles.browserImage}>
      <div className={styles.browserBar} aria-hidden="true">
        <span />
        <span />
        <span />
        <b>{new URL(project.url ?? "https://lakkan-inc.vercel.app").hostname}</b>
      </div>
      {project.cover && (
        <Image
          src={project.cover}
          alt={project.coverAlt ?? `${project.name}の公開画面`}
          fill
          sizes="(max-width: 760px) 92vw, (max-width: 1100px) 70vw, 52vw"
          priority={priority}
          className={styles.browserShot}
        />
      )}
    </div>
  );
}

function HeroFrame({
  project,
  variant,
  onOpen,
}: {
  project: Project;
  variant: "primary" | "secondary" | "tertiary";
  onOpen: (project: Project) => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.heroFrame} ${styles[`heroFrame_${variant}`]}`}
      onClick={() => onOpen(project)}
      aria-label={`${project.name}の詳細を見る`}
    >
      <span className={styles.frameLabel}>
        <WorkLabel project={project} />
        <span>{project.name}</span>
      </span>
      <BrowserImage project={project} priority />
    </button>
  );
}

function FeaturedWork({
  project,
  variant,
  onOpen,
}: {
  project: Project;
  variant: "primary" | "secondary";
  onOpen: (project: Project) => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.featuredCard} ${styles[`featuredCard_${variant}`]}`}
      onClick={() => onOpen(project)}
      aria-label={`${project.name}の制作詳細を見る`}
    >
      {project.cover && (
        <Image
          src={project.cover}
          alt={project.coverAlt ?? `${project.name}の公開画面`}
          fill
          sizes={variant === "primary" ? "(max-width: 760px) 100vw, 62vw" : "(max-width: 760px) 100vw, 38vw"}
          className={styles.featuredImage}
        />
      )}
      <span className={styles.featuredShade} />
      <span className={styles.featuredTopline}>
        <WorkLabel project={project} />
        <span>{project.client ?? "Lakkan"}</span>
      </span>
      <span className={styles.featuredCopy}>
        <span className={styles.featuredName}>{project.name}</span>
        <span className={styles.featuredDescription}>{project.description}</span>
        <span className={styles.featuredAction}>View case <ArrowUpRight size={16} /></span>
      </span>
    </button>
  );
}

function ArchiveCard({ project, index, onOpen }: { project: Project; index: number; onOpen: (project: Project) => void }) {
  return (
    <article className={styles.archiveCard}>
      <button type="button" className={styles.archiveOpen} data-work-card={project.id} onClick={() => onOpen(project)}>
        <div className={styles.archiveVisual}>
          {project.cover && (
            <Image
              src={project.cover}
              alt={project.coverAlt ?? `${project.name}の公開画面`}
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
              className={styles.archiveImage}
            />
          )}
          <span className={styles.archiveIndex}>{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className={styles.archiveBody}>
          <div className={styles.archiveMeta}>
            <WorkLabel project={project} />
            <span>{project.client ?? "Lakkan"}</span>
          </div>
          <div className={styles.archiveTitleRow}>
            <h3>{project.name}</h3>
            <ArrowUpRight size={20} aria-hidden="true" />
          </div>
          <p>{project.description}</p>
          <div className={styles.archiveTags}>
            {project.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
      </button>
    </article>
  );
}

function WorkDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    if (!dialog.open) dialog.showModal();
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="work-dialog-title"
      data-work-dialog
      onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }}
    >
      <div className={styles.dialogShell}>
        <div className={styles.dialogMedia}>
          {project.cover && (
            <Image
              src={project.cover}
              alt={project.coverAlt ?? `${project.name}の公開画面`}
              fill
              sizes="(max-width: 760px) 100vw, 64vw"
              className={styles.dialogImage}
              priority
            />
          )}
        </div>
        <div className={styles.dialogBody}>
          <button type="button" className={styles.dialogClose} onClick={() => dialogRef.current?.close()} aria-label="詳細を閉じる">
            <X size={20} />
          </button>
          <div className={styles.dialogMeta}>
            <WorkLabel project={project} />
            <span>{project.client ?? "Lakkan"}</span>
          </div>
          <h2 id="work-dialog-title">{project.name}</h2>
          <p className={styles.dialogDescription}>{project.description}</p>
          <dl className={styles.dialogFacts}>
            <div><dt>Scope</dt><dd>{project.tags.slice(0, 3).join(" / ")}</dd></div>
            <div><dt>Built with</dt><dd>{project.builtWith === "claude_code" ? "Claude Code" : project.builtWith}</dd></div>
            <div><dt>Published</dt><dd>{project.createdAt.replaceAll("-", ".")}</dd></div>
          </dl>
          <div className={styles.dialogTags}>{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.dialogLink}>
              公開サイトを見る <ArrowUpRight size={17} />
            </a>
          )}
        </div>
      </div>
    </dialog>
  );
}

export function WorksClient() {
  const [activeType, setActiveType] = useState<WorkType | "all">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const closeProject = useCallback(() => setSelectedProject(null), []);

  const featured = FEATURED_IDS.map(projectById);
  const visibleProjects = useMemo(
    () => activeType === "all" ? projects : projects.filter((project) => resolveWorkType(project) === activeType),
    [activeType]
  );
  const counts = useMemo(() => {
    const result: Record<WorkType | "all", number> = { all: projects.length, client: 0, own: 0, "ai-concept": 0 };
    projects.forEach((project) => { result[resolveWorkType(project)] += 1; });
    return result;
  }, []);

  return (
    <main id="main" className={styles.page}>
      <header className={styles.masthead}>
        <Link href="/" className={styles.wordmark}>Lakkan<span>.</span></Link>
        <nav aria-label="Worksページ内ナビゲーション">
          <a href="#selected">Selected</a>
          <a href="#archive">Archive</a>
          <a href="#process">Process</a>
        </nav>
        <Link href="/contact?topic=portfolio" className={styles.headerCta}>相談する <ArrowUpRight size={14} /></Link>
      </header>

      <section className={styles.hero} aria-labelledby="portfolio-title">
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Works / Lakkan Inc. / 2026</p>
            <h1 id="portfolio-title"><span>構想を、</span><span className={styles.heroAccent}>動くものへ。</span></h1>
            <p className={styles.heroLede}>実案件、自社プロダクト、AIだけで作ったデザイン実験。種類を混ぜず、実際に動いている画面で、Lakkanの設計と実装を見せます。</p>
            <div className={styles.heroActions}>
              <a href="#selected" className={styles.primaryAction}>作品を見る <ArrowDown size={16} /></a>
              <Link href="/contact?topic=portfolio" className={styles.secondaryAction}>制作を相談する <ArrowUpRight size={16} /></Link>
            </div>
          </div>
          <div className={styles.heroFrames} aria-label="公開中の代表作品">
            <HeroFrame project={featured[0]} variant="primary" onOpen={setSelectedProject} />
            <HeroFrame project={featured[2]} variant="secondary" onOpen={setSelectedProject} />
            <HeroFrame project={featured[1]} variant="tertiary" onOpen={setSelectedProject} />
          </div>
        </div>
      </section>

      <section className={styles.proofStrip} aria-label="公開作品の内訳">
        <div className={styles.proofStatement}><b>Proof over promise.</b><span>説明より先に、動く画面を出す。</span></div>
        {(["client", "own", "ai-concept"] as const).map((type) => (
          <div className={styles.proofMetric} key={type}>
            <strong>{String(counts[type]).padStart(2, "0")}</strong>
            <span>{TYPE_META[type].label}</span>
            <small>{TYPE_META[type].description}</small>
          </div>
        ))}
      </section>

      <section id="selected" className={styles.selectedSection} aria-labelledby="selected-title">
        <div className={styles.sectionHead}>
          <p className={styles.sectionLabel}>01 / Selected work</p>
          <div><h2 id="selected-title">いま見せたい、<br />三つの仕事。</h2><p>写真で信頼をつくる。情報を編集する。使うほど育つAIを設計する。異なる三つの課題を、実装までつないだ仕事です。</p></div>
        </div>
        <div className={styles.featuredGrid}>
          <FeaturedWork project={featured[0]} variant="primary" onOpen={setSelectedProject} />
          <FeaturedWork project={featured[1]} variant="secondary" onOpen={setSelectedProject} />
          <FeaturedWork project={featured[2]} variant="secondary" onOpen={setSelectedProject} />
        </div>
      </section>

      <section id="archive" className={styles.archiveSection} aria-labelledby="archive-title">
        <div className={styles.sectionHead}>
          <p className={styles.sectionLabel}>02 / Public archive</p>
          <div><h2 id="archive-title">公開中の仕事だけ。</h2><p>社内ツール、非公開案件、準備中の構想は載せません。クリックすると制作区分と公開サイトを確認できます。</p></div>
        </div>
        <div className={styles.filterBar}>
          <div className={styles.filters} role="group" aria-label="作品区分で絞り込む">
            {(["all", "client", "own", "ai-concept"] as const).map((type) => (
              <button key={type} type="button" data-work-filter={type} aria-pressed={activeType === type} onClick={() => setActiveType(type)}>
                {TYPE_META[type].short}<span>{String(counts[type]).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
          <span className={styles.resultCount}>{String(visibleProjects.length).padStart(2, "0")} public works</span>
        </div>
        <div className={styles.archiveGrid}>
          {visibleProjects.map((project, index) => <ArchiveCard key={project.id} project={project} index={index} onOpen={setSelectedProject} />)}
        </div>
      </section>

      <section id="process" className={styles.processSection} aria-labelledby="process-title">
        <div className={styles.processImage}>
          <Image src="/photo.jpg" alt="株式会社Lakkan代表の山中秀斗" fill sizes="(max-width: 760px) 100vw, 42vw" className={styles.founderImage} />
          <span>Shuto Yamanaka / Lakkan</span>
        </div>
        <div className={styles.processCopy}>
          <p className={styles.processLabel}>03 / Human in the loop</p>
          <h2 id="process-title">AIだけで速く。<br />判断は、人が持つ。</h2>
          <p className={styles.processLede}>AIに全部を任せるのではなく、良いものを選ぶ判断、誰に何を伝えるか、公開してよいかを人が持つ。だから速さと品質を両立できます。</p>
          <ol className={styles.processList}>
            <li><span>01</span><div><b>見つける</b><p>業界を越えて参考サイトを集め、良い点と弱い点を比較する。</p></div></li>
            <li><span>02</span><div><b>決める</b><p>主参考、素材、方向性は山中が選び、採用しない表現も残す。</p></div></li>
            <li><span>03</span><div><b>実装する</b><p>画像、フロントエンド、4画面幅のQA、公開確認まで一つの流れで進める。</p></div></li>
          </ol>
          <Link href="/atelier" className={styles.processLink}>AIデザイン実験を見る <ArrowUpRight size={16} /></Link>
        </div>
      </section>

      <section id="closing" className={styles.closing} aria-labelledby="closing-title">
        <p>Start with a real screen.</p>
        <h2 id="closing-title">次は、あなたの仕事を<br />動く画面に。</h2>
        <div className={styles.closingActions}>
          <Link href="/contact?topic=portfolio" className={styles.primaryAction}>制作を相談する <ArrowUpRight size={16} /></Link>
          <Link href="/atelier" className={styles.secondaryAction}>Atelierを見る <ArrowUpRight size={16} /></Link>
        </div>
      </section>

      <footer id="page-footer" className={styles.footer}>
        <Link href="/" className={styles.footerLogo}>Lakkan<span>.</span></Link>
        <p>AI product / Web design / Workflow redesign</p>
        <span>© 2026 Lakkan Inc.</span>
      </footer>

      {selectedProject && <WorkDialog project={selectedProject} onClose={closeProject} />}
    </main>
  );
}
