'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import EHRViewer from '../components/EHRViewer';
import PAForm from '../components/PAForm';
import RFIModal from '../components/RFIModal';
import EntryScreens from '../components/EntryScreens';
import { initial_agent_responses, patient_context } from '../mockData';

type Stage = 'landing' | 'fetch' | 'choice' | 'processing' | 'dashboard';

export default function Home() {
  const [stage, setStage] = useState<Stage>('landing');
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState<'idle' | 'reviewing' | 'completed'>('idle');
  const [isRfiOpen, setIsRfiOpen] = useState(false);
  const [rfiMessage, setRfiMessage] = useState('');

  const nextStage = () => {
    if (stage === 'landing') setStage('fetch');
    else if (stage === 'fetch') setStage('choice');
  };

  const handleChoice = (choice: 'ai' | 'human') => {
    if (choice === 'ai') {
      setStage('processing');
      setTimeout(() => {
        // Auto-fill logic
        const autoFilled: { [key: string]: string } = {};
        Object.keys(initial_agent_responses).forEach(key => {
          autoFilled[key] = (initial_agent_responses as any)[key].answer;
        });
        setAnswers(autoFilled);
        setStage('dashboard');
      }, 3000);
    } else {
      setAnswers({});
      setStage('dashboard');
    }
  };

  const handleSetAnswer = (id: string, val: string) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
    setReviewStatus('idle');
  };

  const runFinalReview = () => {
    setReviewStatus('reviewing');
    setTimeout(() => {
      setReviewStatus('completed');
      const missingInfo = answers.q3 === 'No';
      if (missingInfo) {
        const msg = `Dear Doctor,\n\nWe are reviewing the clinical documentation for ${patient_context.name} regarding the Prior Authorization for Otezla (Apremilast).\n\nWhile the diagnosis of Plaque Psoriasis and trial of topical steroids are well-documented, the payer requires a 3-month trial and failure of a preferred biologic (e.g., Humira) or Methotrexate as per step-therapy protocols.\n\nPlease provide any clinical evidence of such trials or a justification for skipping these preferred therapies (e.g., specific contraindications) to support this request.\n\nThank you,\nPA Review Agent`;
        setRfiMessage(msg);
        setIsRfiOpen(true);
      } else {
        alert('PA Analysis: Likely to Approve. Form ready for submission.');
      }
    }, 2500);
  };

  if (stage !== 'dashboard') {
    return <EntryScreens stage={stage as any} onNext={nextStage} onChoice={handleChoice} />;
  }

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <EHRViewer highlightId={highlightId} />
        <PAForm 
          answers={answers} 
          setAnswers={handleSetAnswer} 
          onHighlight={setHighlightId}
          onReview={runFinalReview}
          reviewStatus={reviewStatus}
        />
      </div>

      <RFIModal 
        isOpen={isRfiOpen} 
        onClose={() => setIsRfiOpen(false)} 
        rfiMessage={rfiMessage} 
      />

      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        backgroundColor: 'var(--primary)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '30px',
        fontSize: '12px',
        fontWeight: '600',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 50
      }}>
        <div style={{ 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          backgroundColor: reviewStatus === 'reviewing' ? 'var(--warning)' : reviewStatus === 'completed' ? 'var(--danger)' : 'var(--success)',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)'
        }} />
        {reviewStatus === 'reviewing' ? 'Agent: Reviewing clinical gaps...' : 
         reviewStatus === 'completed' ? 'Agent: Identified Step-Therapy Deficit (RFI Required)' : 
         'Agent: EHR Extraction Complete'}
      </div>
    </main>
  );
}
