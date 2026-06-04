-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT,
  cover_image_url VARCHAR,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create chapters table
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  content TEXT,
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Supabase best practice)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anon + authenticated)
CREATE POLICY "courses_read" ON public.courses
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "chapters_read" ON public.chapters
  FOR SELECT TO anon, authenticated
  USING (true);

-- Index for fast chapter lookups by course
CREATE INDEX IF NOT EXISTS idx_chapters_course_id ON public.chapters(course_id);

-- =============
-- Seed Data
-- =============

INSERT INTO public.courses (id, title, description, cover_image_url) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'React Native Fundamentals', 'Learn the core concepts of React Native — components, state, props, and navigation — from scratch.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Offline-First Architecture', 'Master building apps that work without internet using Realm DB and background sync patterns.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'TypeScript for React Developers', 'Level up your React skills with strict typing, generics, and advanced TypeScript patterns.', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800');

INSERT INTO public.chapters (course_id, title, content, order_index) VALUES
  -- React Native Fundamentals chapters
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Getting Started with Expo', 'In this chapter, you will set up your development environment using Expo CLI and create your first React Native project.', 1),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Core Components', 'Learn about View, Text, Image, ScrollView, and other foundational building blocks of React Native.', 2),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'State and Props', 'Understand how data flows through components using props and how to manage local state with useState.', 3),

  -- Offline-First Architecture chapters
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Why Offline-First?', 'Explore the benefits of offline-first design and why it matters for mobile applications in unreliable network conditions.', 1),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Local Databases with Realm', 'Set up Realm DB as the local source of truth and learn to define schemas, write transactions, and query data.', 2),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Background Sync Patterns', 'Implement a sync layer using RTK Query that pushes local changes to Supabase when connectivity is available.', 3),

  -- TypeScript for React Developers chapters
  ('a1b2c3d4-0003-4000-8000-000000000003', 'TypeScript Basics', 'Cover types, interfaces, enums, and type inference — the building blocks of TypeScript.', 1),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Typing React Components', 'Learn to type functional components, hooks, context, and event handlers with precision.', 2),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Generics and Advanced Patterns', 'Dive into generics, conditional types, mapped types, and utility types for reusable, type-safe code.', 3);
