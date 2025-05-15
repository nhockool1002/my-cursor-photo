export const thumbnailService = {
    // Store listeners for thumbnail changes with type annotation
    listeners: {} as Record<string, Array<() => void>>,
  
    setThumbnail(folderName: string, thumbnailKey: string) {
      const thumbnails = JSON.parse(localStorage.getItem('folderThumbnails') || '{}');
      thumbnails[folderName] = { key: thumbnailKey };
      localStorage.setItem('folderThumbnails', JSON.stringify(thumbnails));
      // Notify listeners for this folder
      this.notifyListeners(folderName);
    },
  
    getThumbnail(folderName: string): { key: string } | null {
      const thumbnails = JSON.parse(localStorage.getItem('folderThumbnails') || '{}');
      return thumbnails[folderName] || null;
    },
  
    removeThumbnail(folderName: string) {
      const thumbnails = JSON.parse(localStorage.getItem('folderThumbnails') || '{}');
      delete thumbnails[folderName];
      localStorage.setItem('folderThumbnails', JSON.stringify(thumbnails));
      // Notify listeners for this folder
      this.notifyListeners(folderName);
    },
  
    // Subscribe to thumbnail changes for a folder
    subscribe(folderName: string, callback: () => void) {
      if (!this.listeners[folderName]) {
        this.listeners[folderName] = [];
      }
      this.listeners[folderName].push(callback);
      // Return unsubscribe function
      return () => {
        this.listeners[folderName] = this.listeners[folderName].filter(cb => cb !== callback);
      };
    },
  
    // Notify all listeners for a folder
    notifyListeners(folderName: string) {
      if (this.listeners[folderName]) {
        this.listeners[folderName].forEach(callback => callback());
      }
    }
  };