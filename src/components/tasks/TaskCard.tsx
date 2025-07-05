import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types/task';
import { Calendar, Flag, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDistanceToNow, isAfter, parseISO } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  className = '' 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const isOverdue = task.status === 'open' && isAfter(new Date(), parseISO(task.dueDate));
  const isCompleted = task.status === 'complete';
  
  const priorityColors = {
    high: 'bg-destructive text-destructive-foreground',
    medium: 'bg-warning text-warning-foreground',
    low: 'bg-success text-success-foreground',
  };

  const formatDueDate = (dueDate: string) => {
    try {
      const date = parseISO(dueDate);
      const distance = formatDistanceToNow(date, { addSuffix: true });
      return distance;
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <Card 
      className={`task-card ${className} ${isCompleted ? 'opacity-70' : ''} ${
        isPressed ? 'scale-98' : ''
      } transition-all duration-200`}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Checkbox */}
          <div className="pt-1">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() => onToggleComplete(task.id)}
              className="w-5 h-5"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-semibold text-sm ${
                isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}>
                {task.title}
              </h3>
              
              {/* More Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Description */}
            {task.description && (
              <p className={`text-sm mb-3 ${
                isCompleted ? 'line-through text-muted-foreground' : 'text-muted-foreground'
              }`}>
                {task.description}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* Priority Badge */}
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-2 py-1 ${priorityColors[task.priority]}`}
                >
                  <Flag className="w-3 h-3 mr-1" />
                  {task.priority}
                </Badge>

                {/* Due Date */}
                <div className={`flex items-center text-xs ${
                  isOverdue && !isCompleted 
                    ? 'text-destructive' 
                    : 'text-muted-foreground'
                }`}>
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDueDate(task.dueDate)}
                </div>
              </div>

              {/* Overdue indicator */}
              {isOverdue && !isCompleted && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  Overdue
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;