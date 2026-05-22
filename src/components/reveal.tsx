import * as React from "react";

type Variant = "up" | "down" | "left" | "right" | "scale" | "pop" | "fade";

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  delay?: number; // ms
  threshold?: number;
  as?: keyof React.JSX.IntrinsicElements;
  once?: boolean;
}

export function Reveal({
  variant = "up",
  delay = 0,
  threshold = 0.15,
  as = "div",
  once = true,
  className = "",
  style,
  children,
  ...rest
}: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setVisible(true), delay);
          if (once) obs.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [threshold, once, delay]);

  const Tag = as as any;
  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} ${visible ? "is-visible" : ""} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
