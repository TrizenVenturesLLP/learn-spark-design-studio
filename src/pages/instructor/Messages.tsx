import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Search,
  Send,
  Plus,
  Star,
  Filter,
  Loader2,
  ArrowLeft,
  Mail
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useInstructorDiscussions, useAddReply, useCreateDiscussion } from '@/services/discussionService';
import { useInstructorCourses } from '@/services/courseService';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Discussion } from '@/types/discussion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConversations, useMessages, useSendMessage, useEnrolledStudents } from '@/services/messageService';
import { cn } from '@/lib/utils';

interface Course {
  _id: string;
  title: string;
}

const MessagesPage = () => {
  const { toast } = useToast();
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionContent, setNewDiscussionContent] = useState('');
  const [isCreatingDiscussion, setIsCreatingDiscussion] = useState(false);
  
  // Direct message states
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedCourseForDM, setSelectedCourseForDM] = useState<string | null>(null);
  const [newDirectMessage, setNewDirectMessage] = useState('');
  const [dmSearchQuery, setDmSearchQuery] = useState('');
  
  const { data: discussions = [], isLoading: isLoadingDiscussions } = useInstructorDiscussions();
  const { data: courses = [], isLoading: isLoadingCourses } = useInstructorCourses();
  const { data: conversations = [], isLoading: isLoadingConversations } = useConversations();
  const { data: enrolledStudents = [], isLoading: isLoadingStudents } = useEnrolledStudents();
  const { data: messages = [], isLoading: isLoadingMessages } = useMessages(selectedConversation || '', selectedCourseForDM || '');
  
  const addReplyMutation = useAddReply();
  const createDiscussionMutation = useCreateDiscussion();
  const sendMessageMutation = useSendMessage();

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedDiscussion) return;

    addReplyMutation.mutate({
      discussionId: selectedDiscussion._id,
      content: newMessage,
    }, {
      onSuccess: () => {
        toast({ title: 'Reply sent successfully!' });
        setNewMessage('');
      },
      onError: () => {
        toast({ title: 'Failed to send reply', variant: 'destructive' });
      },
    });
  };

  const handleCreateDiscussion = () => {
    if (!newDiscussionTitle.trim() || !newDiscussionContent.trim() || selectedCourse === 'all') return;

    createDiscussionMutation.mutate({
      courseId: selectedCourse,
      data: {
        title: newDiscussionTitle,
        content: newDiscussionContent,
        isPinned: true,
      }
    }, {
      onSuccess: () => {
        toast({ 
          title: 'Discussion created successfully!',
          description: 'Students will see this discussion pinned at the top of their course discussions.'
        });
        setNewDiscussionTitle('');
        setNewDiscussionContent('');
        setIsCreatingDiscussion(false);
        setSelectedDiscussion(null);
      },
      onError: () => {
        toast({ 
          title: 'Failed to create discussion', 
          description: 'Please try again.',
          variant: 'destructive' 
        });
      },
    });
  };

  const handleSendDirectMessage = () => {
    if (!newDirectMessage.trim() || !selectedConversation || !selectedCourseForDM) return;

    sendMessageMutation.mutate({
      receiverId: selectedConversation,
      courseId: selectedCourseForDM,
      content: newDirectMessage
    }, {
      onSuccess: () => {
        setNewDirectMessage('');
        toast({ title: 'Message sent successfully!' });
      },
      onError: () => {
        toast({ 
          title: 'Failed to send message',
          variant: 'destructive'
        });
      }
    });
  };

  // Filter and organize discussions
  const filteredDiscussions = React.useMemo(() => {
    let filtered = discussions as Discussion[];

    // Filter by course if selected
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(d => d.courseId._id === selectedCourse);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.userId.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort discussions (pinned first, then by date)
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [discussions, selectedCourse, searchQuery]);

  // Filter conversations based on search
  const filteredConversations = React.useMemo(() => {
    let filtered = conversations;

    // Filter by course if selected
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(conv => conv.course._id === selectedCourse);
    }

    // Filter by search query
    if (dmSearchQuery) {
      filtered = filtered.filter(conv => 
        conv.partner.name.toLowerCase().includes(dmSearchQuery.toLowerCase()) ||
        conv.course.title.toLowerCase().includes(dmSearchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [conversations, dmSearchQuery, selectedCourse]);

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="discussions">
            <TabsList className="mb-4">
              <TabsTrigger value="discussions" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Discussions
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Direct Messages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discussions">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    onClick={() => {
                      setIsCreatingDiscussion(true);
                      setSelectedDiscussion(null);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Discussion
                  </Button>
                </div>
                <div className="flex space-x-4">
                  <Select
                    value={selectedCourse}
                    onValueChange={setSelectedCourse}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map(course => (
                        <SelectItem key={course._id} value={course._id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {isLoadingDiscussions || isLoadingCourses ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : isCreatingDiscussion ? (
                  <div className="space-y-4">
                    {selectedCourse === 'all' && (
                      <Select
                        value={selectedCourse}
                        onValueChange={setSelectedCourse}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map(course => (
                            <SelectItem key={course._id} value={course._id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <Input
                      placeholder="Discussion title"
                      value={newDiscussionTitle}
                      onChange={(e) => setNewDiscussionTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder="Discussion content"
                      value={newDiscussionContent}
                      onChange={(e) => setNewDiscussionContent(e.target.value)}
                      rows={6}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsCreatingDiscussion(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateDiscussion}
                        disabled={!newDiscussionTitle || !newDiscussionContent || selectedCourse === 'all' || createDiscussionMutation.isPending}
                      >
                        {createDiscussionMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Plus className="h-4 w-4 mr-2" />
                        )}
                        Create Discussion
                      </Button>
                    </div>
                  </div>
                ) : selectedDiscussion ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedDiscussion(null)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Discussions
                      </Button>
                      {selectedDiscussion.isPinned && (
                        <Badge variant="secondary" className="flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                          Instructor Post
                        </Badge>
                      )}
                    </div>
                    
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-4">
                        {/* Initial discussion post */}
                        <div className="flex justify-start">
                          <div className={`w-full rounded-lg p-4 ${
                            selectedDiscussion.isPinned ? 'bg-primary/5 border border-primary/20' : 'bg-muted'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Avatar>
                                  <AvatarFallback>
                                    {selectedDiscussion.userId.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold">{selectedDiscussion.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedDiscussion.userId.name} · {selectedDiscussion.courseId.title}
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(selectedDiscussion.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm">{selectedDiscussion.content}</p>
                          </div>
                        </div>

                        {/* Replies */}
                        {selectedDiscussion.replies.map((reply: any) => (
                          <div
                            key={reply._id}
                            className={`flex ${
                              reply.userId._id === selectedDiscussion.userId._id ? 'justify-start' : 'justify-end'
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-4 ${
                                reply.userId._id === selectedDiscussion.userId._id
                                  ? 'bg-muted'
                                  : 'bg-primary text-primary-foreground'
                              }`}
                            >
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-medium">{reply.userId.name}</span>
                                <span className="text-xs opacity-70">
                                  {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-sm">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="flex items-center space-x-2 mt-4">
                      <Textarea
                        placeholder="Type your reply..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                        rows={3}
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        size="icon" 
                        className="h-24"
                        disabled={!newMessage.trim() || addReplyMutation.isPending}
                      >
                        {addReplyMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {filteredDiscussions.map((discussion) => (
                        <div
                          key={discussion._id}
                          className={`p-4 rounded-lg cursor-pointer transition-colors ${
                            discussion.isPinned ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedDiscussion(discussion)}
                        >
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarFallback>
                                {discussion.userId.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-medium">{discussion.title}</h4>
                                  {discussion.isPinned && (
                                    <>
                                      <Badge variant="secondary" className="flex items-center">
                                        <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                                        Instructor
                                      </Badge>
                                    </>
                                  )}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {discussion.userId.name} · {discussion.courseId.title}
                              </p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {discussion.content}
                              </p>
                              {discussion.replies.length > 0 && (
                                <div className="flex items-center text-xs text-muted-foreground mt-2">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  {discussion.replies.length} replies
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <div className="flex h-[700px] gap-4">
                {/* Left sidebar: Conversations list */}
                <Card className="w-80 flex flex-col bg-white">
                  <div className="p-4 border-b space-y-2">
                    <Select
                      value={selectedCourse}
                      onValueChange={setSelectedCourse}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        {courses.map(course => (
                          <SelectItem key={course._id} value={course._id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search messages..."
                        value={dmSearchQuery}
                        onChange={(e) => setDmSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1 p-2">
                    {isLoadingConversations ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredConversations.map((conv) => (
                          <div
                            key={conv.partner._id}
                            className={cn(
                              "p-3 rounded-lg cursor-pointer transition-colors",
                              selectedConversation === conv.partner._id
                                ? "bg-primary/10"
                                : "hover:bg-muted"
                            )}
                            onClick={() => {
                              setSelectedConversation(conv.partner._id);
                              setSelectedCourseForDM(conv.course._id);
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>
                                  {conv.partner.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium truncate">{conv.partner.name}</p>
                                  {conv.unreadCount > 0 && (
                                    <Badge variant="secondary" className="ml-2">{conv.unreadCount}</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  {conv.course.title}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </Card>

                {/* Main Chat Area */}
                <Card className="flex-1 flex flex-col bg-white">
                  {selectedConversation && selectedCourseForDM ? (
                    <>
                      {/* Chat Header */}
                      <div className="px-6 py-4 border-b flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {conversations.find(c => c.partner._id === selectedConversation)?.partner.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h2 className="font-semibold">
                              {conversations.find(c => c.partner._id === selectedConversation)?.partner.name}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              {conversations.find(c => c.partner._id === selectedConversation)?.course.title}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Messages Area */}
                      <ScrollArea className="flex-1 p-6 bg-gray-50">
                        {isLoadingMessages ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {messages.map((message) => (
                              <div
                                key={message._id}
                                className={cn(
                                  "flex",
                                  message.senderId._id === selectedConversation ? "justify-start" : "justify-end"
                                )}
                              >
                                {message.senderId._id === selectedConversation && (
                                  <Avatar className="h-8 w-8 mr-2 self-end mb-1">
                                    <AvatarFallback>
                                      {conversations.find(c => c.partner._id === selectedConversation)?.partner.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div
                                  className={cn(
                                    "max-w-[70%] p-3 rounded-lg shadow-sm relative",
                                    message.senderId._id === selectedConversation
                                      ? "bg-white rounded-tl-none"
                                      : "bg-primary text-primary-foreground rounded-tr-none"
                                  )}
                                >
                                  <p className="text-sm break-words">{message.content}</p>
                                  <p className="text-[10px] opacity-70 text-right mt-1">
                                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>

                      {/* Input Area */}
                      <div className="p-4 bg-white border-t">
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSendDirectMessage();
                          }} 
                          className="flex items-center space-x-2"
                        >
                          <div className="flex-1 relative">
                            <Input
                              placeholder="Type your message"
                              value={newDirectMessage}
                              onChange={(e) => setNewDirectMessage(e.target.value)}
                              className="w-full bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full px-4 py-2"
                            />
                          </div>
                          <Button 
                            type="submit"
                            size="icon"
                            className="bg-primary hover:bg-primary/90 rounded-full"
                            disabled={!newDirectMessage.trim() || sendMessageMutation.isPending}
                          >
                            {sendMessageMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center p-8">
                      <div className="space-y-4">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto" />
                        <div>
                          <h3 className="text-lg font-semibold">No Conversation Selected</h3>
                          <p className="text-sm text-muted-foreground">
                            Choose a conversation from the list to start messaging
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesPage; 