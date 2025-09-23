import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Faq from '@/components/faq';
import { ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const reportAnalysisImage = PlaceHolderImages.find(p => p.id === 'report-analysis-hero');
  const interactionCheckerImage = PlaceHolderImages.find(p => p.id === 'interaction-checker-hero');
  const mainHeroImage = PlaceHolderImages.find(p => p.id === 'main-hero');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] flex items-center justify-center text-center">
        {mainHeroImage && (
          <Image
            src={mainHeroImage.imageUrl}
            alt={mainHeroImage.description}
            fill
            className="object-cover"
            data-ai-hint={mainHeroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/30" />
        <div className="relative container mx-auto px-4 md:px-6 z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Transform Medical Reports Into Clear Insights
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              AI-powered medical document analysis that translates complex medical terminology into clear, understandable language for better health decisions.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/report-analysis">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">Lab Report Analysis</CardTitle>
                <CardDescription>Upload your lab report (e.g., blood test, x-ray) and our AI will provide a simple, easy-to-understand summary.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {reportAnalysisImage && (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={reportAnalysisImage.imageUrl}
                      alt={reportAnalysisImage.description}
                      fill
                      className="object-cover"
                      data-ai-hint={reportAnalysisImage.imageHint}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/report-analysis">Analyze Report <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">Medication Interaction Checker</CardTitle>
                <CardDescription>Upload a prescription or add medications manually to check for potential interactions with your food.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {interactionCheckerImage && (
                  <div className="relative aspect-video rounded-hidden">
                     <Image
                      src={interactionCheckerImage.imageUrl}
                      alt={interactionCheckerImage.description}
                      fill
                      className="object-cover rounded-lg"
                      data-ai-hint={interactionCheckerImage.imageHint}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/interaction-checker">Check Interactions <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      <section id="faq" className="w-full py-12 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Faq />
        </div>
      </section>
    </div>
  );
}
