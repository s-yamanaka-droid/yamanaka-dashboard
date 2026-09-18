"use client";

// Adapted from Sora UI Text Reveal (Mask), retrieved through 21st.dev.
// Copyright (c) 2026 Alexsandr Senaviev. See docs/vendor/sora-ui-LICENSE.md.
// Retain overflow masks, EXPO_OUT and stagger; preserve explicit Japanese lines.
import { useRef, useSyncExternalStore } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const subscribe = () => () => {};
const EXPO_OUT = [.19, 1, .22, 1] as const;

export function BrandHeading({children, as:Tag="h2", className, delay=0}: {
  children:string; as?:"h1"|"h2"; className?:string; delay?:number;
}) {
  const ref=useRef<HTMLHeadingElement>(null);
  const hydrated=useSyncExternalStore(subscribe,()=>true,()=>false);
  const reduced=useReducedMotion();
  const inView=useInView(ref,{once:true,margin:"0px 0px -8% 0px"});
  const animated=hydrated && !reduced;
  return <Tag ref={ref} className={className} aria-label={children.replaceAll("\n", " ")}
    data-brand-reveal={animated ? (inView ? "revealed" : "waiting") : "static"}>
    {children.split("\n").map((line,index)=><span key={`${index}-${line}`}
      aria-hidden="true" style={{display:"block",overflow:animated?"hidden":"visible",paddingBlock:".07em",marginBlock:"-.07em"}}>
      {animated ? <motion.span style={{display:"block"}}
        initial={{y:"110%"}}
        animate={{y:inView?"0%":"110%"}}
        transition={{duration:.8,delay:delay+index*.08,ease:EXPO_OUT}}>
        {line}
      </motion.span> : line}
    </span>)}
  </Tag>;
}
