import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BookOpen, Trophy, Star, Clock, GraduationCap, 
  Calendar, MessageSquare 
} from "lucide-react";

const Profile = () => {
  // Get user data from auth context
  const { user, isAuthenticated } = useAuth();

  // Ensure we have some data to display even if user is not loaded
  const displayName = user?.name || user?.email?.split('@')[0] || "Anonymous User";
  
  const userData = {
    name: displayName,
    email: user?.email || "No email provided",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`,
    bio: "Learning and growing with every course",
    role: "Student",
    joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    stats: {
      coursesCompleted: 5,
      coursesInProgress: 2,
      assignmentsSubmitted: 28,
      averageGrade: 92
    },
    achievements: [
      { id: 1, title: "Course Master", description: "Completed 5 courses", icon: Trophy },
      { id: 2, title: "Top Performer", description: "Maintained 90%+ average", icon: Star },
      { id: 3, title: "Active Learner", description: "30 days study streak", icon: Clock }
    ],
    recentActivity: [
      { id: 1, type: 'course', title: "Completed React Fundamentals", date: "2 days ago", icon: BookOpen },
      { id: 2, type: 'assignment', title: "Submitted Final Project", date: "5 days ago", icon: GraduationCap },
      { id: 3, type: 'discussion', title: "Posted in React Hooks thread", date: "1 week ago", icon: MessageSquare }
    ]
  };

  // Debug logging
  console.log('Auth User:', user);
  console.log('Display Name:', displayName);

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userData.avatar} />
                <AvatarFallback>{userData.name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold">{userData.name}</h1>
                    <p className="text-muted-foreground">{userData.email}</p>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md">{userData.bio}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge>{userData.role}</Badge>
                      <Badge variant="outline">Member since {userData.joinDate}</Badge>
                    </div>
                  </div>
                  <Link to="/settings">
                    <Button variant="outline">Edit Profile</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(userData.stats).map(([key, value]) => (
            <Card key={key}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{value}</div>
                  <p className="text-sm text-muted-foreground">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <achievement.icon className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <activity.icon className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;