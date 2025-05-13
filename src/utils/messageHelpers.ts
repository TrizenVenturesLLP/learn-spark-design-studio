
import React from 'react';

// Define the MessageUser type
export interface MessageUser {
  _id: string;
  name: string;
  avatar?: string;
  role?: string;
}

// Function to safely access MessageUser properties and handle string | MessageUser type
export function getUserId(user: string | MessageUser): string {
  if (typeof user === 'string') {
    return user;
  }
  return user._id;
}

// Function to check if an object is a MessageUser
export function isMessageUser(obj: any): obj is MessageUser {
  return typeof obj === 'object' && obj !== null && '_id' in obj;
}

// Safe accessor for user properties
export function getUserProperty<T>(
  user: string | MessageUser,
  accessor: (user: MessageUser) => T,
  defaultValue: T
): T {
  if (typeof user === 'string' || !user) {
    return defaultValue;
  }
  
  try {
    return accessor(user) || defaultValue;
  } catch (error) {
    return defaultValue;
  }
}
