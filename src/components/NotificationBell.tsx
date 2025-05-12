import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  useNotifications, 
  useMarkNotificationRead, 
  useMarkAllNotificationsRead,
  getNotificationRoute,
  type Notification 
} from '@/services/notificationService';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'course_update':
      return '📹';
    case 'assignment':
      return '📝';
    case 'discussion':
      return '💬';
    default:
      return '🔔';
  }
};

const getNotificationTitle = (notification: Notification) => {
  switch (notification.type) {
    case 'course_update':
      return 'Course Update';
    case 'assignment':
      return 'New Assignment';
    case 'discussion':
      return 'Discussion Activity';
    default:
      return notification.title;
  }
};

export const NotificationBell = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNotificationClick = async (notification: Notification) => {
    try {
      setIsNavigating(true);
      if (!notification.read) {
        await markRead.mutateAsync(notification._id);
      }
      const route = getNotificationRoute(notification);
      navigate(route);
    } catch (error) {
      console.error('Error handling notification click:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllRead.mutateAsync();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {data?.unreadCount ? (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {data.unreadCount}
            </Badge>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <h4 className="font-medium">Notifications</h4>
          {data?.unreadCount ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllRead}
              disabled={markAllRead.isPending}
            >
              {markAllRead.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Mark all read
            </Button>
          ) : null}
        </div>
        <Separator />
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              Loading notifications...
            </div>
          ) : data?.notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            data?.notifications.map((notification) => (
              <DropdownMenuItem
                key={notification._id}
                className="p-4 cursor-pointer hover:bg-accent"
                onClick={() => handleNotificationClick(notification)}
                disabled={isNavigating}
              >
                <div className="flex gap-3">
                  <div className="text-lg">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'font-medium'}`}>
                      {getNotificationTitle(notification)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary self-start mt-2" />
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 