import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import { db } from '@/lib/db';

interface BlogPost {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  readTime: string;
  author: string;
  createdAt: Date;
}

const fallbackBlogs: Record<string, BlogPost> = {
  'art-of-sourcing-arabica-beans': {
    title: 'The Art of Sourcing Single-Origin Arabica Beans',
    excerpt: 'Discover how Urban Brew Café travels to the misty mountains of Ethiopia and Colombia to source the finest coffee beans.',
    content: 'At Urban Brew Café, coffee is more than just a morning routine; it is a fine art. The journey of your morning espresso starts thousands of miles away on small, family-owned coffee estates in high-altitude regions. These estates offer optimal soil composition, shaded canopy covers, and pure natural spring waters which give the beans their distinct flavor notes.\n\nOur baristas and tasters visit these locations twice a year to verify that farming practices are organic and fair-trade. By dealing directly with the farmers, we ensure they receive a premium price, allowing them to reinvest in sustainable farming technologies.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop',
    readTime: '4 min read',
    author: 'Jane Doe, Head Roaster',
    createdAt: new Date()
  },
  'mastering-latte-art-guide': {
    title: 'Mastering the Golden Pour: A Guide to Perfect Latte Art',
    excerpt: 'Learn the micro-foam science and pitcher pouring angles used by our baristas to draw perfect rosettes and hearts.',
    content: 'Pouring latte art requires practice, hand-eye coordination, and an understanding of milk protein chemistry. To achieve that glossy, wet-paint-like milk consistency, you must steam your milk to exactly 140°F (60°C). Steaming higher breaks down the sweetness and destroys the micro-foam structure.\n\nStart your pour high to let the milk slide underneath the dark crema of the espresso. Then, bring the spout of your pitcher down close to the cup and tilt it to increase flow velocity. Flick your wrist gently back and forth to create waves, forming the leaves of a beautiful rosette.',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop',
    readTime: '6 min read',
    author: 'Brew Master',
    createdAt: new Date()
  }
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  let post: BlogPost | null = null;

  try {
    const dbPost = await db.blog.findUnique({
      where: { slug }
    });

    if (dbPost) {
      post = {
        title: dbPost.title,
        excerpt: dbPost.excerpt,
        content: dbPost.content,
        image: dbPost.image,
        readTime: dbPost.readTime,
        author: dbPost.author,
        createdAt: dbPost.createdAt
      };
    } else {
      post = fallbackBlogs[slug] || null;
    }
  } catch (error) {
    console.warn('Prisma query failed, using static fallbacks', error);
    post = fallbackBlogs[slug] || null;
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <div>
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-coffee dark:text-accent-gold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles</span>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-xl bg-primary-cream">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Meta Headers */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-primary-coffee dark:text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-[10px] text-primary-coffee/60 dark:text-white/45 font-bold uppercase tracking-wider border-y border-primary-coffee/10 dark:border-white/5 py-3">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-accent-gold" />
            <span>{post.author}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-accent-gold" />
            <span>{post.readTime}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-accent-gold" />
            <span>{new Date(post.createdAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </span>
        </div>
      </div>

      {/* Article Body Content */}
      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-primary-coffee/85 dark:text-primary-cream/80 leading-relaxed font-light space-y-6">
        {post.content.split('\n\n').map((paragraph, i) => (
          <p key={i} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

    </div>
  );
}
