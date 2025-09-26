'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { labReportSummary } from '@/ai/flows/lab-report-summary';
import type { LabReportSummaryOutput } from '@/ai/flows/lab-report-summary';
import { Loader2, FileUp, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


// Helper function to determine the overall status of the report
const getOverallStatus = (summary: LabReportSummaryOutput | null): 'Normal' | 'Attention Needed' => {
  // If there's no summary or no key findings, assume it's normal.
  if (!summary || !summary.keyFindings || summary.keyFindings.length === 0) {
    return 'Normal';
  }

  // Check if ANY finding has a status that is not 'Normal'.
  const hasAbnormalFinding = summary.keyFindings.some(
    (finding) => finding.status !== 'Normal'
  );

  // If we found at least one abnormal finding, the status is 'Attention Needed'.
  if (hasAbnormalFinding) {
    return 'Attention Needed';
  }

  // Only if all findings are 'Normal' do we return 'Normal'.
  return 'Normal';
};


// =================================================================
// == NEW COMPONENT: StatusBanner (for the color-coded header)   ==
// =================================================================
const StatusBanner = ({ summary }: { summary: LabReportSummaryOutput | null }) => {
  const overallStatus = getOverallStatus(summary);

  const statusConfig = {
    'Normal': {
      icon: <CheckCircle2 className="h-5 w-5" />,
      style: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      text: "This report indicates a healthy profile with results within normal ranges."
    },
    'Attention Needed': {
      icon: <AlertTriangle className="h-5 w-5" />,
      style: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      text: "This report shows one or more results that may need attention. Please review the findings below."
    },
  };

  const config = statusConfig[overallStatus];

  return (
    <div className={`flex items-center space-x-3 rounded-md p-4 mb-6 ${config.style}`}>
      {config.icon}
      <p className="font-medium text-sm">{config.text}</p>
    </div>
  );
};

// ===================================================================
// == NEW COMPONENT: FindingCard (for each structured key finding)  ==
// ===================================================================
const FindingCard = ({ finding }: { finding: LabReportSummaryOutput['keyFindings'][0] }) => {
    const statusConfig = {
    'Normal': "text-green-600 dark:text-green-400 font-semibold",
    'High': "text-yellow-600 dark:text-yellow-400 font-semibold",
    'Low': "text-yellow-600 dark:text-yellow-400 font-semibold",
    'Abnormal': "text-red-600 dark:text-red-400 font-semibold",
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{finding.term}</CardTitle>
        <CardDescription>
          Status: <span className={statusConfig[finding.status]}>{finding.status}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{finding.explanation}</p>
      </CardContent>
    </Card>
  );
};

// ===================================================================
// == Main Page Component (with updated rendering logic)            ==
// ===================================================================
export default function ReportAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] =useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<LabReportSummaryOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setSummary(null);
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please upload a lab report to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setSummary(null);

    try {
      const dataUri = await fileToDataUri(file);
      const result = await labReportSummary({ reportDataUri: dataUri });
      setSummary(result);
    } catch (error) {
      console.error('Error analyzing report:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Something went wrong while analyzing your report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Lab Report Analysis</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Get a simple, clear summary of your medical lab reports.
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Upload Your Report</CardTitle>
            <CardDescription>Supports PDF, JPG, and PNG files.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-2">
                <label htmlFor="file-upload" className="w-full">
                  <div className="flex items-center justify-center w-full h-32 px-4 transition bg-card border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-primary focus:outline-none">
                    <span className="flex items-center space-x-2">
                      <FileUp className="w-6 h-6 text-muted-foreground" />
                      <span className="font-medium text-muted-foreground">
                        {fileName || "Drag & drop a file or click to select"}
                      </span>
                    </span>
                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                </label>
              </div>
              <Button type="submit" disabled={loading || !file} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Analyzing...' : 'Analyze Report'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* ====================================================================== */}
        {/* == THIS IS THE MODIFIED SECTION FOR DISPLAYING THE ANALYSIS RESULTS == */}
        {/* ====================================================================== */}
        {(loading || summary) && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Analysis Results</h2>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              summary && (
                <div className="space-y-6">
                  {/* 1. Render the Status Banner */}
                  <StatusBanner summary={summary} />

                  {/* 2. Render the overall text summary */}
                  <Card>
                    <CardHeader><CardTitle>Overall Summary</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{summary.summary}</p>
                    </CardContent>
                  </Card>
                  
                  {/* 3. Render a card for each key finding */}
                  {summary.keyFindings?.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Key Findings</h3>
                      <div className="space-y-4">
                        {summary.keyFindings.map((finding, index) => (
                          <FindingCard key={index} finding={finding} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
