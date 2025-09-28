import type { CharactersResponse, Character, Status } from "@/types/character";

const BASE_URL = "https://rickandmortyapi.com/api";

export interface FetchCharactersParams {
  page?: number;
  name?: string;
  status?: Status | "";
}

export async function fetchCharacters(params: FetchCharactersParams = {}): Promise<CharactersResponse> {
  const url = new URL(`${BASE_URL}/character`);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.name && params.name.trim().length >= 2) url.searchParams.set("name", params.name.trim());
  if (params.status) url.searchParams.set("status", params.status);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch characters: ${res.status} ${text}`);
  }
  return res.json();
}

export async function fetchCharacter(id: number | string): Promise<Character> {
  const res = await fetch(`${BASE_URL}/character/${id}`, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch character ${id}: ${res.status} ${text}`);
  }
  return res.json();
}
