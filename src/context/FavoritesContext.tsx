import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BaseLink } from '../types';

interface FavoritesContextType {
  favorites: BaseLink[];
  toggleFavorite: (link: BaseLink) => void;
  isFavorite: (href: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<BaseLink[]>(() => {
    try {
      const stored = localStorage.getItem('cs_guide_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error reading favorites from localStorage:', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cs_guide_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Error writing favorites to localStorage:', e);
    }
  }, [favorites]);

  const toggleFavorite = (link: BaseLink) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.href === link.href);
      if (exists) {
        // Remove from favorites
        return prev.filter((fav) => fav.href !== link.href);
      } else {
        // Add to favorites
        return [...prev, link];
      }
    });
  };

  const isFavorite = (href: string) => {
    return favorites.some((fav) => fav.href === href);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
