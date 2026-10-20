"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUpRight, X } from "lucide-react";
import projectsData from "@/data/projects.json";
import { Project, WorkType, resolveWorkType } from "@/types";
import styles from "./works.module.css";

const projects = projectsData as Project[];

const TYPE_META: Record<WorkType | "all", { label: string; short: string }> = {
  all: { label: "すべての公開作品", short: "All" },
  client: { label: "実案件・クライアントワーク", short: "Client" },
  own: { label: "Lakkan・関係会社のプロダクト", short: "Owned" },
  "ai-concept": { label: "AIによるデザイン実験", short: "AI Concept" },
};

const FEATURED_IDS = ["central-medical", "now-on-air", "luna-ai"];

function projectById(id: string) {
  return projects.find((project) => project.id === id) ?? projects[0];
}

function WorkLabel({ project }: { project: Project }) {
  const type = resolveWorkType(project);
  return <span className={`${styles.workLabel} ${styles[`workLabel_${type}`]}`}>{TYPE_META[type].short}</span>;
}

function SelectedWork({ project, index, onOpen }: { project: Project; index: number; onOpen: (project: Project) => void }) {
  return (
    <article className={styles.selectedCard}>
      <button type="button" onClick={() => onOpen(project)} aria-label={`${project.name}の詳細を見る`}>
        <div className={styles.selectedVisual}>
          {project.cover && (
            <Image
              src={project.cover}
              alt={project.coverAlt ?? `${project.name}の公開画面`}
              fill
              sizes="(max-width: 760px) 88vw, 78vw"
              priority={index < 2}
              className={styles.selectedImage}
            />
          )}
          <span className={styles.selectedNumber}>{String(index + 1).padStart(2, "0")}</span>
          <span className={styles.openHint}>Open case <ArrowUpRight size={15} /></span>
        </div>
        <div className={styles.selectedCaption}>
          <div className={styles.selectedMeta}><WorkLabel project={project} /><span>{project.client ?? "Lakkan"}</span></div>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
      </button>
    </article>
  );
}

