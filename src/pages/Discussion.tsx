import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCreateDiscussion, useAddReply, useToggleLike, type CreateDiscussionData, type Discussion } from '@/services/discussionService';
import { Heart, MessageCircle, Pin } from 'lucide-react';
import CourseLayout from '@/components/layouts/CourseLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const DiscussionPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionContent, setNewDiscussionContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [activeDiscussionId, setActiveDiscussionId] = useState<string | null>(null);

  const { data: discussions = [], isLoading } = useQuery<Discussion[]>({
    queryKey: ['discussions', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const response = await axios.get(`/api/courses/${courseId}/discussions`);
      return response.data;
    },
    enabled: !!courseId,
  });

  const createDiscussionMutation = useCreateDiscussion();
  const addReplyMutation = useAddReply();
  const toggleLikeMutation = useToggleLike();

  const handleCreateDiscussion = (formData: { title: string, content: string }) => {
    if (!courseId) return;
    
    const data: CreateDiscussionData = {
      ...formData,
      isPinned: false
    };
    
    createDiscussionMutation.mutate(
      { courseId, data },
      {
        onSuccess: () => {
          setNewDiscussionTitle('');
          setNewDiscussionContent('');
          toast({
            title: 'Success',
            description: 'Discussion created successfully',
          });
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to create discussion',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleAddReply = (discussionId: string) => {
    if (!replyContent.trim()) return;

    addReplyMutation.mutate(
      { discussionId, content: replyContent },
      {
        onSuccess: () => {
          setReplyContent('');
          toast({
            title: 'Success',
            description: 'Reply added successfully',
          });
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to add reply',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleToggleLike = (discussionId: string) => {
    toggleLikeMutation.mutate(discussionId);
  };

  const pinnedDiscussions = discussions.filter(d => d.isPinned);
  const regularDiscussions = discussions.filter(d => !d.isPinned);

  return (
    <CourseLayout>
      <div className="container py-6">
        <Tabs defaultValue="discussions">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
              <TabsTrigger value="create">Start a Discussion</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="discussions">
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-10">Loading discussions...</div>
              ) : discussions.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-10">
                    <p className="text-muted-foreground">No discussions yet. Be the first to start one!</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {pinnedDiscussions.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <Pin className="h-4 w-4 mr-2" /> Pinned Discussions
                      </h3>
                      {pinnedDiscussions.map((discussion) => (
                        <DiscussionCard
                          key={discussion._id}
                          discussion={discussion}
                          isActive={activeDiscussionId === discussion._id}
                          onToggleActive={() => {
                            setActiveDiscussionId(
                              activeDiscussionId === discussion._id ? null : discussion._id
                            );
                            setReplyContent('');
                          }}
                          replyContent={activeDiscussionId === discussion._id ? replyContent : ''}
                          onReplyChange={setReplyContent}
                          onAddReply={() => handleAddReply(discussion._id)}
                          onToggleLike={() => handleToggleLike(discussion._id)}
                        />
                      ))}
                    </div>
                  )}

                  <div className="space-y-4">
                    {pinnedDiscussions.length > 0 && regularDiscussions.length > 0 && (
                      <h3 className="text-lg font-medium">All Discussions</h3>
                    )}
                    {regularDiscussions.map((discussion) => (
                      <DiscussionCard
                        key={discussion._id}
                        discussion={discussion}
                        isActive={activeDiscussionId === discussion._id}
                        onToggleActive={() => {
                          setActiveDiscussionId(
                            activeDiscussionId === discussion._id ? null : discussion._id
                          );
                          setReplyContent('');
                        }}
                        replyContent={activeDiscussionId === discussion._id ? replyContent : ''}
                        onReplyChange={setReplyContent}
                        onAddReply={() => handleAddReply(discussion._id)}
                        onToggleLike={() => handleToggleLike(discussion._id)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Start a New Discussion</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateDiscussion({
                      title: newDiscussionTitle,
                      content: newDiscussionContent,
                    });
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Input
                      placeholder="Discussion Title"
                      value={newDiscussionTitle}
                      onChange={(e) => setNewDiscussionTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Share your thoughts, questions, or insights..."
                      value={newDiscussionContent}
                      onChange={(e) => setNewDiscussionContent(e.target.value)}
                      rows={6}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={createDiscussionMutation.isPending}
                  >
                    {createDiscussionMutation.isPending
                      ? 'Posting...'
                      : 'Post Discussion'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CourseLayout>
  );
};

interface DiscussionCardProps {
  discussion: Discussion;
  isActive: boolean;
  onToggleActive: () => void;
  replyContent: string;
  onReplyChange: (content: string) => void;
  onAddReply: () => void;
  onToggleLike: () => void;
}

const DiscussionCard = ({
  discussion,
  isActive,
  onToggleActive,
  replyContent,
  onReplyChange,
  onAddReply,
  onToggleLike,
}: DiscussionCardProps) => {
  const addReplyMutation = useAddReply();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={discussion.author.avatar} />
                <AvatarFallback>
                  {discussion.author.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{discussion.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {discussion.author.name} •{' '}
                  {formatDistanceToNow(new Date(discussion.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            {discussion.isPinned && (
              <Pin className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          <div className="mt-4">
            <p className="text-sm">{discussion.content}</p>
          </div>

          <div className="mt-4 flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={onToggleLike}
            >
              <Heart
                className={cn(
                  'h-4 w-4',
                  discussion.likedByUser && 'fill-red-500 text-red-500'
                )}
              />
              <span>{discussion.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={onToggleActive}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{discussion.replies.length}</span>
            </Button>
          </div>
        </div>

        {isActive && (
          <div className="bg-muted/50 p-6">
            <div className="space-y-4">
              {discussion.replies.length > 0 ? (
                discussion.replies.map((reply) => (
                  <div key={reply._id} className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={reply.author.avatar} />
                      <AvatarFallback>
                        {reply.author.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{reply.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(reply.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <p className="text-sm">{reply.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No replies yet. Be the first to reply!
                </p>
              )}
            </div>

            <Separator className="my-4" />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onAddReply();
              }}
              className="flex space-x-2"
            >
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => onReplyChange(e.target.value)}
                className="min-h-[80px] flex-1"
              />
              <Button
                type="submit"
                disabled={!replyContent.trim() || addReplyMutation.isPending}
                className="self-end"
              >
                {addReplyMutation.isPending ? 'Posting...' : 'Post'}
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiscussionPage;
