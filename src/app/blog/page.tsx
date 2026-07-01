import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, User, Clock } from 'lucide-react';
import { db } from '@/lib/db';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  readTime: string;
  author: string;
  createdAt: Date;
}

const fallbackBlogs: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Art of Sourcing Single-Origin Arabica Beans',
    slug: 'art-of-sourcing-arabica-beans',
    excerpt: 'Discover how Urban Brew Café travels to the misty mountains of Ethiopia and Colombia to source the finest coffee beans.',
    content: '',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop',
    readTime: '4 min read',
    author: 'Jane Doe, Head Roaster',
    createdAt: new Date()
  },
  {
    id: 'b2',
    title: 'Mastering the Golden Pour: A Guide to Perfect Latte Art',
    slug: 'mastering-latte-art-guide',
    excerpt: 'Learn the micro-foam science and pitcher pouring angles used by our baristas to draw perfect rosettes and hearts.',
    content: '',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop',
    readTime: '6 min read',
    author: 'Brew Master',
    createdAt: new Date()
  }
];

export const revalidate = 1800; // Cache for 30 min

export default async function BlogPage() {
  let posts: BlogPost[] = [];

  try {
    const dbBlogs = await db.blog.findMany({
      orderBy: { createdAt: 'desc' }
    });

    if (dbBlogs && dbBlogs.length > 0) {
      posts = dbBlogs.map((b: any) => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        content: b.content,
        image: b.image,
        readTime: b.readTime,
        author: b.author,
        createdAt: b.createdAt
      }));
    } else {
      posts = fallbackBlogs;
    }
  } catch (error) {
    console.warn('Could not query blogs from Prisma, using fallback data', error);
    posts = fallbackBlogs;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">Brewing Culture</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-primary-coffee dark:text-white flex items-center justify-center gap-3">
          <BookOpen className="h-8 w-8 text-accent-gold" />
          <span>The Coffee Chronicles</span>
        </h1>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-primary-coffee/60 dark:text-white/50 font-light">
          Guides on home brewing chemistry, bean selection tips, and recipes curated by our roasters.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="bg-white dark:bg-[#201512] rounded-3xl overflow-hidden border border-primary-coffee/10 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="relative h-64 overflow-hidden bg-primary-cream">
              <img 
                src={post.image} 
                alt={post.title} 
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop'; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-[10px] text-primary-coffee/60 dark:text-white/45 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3 text-accent-gold" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-accent-gold" />
                    {post.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-accent-gold" />
                    {new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold font-serif leading-tight text-primary-coffee dark:text-white group-hover:text-accent-gold transition-colors duration-300">
                  {post.title}
                </h3>

                <p className="text-xs text-primary-coffee/75 dark:text-primary-cream/70 leading-relaxed font-light line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-primary-coffee/10 dark:border-white/5">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-accent-gold hover:underline"
                >
                  <span>Read Article</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}
