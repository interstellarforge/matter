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

export interface FieldControlProps {
  id: string;
  "aria-describedby"?: string | undefined;
  invalid?: boolean | undefined;
  required?: boolean | undefined;
}

export interface BreadcrumbItem {
  label: string;
  /** Omit on the last item (the current page). */
  href?: string;
}

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DataTableColumn {
  id: string;
  header: string;
  sortable?: boolean;
}

export type SortDirection = "ascending" | "descending";

export interface DataTableSort {
  columnId: string;
  direction: SortDirection;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  current?: boolean;
}

export interface SidebarGroup {
  id: string;
  label?: string;
  items: SidebarItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export type ToastTone = "info" | "success" | "warning" | "danger";

export interface ToastItem {
  id: string;
  tone?: ToastTone;
  title?: string;
  message: string;
  action?: { label: string; onAction: () => void };
  /** Milliseconds before auto-dismiss; default 5000, `0` keeps it until dismissed. */
  duration?: number;
}

export interface UploadFile {
  id: string;
  name: string;
  /** 0-100; omit when not uploading. */
  progress?: number;
  error?: string;
  previewUrl?: string;
}

export interface CalendarLabels {
  /** Accessible name of the button that opens the calendar; receives the input's `aria-label`. */
  openLabel: (field: string) => string;
  previousMonthLabel: string;
  nextMonthLabel: string;
  /** Shows a "today" button when set. */
  todayLabel?: string;
}

export type ScoreRingTone =
  "accent" | "info" | "success" | "warning" | "danger";

export interface BarChartItem {
  id?: string;
  /** Short category label under the bar, e.g. "Mon". */
  label: string;
  value: number;
  /** Value as text, e.g. "12 vacancies". Defaults to the number. */
  valueLabel?: string;
}

export interface SortableMove {
  id: string;
  /** Index before and after the move. */
  from: number;
  to: number;
  /** All ids in the new order. */
  ids: string[];
}

export interface KanbanColumn<T extends { id: string }> {
  id: string;
  title: string;
  /** Colour of the dot before the title. */
  tone?: "neutral" | "accent" | "info" | "success" | "warning" | "danger";
  items: T[];
}

export interface KanbanMove {
  id: string;
  fromColumn: string;
  toColumn: string;
  /** Position in the target column once the card is removed from its old place. */
  index: number;
}

export interface ColorSwatchOption {
  value: string;
  /** Accessible name, e.g. "Teal". */
  label: string;
  /** Any CSS colour. */
  color: string;
}
