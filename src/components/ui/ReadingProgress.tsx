"use client";

import { useEffect, useState } from "react";

interface ReadingProgressProps {
  className?: string;
}

export default function ReadingProgress({ className = "" }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      // Only show on pages with enough scrollable content
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight < 500) {
        setIsVisible(false);
        return;
      }

      setIsVisible(true);
      const scrollTop = window.scrollY;
      const progress = (scrollTop / scrollHeight) * 100;
      setProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50 ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
