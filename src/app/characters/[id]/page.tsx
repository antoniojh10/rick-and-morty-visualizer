"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchCharacter } from "@/services/api";
import type { Character } from "@/types/character";

export default function CharacterDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [item, setItem] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCharacter(id);
        setItem(data);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load character");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [id]);

  if (loading) {
    return <div className="py-10 text-center">Loading…</div>;
  }
  if (error) {
    return (
      <div className="py-10 text-center space-y-3">
        <p>{error}</p>
        <button className="rounded border px-3 py-1 text-sm" onClick={() => router.back()}>Go back</button>
      </div>
    );
  }
  if (!item) return null;

  return (
    <div className="grid gap-6 md:grid-cols-[320px_1fr]">
      <div className="overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={item.name} className="w-full h-auto" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{item.name}</h1>
        <p><span className="font-medium">Status:</span> {item.status}</p>
        <p><span className="font-medium">Species:</span> {item.species}</p>
        <p><span className="font-medium">Gender:</span> {item.gender}</p>
        <p><span className="font-medium">Origin:</span> {item.origin?.name}</p>
        <p><span className="font-medium">Location:</span> {item.location?.name}</p>
        <div className="pt-4">
          <button onClick={() => router.back()} className="rounded border px-3 py-1 text-sm">Back</button>
        </div>
      </div>
    </div>
  );
}
