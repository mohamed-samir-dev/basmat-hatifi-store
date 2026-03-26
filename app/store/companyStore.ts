import { create } from "zustand";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CompanyStore {
  logo: string;
  fetchLogo: () => Promise<void>;
  setLogo: (url: string) => void;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  logo: "",
  fetchLogo: async () => {
    try {
      const res = await fetch(`/api/admin/company`, { credentials: "include" });
      const data = await res.json();
      const fullUrl = data.logo
        ? (data.logo.startsWith("http") ? data.logo : `${API}${data.logo}`)
        : "";
      set({ logo: fullUrl });
    } catch (e) { console.error(e); }
  },
  setLogo: (url) => set({ logo: url }),
}));
