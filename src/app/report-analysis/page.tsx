'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { labReportSummary } from '@/ai/flows/lab-report-summary';
import type { LabReportSummaryOutput } from '@/ai/flows/lab-report-summary';
import { Loader2, FileUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<LabReportSummaryOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setSummary(null); // Reset summary when a new file is chosen
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

        {(loading || summary) && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                summary && <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none whitespace-pre-wrap">{summary.summary}</div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
