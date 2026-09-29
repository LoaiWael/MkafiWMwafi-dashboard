import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { HERO_VIDEO_SRC } from "@/features/content/constants";

interface HeroVideoProps {
  src?: string;
  poster?: string;
}

export default function HeroVideo({
  src = HERO_VIDEO_SRC,
  poster,
}: HeroVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= 2) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.08,
        }}
        transition={{
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="size-full"
      >
        <video
          ref={videoRef}
          aria-hidden="true"
          autoPlay
          loop
          muted
          playsInline
          poster={poster}
          onLoadedData={() => setIsLoaded(true)}
          onPlaying={() => setIsLoaded(true)}
          className="size-full object-cover object-center"
        >
          <source src={src} type="video/mp4" />
        </video>
      </motion.div>
    </div>
  );
}
