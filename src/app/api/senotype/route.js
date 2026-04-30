import API from '@/lib/api';
import URLS from '@/lib/urls';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const body = await request.json();

  const url = URLS.api.senotype.createEdit;
  const result = await API.fetch({ url, body });
  return NextResponse.json({ result }, { status: result.status || 200 });;
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const url = `${URLS.api.senotype.createEdit}/${body.uuid}`;
  const result = await API.fetch({ url, body, method: 'PUT' });
  return NextResponse.json({ result }, { status: result.status || 200 });
}
