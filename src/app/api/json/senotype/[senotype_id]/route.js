import { NextResponse } from 'next/server';
import API from '@/lib/api';
import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';

export async function GET(request, { params }) {
  const { senotype_id } = await params;
  const info = await getCookie('info', { cookies });
  let groupsToken;
  if (info) {
    const auth = JSON.parse(atob(info));
    groupsToken = auth?.groups_token;
  }

  const data = await API.fetchSenotype(senotype_id, groupsToken);
  if (data) {
    return NextResponse.json(data);
  } else {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
}
