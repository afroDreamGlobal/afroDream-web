'use client';

import React from 'react';
import AdminLoginForm from '@/components/AdminLoginForm';

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { redirect?: string };
}) {
  const redirectUrl = searchParams?.redirect || '/admin';
  return <AdminLoginForm redirectUrl={redirectUrl} />;
}