function ArchiveRow({ project, index, onOpen }: { project: Project; index: number; onOpen: (project: Project) => void }) {
  return (
    <article className={styles.archiveRow}>
      <button type="button" data-work-card={project.id} onClick={() => onOpen(project)}>
        <span className={styles.archiveIndex}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.archiveThumb}>
          {project.cover && <Image src={project.cover} alt="" fill sizes="160px" loading="eager" unoptimized className={styles.archiveImage} />}
        </span>
        <span className={styles.archiveIdentity}>
          <span className={styles.archiveMeta}><WorkLabel project={project} /> {project.client ?? "Lakkan"}</span>
          <strong>{project.name}</strong>
        </span>
        <span className={styles.archiveDescription}>{project.description}</span>
        <ArrowUpRight className={styles.archiveArrow} size={22} aria-hidden="true" />
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
            <Image src={project.cover} alt={project.coverAlt ?? `${project.name}の公開画面`} fill sizes="(max-width: 760px) 100vw, 64vw" className={styles.dialogImage} priority />
          )}
        </div>
        <div className={styles.dialogBody}>
          <button type="button" className={styles.dialogClose} onClick={() => dialogRef.current?.close()} aria-label="詳細を閉じる"><X size={20} /></button>
          <div className={styles.dialogMeta}><WorkLabel project={project} /><span>{project.client ?? "Lakkan"}</span></div>
          <h2 id="work-dialog-title">{project.name}</h2>
          <p className={styles.dialogDescription}>{project.description}</p>
          <dl className={styles.dialogFacts}>
            <div><dt>Scope</dt><dd>{project.tags.slice(0, 3).join(" / ")}</dd></div>
            <div><dt>Built with</dt><dd>{project.builtWith === "claude_code" ? "Claude Code" : project.builtWith}</dd></div>
            <div><dt>Published</dt><dd>{project.createdAt.replaceAll("-", ".")}</dd></div>
          </dl>
          <div className={styles.dialogTags}>{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.dialogLink}>公開サイトを見る <ArrowUpRight size={17} /></a>}
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
        <Link href="/" className={styles.wordmark}>Lakkan<span>.</span><small>Works archive</small></Link>
        <nav aria-label="Worksページ内ナビゲーション">
          <a href="#selected">Selected</a><a href="#archive">Archive</a><a href="#human">Human</a>
        </nav>
        <Link href="/" className={styles.backLink}><ArrowLeft size={14} /> Home</Link>
      </header>

      <section className={styles.hero} aria-labelledby="portfolio-title">
        <div className={styles.eyebrow}><span /> Works <em>· v.0.3</em></div>
        <h1 id="portfolio-title">構想は、<br /><em>動くまでが</em><br />仕事だ。</h1>
        <div className={styles.heroBottom}>
          <p>実案件、自社プロダクト、AIによる実験。<br />説明より先に、公開された画面を見せます。</p>
          <div><strong>{String(projects.length).padStart(2, "0")}</strong><span>Public works<br />Built with AI</span></div>
          <a href="#selected">View selected <ArrowDown size={16} /></a>
        </div>
      </section>

      <section id="selected" className={styles.selectedSection} aria-labelledby="selected-heading">
        <div className={styles.sectionIntro}>
          <p>01 — Selected work</p>
          <h2 id="selected-heading">画面こそ、<br />いちばん強い<br />証拠。</h2>
          <span>Scroll sideways / Swipe</span>
        </div>
        <div className={styles.selectedRail}>
          {featured.map((project, index) => <SelectedWork key={project.id} project={project} index={index} onOpen={setSelectedProject} />)}
          <div className={styles.railEnd}><span>All public works</span><a href="#archive">Archiveへ <ArrowDown size={15} /></a></div>
        </div>
      </section>

      <section id="archive" className={styles.archiveSection} aria-labelledby="archive-title">
        <div className={styles.archiveHeading}>
          <p>02 — Public archive</p>
          <h2 id="archive-title">つくったものを、<br /><em>誤魔化さない。</em></h2>
        </div>
        <div className={styles.filterBar}>
          <span>{TYPE_META[activeType].label}</span>
          <div className={styles.filters} role="group" aria-label="作品区分で絞り込む">
            {(["all", "client", "own", "ai-concept"] as const).map((type) => (
              <button key={type} type="button" data-work-filter={type} aria-pressed={activeType === type} onClick={() => setActiveType(type)}>
                {TYPE_META[type].short}<span>{String(counts[type]).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.archiveList}>
          {visibleProjects.map((project, index) => <ArchiveRow key={project.id} project={project} index={index} onOpen={setSelectedProject} />)}
        </div>
      </section>

      <section id="human" className={styles.humanSection} aria-labelledby="human-title">
        <div className={styles.humanImage}><Image src="/photo.jpg" alt="株式会社Lakkan代表の山中秀斗" fill sizes="(max-width: 760px) 100vw, 48vw" className={styles.founderImage} /><span>Shuto Yamanaka · Founder</span></div>
        <div className={styles.humanCopy}>
          <p>03 — Human in the loop</p>
          <h2 id="human-title">AIで速く。<br /><em>判断は、人が持つ。</em></h2>
          <p className={styles.humanLede}>AIがつくる。人が選ぶ。良いものと微妙なものを見分け、公開できる品質まで責任を持つ。その判断まで含めて、Lakkanの仕事です。</p>
          <Link href="/contact?topic=portfolio" className={styles.humanLink}>一緒につくる <ArrowUpRight size={16} /></Link>
        </div>
      </section>

      <section id="closing" className={styles.closing}>
        <p>Next project — 2026</p>
        <h2>次は、あなたの<br /><em>構想を動かす。</em></h2>
        <Link href="/contact?topic=portfolio">制作・AI導入を相談する <ArrowUpRight size={18} /></Link>
      </section>

      <footer id="page-footer" className={styles.footer}>
        <Link href="/">Lakkan.</Link><em>楽観と、計画と。</em>
        <div><span>株式会社 Lakkan<br />東京都渋谷区神宮前</span><span>© 2026 Lakkan Inc.</span></div>
      </footer>

      {selectedProject && <WorkDialog project={selectedProject} onClose={closeProject} />}
    </main>
  );
}
