import SQL from '@/lib/sql';
import { NextResponse } from 'next/server';
import log from 'xac-loglevel';

export async function GET() {
  return NextResponse.json({ message: 'Hello from the App Router!' });
}

export async function POST(request) {
  const data = await request.json();
  log.debug('api.senotype.POST', data);
  const q = data.query || 'SELECT * FROM senotype';
  const v = data.values || [];
  const results = await SQL.exec(q, v);
  return NextResponse.json({ results }, { status: 201 });
}
