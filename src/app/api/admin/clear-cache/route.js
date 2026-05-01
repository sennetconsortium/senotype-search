import { NextResponse } from 'next/server';
import ONTOLOGY from '@/lib/ontology';

export async function DELETE() {
  const result = await ONTOLOGY.clearCache();
  return NextResponse.json({ result }, { status: result === true ? 200 : 500 });
}
