import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types/task';
import { Calendar, Flag, Save, X } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface TaskFormProps {
  task?: Task;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, isOpen }) => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    dueDate: string;
    status: 'open' | 'complete';
    priority: 'low' | 'medium' | 'high';
  }>({
    title: '',
    description: '',
    dueDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    status: 'open',
    priority: 'medium',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when task changes or form opens
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate.split('T')[0], // Extract date part
        status: task.status,
        priority: task.priority,
      });
    } else if (isOpen) {
      setFormData({
        title: '',
        description: '',
        dueDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        status: 'open',
        priority: 'medium',
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert date to ISO string
    const dueDateTime = new Date(formData.dueDate + 'T23:59:59').toISOString();
    
    onSubmit({
      ...formData,
      dueDate: dueDateTime,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 animate-fade-in">
      <Card className="w-full max-w-md mx-4 mb-4 animate-slide-up">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {task ? 'Edit Task' : 'Create New Task'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel} className="w-8 h-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={errors.title ? 'border-destructive' : ''}
                autoFocus
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add more details..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Due Date and Priority Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Due Date *
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className={errors.dueDate ? 'border-destructive' : ''}
                />
                {errors.dueDate && (
                  <p className="text-sm text-destructive">{errors.dueDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  <Flag className="w-4 h-4 inline mr-1" />
                  Priority
                </Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status (only show when editing) */}
            {task && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1 gradient-primary text-primary-foreground">
                <Save className="w-4 h-4 mr-2" />
                {task ? 'Update Task' : 'Create Task'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="px-6">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskForm;