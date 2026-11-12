import { API_URL } from "./config";
import { supabase } from "./supabase";

export const apiFetch = async (path: string, init: RequestInit = {}) => {
  const { data } = await supabase.auth.getSession();
  const headers = new Headers(init.headers);
  if (data.session) headers.set("Authorization", `Bearer ${data.session.access_token}`);
  return fetch(`${API_URL}${path}`, { ...init, headers });
};
