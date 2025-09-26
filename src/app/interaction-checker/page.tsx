'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X, Loader2, FileUp, Pill, Apple, AlertCircle } from 'lucide-react';

import { extractMedicationFromPrescription } from '@/ai/flows/extract-medication-from-prescription';
import type { ExtractMedicationFromPrescriptionOutput } from '@/ai/flows/extract-medication-from-prescription';
import { foodMedicationInteractionCheck } from '@/ai/flows/food-medication-interaction-check';

type Medication = ExtractMedicationFromPrescriptionOutput['medications'][0];

export default function InteractionCheckerPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [foods, setFoods] = useState<string[]>([]);
  const [interactions, setInteractions] = useState<{ med: string; food: string; text: string }[]>([]);

  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionFileName, setPrescriptionFileName] = useState('');

  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '' });
  const [newFood, setNewFood] = useState('');

  const [isExtracting, setIsExtracting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const { toast } = useToast();

  const fileToDataUri = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPrescriptionFile(file);
      setPrescriptionFileName(file.name);
    }
  };

  const handleExtractMedications = async () => {
    if (!prescriptionFile) {
      toast({ title: 'No file selected', description: 'Please upload a prescription.', variant: 'destructive' });
      return;
    }
    setIsExtracting(true);
    try {
      const dataUri = await fileToDataUri(prescriptionFile);
      const { medications: extractedMeds } = await extractMedicationFromPrescription({ prescriptionDataUri: dataUri });
      setMedications(prev => [...prev, ...extractedMeds]);
      toast({ title: 'Success', description: 'Medications extracted from prescription.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Extraction Failed', description: 'Could not extract medications. Please try again or add manually.', variant: 'destructive' });
    } finally {
      setIsExtracting(false);
      setPrescriptionFile(null);
      setPrescriptionFileName('');
    }
  };

  const handleAddManualMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMed.name) {
      setMedications([...medications, { name: newMed.name, dosage: newMed.dosage || 'N/A', frequency: newMed.frequency || 'N/A' }]);
      setNewMed({ name: '', dosage: '', frequency: '' });
    }
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFood && !foods.includes(newFood)) {
      setFoods([...foods, newFood]);
      setNewFood('');
    }
  };

  const removeFood = (index: number) => {
    setFoods(foods.filter((_, i) => i !== index));
  };

  const handleCheckInteractions = async () => {
    if (medications.length === 0 || foods.length === 0) {
      toast({ title: 'Missing Information', description: 'Please add at least one medication and one food item.', variant: 'destructive' });
      return;
    }

    setIsChecking(true);
    setInteractions([]);

    try {
      const allInteractions: { med: string; food: string; text: string }[] = [];

      // Check each med-food combination
      for (const med of medications.map(m => m.name)) {
        for (const food of foods) {
          const result = await foodMedicationInteractionCheck({ medications: [med], foods: [food] });
          if (result.interactions?.length) {
            result.interactions.forEach(text => allInteractions.push({ med, food, text }));
          }
        }
      }

      setInteractions(allInteractions);

      if (allInteractions.length === 0) {
        toast({ title: 'No Interactions Found', description: 'No potential interactions detected.' });
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Check Failed', description: 'Could not check for interactions. Please try again.', variant: 'destructive' });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Medication Interaction Checker</h1>
        <p className="mt-2 text-lg text-muted-foreground">Check potential interactions between your medications and foods.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Inputs */}
        <div className="space-y-8">
          {/* Medications Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>1. Add Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload Prescription</TabsTrigger>
                  <TabsTrigger value="manual">Add Manually</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="pt-4">
                  <div className="space-y-4">
                    <label htmlFor="prescription-upload" className="w-full">
                      <div className="flex items-center justify-center w-full h-24 px-4 transition bg-card border-2 border-dashed rounded-md cursor-pointer hover:border-primary">
                        <span className="flex items-center space-x-2">
                          <FileUp className="w-6 h-6 text-muted-foreground" />
                          <span className="font-medium text-muted-foreground">{prescriptionFileName || "Select a prescription file"}</span>
                        </span>
                        <Input id="prescription-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                      </div>
                    </label>
                    <Button onClick={handleExtractMedications} disabled={isExtracting || !prescriptionFile} className="w-full">
                      {isExtracting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Extract Medications
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="manual" className="pt-4">
                  <form onSubmit={handleAddManualMed} className="space-y-2">
                    <Input placeholder="Medication Name" value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} required />
                    <div className="flex gap-2">
                      <Input placeholder="Dosage" value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} />
                      <Input placeholder="Frequency" value={newMed.frequency} onChange={e => setNewMed({ ...newMed, frequency: e.target.value })} />
                    </div>
                    <Button type="submit" className="w-full">Add Medication</Button>
                  </form>
                </TabsContent>
              </Tabs>

              {medications.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h3 className="font-semibold">Your Medications:</h3>
                  {medications.map((med, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">{med.name}</p>
                          <p className="text-sm text-muted-foreground">{med.dosage} - {med.frequency}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeMedication(i)}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Foods Card */}
          <Card className="shadow-lg">
            <CardHeader><CardTitle>2. Add Foods</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAddFood} className="flex gap-2">
                <Input placeholder="e.g., Milk, Cheese, Alcohol" value={newFood} onChange={e => setNewFood(e.target.value)} />
                <Button type="submit">Add Food</Button>
              </form>
              {foods.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h3 className="font-semibold">Your Foods:</h3>
                  <div className="flex flex-wrap gap-2">
                    {foods.map((food, i) => (
                      <div key={i} className="flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-full bg-secondary">
                        <Apple className="h-4 w-4 text-accent" />
                        <span className="text-sm">{food}</span>
                        <button onClick={() => removeFood(i)} className="rounded-full hover:bg-muted p-0.5"><X className="h-3 w-3" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Check Interactions Button */}
          <Button onClick={handleCheckInteractions} className="w-full text-lg py-6">
            {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            3. Check for Interactions
          </Button>
        </div>

        {/* Right Column: Results */}
        <div className="space-y-8 sticky top-24">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Interaction Results</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[200px]">
              {isChecking && (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {!isChecking && interactions.length > 0 && (
                <div className="space-y-4">
                  {interactions.map((interaction, i) => (
                    <Alert key={i} variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{interaction.med} & {interaction.food}</AlertTitle>
                      <AlertDescription>{interaction.text}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
              {!isChecking && interactions.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <p>Results will appear here.</p>
                  <p className="text-sm">Add medications and foods, then click the button above.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
