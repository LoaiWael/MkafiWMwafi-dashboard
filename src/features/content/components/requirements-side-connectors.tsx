import { motion, type Variants } from "motion/react";

interface RequirementsSideConnectorsProps {
  side: "start" | "end";
}

const pathVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 0.9,
    transition: {
      duration: 0.9,
      ease: [0.21, 0.47, 0.32, 0.98],
      delay: 0.2,
    },
  },
};

const dotVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0, 0, 0.2, 1],
      delay: 0.7,
    },
  },
};

export default function RequirementsSideConnectors({
  side,
}: RequirementsSideConnectorsProps) {
  const isStart = side === "start";

  return (
    <div className="relative size-full text-primary-700">
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="size-full overflow-visible"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        >
          {isStart ? (
            <>
              <motion.path variants={pathVariants} d="M -15 50 H 100" />
              <motion.path
                variants={pathVariants}
                d="M -15 50 H -5 C 8 50, 20 42, 20 32 L 20 28 C 20 20, 28 16.67, 38 16.67 H 100"
              />
              <motion.path
                variants={pathVariants}
                d="M -15 50 H -5 C 8 50, 20 58, 20 68 L 20 72 C 20 80, 28 83.33, 38 83.33 H 100"
              />
            </>
          ) : (
            <>
              <motion.path variants={pathVariants} d="M 115 50 H 0" />
              <motion.path
                variants={pathVariants}
                d="M 115 50 H 105 C 92 50, 80 42, 80 32 L 80 28 C 80 20, 72 16.67, 62 16.67 H 0"
              />
              <motion.path
                variants={pathVariants}
                d="M 115 50 H 105 C 92 50, 80 58, 80 68 L 80 72 C 80 80, 72 83.33, 62 83.33 H 0"
              />
            </>
          )}
        </g>
      </motion.svg>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {isStart ? (
          <>
            <motion.span
              variants={dotVariants}
              className="absolute top-1/6 inset-s-0 size-1.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-700"
            />
            <motion.span
              variants={dotVariants}
              className="absolute top-1/2 inset-s-0 size-1.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-700"
            />
            <motion.span
              variants={dotVariants}
              className="absolute top-5/6 inset-s-0 size-1.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-700"
            />
          </>
        ) : (
          <>
            <motion.span
              variants={dotVariants}
              className="absolute top-1/6 inset-e-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-700"
            />
            <motion.span
              variants={dotVariants}
              className="absolute top-1/2 inset-e-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-700"
            />
            <motion.span
              variants={dotVariants}
              className="absolute top-5/6 inset-e-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-700"
            />
          </>
        )}
      </motion.div>
    </div>
  );
}
