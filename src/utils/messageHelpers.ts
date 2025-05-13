
/**
 * Type guard to check if a value is a MessageUser object with _id property
 */
export function isMessageUser(value: any): value is { _id: string; name?: string } {
  return value && typeof value === 'object' && '_id' in value;
}

/**
 * Safely get the ID from either a string ID or a MessageUser object
 */
export function getUserId(user: string | { _id: string }): string {
  if (isMessageUser(user)) {
    return user._id;
  }
  return user;
}

/**
 * Type safe comparison of user IDs
 */
export function isSameUser(user1: string | { _id: string } | undefined, user2: string | { _id: string } | undefined): boolean {
  if (!user1 || !user2) return false;
  
  const id1 = getUserId(user1);
  const id2 = getUserId(user2);
  
  return id1 === id2;
}
