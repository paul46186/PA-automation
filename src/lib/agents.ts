const project = 'qwiklabs-gcp-01-21e21af0a432';
const location = 'us-central1';

async function runVertexPrompt(prompt: string) {
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
    throw new Error(`Vertex AI REST Error (${response.status}): ${errorBody}`);
  }

  const result = await response.json();
  return result.candidates?.[0].content.parts[0].text || '';
}

export async function clinicalExtractionAgent(ehrDocuments: any[], formSchema: any[]) {
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
      
    Output only a raw JSON object string where keys are question IDs. Do not include markdown formatting or "json" labels.
  `;

  const text = await runVertexPrompt(prompt);
  const jsonStr = text.replace(/```json|```/g, "").trim();
  return JSON.parse(jsonStr);
}

export async function reviewPredictionAgent(answers: any, patientName: string) {
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
    Do not include markdown formatting or "json" labels.
  `;

  const text = await runVertexPrompt(prompt);
  const jsonStr = text.replace(/```json|```/g, "").trim();
  return JSON.parse(jsonStr);
}

export async function rfiGeneratorAgent(gap: string, patientName: string, drug: string) {
  const prompt = `
    You are a Clinical Liaison Agent.
    Draft a professional, concise message to a doctor requesting specific missing clinical evidence (the gap mentioned below) to support a Prior Authorization.
    
    PATIENT: ${patientName}
    DRUG: ${drug}
    MISSING INFO: ${gap}
    
    Stay professional, polite, and emphasize the need for systemic/step-therapy trial history history from the medical record.
    Output only the message text.
  `;

  return await runVertexPrompt(prompt);
}
