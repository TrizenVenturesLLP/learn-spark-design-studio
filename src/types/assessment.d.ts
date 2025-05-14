
export interface Assessment {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
