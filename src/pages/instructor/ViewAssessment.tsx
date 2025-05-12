
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileQuestion, Edit, ArrowLeft, User } from 'lucide-react';
import { useAssessmentDetails, useAssessmentResults } from '@/services/assessmentService';

// Define types for assessment results
interface AssessmentSubmission {
  studentId: string;
  studentName: string;
  submissionDate: string;
  totalMarks: number;
  answers: any[];
}

interface AssessmentResults {
  submissions: AssessmentSubmission[];
  totalStudents: number;
}

const ViewAssessment = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  
  const { 
    data: assessment, 
    isLoading: isLoadingAssessment,
    isError: isAssessmentError 
  } = useAssessmentDetails(assessmentId || '');
  
  const {
    data: results,
    isLoading: isLoadingResults,
    isError: isResultsError
  } = useAssessmentResults<AssessmentResults>(assessmentId || '');

  if (isLoadingAssessment || isLoadingResults) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAssessmentError || !assessment) {
    return (
      <div className="text-center py-12">
        <FileQuestion className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Assessment not found</h3>
        <p className="text-muted-foreground mb-4">The assessment you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/instructor/assessments')}>
          Go Back to Assessments
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/instructor/assessments')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{assessment.title}</h1>
        </div>
        <Button onClick={() => navigate(`/instructor/assessments/${assessmentId}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Assessment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Assessment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-sm text-muted-foreground mt-1">{assessment.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium">Type</h3>
                  <p className="text-sm text-muted-foreground mt-1">{assessment.type}</p>
                </div>
                <div>
                  <h3 className="font-medium">Due Date</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(assessment.dueDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Total Marks</h3>
                  <p className="text-sm text-muted-foreground mt-1">{assessment.totalMarks}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Questions ({assessment.questions.length})</h3>
                <div className="space-y-3">
                  {assessment.questions.map((question, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <span className="text-sm text-muted-foreground">{question.marks} marks</span>
                      </div>
                      <div className="mt-2">
                        {question.type === 'MCQ' ? (
                          <>
                            <p>{question.questionText}</p>
                            <ul className="mt-2 space-y-1">
                              {question.options.map((option, optionIndex) => (
                                <li key={optionIndex} className="flex items-center">
                                  <span className={option === question.correctAnswer ? 'text-green-600 font-medium' : ''}>
                                    {option}
                                    {option === question.correctAnswer && ' (Correct)'}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <>
                            <p className="font-medium">Problem Statement:</p>
                            <p className="mt-1 mb-2">{question.problemStatement}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium text-sm">Input Format:</p>
                                <p className="text-sm">{question.inputFormat}</p>
                              </div>
                              <div>
                                <p className="font-medium text-sm">Output Format:</p>
                                <p className="text-sm">{question.outputFormat}</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="font-medium text-sm">Test Cases ({question.testCases.length}):</p>
                              <div className="mt-1 max-h-40 overflow-y-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Input</TableHead>
                                      <TableHead>Expected Output</TableHead>
                                      <TableHead>Hidden</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {question.testCases.map((testCase, testIndex) => (
                                      <TableRow key={testIndex}>
                                        <TableCell className="font-mono text-xs">
                                          {testCase.input}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                          {testCase.expectedOutput}
                                        </TableCell>
                                        <TableCell>
                                          {testCase.isHidden ? 'Yes' : 'No'}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {results && results.submissions && results.submissions.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {results.submissions.length} out of {results.totalStudents} students submitted
                  </p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead>Submitted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.submissions.map((submission, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{submission.studentName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {submission.totalMarks}/{assessment.totalMarks}
                          </TableCell>
                          <TableCell>
                            {new Date(submission.submissionDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
                <p className="text-muted-foreground">
                  Students haven't submitted their work for this assessment.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewAssessment;
