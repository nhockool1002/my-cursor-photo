const ROTATION_STORAGE_KEY = 'image_rotations';

export const rotationService = {
  getRotation(key: string): number {
    const rotations = this.getAllRotations();
    return rotations[key] || 0;
  },

  setRotation(key: string, rotation: number): void {
    const rotations = this.getAllRotations();
    rotations[key] = rotation;
    localStorage.setItem(ROTATION_STORAGE_KEY, JSON.stringify(rotations));
  },

  getAllRotations(): Record<string, number> {
    const stored = localStorage.getItem(ROTATION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }
}; 