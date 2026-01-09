export const triggerHaptic = (type: 'tick' | 'light' | 'medium' | 'heavy' | 'success' | 'warning') => {
  // Check if vibration is supported
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      switch (type) {
        case 'tick':
          // Very short, sharp tick
          navigator.vibrate(5);
          break;
        case 'light': 
          // Subtle click feel
          navigator.vibrate(10); 
          break;
        case 'medium': 
          // Standard interaction
          navigator.vibrate(40); 
          break;
        case 'heavy': 
          // Significant action
          navigator.vibrate(70); 
          break;
        case 'success': 
          // Double tap for success
          navigator.vibrate([50, 50, 100]); 
          break;
        case 'warning': 
          // Alert pattern
          navigator.vibrate([100, 50, 100]); 
          break;
      }
    } catch (e) {
      // Ignore errors on devices that don't support it or if user disabled it
      console.warn("Haptics error", e);
    }
  }
};