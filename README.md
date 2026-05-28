# Prior Authorization Automation & PBM Adjudication POC

A full-cycle pharmaceutical automation platform built with Next.js, featuring AI-driven form completion and payer-side claim review.

## Key Features
- **Pharmacy Dashboard**: Automated PA form filling with EHR citation highlighting.
- **RFI Agent**: Intelligent gap identification and physician communication.
- **PayerCore Adjudication Portal**: Real-time claim review and rejection based on clinical policy.
- **Interactive EHR Viewer**: Split-screen clinical data visualization.

## How to Run
1. Clone the repository.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

## Configuring Live Agents
To enable the live Gemini AI agents:
1. Create a `.env.local` file.
2. Add the following variables:
   - `GEMINI_API_KEY`: Your Google Cloud Access Token (ya29...) or AI Studio Key.
   - `GCP_PROJECT_ID`: Your Google Cloud Project ID.
   - `GCP_LOCATION`: Your region (e.g., us-central1).

The application will automatically use these credentials for clinical extraction and review. If they are missing, it will gracefully fallback to the stable mock-simulation mode.
