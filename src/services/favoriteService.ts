import { Photo } from '@/types/photo';

const FAVORITE_KEY = 'favorite_photos';

export const favoriteService = {
  getFavorites: (): Photo[] => {
    const favorites = localStorage.getItem(FAVORITE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  },

  addFavorite: (photo: Photo): void => {
    const favorites = favoriteService.getFavorites();
    if (!favorites.some(f => f.id === photo.id)) {
      favorites.push(photo);
      localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
    }
  },

  removeFavorite: (photoId: string): void => {
    const favorites = favoriteService.getFavorites();
    const updatedFavorites = favorites.filter(f => f.id !== photoId);
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(updatedFavorites));
  },

  clearFavorites: (): void => {
    localStorage.removeItem(FAVORITE_KEY);
  },

  isFavorite: (photoId: string): boolean => {
    const favorites = favoriteService.getFavorites();
    return favorites.some(f => f.id === photoId);
  }
}; 