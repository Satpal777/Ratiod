import { useState, useEffect } from "react";

export function useScroll(threshold = 18) {
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > threshold);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > threshold);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return isScrolled;
}
