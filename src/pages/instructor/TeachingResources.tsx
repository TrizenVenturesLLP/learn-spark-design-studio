import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  PenTool, 
  Video, 
  MessageSquare, 
  FileText, 
  AlertCircle, 
  Search, 
  GraduationCap,
  Calendar,
  Award,
  Clock,
  FilePlus,
  Users,
  BarChart,
  CheckCircle,
  InfoIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TeachingResources = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <BookOpen className="w-8 h-8 mr-2 text-primary" />
          Teaching Resources
        </h1>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700">Resources Coming Soon!</AlertTitle>
        <AlertDescription className="text-blue-600">
          Our teaching resources are not yet available. We're actively developing comprehensive materials to support your teaching journey. Please check back soon!
        </AlertDescription>
      </Alert>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input 
          placeholder="Search all resources..." 
          className="w-full pl-10 py-6 text-lg"
          disabled
        />
      </div>
      
      <Tabs defaultValue="tools" className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 mb-4">
          <TabsTrigger value="tools">Instructor Toolkit</TabsTrigger>
          <TabsTrigger value="guides">Teaching Guides</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="webinars">Webinars & Events</TabsTrigger>
        </TabsList>
        
        {/* Instructor Toolkit Tab */}
        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Coming Soon</CardTitle>
              <CardDescription>
                Our instructor toolkit resources are being developed and will be available shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>We're working hard to create valuable resources including:</p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Course planning templates</li>
                <li>Video recording guides</li>
                <li>Student engagement tools</li>
                <li>Assessment creation kits</li>
                <li>Analytics interpretation guides</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Teaching Guides Tab */}
        <TabsContent value="guides">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Coming Soon</CardTitle>
              <CardDescription>
                Our teaching guides are being developed and will be available shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>We're working hard to create comprehensive guides on:</p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Effective online teaching strategies</li>
                <li>Creating engaging learning objectives</li>
                <li>Building online student communities</li>
                <li>Subject-specific teaching approaches</li>
                <li>Giving constructive student feedback</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Templates Tab */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Coming Soon</CardTitle>
              <CardDescription>
                Our templates are being developed and will be available shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>We're working hard to create useful templates including:</p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Course syllabus templates</li>
                <li>Student announcement templates</li>
                <li>Assignment and quiz frameworks</li>
                <li>Course project guidelines</li>
                <li>Video script templates</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Webinars Tab */}
        <TabsContent value="webinars">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Coming Soon</CardTitle>
              <CardDescription>
                Our webinars and events are being scheduled and will be available shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>We're working hard to prepare valuable events including:</p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Creating engaging video content</li>
                <li>Effective assessment strategies</li>
                <li>Growing your student base</li>
                <li>Advanced course design techniques</li>
                <li>Instructor success stories</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeachingResources; 