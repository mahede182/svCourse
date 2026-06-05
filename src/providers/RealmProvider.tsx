import React from 'react';
import { RealmProvider as RealmContextProvider } from '@realm/react';
import { CourseModel } from '@/src/features/courses';
import { ChapterModel } from '@/src/features/chapters';

export function RealmProvider({ children }: { children: React.ReactNode }) {
  return (
    <RealmContextProvider schema={[CourseModel, ChapterModel]}>
      {children}
    </RealmContextProvider>
  );
}
