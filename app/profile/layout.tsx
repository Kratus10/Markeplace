'use client';

import React from 'react';
import { Toaster } from 'sonner';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-right" richColors />
      {children}
    </>
  );
}