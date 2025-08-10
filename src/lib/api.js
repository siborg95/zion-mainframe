export const API = "https://zion-mainframe-backend-production.up.railway.app";

export async function login(username, password) {
  const r = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data.ok) throw new Error(data.error || `HTTP ${r.status}`);
  return data; // { ok:true, token?:string }
}

export async function askGPT(prompt) {
  const r = await fetch(`${API}/gpt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data.ok) throw new Error(data.error || `HTTP ${r.status}`);
  return data.text; // reply text
}
