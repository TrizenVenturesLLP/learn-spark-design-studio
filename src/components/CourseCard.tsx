
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  image: string;
  title: string;
  description: string;
  duration: string;
  rating: number;
  students: number;
  level: "Beginner" | "Intermediate" | "Advanced";
}

const CourseCard = ({
  image,
  title,
  description,
  duration,
  rating,
  students,
  level
}: CourseCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <Badge variant={
            level === "Beginner" ? "outline" : 
            level === "Intermediate" ? "secondary" : 
            "default"
          }>
            {level}
          </Badge>
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yellow-500"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        <h3 className="mt-2 font-semibold leading-tight">{title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{students} students</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
