import API from '@/lib/api';
import { NextResponse } from 'next/server';

export async function POST(request, {params}) {
  const {predicate} = await params;
  const body = await request.json();
  
  const result = await API.fetchForForm(predicate, body.query);
  return NextResponse.json({ result: result || [] }, { status: result ? 200 : 404 });
}
