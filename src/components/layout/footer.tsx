export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-6 px-4 md:px-6 bg-card border-t mt-auto">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        &copy; {year} MediClear. All rights reserved. This service is for informational purposes only and is not a substitute for professional medical advice.
      </div>
    </footer>
  );
}
