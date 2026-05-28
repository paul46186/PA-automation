export const patient_context = {
  name: "Sarah Jenkins",
  dob: "1982-03-12",
  id: "PAT-8829-X",
  insurance: "Blue Cross Blue Shield - PPO",
  drug: "Otezla (Apremilast) 30mg",
  indication: "Moderate to Severe Plaque Psoriasis"
};

export const ehr_documents = [
  {
    id: "p1",
    title: "Encounter Note - Dermatology (2024-02-15)",
    content: "Patient Sarah Jenkins presents for follow-up of plaque psoriasis. Physical exam reveals erythematous plaques with silvery scale on extensor surfaces of elbows and knees, involving approximately 12% Body Surface Area (BSA). Diagnosis of moderate-to-severe plaque psoriasis confirmed."
  },
  {
    id: "p2",
    title: "Medication History",
    content: "Current Medications: Cetirizine 10mg daily, Multivitamin. \nPast Medications for Psoriasis: Tried Clobetasol propionate 0.05% ointment (Topical Steroid) from 2023-09 to 2024-01. Patient reported 'initial improvement but stalled after 8 weeks'. Discontinued due to plateau in efficacy."
  },
  {
    id: "p3",
    title: "Clinical Decision Support",
    content: "Treatment plan discussed. Given BSA > 10% and failure of high-potency topical steroids, systemic therapy is indicated. Discussion of biologics vs. oral PDE4 inhibitors. Patient specifically interested in oral Otezla due to needle phobia. No contraindications noted."
  }
];

export const pa_form_schema = [
  {
    id: "q1",
    text: "Does the patient have a diagnosis of moderate-to-severe plaque psoriasis?",
    type: "boolean",
    options: ["Yes", "No"],
    required: true
  },
  {
    id: "q2",
    text: "Has the patient tried and failed at least one high-potency topical corticosteroid?",
    type: "boolean",
    options: ["Yes", "No"],
    required: true
  },
  {
    id: "q3",
    text: "Has the patient tried and failed a 3-month trial of Humira (Adalimumab) or Methotrexate?",
    type: "boolean",
    options: ["Yes", "No"],
    required: true,
    skip_logic: {
      action: "show",
      condition: { q3: "No" },
      target_id: "q4"
    }
  },
  {
    id: "q4",
    text: "Provide clinical justification for skipping biologic/DMARD trial:",
    type: "text",
    required: false,
    depends_on: "q3"
  }
];

export const initial_agent_responses = {
  q1: {
    answer: "Yes",
    rationale: "Documentation in dermatological encounter (2024-02-15) confirms diagnosis with 12% BSA involvement.",
    confidence: 0.98,
    source_id: "p1",
    source_text: "Diagnosis of moderate-to-severe plaque psoriasis confirmed."
  },
  q2: {
    answer: "Yes",
    rationale: "Medication history shows trial of Clobetasol propionate (high-potency topical) from Sep 2023 to Jan 2024 with efficacy plateau.",
    confidence: 0.95,
    source_id: "p2",
    source_text: "Tried Clobetasol propionate 0.05% ointment (Topical Steroid) from 2023-09 to 2024-01."
  },
  q3: {
    answer: "No",
    rationale: "No evidence of Humira or Methotrexate trial found in the provided EHR documents.",
    confidence: 0.92,
    source_id: "p2",
    source_text: "Current Medications: Cetirizine 10mg daily, Multivitamin."
  }
};
