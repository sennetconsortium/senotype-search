import { NextResponse } from 'next/server';
import URLS from '@/lib/urls';
import API from '@/lib/api';

export async function GET() {
  const url = URLS.bannerContent;
  const results = await API.fetch({ url, method: 'GET' });
  return NextResponse.json(results, { status: results ? 200 : 404 });
}
