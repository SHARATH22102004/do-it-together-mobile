import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTask } from '@/contexts/TaskContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { Task, TaskFilter, TaskSort } from '@/types/task';
import { Search, Filter, SortAsc, RefreshCw, Trash2 } from 'lucide-react';

interface TaskListProps {
  showSearch?: boolean;
  defaultFilter?: TaskFilter;
}

const TaskList: React.FC<TaskListProps> = ({ showSearch = false, defaultFilter = 'all' }) => {
  const {
    filteredTasks,
    filter,
    sort,
    searchQuery,
    setFilter,
    setSort,
    setSearchQuery,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    clearCompleted,
    tasks
  } = useTask();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Set default filter on mount
  React.useEffect(() => {
    if (filter !== defaultFilter) {
      setFilter(defaultFilter);
    }
  }, [defaultFilter, filter, setFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    }
    setEditingTask(null);
    setIsFormOpen(false);
  };

  const handleFormCancel = () => {
    setEditingTask(null);
    setIsFormOpen(false);
  };

  const completedCount = tasks.filter(task => task.status === 'complete').length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 space-y-4 z-10">
        {/* Search */}
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Filters and Controls */}
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            {/* Filter Buttons */}
            <div className="flex bg-muted rounded-lg p-1">
              {(['all', 'open', 'complete'] as TaskFilter[]).map((filterOption) => (
                <Button
                  key={filterOption}
                  variant={filter === filterOption ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter(filterOption)}
                  className={`px-3 py-1 text-xs ${
                    filter === filterOption 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'hover:bg-background'
                  }`}
                >
                  {filterOption === 'all' ? 'All' : filterOption === 'open' ? 'Active' : 'Done'}
                  {filterOption !== 'all' && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {tasks.filter(t => t.status === filterOption).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort and Actions */}
          <div className="flex items-center space-x-2">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-32 h-8">
                <SortAsc className="w-4 h-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-8 h-8 p-0"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Clear Completed */}
        {completedCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearCompleted}
            className="w-full text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear {completedCount} completed task{completedCount !== 1 ? 's' : ''}
          </Button>
        )}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'No tasks found' : filter === 'complete' ? 'No completed tasks' : filter === 'open' ? 'No active tasks' : 'No tasks yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : filter === 'complete' 
                ? 'Completed tasks will appear here'
                : filter === 'open'
                ? 'Create your first task to get started'
                : 'Create your first task to get organized'
              }
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3 pb-24">
            {filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskCard
                  task={task}
                  onToggleComplete={() => toggleTaskComplete(task.id)}
                  onEdit={handleEditTask}
                  onDelete={deleteTask}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      <TaskForm
        task={editingTask || undefined}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        isOpen={isFormOpen}
      />
    </div>
  );
};

export default TaskList;