import { NextResponse } from 'next/server';
import ONTOLOGY from '@/lib/ontology';
import URLS from '@/lib/urls';
import API from '@/lib/api';
import { cookies } from 'next/headers';

export async function DELETE() {
  const _cookies = await cookies();
  const admin = await API.fetch({
    url: URLS.api.ingest.privs.admin,
    cookies: _cookies,
    method: 'GET',
  });
  console.log('admin', admin);

  const result = admin?.has_data_admin_privs
    ? await ONTOLOGY.clearCache()
    : false;
  const status = result === true ? 200 : result === false ? 401 : 500;
  return NextResponse.json({ result }, { status });
}
