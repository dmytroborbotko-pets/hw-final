import { useState, useEffect } from 'react'
import type { Task, CreateTaskInput, UpdateTaskInput } from './types/task'
import { TaskService } from './services/taskService'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import './App.css'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await TaskService.getAllTasks()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
      console.error('Error loading tasks:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async (input: CreateTaskInput | UpdateTaskInput) => {
    try {
      setIsSubmitting(true)
      setError(null)
      const newTask = await TaskService.createTask(input as CreateTaskInput)
      setTasks([newTask, ...tasks])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
      console.error('Error creating task:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateTask = async (input: CreateTaskInput | UpdateTaskInput) => {
    if (!editingTask) return

    try {
      setIsSubmitting(true)
      setError(null)
      const updatedTask = await TaskService.updateTask(
        editingTask.id,
        editingTask.createdAt,
        input
      )
      setTasks(tasks.map(t =>
        t.id === updatedTask.id && t.createdAt === updatedTask.createdAt
          ? updatedTask
          : t
      ))
      setEditingTask(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
      console.error('Error updating task:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTask = async (id: string, createdAt: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      setError(null)
      await TaskService.deleteTask(id, createdAt)
      setTasks(tasks.filter(t => !(t.id === id && t.createdAt === createdAt)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
      console.error('Error deleting task:', err)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Inbox Tasks</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={editingTask ? handleCancelEdit : undefined}
          isSubmitting={isSubmitting}
        />

        <TaskList
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDeleteTask}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default App
