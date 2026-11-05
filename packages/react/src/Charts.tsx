import type { ComponentProps, CSSProperties } from "react";

import { cx } from "./cx.ts";

export type ScoreRingTone =
  "accent" | "info" | "success" | "warning" | "danger";

export interface ScoreRingProps extends ComponentProps<"div"> {
  /** Accessible name (required), e.g. "Match". */
  label: string;
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  tone?: ScoreRingTone;
  /** Spoken value; defaults to the rounded percentage. */
  valueText?: string;
}

const percentOf = (value: number, max: number) =>
  Math.min(100, Math.max(0, (value / max) * 100));

/** The centre shows the rounded percentage unless `children` replaces it. */
export function ScoreRing({
  label,
  value,
  max = 100,
  size = "md",
  tone = "accent",
  valueText,
  className,
  style,
  children,
  ...rest
}: ScoreRingProps) {
  const percent = percentOf(value, max);
  const text = `${String(Math.round(percent))}%`;
  return (
    <div
      {...rest}
      className={cx("m-score-ring", className)}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={valueText ?? text}
      data-size={size}
      data-tone={tone}
      data-empty={percent === 0 ? "" : undefined}
      style={{ ...style, "--m-score": percent } as CSSProperties}
    >
      <svg
        className="m-score-ring__svg"
        viewBox="0 0 36 36"
        aria-hidden="true"
        focusable="false"
      >
        <circle className="m-score-ring__track" cx="18" cy="18" r="16" />
        <circle
          className="m-score-ring__arc"
          cx="18"
          cy="18"
          r="16"
          pathLength="100"
        />
      </svg>
      <span className="m-score-ring__text" aria-hidden="true">
        {children ?? text}
      </span>
    </div>
  );
}

export interface BarChartItem {
  id?: string;
  /** Short category label under the bar, e.g. "Mon". */
  label: string;
  value: number;
  /** Value as text, e.g. "12 vacancies". Defaults to the number. */
  valueLabel?: string;
}

export interface BarChartProps extends Omit<ComponentProps<"div">, "children"> {
  /** Accessible name of the chart (required). */
  label: string;
  data: BarChartItem[];
  /** Value that fills the full height; defaults to the largest value. */
  max?: number;
}

export function BarChart({
  label,
  data,
  max,
  className,
  ...rest
}: BarChartProps) {
  const top = max ?? Math.max(1, ...data.map((item) => item.value));
  return (
    <div
      {...rest}
      className={cx("m-barchart", className)}
      role="group"
      aria-label={label}
    >
      <ul className="m-barchart__bars" role="list">
        {data.map((item) => {
          const text = item.valueLabel ?? String(item.value);
          return (
            <li
              key={item.id ?? item.label}
              className="m-barchart__bar"
              style={
                {
                  "--m-bar": `${String(percentOf(item.value, top))}%`,
                } as CSSProperties
              }
            >
              <span className="m-barchart__track" aria-hidden="true">
                <span className="m-barchart__value">{text}</span>
                <span className="m-barchart__fill" />
              </span>
              <span className="m-barchart__label" aria-hidden="true">
                {item.label}
              </span>
              <span className="m-sr-only">{`${item.label}: ${text}`}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
