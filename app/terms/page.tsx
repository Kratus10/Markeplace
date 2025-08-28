import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import Card from '@/components/ui/Card';

export default function TermsPage() {
  const filePath = path.join(process.cwd(), 'docs', 'legal', 'terms-and-conditions.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContents);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card className="p-6">
        <article className="prose prose-blue max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </Card>
    </div>
  );
}
