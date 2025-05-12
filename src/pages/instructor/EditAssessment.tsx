
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAssessmentDetails } from '@/services/assessmentService';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CreateAssessment from './CreateAssessment';

const EditAssessment = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    data: assessment,
    isLoading,
    isError,
  } = useAssessmentDetails(assessmentId || '');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading assessment...</p>
      </div>
    );
  }

  if (isError || !assessment) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate('/instructor/assessments')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Assessment</h1>
        </div>
        
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">Assessment not found</h3>
          <p className="text-muted-foreground mb-4">The assessment you're trying to edit doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/instructor/assessments')}>
            Go Back to Assessments
          </Button>
        </div>
      </div>
    );
  }

  // Pass the assessment data to the CreateAssessment component for editing
  return <CreateAssessment isEditing={true} existingAssessment={assessment} />;
};

export default EditAssessment;
