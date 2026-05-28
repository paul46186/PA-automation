import { NextResponse } from 'next/server';
import { clinicalExtractionAgent } from '@/lib/agents';
import { ehr_documents, pa_form_schema } from '@/mockData';

export async function POST() {
  try {
    const results = await clinicalExtractionAgent(ehr_documents, pa_form_schema);
    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Extraction Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
