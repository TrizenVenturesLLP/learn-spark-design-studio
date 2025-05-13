
import React, { useState, useEffect, useRef } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useMessageStore } from '@/services/messageService';
import type { Message, Student, MessageUser } from '@/services/messageService';

interface DirectMessageNotification {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  courseName: string;
  avatar?: string;
}

export const NotificationBell = () => {
  const navigate = useNavigate();
  const { messages, students, unreadCount, markMessageAsRead, markAllMessagesAsRead, settings } = useMessageStore();
  const [notifications, setNotifications] = useState<DirectMessageNotification[]>([]);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousMessagesRef = useRef<Message[]>([]);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
    audioRef.current.preload = 'auto';
  }, []);

  // Request notification permission if needed
  useEffect(() => {
    if (settings.desktop && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [settings.desktop]);

  // Handle new messages and notifications
  useEffect(() => {
    // Check for new messages
    const newMessages = messages.filter(message => {
      const isNew = !previousMessagesRef.current.find(prev => prev._id === message._id);
      const isUnread = !message.read;
      return isNew && isUnread;
    });

    if (newMessages.length > 0 && settings.notifications) {
      // Play sound for new messages
      if (settings.sound && audioRef.current) {
        audioRef.current.play().catch(error => {
          console.warn('Failed to play notification sound:', error);
        });
      }

      // Show desktop notifications
      if (settings.desktop && Notification.permission === 'granted') {
        newMessages.forEach(message => {
          const sender = typeof message.senderId === 'string' 
            ? students.find(s => s._id === message.senderId)?.name 
            : (message.senderId as MessageUser).name;

          if (sender) {
            const notification = new Notification('New Message', {
              body: settings.preview ? message.content : 'You have a new message',
              icon: '/favicon.ico',
            });

            notification.onclick = () => {
              window.focus();
              const studentId = typeof message.senderId === 'string' 
                ? message.senderId 
                : message.senderId._id;
              navigate(`/instructor/messages?student=${studentId}`);
            };
          }
        });
      }
    }

    // Update previous messages reference
    previousMessagesRef.current = messages;
  }, [messages, settings, students, navigate]);

  // Convert messages to notifications format
  useEffect(() => {
    const messageNotifications = messages.map(message => {
      const student = students.find(s => s._id === (typeof message.senderId === 'string' ? message.senderId : message.senderId._id));
      if (!student) return null;

      const timestamp = typeof message.createdAt === 'string' 
        ? message.createdAt 
        : (message.createdAt instanceof Date 
          ? message.createdAt.toISOString() 
          : new Date().toISOString());

      return {
        id: message._id,
        senderId: student._id,
        senderName: student.name,
        content: message.content,
        timestamp,
        read: message.read,
        courseName: student.courseName,
        avatar: student.avatar
      } as DirectMessageNotification;
    }).filter((n): n is DirectMessageNotification => n !== null);

    setNotifications(messageNotifications);
  }, [messages, students]);

  const handleNotificationClick = (notification: DirectMessageNotification) => {
    markMessageAsRead(notification.id);
    navigate(`/instructor/messages?student=${notification.senderId}`);

    toast({
      title: `Message from ${notification.senderName}`,
      description: notification.content,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!settings.notifications) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between p-4">
          <h4 className="font-medium">Direct Messages</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllMessagesAsRead}
            >
              Mark all read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No new messages
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="p-4 cursor-pointer hover:bg-accent"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={notification.avatar} />
                    <AvatarFallback>{getInitials(notification.senderName)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'font-medium'}`}>
                        {notification.senderName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    {settings.preview ? (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.content}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        New message
                      </p>
                    )}
                    <p className="text-xs text-primary">
                      {notification.courseName}
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
