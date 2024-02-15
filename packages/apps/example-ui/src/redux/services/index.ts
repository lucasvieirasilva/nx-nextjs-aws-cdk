'use client';

import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export const baseQuery = fetchBaseQuery({
  baseUrl,
});
