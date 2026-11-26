export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { file: string; section: string }[];
  isCallout?: boolean; // off-topic or not-found
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  pinned?: boolean;
  createdAt: number;
  updatedAt: number;
}

export type DisplayMode = "normal" | "half" | "full";

export interface LexiPreferences {
  mode: DisplayMode;
  isOpen: boolean;
  theme?: "light" | "dark";
}

const STORAGE_KEY_SESSIONS = "lexi_chat_sessions_v1";
const STORAGE_KEY_PREFS = "lexi_chat_preferences_v1";

export interface ChatStorage {
  getSessions(): ChatSession[];
  saveSession(session: ChatSession): void;
  deleteSession(id: string): void;
  renameSession(id: string, title: string): void;
  pinSession(id: string, pinned: boolean): void;
  getPreferences(): LexiPreferences;
  savePreferences(prefs: Partial<LexiPreferences>): void;
}

export class LocalChatStorage implements ChatStorage {
  getSessions(): ChatSession[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY_SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveSession(session: ChatSession): void {
    if (typeof window === "undefined") return;
    const sessions = this.getSessions();
    const idx = sessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      sessions[idx] = session;
    } else {
      sessions.unshift(session);
    }
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error("Failed to save session to localStorage:", e);
    }
  }

  deleteSession(id: string): void {
    if (typeof window === "undefined") return;
    const sessions = this.getSessions().filter((s) => s.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error("Failed to delete session from localStorage:", e);
    }
  }

  renameSession(id: string, title: string): void {
    if (typeof window === "undefined") return;
    const sessions = this.getSessions();
    const target = sessions.find((s) => s.id === id);
    if (target) {
      target.title = title;
      target.updatedAt = Date.now();
      try {
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
      } catch (e) {
        console.error("Failed to rename session:", e);
      }
    }
  }

  pinSession(id: string, pinned: boolean): void {
    if (typeof window === "undefined") return;
    const sessions = this.getSessions();
    const target = sessions.find((s) => s.id === id);
    if (target) {
      target.pinned = pinned;
      target.updatedAt = Date.now();
      try {
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
      } catch (e) {
        console.error("Failed to pin session:", e);
      }
    }
  }

  getPreferences(): LexiPreferences {
    if (typeof window === "undefined") {
      return { mode: "normal", isOpen: false, theme: "light" };
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY_PREFS);
      return data
        ? JSON.parse(data)
        : { mode: "normal", isOpen: false, theme: "light" };
    } catch {
      return { mode: "normal", isOpen: false, theme: "light" };
    }
  }

  savePreferences(prefs: Partial<LexiPreferences>): void {
    if (typeof window === "undefined") return;
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    try {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save preferences:", e);
    }
  }
}

export const chatStorage = new LocalChatStorage();
