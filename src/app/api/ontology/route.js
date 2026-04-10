import { NextResponse } from 'next/server';
import ONTOLOGY from '@/lib/ontology';

export async function GET() {
  const ontology = await ONTOLOGY.getImport();
  return NextResponse.json({ ontology }, { status: ontology ? 200 : 404 });
}
