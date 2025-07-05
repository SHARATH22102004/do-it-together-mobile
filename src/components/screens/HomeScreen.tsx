import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTask } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import TaskCard from '@/components/tasks/TaskCard';
import { Calendar, Clock, TrendingUp, CheckCircle2, Circle, Flag } from 'lucide-react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';

interface HomeScreenProps {
  onEditTask: (task: any) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onEditTask }) => {
  const { user } = useAuth();
  const { tasks, toggleTaskComplete, deleteTask } = useTask();

  const openTasks = tasks.filter(task => task.status === 'open');
  const completedTasks = tasks.filter(task => task.status === 'complete');
  const todayTasks = openTasks.filter(task => isToday(parseISO(task.dueDate)));
  const tomorrowTasks = openTasks.filter(task => isTomorrow(parseISO(task.dueDate)));
  const overdueTasks = openTasks.filter(task => parseISO(task.dueDate) < new Date());
  const highPriorityTasks = openTasks.filter(task => task.priority === 'high');

  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="gradient-hero p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{getGreeting()}</h1>
            <p className="text-white/80">{user?.name || 'User'}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold">{user?.name?.[0] || 'U'}</span>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{openTasks.length}</div>
            <div className="text-sm text-white/80">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{completedTasks.length}</div>
            <div className="text-sm text-white/80">Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
            <div className="text-sm text-white/80">Complete</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 pb-24">
        {/* Progress Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Overall Completion</span>
                <span className="font-medium">{Math.round(completionRate)}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Circle className="w-4 h-4 text-primary" />
                  <span>{openTasks.length} Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>{completedTasks.length} Done</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Tasks */}
        {todayTasks.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Due Today
                </div>
                <Badge variant="secondary">{todayTasks.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayTasks.slice(0, 3).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={() => toggleTaskComplete(task.id)}
                  onEdit={onEditTask}
                  onDelete={deleteTask}
                  className="bg-primary/5 border-primary/20"
                />
              ))}
              {todayTasks.length > 3 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{todayTasks.length - 3} more tasks due today
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-destructive" />
                  Overdue
                </div>
                <Badge variant="destructive">{overdueTasks.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {overdueTasks.slice(0, 2).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={() => toggleTaskComplete(task.id)}
                  onEdit={onEditTask}
                  onDelete={deleteTask}
                  className="bg-destructive/5 border-destructive/20"
                />
              ))}
              {overdueTasks.length > 2 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{overdueTasks.length - 2} more overdue tasks
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* High Priority */}
        {highPriorityTasks.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <Flag className="w-5 h-5 mr-2 text-warning" />
                  High Priority
                </div>
                <Badge variant="secondary">{highPriorityTasks.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {highPriorityTasks.slice(0, 2).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={() => toggleTaskComplete(task.id)}
                  onEdit={onEditTask}
                  onDelete={deleteTask}
                  className="bg-warning/5 border-warning/20"
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Tomorrow's Preview */}
        {tomorrowTasks.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
                  Tomorrow
                </div>
                <Badge variant="outline">{tomorrowTasks.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tomorrowTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm font-medium">{task.title}</span>
                    <Badge 
                      variant="outline" 
                      className={task.priority === 'high' ? 'border-destructive text-destructive' : ''}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {tasks.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Welcome to TaskFlow!</h3>
              <p className="text-muted-foreground mb-4">
                Start organizing your life by creating your first task.
              </p>
              <p className="text-sm text-muted-foreground">
                Tap the + button to get started
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;