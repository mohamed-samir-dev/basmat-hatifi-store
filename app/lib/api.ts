const ALLOWED_HOSTS = ["localhost", "pasmthatfee.com"];

function getApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const { hostname, origin } = new URL(raw);
    if (!ALLOWED_HOSTS.includes(hostname)) throw new Error(`Blocked host: ${hostname}`);
    return origin;
  } catch {
    return "http://localhost:5000";
  }
}

export const API = getApiBase();
