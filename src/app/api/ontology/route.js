import { NextResponse } from 'next/server'
import ONTOLOGY from "@/lib/ontology"

export async function GET() {

  const result = await ONTOLOGY.getImport()
  return NextResponse.json({ ontology: result?.ontology }, { status: result?.ontology ? 200 : 404 })
}