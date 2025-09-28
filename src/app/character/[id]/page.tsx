'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Heart, MapPin, User, Calendar } from 'lucide-react';
import { fetchCharacter } from '@/services/api';
import type { Character } from '@/types/character';
import { useFavorites } from '@/context/FavoritesContext';
import { useNotify } from '@/context/NotificationContext';

export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { favorites, add, remove } = useFavorites();
  const { addToast } = useNotify();

  const characterId = params.id as string;
  const isFavorite = character ? favorites[character.id] : false;

  useEffect(() => {
    const loadCharacter = async () => {
      if (!characterId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchCharacter(characterId);
        setCharacter(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load character');
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [characterId]);

  const handleToggleFavorite = () => {
    if (!character) return;

    if (isFavorite) {
      remove(character.id);
      addToast({ type: 'success', message: `Removed ${character.name} from favorites` });
    } else {
      add(character);
      addToast({ type: 'success', message: `Added ${character.name} to favorites` });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Loading character...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Character not found</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Character Details</h1>
      </div>

      {/* Character Card */}
      <div className="bg-background border border-foreground/20 rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/3">
            <Image
              src={character.image}
              alt={character.name}
              width={300}
              height={300}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="md:w-2/3 p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-3xl font-bold text-foreground">{character.name}</h2>
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite
                    ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                    : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      character.status === 'Alive'
                        ? 'bg-green-500'
                        : character.status === 'Dead'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                    }`}
                  ></div>
                  <span className="text-lg font-medium">{character.status}</span>
                </div>
              </div>

              {/* Species and Gender */}
              <div className="flex items-center gap-2 text-foreground/80">
                <User className="w-5 h-5" />
                <span>
                  {character.species} • {character.gender}
                </span>
              </div>

              {/* Origin */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Origin</h3>
                <div className="flex items-center gap-2 text-foreground/80">
                  <MapPin className="w-5 h-5" />
                  <span>{character.origin.name}</span>
                </div>
              </div>

              {/* Last known location */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Last known location</h3>
                <div className="flex items-center gap-2 text-foreground/80">
                  <MapPin className="w-5 h-5" />
                  <span>{character.location.name}</span>
                </div>
              </div>

              {/* Created date */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">First seen</h3>
                <div className="flex items-center gap-2 text-foreground/80">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(character.created).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Episodes count */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Episodes</h3>
                <p className="text-foreground/80">
                  Appeared in {character.episode.length} episode
                  {character.episode.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 border border-foreground/20 text-foreground rounded-lg hover:bg-foreground/5 transition-colors"
        >
          Back to Characters
        </button>
        <button
          onClick={handleToggleFavorite}
          className="px-6 py-2 border border-foreground/20 text-foreground rounded-lg hover:bg-foreground/5 transition-colors"
        >
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
}
