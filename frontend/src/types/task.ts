export interface Task {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface CreateTaskInput {
  title: string;
  content: string;
}

export interface UpdateTaskInput {
  title?: string;
  content?: string;
}
