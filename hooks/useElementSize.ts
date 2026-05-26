import { useEffect, useState, useRef } from "react";

export default function useElementSize(): {
  ref: React.MutableRefObject<HTMLElement | null>;
  width: number;
  height: number;
} {
  const ref = useRef<HTMLElement | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
        setHeight(ref.current.offsetHeight);
      }
    };

    handleResize(); // Initial measurement

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { ref, width, height };
}
