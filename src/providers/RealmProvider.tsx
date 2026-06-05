import React from 'react';
import { RealmProvider as RealmContextProvider } from '@realm/react';
import { CourseModel, ChapterModel } from '@/src/models';

export function RealmProvider({ children }: { children: React.ReactNode }) {
  return (
    <RealmContextProvider schema={[CourseModel, ChapterModel]}>
      {children}
    </RealmContextProvider>
  );
}
