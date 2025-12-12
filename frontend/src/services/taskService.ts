import type { Task, CreateTaskInput, UpdateTaskInput } from "../types/task";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export class TaskService {
  private static async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async getAllTasks(): Promise<Task[]> {
    return this.request<Task[]>("/tasks");
  }

  static async createTask(input: CreateTaskInput): Promise<Task> {
    return this.request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  static async updateTask(
    id: string,
    createdAt: string,
    input: UpdateTaskInput
  ): Promise<Task> {
    return this.request<Task>(`/tasks/${id}/${createdAt}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  }

  static async deleteTask(id: string, createdAt: string): Promise<Task> {
    return this.request<Task>(`/tasks/${id}/${createdAt}`, {
      method: "DELETE",
    });
  }
}
