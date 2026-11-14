"use client";
import * as React from "react";
import { motion, useMotionValue, useSpring, useVelocity, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

type CursorProviderProps = { children: React.ReactNode; global?: boolean; className?: string };
type CursorContextValue = { x: ReturnType<typeof useMotionValue<number>>; y: ReturnType<typeof useMotionValue<number>>; active: boolean; visible: boolean };
const CursorContext = React.createContext<CursorContextValue | null>(null);
function useMewCursor() {
  const value = React.useContext(CursorContext);
  if (!value) throw new Error("Cursor must be used within CursorProvider");
  return value;
}
export function CursorProvider({ children, global = true, className }: CursorProviderProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [active, setActive] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    const fine = window.matchMedia("(hover:hover) and (pointer:fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion:reduce)");
    const update = () => setEnabled(fine.matches && !reduced.matches);
    update();
    fine.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => { fine.removeEventListener("change", update); reduced.removeEventListener("change", update); };
  }, []);
  React.useEffect(() => {
    if (!enabled) return;
    const node = global ? document : ref.current;
    if (!node) return;
    const move = (event: Event) => {
      const e = event as PointerEvent;
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX); y.set(e.clientY);
      setVisible(true);
      setActive(!!(e.target as Element)?.closest?.("a,button,input,select,textarea,[role=button]"));
    };
    const leave = () => { setVisible(false); setActive(false); };
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", leave);
    return () => { node.removeEventListener("pointermove", move); node.removeEventListener("pointerleave", leave); };
  }, [enabled, global, x, y]);
  return <div ref={ref} className={cn("contents", className)}>
    <CursorContext.Provider value={{ x, y, active, visible: visible && enabled }}>{children}</CursorContext.Provider>
  </div>;
}
export function Cursor({ className }: { className?: string }) {
  const { x, y, visible } = useMewCursor();
  const smoothX = useSpring(x, { damping:25, stiffness:300 });
  const smoothY = useSpring(y, { damping:25, stiffness:300 });
  const vx = useVelocity(smoothX), vy = useVelocity(smoothY);
  const rotate = useSpring(useTransform([vx, vy], ([a,b]) => Math.max(-45,Math.min(45,((a as number)+(b as number))*.03))), { damping:15, stiffness:200 });
  const scale = useTransform([vx, vy], ([a,b]) => 1-Math.min(Math.hypot(a as number,b as number)/2000,.1));
  return <motion.div aria-hidden="true" className="pointer-events-none fixed z-[9999]" style={{ left:smoothX, top:smoothY, x:"-4.5%", y:"-11%", opacity:visible?1:0 }}>
    <motion.svg className={cn("size-7 text-[#c58c64] drop-shadow-md",className)} viewBox="0 0 40 40" style={{rotate,scale,transformOrigin:"4.5% 11%"}}>
      <path fill="currentColor" stroke="#fff3e7" strokeWidth="1.7" paintOrder="stroke fill" d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"/>
    </motion.svg>
  </motion.div>;
}
export function CursorFollow({children="Explorar",className}:{children?:React.ReactNode;className?:string}) {
  const {x,y,active,visible}=useMewCursor();
  const sx=useSpring(x,{damping:25,stiffness:300}),sy=useSpring(y,{damping:25,stiffness:300});
  const vx=useVelocity(sx),vy=useVelocity(sy);
  const scaleX=useTransform(vx,[-1000,0,1000],[.9,1,1.15]);
  const scaleY=useTransform(vy,[-1000,0,1000],[1.15,1,.9]);
  const skewX=useTransform(vx,[-1000,0,1000],[-3,0,3]);
  const skewY=useTransform(vy,[-1000,0,1000],[-3,0,3]);
  return <motion.div aria-hidden="true" className={cn("pointer-events-none fixed z-[9998] rounded-lg border border-[#c58c64] bg-[#3c2a21] px-3 py-2 font-['Montserrat'] text-xs font-semibold text-[#fff7ed]",className)}
    style={{left:sx,top:sy,x:20,y:22,scaleX,scaleY,skewX,skewY,opacity:visible&&active?1:0}}>{children}</motion.div>;
}
export default Cursor;
