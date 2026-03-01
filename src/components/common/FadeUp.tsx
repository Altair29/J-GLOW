"use client";

import { useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// FadeUp — スクロール連動 ふわっと上昇アニメーション
//
// 使い方:
//   <FadeUp>
//     <SomeSection />
//   </FadeUp>
//
// 複数要素を順番にアニメーション（stagger）させたい場合:
//   <FadeUp delay={0}>   <SectionA /> </FadeUp>
//   <FadeUp delay={0.1}> <SectionB /> </FadeUp>
//   <FadeUp delay={0.2}> <SectionC /> </FadeUp>
// ─────────────────────────────────────────────────────────────

interface FadeUpProps {
  children: ReactNode;

  /** アニメーション開始までの遅延（秒）。連続要素のstaggerに使用 */
  delay?: number;

  /** 上から何px浮かせた位置から始めるか（デフォルト: 32px） */
  distance?: number;

  /** アニメーション時間（秒）（デフォルト: 0.6s） */
  duration?: number;

  /** 何割画面に入ったら発火するか 0〜1（デフォルト: 0.15 = 15%） */
  threshold?: number;

  /** 一度発火したら再アニメーションしないか（デフォルト: true） */
  once?: boolean;

  /** Tailwindクラスなど追加のclassName */
  className?: string;
}

export function FadeUp({
  children,
  delay = 0,
  distance = 32,
  duration = 0.6,
  threshold = 0.15,
  once = true,
  className,
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    margin: `0px 0px -${Math.floor(distance / 2)}px 0px` as `${number}px ${number}px ${number}px ${number}px`,
    amount: threshold,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuart — 自然な減速感
      }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// FadeUpGroup — 子要素を順番に stagger アニメーションさせるラッパー
//
// 使い方:
//   <FadeUpGroup stagger={0.12}>
//     <Card />
//     <Card />
//     <Card />
//   </FadeUpGroup>
//
// ※ 直接の子要素それぞれがアニメーションされます
// ─────────────────────────────────────────────────────────────

interface FadeUpGroupProps {
  children: ReactNode;

  /** 子要素間のアニメーション間隔（秒）（デフォルト: 0.1s） */
  stagger?: number;

  distance?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}

const containerVariants = (stagger: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
    },
  },
});

const itemVariants = (distance: number, duration: number) => ({
  hidden: { opacity: 0, y: distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
});

export function FadeUpGroup({
  children,
  stagger = 0.1,
  distance = 28,
  duration = 0.55,
  threshold = 0.1,
  once = true,
  className,
}: FadeUpGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants(stagger)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* 直接の子要素それぞれにアニメーションを適用 */}
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={itemVariants(distance, duration)}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={itemVariants(distance, duration)}>{children}</motion.div>
      }
    </motion.div>
  );
}
