
export interface MessageUser {
  _id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  _id: string;
  senderId: MessageUser | string;
  receiverId: MessageUser | string;
  content: string;
  createdAt: string;
  courseId?: string;
  courseName?: string;
  read: boolean;
}
