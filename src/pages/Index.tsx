import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import LoginScreen from '@/components/auth/LoginScreen';
import HomeScreen from '@/components/screens/HomeScreen';
import ProfileScreen from '@/components/screens/ProfileScreen';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import FloatingActionButton from '@/components/tasks/FloatingActionButton';
import BottomNav from '@/components/navigation/BottomNav';
import { Task } from '@/types/task';

const Index = () => {
  const { user, isLoading } = useAuth();
  const { addTask, updateTask } = useTask();
  
  const [activeTab, setActiveTab] = useState('home');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="mobile-container flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="gradient-hero w-16 h-16 rounded-2xl mx-auto flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gradient-primary">TaskFlow</h1>
            <p className="text-muted-foreground">Loading your tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen />;
  }

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskFormSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const handleTaskFormCancel = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onEditTask={handleEditTask} />;
      case 'tasks':
        return <TaskList defaultFilter="open" />;
      case 'completed':
        return <TaskList defaultFilter="complete" />;
      case 'search':
        return <TaskList showSearch defaultFilter="all" />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onEditTask={handleEditTask} />;
    }
  };

  return (
    <div className="mobile-container bg-background">
      {/* Main Content */}
      <div className="flex flex-col h-screen">
        {/* Active Screen */}
        <div className="flex-1 overflow-hidden">
          {renderActiveScreen()}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Floating Action Button - Hide on profile screen */}
      {activeTab !== 'profile' && (
        <FloatingActionButton 
          onClick={handleCreateTask}
          disabled={isTaskFormOpen}
        />
      )}

      {/* Task Form Modal */}
      <TaskForm
        task={editingTask || undefined}
        onSubmit={handleTaskFormSubmit}
        onCancel={handleTaskFormCancel}
        isOpen={isTaskFormOpen}
      />
    </div>
  );
};

export default Index;
