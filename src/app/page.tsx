"use client";
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
  const mainHeroImage = PlaceHolderImages.find(p => p.id === 'main-hero'); // Kept for reference, can be removed if unused

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] flex items-center justify-center text-center">
        {/*
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
        */}
        <Image
          src="/images/medical-bg.jpg"
          alt="Medical background with stethoscope"
          fill
          className="object-cover"
          priority
        />
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
                <CardTitle className="text-2xl">Lab Report
