
// Type guard utility functions

/**
 * Safely get a property from an object, with type checking
 * @param obj The object to check
 * @param key The property key
 * @param fallback Optional fallback value
 * @returns The property value or fallback
 */
export function safeGet<T, K extends keyof T>(
  obj: T | null | undefined,
  key: K,
  fallback?: T[K]
): T[K] | undefined {
  if (obj == null) return fallback;
  return obj[key] ?? fallback;
}

/**
 * Type guard to check if an object is of a specific type
 * @param obj The object to check
 * @param props Array of property names to check for
 * @returns Boolean indicating if the object has all the specified properties
 */
export function hasProperties<T extends Record<string, any>>(
  obj: any,
  props: Array<keyof T>
): obj is T {
  if (!obj || typeof obj !== 'object') return false;
  return props.every(prop => prop in obj);
}

/**
 * Safe type assertion for message user ID
 * @param user The user object or ID string
 * @returns The user ID string or undefined
 */
export function getMessageUserId(user: unknown): string | undefined {
  if (typeof user === 'string') return user;
  
  if (user && typeof user === 'object' && '_id' in user) {
    return (user as { _id: string })._id;
  }
  
  return undefined;
}
