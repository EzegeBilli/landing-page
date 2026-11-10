export type ToastType = "success" | "error" | "info";
export type ToastOptions = { title?: string; duration?: number };
export type Toast = { id: number; message: string; type: ToastType; title: string; duration: number };

const DEFAULT_TITLES: Record<ToastType, string> = {
  success: "Done",
  error: "Something went wrong",
  info: "Heads up",
};
const DEFAULT_DURATION: Record<ToastType, number> = { success: 6000, error: 10000, info: 7000 };
const MAX_VISIBLE = 3;

let items: Toast[] = [];
let nextId = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export const toastStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
  getSnapshot: () => items,
  dismiss(id: number) {
    items = items.filter((item) => item.id !== id);
    emit();
  },
};

// Timing (auto-dismiss, pause on hover) lives in the Toasts component.
function show(message: string, type: ToastType, options: ToastOptions = {}) {
  const id = ++nextId;
  const toast: Toast = {
    id,
    message,
    type,
    title: options.title ?? DEFAULT_TITLES[type],
    duration: options.duration ?? DEFAULT_DURATION[type],
  };
  items = [...items.slice(-(MAX_VISIBLE - 1)), toast];
  emit();
  return id;
}

export const toast = {
  success: (message: string, options?: ToastOptions) => show(message, "success", options),
  error: (message: string, options?: ToastOptions) => show(message, "error", options),
  info: (message: string, options?: ToastOptions) => show(message, "info", options),
  dismiss: (id: number) => toastStore.dismiss(id),
};
