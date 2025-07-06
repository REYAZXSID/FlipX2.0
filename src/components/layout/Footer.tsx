
import { Code } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 text-center p-4 mt-12 text-muted-foreground text-sm">
      <p className="inline-flex items-center gap-1.5">
        Built by <span className="font-bold text-primary">Sid</span> with{' '}
        <Code className="w-4 h-4 text-accent" />
      </p>
    </footer>
  );
}
