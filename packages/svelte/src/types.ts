export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ControlSize = "sm" | "md" | "lg";
export type BadgeTone =
  "neutral" | "accent" | "info" | "success" | "warning" | "danger";

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export type BannerTone = "info" | "success" | "warning" | "danger";
