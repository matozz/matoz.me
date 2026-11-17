import { ArrowLeft, ArrowUpRight } from 'lucide-react';

import Link from 'next/link';

import BLOG from '@/blog.config';
import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <Container title={`Page not found — ${BLOG.title}`} noIndex>
      <div className="flex flex-col items-start gap-5 py-10">
        <p className="text-muted-foreground font-mono text-sm">404</p>
        <h1 className="page-title">Page not found</h1>
        <p className="text-muted-foreground max-w-sm text-sm leading-7">
          The page may have moved or is no longer published.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/posts">
              <ArrowLeft data-icon="inline-start" /> All articles
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">
              Go home <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
