export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'open' | 'complete';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'github' | 'facebook' | 'apple';
}

export type TaskFilter = 'all' | 'open' | 'complete';
export type TaskSort = 'dueDate' | 'priority' | 'created' | 'updated';