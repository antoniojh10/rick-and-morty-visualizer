"use client";

import Image from "next/image";
import Link from "next/link";
import type { Character } from "@/types/character";

export default function CharacterCard({ c }: { c: Character }) {
  return (
    <Link
      href={`/characters/${c.id}`}
      className="group overflow-hidden rounded-lg border border-black/10 dark:border-white/10 hover:shadow transition"
    >
      <div className="relative aspect-[4/3] bg-black/5 dark:bg-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold truncate" title={c.name}>{c.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${
            c.status === "Alive" ? "border-green-600 text-green-600" : c.status === "Dead" ? "border-red-600 text-red-600" : "border-gray-500 text-gray-500"
          }`}>{c.status}</span>
        </div>
        <p className="text-sm text-black/70 dark:text-white/70">{c.species}</p>
        <p className="text-xs mt-1 text-black/60 dark:text-white/60">Location: {c.location?.name}</p>
      </div>
    </Link>
  );
}
