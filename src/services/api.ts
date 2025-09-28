import axios, { AxiosError } from 'axios';
import type { CharactersResponse, Character, Status } from "@/types/character";

const BASE_URL = "https://rickandmortyapi.com/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export interface FetchCharactersParams {
  page?: number;
  name?: string;
  status?: Status | "";
}

export async function fetchCharacters(params: FetchCharactersParams = {}): Promise<CharactersResponse> {
  try {
    const searchParams: Record<string, string> = {};
    
    if (params.page) searchParams.page = String(params.page);
    if (params.name && params.name.trim().length >= 2) searchParams.name = params.name.trim();
    if (params.status) searchParams.status = params.status;

    const response = await api.get<CharactersResponse>('/character', {
      params: searchParams,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // The API returns 404 with { error: "There is nothing here" } when no results match
      if (error.response?.status === 404) {
        return {
          info: { count: 0, pages: 0, next: null, prev: null },
          results: [],
        };
      }
      throw new Error(`Failed to fetch characters: ${error.response?.status} ${error.message}`);
    }
    throw new Error('Failed to fetch characters: Unknown error');
  }
}

export async function fetchCharacter(id: number | string): Promise<Character> {
  try {
    const response = await api.get<Character>(`/character/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to fetch character ${id}: ${error.response?.status} ${error.message}`);
    }
    throw new Error(`Failed to fetch character ${id}: Unknown error`);
  }
}
