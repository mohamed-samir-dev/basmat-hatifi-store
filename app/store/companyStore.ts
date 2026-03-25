import { create } from "zustand";
import { persist } from "zustand/middleware";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CompanyStore {
  logo: string;
  fetchLogo: () => Promise<void>;
  setLogo: (url: string) => void;
}

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      logo: "",
      fetchLogo: async () => {
        if (useCompanyStore.getState().logo) return;
        try {
          const res = await fetch(`${API}/api/admin/company`, { credentials: "include" });
          const data = await res.json();
          if (data.logo) {
            const fullUrl = data.logo.startsWith("http") ? data.logo : `${API}${data.logo}`;
            set({ logo: fullUrl });
          }
        } catch (e) { console.error(e); }
      },
      setLogo: (url) => set({ logo: url }),
    }),
    { name: "company-storage" }
  )
);
