
import { useQuery } from "@tanstack/react-query";

// Course data with categories
const courseData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Machine Learning Fundamentals",
    description: "Learn the foundations of machine learning algorithms and their practical applications",
    longDescription: "This comprehensive course teaches you the core concepts of machine learning from the ground up. You'll master supervised and unsupervised learning techniques, neural networks, and deep learning fundamentals. Through hands-on projects, you'll implement algorithms for real-world data analysis and prediction tasks.",
    instructor: "Dr. Ada Johnson",
    duration: "36 hours",
    rating: 4.8,
    students: 8745,
    level: "Beginner" as const,
    category: "ai",
    skills: ["Python", "TensorFlow", "Neural Networks", "Data Analysis", "Statistical Modeling", "Supervised Learning", "Unsupervised Learning", "Regression Analysis"],
    courses: [
      {
        title: "Introduction to Machine Learning",
        details: "Course 1 • 12 hours • 4.9 ★ (623 ratings)"
      },
      {
        title: "Neural Networks and Deep Learning",
        details: "Course 2 • 14 hours • 4.7 ★ (512 ratings)"
      },
      {
        title: "Applied Machine Learning Projects",
        details: "Course 3 • 10 hours • 4.8 ★ (478 ratings)"
      }
    ],
    testimonials: [
      {
        text: "This course gave me the skills I needed to transition into a machine learning role at my company.",
        author: "Michael T.",
        since: "Learner since 2022"
      },
      {
        text: "Clear explanations of complex concepts. The projects really helped cement my understanding.",
        author: "Sarah J.",
        since: "Learner since 2021"
      }
    ]
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "AWS Cloud Practitioner",
    description: "Master AWS fundamentals and prepare for the Cloud Practitioner certification",
    longDescription: "Prepare for the AWS Certified Cloud Practitioner exam with this thorough introduction to Amazon Web Services. Learn about AWS core services, security, architecture, pricing, and support. By the end of this course, you'll understand cloud concepts and how to implement them using AWS services.",
    instructor: "Raj Patel",
    duration: "30 hours",
    rating: 4.9,
    students: 6521,
    level: "Beginner" as const,
    category: "cloud",
    skills: ["Amazon Web Services (AWS)", "Cloud Computing", "EC2", "S3", "RDS", "IAM", "CloudFormation", "Lambda"],
    courses: [
      {
        title: "AWS Core Services",
        details: "Course 1 • 10 hours • 4.9 ★ (756 ratings)"
      },
      {
        title: "AWS Security and Compliance",
        details: "Course 2 • 8 hours • 4.8 ★ (521 ratings)"
      },
      {
        title: "AWS Certification Exam Preparation",
        details: "Course 3 • 12 hours • 4.9 ★ (843 ratings)"
      }
    ],
    testimonials: [
      {
        text: "Passed my AWS certification on the first try thanks to this course!",
        author: "Diego M.",
        since: "Learner since 2023"
      },
      {
        text: "Great balance of theory and hands-on practice with AWS services.",
        author: "Priya S.",
        since: "Learner since 2022"
      }
    ]
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Full-Stack Web Development",
    description: "Build modern web applications with React, Node.js, and MongoDB",
    longDescription: "Learn to create complete web applications from front to back. This course covers everything from UI design with React to server-side development with Node.js and database management with MongoDB. You'll build real-world projects and deploy them to the cloud.",
    instructor: "Jennifer Wu",
    duration: "48 hours",
    rating: 4.7,
    students: 9874,
    level: "Intermediate" as const,
    category: "web",
    skills: ["React", "Node.js", "MongoDB", "Express.js", "JavaScript", "HTML", "CSS", "RESTful APIs", "Git", "Authentication"],
    courses: [
      {
        title: "Frontend Development with React",
        details: "Course 1 • 16 hours • 4.7 ★ (892 ratings)"
      },
      {
        title: "Backend Development with Node.js",
        details: "Course 2 • 18 hours • 4.6 ★ (764 ratings)"
      },
      {
        title: "Database Design with MongoDB",
        details: "Course 3 • 14 hours • 4.8 ★ (623 ratings)"
      }
    ],
    testimonials: [
      {
        text: "This course helped me build my portfolio and land my first dev job!",
        author: "Chris L.",
        since: "Learner since 2021"
      },
      {
        text: "The project-based approach made learning complex concepts much easier.",
        author: "Amanda K.",
        since: "Learner since 2022"
      }
    ]
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Ethical Hacking & Penetration Testing",
    description: "Learn to identify and exploit vulnerabilities in computer systems and networks",
    longDescription: "Master the art of ethical hacking and penetration testing. Learn to think like a hacker to identify security flaws in systems and networks. You'll practice on real-world scenarios, use professional tools, and learn legal and ethical considerations for security professionals.",
    instructor: "Mark Cunningham",
    duration: "42 hours",
    rating: 4.9,
    students: 5326,
    level: "Advanced" as const,
    category: "security",
    skills: ["Network Security", "Vulnerability Assessment", "Metasploit", "Wireshark", "Kali Linux", "Social Engineering", "Cryptography", "Web Application Security"],
    courses: [
      {
        title: "Introduction to Network Security",
        details: "Course 1 • 14 hours • 4.9 ★ (487 ratings)"
      },
      {
        title: "Web Application Penetration Testing",
        details: "Course 2 • 16 hours • 4.9 ★ (512 ratings)"
      },
      {
        title: "Advanced Exploitation Techniques",
        details: "Course 3 • 12 hours • 4.8 ★ (378 ratings)"
      }
    ],
    testimonials: [
      {
        text: "Incredibly detailed course that teaches real-world hacking skills ethically.",
        author: "James R.",
        since: "Learner since 2020"
      },
      {
        text: "The hands-on labs were excellent for practicing techniques safely.",
        author: "Elena V.",
        since: "Learner since 2021"
      }
    ]
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Data Analysis with Python",
    description: "Explore and analyze data using Python libraries like Pandas, NumPy, and Matplotlib",
    longDescription: "Become proficient in data analysis using Python's powerful libraries. Learn how to clean, transform, and visualize data with Pandas, NumPy, and Matplotlib. You'll work on real datasets to extract insights and communicate findings through effective data storytelling.",
    instructor: "Dr. Maria Rodriguez",
    duration: "32 hours",
    rating: 4.6,
    students: 7425,
    level: "Intermediate" as const,
    category: "data",
    skills: ["Python", "Pandas", "NumPy", "Matplotlib", "Data Cleaning", "Data Visualization", "Statistical Analysis", "Jupyter Notebooks"],
    courses: [
      {
        title: "Python for Data Science",
        details: "Course 1 • 10 hours • 4.7 ★ (623 ratings)"
      },
      {
        title: "Data Cleaning and Preparation",
        details: "Course 2 • 12 hours • 4.5 ★ (487 ratings)"
      },
      {
        title: "Data Visualization and Reporting",
        details: "Course 3 • 10 hours • 4.6 ★ (521 ratings)"
      }
    ],
    testimonials: [
      {
        text: "This course took my Python skills to the next level with practical data analysis applications.",
        author: "Thomas G.",
        since: "Learner since 2022"
      },
      {
        text: "I use what I learned in this course every day in my job as a data analyst.",
        author: "Sophia W.",
        since: "Learner since 2021"
      }
    ]
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Business Communication Skills",
    description: "Develop effective communication skills for professional environments",
    longDescription: "Enhance your professional communication skills for greater effectiveness in the workplace. Learn strategies for clear verbal and written communication, presentation skills, conflict resolution, and cross-cultural communication. These essential soft skills will help you advance in any career path.",
    instructor: "Dr. Michelle Parker",
    duration: "24 hours",
    rating: 4.8,
    students: 4219,
    level: "Beginner" as const,
    category: "soft",
    skills: ["Public Speaking", "Business Writing", "Presentation Skills", "Active Listening", "Nonverbal Communication", "Email Etiquette", "Conflict Resolution", "Cross-cultural Communication"],
    courses: [
      {
        title: "Effective Written Communication",
        details: "Course 1 • 8 hours • 4.8 ★ (418 ratings)"
      },
      {
        title: "Presentation and Public Speaking",
        details: "Course 2 • 8 hours • 4.9 ★ (376 ratings)"
      },
      {
        title: "Conflict Resolution and Negotiation",
        details: "Course 3 • 8 hours • 4.7 ★ (392 ratings)"
      }
    ],
    testimonials: [
      {
        text: "This course helped me overcome my fear of public speaking and improved my presentations.",
        author: "Robert K.",
        since: "Learner since 2023"
      },
      {
        text: "The email templates and communication frameworks are incredibly useful in my daily work.",
        author: "Naomi T.",
        since: "Learner since 2022"
      }
    ]
  },
];

// Function to get course by ID
export const getCourseById = (id: number | string) => {
  const courseId = typeof id === 'string' ? parseInt(id, 10) : id;
  return courseData.find(course => course.id === courseId);
};

// React Query hook for getting course details
export const useCourseDetails = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => {
      if (!courseId) return null;
      const course = getCourseById(courseId);
      if (!course) {
        throw new Error(`Course with ID ${courseId} not found`);
      }
      return course;
    },
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
