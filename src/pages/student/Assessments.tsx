import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStudentAssessments } from '@/services/assessmentService';

const Assessments = () => {
  const { courseId } = useParams();
  const { data: assessments, isLoading, error } = useStudentAssessments(courseId);

  useEffect(() => {
    console.log('Assessments for course:', courseId, assessments);
  }, [courseId, assessments]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Assessments</h1>

      {isLoading ? (
        <p>Loading assessments...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load assessments. Please try again.</p>
      ) : assessments.length === 0 ? (
        <p>No assessments available for this course.</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>{assessment.title}</TableCell>
                    <TableCell>{assessment.description}</TableCell>
                    <TableCell>{new Date(assessment.dueDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Assessments;
