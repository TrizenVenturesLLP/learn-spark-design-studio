
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const events = [
  {
    id: 1,
    type: "Workshop",
    title: "Mastering Kubernetes Workshop",
    date: "May 15, 2025",
    time: "2:00 PM - 4:00 PM"
  },
  {
    id: 2,
    type: "Webinar",
    title: "AI Ethics in Healthcare",
    date: "May 22, 2025",
    time: "1:00 PM - 2:30 PM"
  },
  {
    id: 3,
    type: "Event",
    title: "Career Fair: Tech Opportunities",
    date: "June 5, 2025",
    time: "10:00 AM - 4:00 PM"
  }
];

const EventsSection = () => {
  return (
    <section className="py-16">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join our live events, workshops, and webinars to gain insights from industry experts and network with peers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className={`p-2 text-center text-white ${
                event.type === "Workshop" ? "bg-blue-600" :
                event.type === "Webinar" ? "bg-purple-600" : "bg-green-600"
              }`}>
                {event.type}
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
                
                <div className="flex items-center text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{event.date}</span>
                </div>
                
                <div className="text-gray-500 ml-6">
                  {event.time}
                </div>
              </CardContent>
              
              <CardFooter className="border-t bg-gray-50 px-6 py-3">
                <Button className="w-full" variant="outline">Register Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline">View All Events</Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
