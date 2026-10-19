import { motion, type HTMLMotionProps } from "motion/react";
import { revealTransition, useSeen } from "@/lib/seen";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number };

export function Reveal({ delay = 0, y = 28, children, ...rest }: Props) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={seen === "idle" ? { opacity: 0, y } : { opacity: 1, y: 0 }}
      transition={revealTransition(seen, { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] })}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
