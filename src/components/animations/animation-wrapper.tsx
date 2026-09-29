"use client"

import React from "react"
import { motion, type HTMLMotionProps, type Variants } from "motion/react"
import { cn } from "@/lib/utils"

export interface FadeInProps extends HTMLMotionProps<"div"> {
  direction?: "up" | "down" | "left" | "right" | "none"
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
  children?: React.ReactNode
  className?: string
}

/**
 * Client animation wrapper for fading in elements on viewport entry.
 * Keeps parent pages/sections as Server Components for SEO.
 */
export function FadeIn({
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance = 24,
  once = true,
  children,
  className,
  ...props
}: FadeInProps) {
  const getInitialOffset = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 }
      case "down":
        return { y: -distance, x: 0 }
      case "left":
        return { x: distance, y: 0 }
      case "right":
        return { x: -distance, y: 0 }
      case "none":
      default:
        return { x: 0, y: 0 }
    }
  }

  const offset = getInitialOffset()

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export interface ScaleInProps extends HTMLMotionProps<"div"> {
  delay?: number
  duration?: number
  initialScale?: number
  once?: boolean
  children?: React.ReactNode
  className?: string
}

/**
 * Client animation wrapper for scale-in elements (e.g. badges, cards, center-pieces).
 */
export function ScaleIn({
  delay = 0,
  duration = 0.5,
  initialScale = 0.88,
  once = true,
  children,
  className,
  ...props
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  staggerDelay?: number
  delayChildren?: number
  once?: boolean
  children?: React.ReactNode
  className?: string
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: (custom: { staggerDelay: number; delayChildren: number }) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.staggerDelay,
      delayChildren: custom.delayChildren,
    },
  }),
}

const REVEAL_EASE = [0.21, 0.47, 0.32, 0.98] as const

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: REVEAL_EASE,
    },
  },
}

export interface MountFadeProps extends HTMLMotionProps<"div"> {
  delay?: number
  duration?: number
  distance?: number
  children?: React.ReactNode
  className?: string
}

/**
 * Plays once on mount. Use for dashboard content that is already in view,
 * including lists that remount when filters change.
 */
export function MountFade({
  delay = 0,
  duration = 0.28,
  distance = 8,
  children,
  className,
  ...props
}: MountFadeProps) {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: REVEAL_EASE }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

/**
 * Direct child of `AnimatePresence` for tab panels.
 * Enter uses a short transform; exit is opacity-only so large tables
 * are not translated off-screen.
 */
export function AnimatedPanel({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16, ease: REVEAL_EASE }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

/**
 * Stagger container wrapper to animate child `StaggerItem` elements sequentially.
 */
export function StaggerContainer({
  staggerDelay = 0.1,
  delayChildren = 0,
  once = true,
  children,
  className,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={containerVariants}
      custom={{ staggerDelay, delayChildren }}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-40px" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={itemVariants} className={cn(className)} {...props}>
      {children}
    </motion.div>
  )
}

export function StaggerListItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"li">) {
  return (
    <motion.li variants={itemVariants} className={cn(className)} {...props}>
      {children}
    </motion.li>
  )
}

export interface AnimatedProgressBarProps {
  progress: number
  className?: string
  barClassName?: string
  duration?: number
  delay?: number
}

export function AnimatedProgressBar({
  progress,
  className,
  barClassName,
  duration = 1.2,
  delay = 0.2,
}: AnimatedProgressBarProps) {
  return (
    <div className={cn("overflow-hidden rounded-full bg-muted", className)}>
      <motion.div
        className={cn("h-full rounded-full", barClassName)}
        initial={{ width: 0 }}
        whileInView={{ width: `${progress}%` }}
        viewport={{ once: true }}
        transition={{ duration, delay, ease: [0.25, 1, 0.5, 1] }}
      />
    </div>
  )
}

export interface FloatProps extends HTMLMotionProps<"div"> {
  distance?: number
  duration?: number
  delay?: number
  children?: React.ReactNode
  className?: string
}

/**
 * Continuous gentle floating animation component.
 */
export function Float({
  distance = 8,
  duration = 3.5,
  delay = 0,
  children,
  className,
  ...props
}: FloatProps) {
  return (
    <motion.div
      animate={{
        y: [-distance / 2, distance / 2, -distance / 2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export interface ScaleBackgroundProps extends HTMLMotionProps<"div"> {
  initialScale?: number
  targetScale?: number
  duration?: number
  delay?: number
  children?: React.ReactNode
  className?: string
}

/**
 * Smooth scale & reveal animation for hero background images/media.
 */
export function ScaleBackground({
  initialScale = 1.15,
  targetScale = 1,
  duration = 1.6,
  delay = 0,
  children,
  className,
  ...props
}: ScaleBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        initial={{ scale: initialScale, opacity: 0.7 }}
        animate={{ scale: targetScale, opacity: 1 }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={cn("absolute inset-0 size-full", className)}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  )
}

export interface WiggleProps extends HTMLMotionProps<"span"> {
  delay?: number
  duration?: number
  children?: React.ReactNode
  className?: string
}

/**
 * Playful wiggle/wave animation (e.g. waving hand emoji or interactive highlights).
 */
export function Wiggle({
  delay = 0.5,
  duration = 1.4,
  children,
  className,
  ...props
}: WiggleProps) {
  return (
    <motion.span
      animate={{
        rotate: [0, 14, -8, 14, -4, 10, 0],
      }}
      transition={{
        duration,
        delay,
        ease: "easeInOut",
      }}
      className={cn("inline-block origin-bottom-right select-none", className)}
      {...props}
    >
      {children}
    </motion.span>
  )
}