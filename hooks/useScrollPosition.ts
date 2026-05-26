import { useEffect, useState } from "react";

interface ScrollPosition {
  x: number;
  y: number;
}

export default function useScrollPosition(): {
  scroll: ScrollPosition;
  scrollTo: ({ x, y }: ScrollPosition) => void;
} {
  const [scroll, setScroll] = useState<ScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScroll({ x: window.pageXOffset, y: window.pageYOffset });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollTo = ({ x, y }: ScrollPosition) => {
    window.scrollTo(x, y);
  };

  return { scroll, scrollTo };
}
