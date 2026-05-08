import { NextResponse } from 'next/server';
import API from '@/lib/api';
import { cookies, headers } from 'next/headers';
import AUTH from '@/lib/auth';

export async function GET(request, { params }) {
  const { senotype_id } = await params;
  const _cookies = await cookies();
  let token = await AUTH.tokenFromHeader(headers)
  if (!token) {
    token = AUTH.token(_cookies)
  }

  const data = await API.fetchSenotype(senotype_id, token);
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
