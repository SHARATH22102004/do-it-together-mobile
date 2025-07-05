import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import { User, LogOut, Settings, HelpCircle, Shield, Smartphone, Award, Calendar, TrendingUp } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { tasks } = useTask();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'complete').length;
  const openTasks = tasks.filter(task => task.status === 'open').length;
  
  // Calculate weekly stats
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const thisWeekTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    return taskDate >= weekStart && taskDate <= weekEnd;
  });
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const highPriorityCompleted = tasks.filter(task => task.status === 'complete' && task.priority === 'high').length;

  const stats = [
    { label: 'Total Tasks', value: totalTasks, icon: Calendar, color: 'text-primary' },
    { label: 'Completed', value: completedTasks, icon: Award, color: 'text-success' },
    { label: 'Active', value: openTasks, icon: TrendingUp, color: 'text-warning' },
    { label: 'This Week', value: thisWeekTasks.length, icon: Calendar, color: 'text-secondary' },
  ];

  const menuItems = [
    { icon: Settings, label: 'Settings', desc: 'App preferences and customization' },
    { icon: Shield, label: 'Privacy', desc: 'Data protection and security' },
    { icon: Smartphone, label: 'Mobile App', desc: 'Install TaskFlow on your device' },
    { icon: HelpCircle, label: 'Help & Support', desc: 'Get help and contact support' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Profile Header */}
      <div className="gradient-hero p-6 text-white">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{user?.name || 'User'}</h1>
            <p className="text-white/80 text-sm">{user?.email}</p>
            <Badge variant="outline" className="mt-2 text-white border-white/30">
              {user?.provider ? `Signed in with ${user.provider}` : 'Local Account'}
            </Badge>
          </div>
        </div>

        {/* Achievement */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Productivity Score</h4>
              <p className="text-2xl font-bold">{completionRate}%</p>
            </div>
            <div className="text-right">
              <Award className="w-8 h-8 mb-1" />
              <p className="text-xs text-white/80">
                {completionRate >= 80 ? 'Excellent!' : completionRate >= 60 ? 'Good job!' : 'Keep going!'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 pb-24">
        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Award className="w-8 h-8 text-success" />
                <div>
                  <h4 className="font-semibold">Task Master</h4>
                  <p className="text-sm text-muted-foreground">Completed {completedTasks} tasks</p>
                </div>
              </div>
              <Badge variant="secondary">
                {completedTasks >= 50 ? 'Expert' : completedTasks >= 20 ? 'Advanced' : completedTasks >= 5 ? 'Beginner' : 'Starter'}
              </Badge>
            </div>

            {highPriorityCompleted > 0 && (
              <div className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-warning" />
                  <div>
                    <h4 className="font-semibold">Priority Focused</h4>
                    <p className="text-sm text-muted-foreground">Completed {highPriorityCompleted} high priority tasks</p>
                  </div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Settings & More</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <React.Fragment key={index}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto p-4"
                    onClick={() => {
                      // In a real app, these would navigate to respective screens
                      console.log(`Navigate to ${item.label}`);
                    }}
                  >
                    <Icon className="w-5 h-5 mr-3 text-muted-foreground" />
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-muted-foreground">{item.desc}</div>
                    </div>
                  </Button>
                  {index < menuItems.length - 1 && <Separator />}
                </React.Fragment>
              );
            })}
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardContent className="p-4 text-center space-y-2">
            <p className="text-sm font-medium">TaskFlow Mobile</p>
            <p className="text-xs text-muted-foreground">Version 1.0.0</p>
            <p className="text-xs text-muted-foreground">
              Built with ❤️ for productivity enthusiasts
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              This project is part of a hackathon run by https://www.katomaran.com
            </p>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          onClick={logout}
          variant="outline"
          className="w-full text-destructive hover:text-destructive border-destructive/20 hover:border-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ProfileScreen;