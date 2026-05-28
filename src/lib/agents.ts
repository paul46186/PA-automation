/**
 * Live Agent Engine for Prior Authorization
 * 
 * To use live agents, provide the following Environment Variables:
 * - GEMINI_API_KEY: Your Google Cloud Access Token (ya29...) or AI Studio Key
 * - GCP_PROJECT_ID: Your Google Cloud Project ID
 * - GCP_LOCATION: The region to use (default: us-central1)
 */

async function runVertexPrompt(prompt: string) {
  const project = process.env.GCP_PROJECT_ID || 'qwiklabs-gcp-01-21e21af0a432';
  const location = process.env.GCP_LOCATION || 'us-central1';
  const token = process.env.GEMINI_API_KEY || '';
  
  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/gemini-1.5-flash:generateContent`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        topP: 0.95,
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    // In demo mode, if the API fails, we return a characteristic fallback indicator
    // which the UI handles gracefully by showing mock data.
    console.error(`Vertex AI REST Error (${response.status}): ${errorBody}`);
    throw new Error('API_FALLBACK');
  }

  const result = await response.json();
  return result.candidates?.[0].content.parts[0].text || '';
}

export async function clinicalExtractionAgent(ehrDocuments: any[], formSchema: any[]) {
  try {
    const prompt = `
      You are a Board-Certified Medical Authorization Agent. 
      Your Task: Process the following EHR documents and fill out the Prior Authorization form.
      
      EHR DOCUMENTS:
      ${JSON.stringify(ehrDocuments)}
      
      FORM SCHEMA:
      ${JSON.stringify(formSchema)}
      
      INSTRUCTIONS:
      - For each question in the schema, provide:
        1. An answer (Yes/No or text).
        2. A clinical rationale (why is this the answer?).
        3. A confidence score (0 to 1).
        4. A 'source_text' which is the literal snippet from the EHR that supports this.
        5. A 'source_id' matching the 'id' (e.g., p1, p2) of the document where you found the evidence.
        
      Output only a raw JSON object string where keys are question IDs. 
    `;

    const text = await runVertexPrompt(prompt);
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.log('Using Fallback Data due to API status.');
    return null; // Signals UI to use mock fallback
  }
}

export async function reviewPredictionAgent(answers: any, patientName: string) {
  try {
    const prompt = `
      You are a Payer Review Agent auditing a Prior Authorization request for Otezla (Apremilast).
      
      PATIENT: ${patientName}
      FILLED FORM ANSWERS:
      ${JSON.stringify(answers)}
      
      POLICY RULES for OTEZLA:
      1. Must have Moderate-to-Severe Plaque Psoriasis diagnosis.
      2. Must have failed high-potency topical steroids.
      3. Must have a documented 3-month trial and failure of a preferred systemic/biologic (e.g., Humira, Methotrexate) OR a contraindication to them.
      
      TASK: 
      Evaluate the request. 
      1. Status: "Approve" or "Deny".
      2. Reason: Brief explanation.
      3. Gap: If denying, specify exactly what clinical evidence is missing.
      
      Output JSON: { "status": "Approve"|"Deny", "reason": "...", "gap": "..." }
    `;

    const text = await runVertexPrompt(prompt);
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}

export async function rfiGeneratorAgent(gap: string, patientName: string, drug: string) {
  try {
    const prompt = `
      You are a Clinical Liaison Agent.
      Draft a professional message to a doctor requesting: ${gap}
      PATIENT: ${patientName}
      DRUG: ${drug}
      Output only the message text.
    `;
    return await runVertexPrompt(prompt);
  } catch (e) {
    return null;
  }
}
