"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Shared timing follows the adopted Sora/21st masked headings. Content remains
// readable in server HTML and when JavaScript or animation support is absent.
const EASE = "cubic-bezier(.19,1,.22,1)";
const GROUPS = ".water-hero-top, .water-hero-caption, .water-editorial-label, .water-project, .water-offerings>a, .water-all-work, .water-contact-top, .water-contact-link, .brand-service-art, .lab-services>a, .sv-process>li, .sv-faq>details, .company-section dl>div, .brand-portfolio article";

export function SiteMotion({ children }: { children: ReactNode }) {
 const root = useRef<HTMLDivElement>(null);
 const progress = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const container = root.current;
  if (!container) return;
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  let dispose = () => {};
  const configure = () => {
   dispose();
   if (preference.matches) return;
   const animations = new Set<Animation>();
   const registered = new WeakSet<Element>();
   const completed = new WeakSet<Element>();
   const groups = new Set<Element>();
   const reveal = new IntersectionObserver(entries => {
    let order = 0;
    for (const entry of entries) {
     if (!entry.isIntersecting || completed.has(entry.target)) continue;
     const el = entry.target as HTMLElement;
     completed.add(el); reveal.unobserve(el);
     // Never animate a focused control away from the person using it.
     if (el.contains(document.activeElement)) continue;
     const artwork = el.matches(".water-project, .brand-portfolio article, .brand-service-art");
     const anim = el.animate(artwork ? [
      { opacity: .3, clipPath: "inset(12% 0 12% 0 round 8% 8% 8% 8%)", transform: "translate3d(0,48px,0) scale(.97)" },
      { opacity: 1, clipPath: "inset(0% 0 0% 0 round 0% 0% 0% 0%)", transform: "translate3d(0,0,0) scale(1)" },
     ] : [
      { opacity: .1, transform: "translate3d(0,30px,0)" },
      { opacity: 1, transform: "translate3d(0,0,0)" },
     ], { duration: artwork ? 1450 : 1050, delay: Math.min(order++ * 85, 255), easing: EASE, fill: "backwards" });
     animations.add(anim); el.dataset.motionState = "revealing";
     void anim.finished.then(() => { el.dataset.motionState = "revealed"; animations.delete(anim); }).catch(() => {});
    }
   }, { threshold: .08, rootMargin: "0px 0px -4% 0px" });
   const register = () => {
    container.querySelectorAll(GROUPS).forEach(el => groups.add(el));
    const candidates = [
     ...groups,
     ...container.querySelectorAll("section h1, section h2, section p, .contact-intro, .contact-form, .brand-text-link"),
     ...document.querySelectorAll(".original-footer-brand, .original-footer nav"),
    ];
    for (const el of candidates) {
     if (registered.has(el) || el.hasAttribute("data-brand-reveal") || el.closest("[data-brand-reveal]")) continue;
     if ([...groups].some(parent => parent !== el && parent.contains(el))) continue;
     registered.add(el); reveal.observe(el);
    }
   };
   register();
   // Newly filtered works are real DOM replacements; animate their entry too.
   const changes = new MutationObserver(register);
   changes.observe(container, { childList: true, subtree: true });
   let frame = 0;
   const images = new Set<HTMLElement>();
   const drifting = new Set<HTMLElement>();
   const magnetic = new Set<HTMLElement>();
   let activeLink: HTMLElement | null = null;
   const resetLink = () => {
    activeLink?.style.removeProperty("--pointer-x");
    activeLink?.style.removeProperty("--pointer-y");
    activeLink = null;
   };
   const pointer = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const link = (event.target as Element).closest<HTMLElement>(".water-offerings>a, .water-all-work, .water-contact-art, .brand-text-link, .sv-button");
    if (link !== activeLink) resetLink();
    if (!link) return;
    activeLink = link; magnetic.add(link);
    const rect = link.getBoundingClientRect();
    link.style.setProperty("--pointer-x", `${((event.clientX - rect.left) / rect.width - .5) * 16}px`);
    link.style.setProperty("--pointer-y", `${((event.clientY - rect.top) / rect.height - .5) * 12}px`);
   };
   container.addEventListener("pointermove", pointer, { passive: true });
   container.addEventListener("pointerleave", resetLink);
   const update = () => {
    frame = 0;
    const distance = document.documentElement.scrollHeight - innerHeight;
    if (progress.current) progress.current.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0})`;
    // Next can stream children after this effect mounts. Read current artwork
    // nodes on each scheduled scroll frame instead of retaining an empty list.
    for (const image of container.querySelectorAll<HTMLElement>(".water-project-visual")) {
     images.add(image);
     const rect = image.getBoundingClientRect();
     if (rect.bottom < 0 || rect.top > innerHeight) continue;
     const offset = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight));
     image.style.setProperty("--water-drift", `${offset * (innerWidth < 761 ? 10 : 26)}px`);
    }
    for (const heading of container.querySelectorAll<HTMLElement>(".water-editorial-label, .water-page-kicker, .water-contact-top")) {
     drifting.add(heading);
     const rect = heading.getBoundingClientRect();
     if (rect.bottom < 0 || rect.top > innerHeight) continue;
     const amount = Math.max(-1, Math.min(1, (rect.top - innerHeight * .5) / innerHeight));
     heading.style.setProperty("--heading-drift", `${amount * (innerWidth < 761 ? 8 : 22)}px`);
    }
   };
   const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
   window.addEventListener("scroll", schedule, { passive: true });
   window.addEventListener("resize", schedule); schedule();
   dispose = () => {
    reveal.disconnect(); changes.disconnect(); cancelAnimationFrame(frame);
    animations.forEach(anim => anim.cancel());
    window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
    images.forEach(image => image.style.removeProperty("--water-drift"));
    drifting.forEach(el => el.style.removeProperty("--heading-drift"));
    magnetic.forEach(el => { el.style.removeProperty("--pointer-x"); el.style.removeProperty("--pointer-y"); });
    container.removeEventListener("pointermove", pointer); container.removeEventListener("pointerleave", resetLink);
    if (progress.current) progress.current.style.transform = "scaleX(0)";
   };
  };
  configure(); preference.addEventListener("change", configure);
  return () => { dispose(); preference.removeEventListener("change", configure); };
 }, []);
 return <div ref={root} className="brand-page-enter"><div ref={progress} className="water-reading-progress" aria-hidden="true"/>{children}</div>;
}
