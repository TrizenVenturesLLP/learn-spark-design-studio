import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, ThumbsUp, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  course: string;
  createdAt: string;
  replies: number;
  likes: number;
  tags: string[];
}

const staticDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'React Hooks and State Management',
    content: 'Can someone explain the difference between useState and useReducer? When should I use each one?',
    author: {
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    },
    course: 'Advanced React Development',
    createdAt: '2 hours ago',
    replies: 5,
    likes: 12,
    tags: ['react', 'hooks']
  },
  {
    id: '2',
    title: 'Understanding TypeScript Generics',
    content: 'I am struggling with TypeScript generics. Could someone provide some practical examples?',
    author: {
      name: 'Jane Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
    },
    course: 'TypeScript Fundamentals',
    createdAt: '1 day ago',
    replies: 8,
    likes: 15,
    tags: ['typescript', 'generics']
  },
  {
    id: '3',
    title: 'Next.js Server Components',
    content: 'What are the benefits of using Server Components in Next.js 13? How do they differ from Client Components?',
    author: {
      name: 'Mike Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
    },
    course: 'Next.js Mastery',
    createdAt: '3 days ago',
    replies: 12,
    likes: 24,
    tags: ['nextjs', 'react']
  }
];

const DiscussionCard = ({ discussion }: { discussion: Discussion }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={discussion.author.avatar} />
          <AvatarFallback>{discussion.author.name[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold">{discussion.title}</h3>
              <p className="text-sm text-muted-foreground">
                {discussion.author.name} • {discussion.createdAt}
              </p>
            </div>
            <Badge variant="secondary">{discussion.course}</Badge>
          </div>
          
          <p className="text-sm mb-4">{discussion.content}</p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ThumbsUp className="h-4 w-4" />
              {discussion.likes}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              {discussion.replies}
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Discussion = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDiscussions = staticDiscussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Course Discussions</h1>
            <p className="text-muted-foreground">
              Engage with your peers and instructors
            </p>
          </div>
          <Button>
            <MessageCircle className="h-4 w-4 mr-2" />
            New Discussion
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-6"
            />
            
            {filteredDiscussions.length > 0 ? (
              filteredDiscussions.map(discussion => (
                <DiscussionCard key={discussion.id} discussion={discussion} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No discussions found
              </div>
            )}
          </div>

          <Card className="h-fit sticky top-6">
            <CardHeader>
              <CardTitle>Start a Discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <Input placeholder="Discussion title" />
                <Textarea placeholder="What would you like to discuss?" />
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Post Discussion
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Discussion;