
// Helper functions for message-related components

/**
 * Safely gets the ID from a user object that might be a string or object
 * @param user - The user object or string ID
 * @returns The user ID as a string
 */
export function safeGetUserId(user: string | { _id: string }): string {
  if (typeof user === 'string') {
    return user;
  }
  return user._id;
}

/**
 * Determines if the user ID exists in the given object
 * @param user - The user object or string ID
 * @returns Boolean indicating if the ID exists
 */
export function userIdExists(user: unknown): boolean {
  if (!user) return false;
  
  if (typeof user === 'string') {
    return user.length > 0;
  }
  
  if (typeof user === 'object' && user !== null) {
    return '_id' in user && typeof (user as any)._id === 'string';
  }
  
  return false;
}
