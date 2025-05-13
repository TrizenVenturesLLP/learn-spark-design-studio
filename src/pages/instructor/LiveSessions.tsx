import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Video, Users } from 'lucide-react';

const LiveSessionsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/instructor/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Live Sessions</h1>
      </div>

      <Card className="mt-6">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center space-y-4">
            <Calendar className="h-12 w-12 text-primary" />
            <CardTitle className="text-2xl">Coming Soon!</CardTitle>
            <CardDescription className="text-lg">
              Live Sessions feature is currently under development
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-muted-foreground">
              We're working hard to bring you an amazing live teaching experience. Soon you'll be able to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="p-4">
                <div className="flex flex-col items-center space-y-2">
                  <Video className="h-6 w-6 text-primary" />
                  <h3 className="font-medium">Host Live Classes</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Conduct interactive live sessions with your students
                  </p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex flex-col items-center space-y-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  <h3 className="font-medium">Schedule Sessions</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Plan and organize your teaching schedule
                  </p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex flex-col items-center space-y-2">
                  <Users className="h-6 w-6 text-primary" />
                  <h3 className="font-medium">Engage Students</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Real-time interaction with your students
                  </p>
                </div>
              </Card>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Stay tuned for updates! We'll notify you when this feature becomes available.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveSessionsPage;
