import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Faq from '@/components/faq';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* === 1. HERO SECTION (No changes here) === */}
      <section className="relative w-full h-[60vh] flex items-center justify-center text-center">
        <Image
          src="/images/medical-bg.jpg"
          alt="Medical background with stethoscope"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" /> {/* Increased overlay opacity for better text contrast */}
        <div className="relative container mx-auto px-4 md:px-6 z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary-foreground">
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

      {/* === 2. FEATURES SECTION (No changes here) === */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Our Core Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Link href="/report-analysis">
              <Card className="flex flex-col h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl">Report Analysis</CardTitle>
                  <CardDescription>
                    Upload your lab reports, and our AI will translate complex medical terms into simple, easy-to-understand language.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <p className="text-sm font-medium text-primary flex items-center">
                    Analyze a Report <ArrowRight className="ml-2 h-4 w-4" />
                  </p>
                </CardFooter>
              </Card>
            </Link>
            <Link href="/interaction-checker">
              <Card className="flex flex-col h-full hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl">Interaction Checker</CardTitle>
                  <CardDescription>
                    Check for potential interactions between different medications to ensure your treatment plan is safe and effective.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <p className="text-sm font-medium text-primary flex items-center">
                    Check Interactions <ArrowRight className="ml-2 h-4 w-4" />
                  </p>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* === 3. HOW IT WORKS SECTION (MODIFIED: Added a solid background color for readability) === */}
      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Simple Steps to Clarity
          </h2>
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-primary text-primary-foreground rounded-full p-4 flex items-center justify-center h-12 w-12">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold">Upload Document</h3>
              <p className="text-muted-foreground">Securely upload your medical report, lab result, or prescription list.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-primary text-primary-foreground rounded-full p-4 flex items-center justify-center h-12 w-12">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold">AI Analysis</h3>
              <p className="text-muted-foreground">Our AI instantly analyzes the document for key information and terminology.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-primary text-primary-foreground rounded-full p-4 flex items-center justify-center h-12 w-12">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold">Get Clear Insights</h3>
              <p className="text-muted-foreground">Receive a simplified summary and clear explanations in seconds.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* === 4. FAQ SECTION (MODIFIED: Added a solid background color for readability) === */}
      <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <Faq />
          </div>
        </div>
      </section>

    </div>
  );
}
