import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserPreferences, Work, Chapter, Theme } from '@/lib/types';
import { storageKeys } from '@/lib/config';

// ========== 用户 Store ==========
interface UserStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null }),
}));

// ========== 阅读偏好 Store（持久化） ==========
interface ReadingStore extends UserPreferences {
  setTheme: (theme: string) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
  setLineHeight: (height: number) => void;
  setReadingWidth: (width: number) => void;
  toggleDarkMode: () => void;
  resetPreferences: () => void;
}

const defaultPreferences: Omit<UserPreferences, 'id' | 'userId'> = {
  theme: 'default',
  fontSize: 16,
  fontFamily: 'serif',
  lineHeight: 1.75,
  readingWidth: 65,
  darkMode: false,
  autoSave: true,
  emailNotifications: true,
};

export const useReadingStore = create<ReadingStore>()(
  persist(
    (set) => ({
      id: '',
      userId: '',
      ...defaultPreferences,
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize: Math.max(14, Math.min(24, fontSize)) }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setLineHeight: (lineHeight) => set({ lineHeight: Math.max(1.2, Math.min(2.5, lineHeight)) }),
      setReadingWidth: (readingWidth) => set({ readingWidth: Math.max(40, Math.min(100, readingWidth)) }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      resetPreferences: () => set(defaultPreferences),
    }),
    {
      name: storageKeys.theme,
      partialize: (state) => ({
        theme: state.theme,
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        lineHeight: state.lineHeight,
        readingWidth: state.readingWidth,
        darkMode: state.darkMode,
      }),
    }
  )
);

// ========== 编辑器 Store ==========
interface EditorStore {
  currentWork: Work | null;
  currentChapter: Chapter | null;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  setCurrentWork: (work: Work | null) => void;
  setCurrentChapter: (chapter: Chapter | null) => void;
  setDirty: (dirty: boolean) => void;
  setSaving: (saving: boolean) => void;
  setLastSaved: (date: Date) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  currentWork: null,
  currentChapter: null,
  isDirty: false,
  isSaving: false,
  lastSaved: null,
  setCurrentWork: (work) => set({ currentWork: work }),
  setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
  setDirty: (isDirty) => set({ isDirty }),
  setSaving: (isSaving) => set({ isSaving }),
  setLastSaved: (date) => set({ lastSaved: date, isDirty: false }),
}));

// ========== UI Store ==========
interface UIStore {
  sidebarOpen: boolean;
  tableOfContentsOpen: boolean;
  searchOpen: boolean;
  theme: string;
  setSidebarOpen: (open: boolean) => void;
  setTableOfContentsOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setTheme: (theme: string) => void;
  toggleSidebar: () => void;
  toggleTableOfContents: () => void;
  toggleSearch: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      tableOfContentsOpen: true,
      searchOpen: false,
      theme: 'default',
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setTableOfContentsOpen: (tableOfContentsOpen) => set({ tableOfContentsOpen }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleTableOfContents: () => set((state) => ({ tableOfContentsOpen: !state.tableOfContentsOpen })),
      toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
    }),
    {
      name: 'inkweave-ui',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        tableOfContentsOpen: state.tableOfContentsOpen,
        theme: state.theme,
      }),
    }
  )
);

// ========== 阅读进度 Store（本地） ==========
interface ReadingProgressStore {
  progress: Record<string, number>; // chapterId -> progress
  scrollPositions: Record<string, number>; // chapterId -> scrollPosition
  setProgress: (chapterId: string, progress: number) => void;
  setScrollPosition: (chapterId: string, position: number) => void;
  getProgress: (chapterId: string) => number;
  getScrollPosition: (chapterId: string) => number;
}

export const useReadingProgressStore = create<ReadingProgressStore>()(
  persist(
    (set, get) => ({
      progress: {},
      scrollPositions: {},
      setProgress: (chapterId, progress) =>
        set((state) => ({
          progress: { ...state.progress, [chapterId]: progress },
        })),
      setScrollPosition: (chapterId, position) =>
        set((state) => ({
          scrollPositions: { ...state.scrollPositions, [chapterId]: position },
        })),
      getProgress: (chapterId) => get().progress[chapterId] || 0,
      getScrollPosition: (chapterId) => get().scrollPositions[chapterId] || 0,
    }),
    {
      name: storageKeys.readingProgress,
    }
  )
);

// ========== 搜索历史 Store ==========
interface SearchHistoryStore {
  history: string[];
  addToHistory: (query: string) => void;
  removeFromHistory: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryStore>()(
  persist(
    (set) => ({
      history: [],
      addToHistory: (query) =>
        set((state) => ({
          history: [query, ...state.history.filter((q) => q !== query)].slice(0, 20),
        })),
      removeFromHistory: (query) =>
        set((state) => ({
          history: state.history.filter((q) => q !== query),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: storageKeys.searchHistory,
    }
  )
);

// ========== 草稿 Store ==========
interface DraftStore {
  drafts: Record<string, string>; // chapterId -> content
  setDraft: (chapterId: string, content: string) => void;
  getDraft: (chapterId: string) => string | null;
  removeDraft: (chapterId: string) => void;
  clearAllDrafts: () => void;
}

export const useDraftStore = create<DraftStore>()(
  persist(
    (set, get) => ({
      drafts: {},
      setDraft: (chapterId, content) =>
        set((state) => ({
          drafts: { ...state.drafts, [chapterId]: content },
        })),
      getDraft: (chapterId) => get().drafts[chapterId] || null,
      removeDraft: (chapterId) =>
        set((state) => {
          const { [chapterId]: _, ...rest } = state.drafts;
          return { drafts: rest };
        }),
      clearAllDrafts: () => set({ drafts: {} }),
    }),
    {
      name: storageKeys.draft,
    }
  )
);
