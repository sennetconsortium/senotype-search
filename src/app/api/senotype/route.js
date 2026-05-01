import API from '@/lib/api';
import URLS from '@/lib/urls';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  return NextResponse.json({ result: true }, { status: 200 });
}

export async function POST(request) {
  const _cookies = await cookies();
  const body = await request.json();
  const url = URLS.api.senotype.createEdit;
  const result = await API.fetch({ url, body, cookies: _cookies });
  return NextResponse.json(result, { status: result.status || 200 });
}

export async function PUT(request) {
  const _cookies = await cookies();
  const body = await request.json();
  const url = `${URLS.api.senotype.createEdit}/${body.uuid}`;
  const result = await API.fetch({
    url,
    body,
    method: 'PUT',
    cookies: _cookies,
  });
  return NextResponse.json(result, { status: result.status || 200 });
}