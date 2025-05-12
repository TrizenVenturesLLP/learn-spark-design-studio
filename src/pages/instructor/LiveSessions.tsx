import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, Video, MoreHorizontal, Edit, Trash2, Users, Link } from 'lucide-react';
import { format } from 'date-fns';

interface Session {
  id: string;
  title: string;
  courseTitle: string;
  date: string;
  time: string;
  duration: string;
  attendees: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
}

const mockSessions: Session[] = [
  {
    id: '1',
    title: 'Introduction to React Hooks',
    courseTitle: 'Web Development Fundamentals',
    date: '2025-05-15',
    time: '10:00 AM',
    duration: '1.5 hours',
    attendees: 25,
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Data Structures Deep Dive',
    courseTitle: 'Data Structures',
    date: '2025-05-12',
    time: '2:00 PM',
    duration: '2 hours',
    attendees: 18,
    status: 'completed'
  },
  {
    id: '3',
    title: 'Python OOP Concepts',
    courseTitle: 'Python Programming',
    date: '2025-05-20',
    time: '11:30 AM',
    duration: '1 hour',
    attendees: 0,
    status: 'scheduled'
  },
];

const LiveSessionsPage = () => {
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [date, setDate] = useState<Date>();

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Live Sessions</h1>
        <Button onClick={() => setIsCreateSessionOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Session
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Upcoming Sessions</CardTitle>
              <div className="flex space-x-2 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search sessions..."
                    className="pl-10 w-[250px]"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.title}</TableCell>
                    <TableCell>{session.courseTitle}</TableCell>
                    <TableCell>
                      {format(new Date(session.date), 'MMM d, yyyy')} {session.time}
                    </TableCell>
                    <TableCell>{session.duration}</TableCell>
                    <TableCell>{session.attendees}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(session.status)}`}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {session.status === 'scheduled' && (
                            <DropdownMenuItem className="text-green-600">
                              <Video className="h-4 w-4 mr-2" />
                              Start Session
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            View Attendees
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link className="h-4 w-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel Session
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCreateSessionOpen} onOpenChange={setIsCreateSessionOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule New Session</DialogTitle>
            <DialogDescription>
              Create a new live session for your course.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Enter session title" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Course</label>
              <Input placeholder="Select course" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input type="time" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Input placeholder="e.g., 1.5 hours" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateSessionOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Schedule Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveSessionsPage;
