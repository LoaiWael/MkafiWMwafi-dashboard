import { motion, type Variants } from "motion/react";
import EditableText from "@/features/content/components/editable-text";
import { HERO_STATS } from "@/features/content/constants";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.45,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

const statNumberFormat = new Intl.NumberFormat("en-US");

export default function HeroStats() {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-20px" }}
      className="flex w-full items-end justify-between gap-2 sm:ms-auto sm:w-auto sm:justify-end sm:gap-6 md:gap-10 lg:gap-12"
      aria-label="إحصائيات المنصة"
    >
      {HERO_STATS.map((stat) => (
        <motion.li
          key={stat.id}
          variants={itemVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="flex min-w-0 flex-1 cursor-default flex-col items-center gap-0.5 text-center sm:flex-initial sm:items-start sm:gap-1 sm:text-start"
        >
          <div className="text-base font-bold text-primary-foreground tabular-nums sm:text-2xl md:text-3xl lg:text-4xl">
            <EditableText
              defaultValue={statNumberFormat.format(stat.value)}
              label={`تعديل الرقم: ${stat.label}`}
              dir="ltr"
              className="tabular-nums"
              inputClassName="h-8 w-16 text-center text-xs font-bold tabular-nums sm:h-10 sm:w-24 sm:text-base"
            />
          </div>
          <div className="text-2xs font-medium text-primary-foreground/90 sm:text-sm md:text-base">
            <EditableText
              defaultValue={stat.label}
              label={`تعديل التسمية: ${stat.label}`}
              inputClassName="h-8 w-20 text-center text-xs font-medium sm:h-10 sm:w-32 sm:text-start sm:text-base"
            />
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
