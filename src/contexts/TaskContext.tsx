import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Task, TaskFilter, TaskSort } from '@/types/task';
import { toast } from '@/hooks/use-toast';

interface TaskContextType {
  tasks: Task[];
  filter: TaskFilter;
  sort: TaskSort;
  searchQuery: string;
  filteredTasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  setFilter: (filter: TaskFilter) => void;
  setSort: (sort: TaskSort) => void;
  setSearchQuery: (query: string) => void;
  clearCompleted: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sort, setSort] = useState<TaskSort>('dueDate');
  const [searchQuery, setSearchQuery] = useState('');

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('todo-tasks');
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error('Failed to load tasks from localStorage:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Task created",
      description: "Your new task has been added successfully.",
    });
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "Your task has been removed.",
      variant: "destructive",
    });
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            status: task.status === 'complete' ? 'open' : 'complete',
            updatedAt: new Date().toISOString()
          }
        : task
    ));
  }, []);

  const clearCompleted = useCallback(() => {
    const completedCount = tasks.filter(task => task.status === 'complete').length;
    setTasks(prev => prev.filter(task => task.status !== 'complete'));
    toast({
      title: "Completed tasks cleared",
      description: `Removed ${completedCount} completed task${completedCount !== 1 ? 's' : ''}.`,
    });
  }, [tasks]);

  // Filter and sort tasks
  const filteredTasks = React.useMemo(() => {
    let filtered = tasks;

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(task => task.status === filter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, filter, sort, searchQuery]);

  const value: TaskContextType = {
    tasks,
    filter,
    sort,
    searchQuery,
    filteredTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    setFilter,
    setSort,
    setSearchQuery,
    clearCompleted,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};