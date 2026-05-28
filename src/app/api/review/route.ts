import { NextResponse } from 'next/server';
import { reviewPredictionAgent, rfiGeneratorAgent } from '@/lib/agents';
import { patient_context } from '@/mockData';

export async function POST(req: Request) {
  try {
    const { answers } = await req.json();
    const review = await reviewPredictionAgent(answers, patient_context.name);
    
    let rfiMessage = null;
    if (review.status === 'Deny') {
      rfiMessage = await rfiGeneratorAgent(review.gap, patient_context.name, patient_context.drug);
    }
    
    return NextResponse.json({ ...review, rfiMessage });
  } catch (error: any) {
    console.error('Review Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
