import { NextResponse } from 'next/server';
import API from '@/lib/api';
import { cookies, headers } from 'next/headers';
import { getCookie } from 'cookies-next';

export async function GET(request, { params }) {
  let groupsToken;

  // First check if Bearer token is passed in the header
  const { senotype_id } = await params;
  const authHeader = (await headers()).get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    groupsToken = authHeader.split(' ')[1];
  }
  // Try to grab the token from cookies
  if (!groupsToken) {
    const info = await getCookie('info', { cookies });
    if (info) {
      const auth = JSON.parse(atob(info));
      groupsToken = auth?.groups_token;
    }
  }
  const data = await API.fetchSenotype(senotype_id, groupsToken);
  if (data && data.hasOwnProperty('error')) {
    return NextResponse.json(
      { error: data['error'] },
      { status: data['status'] || 500 },
    );
  }
  if (data) {
    return NextResponse.json(data);
  } else {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
}
