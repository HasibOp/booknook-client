const FLASH_KEY = "booknook:flash";

export type FlashMessage = { type: "success" | "error"; message: string };

export function setFlash(flash: FlashMessage) {
  try {
    sessionStorage.setItem(FLASH_KEY, JSON.stringify(flash));
  } catch {}
}

export function takeFlash(): FlashMessage | null {
  try {
    const raw = sessionStorage.getItem(FLASH_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(FLASH_KEY);
    return JSON.parse(raw) as FlashMessage;
  } catch {
    return null;
  }
}

export function hardNavigate(path: string, flash?: FlashMessage) {
  if (flash) setFlash(flash);
  window.location.href = new URL(path, window.location.origin).toString();
}
