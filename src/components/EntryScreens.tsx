import React, { useState } from 'react';
import { patient_context } from '../mockData';

interface Props {
  stage: 'landing' | 'fetch' | 'choice' | 'processing';
  onNext: () => void;
  onChoice: (choice: 'ai' | 'human') => void;
}

export default function EntryScreens({ stage, onNext, onChoice }: Props) {
  const [patientId, setPatientId] = useState(patient_context.id);

  const containerStyle: React.CSSProperties = {
    height: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-main)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundImage: 'radial-gradient(circle at 2px 2px, var(--border) 1px, transparent 0)',
    backgroundSize: '40px 40px'
  };

  const cardStyle: React.CSSProperties = {
    width: '480px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-md)',
    padding: '40px',
    border: '1px solid var(--border)',
    textAlign: 'center',
    animation: 'slideUp 0.5s ease-out'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 32px',
    borderRadius: '8px',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    width: '100%',
    transition: 'transform 0.2s, opacity 0.2s'
  };

  if (stage === 'landing') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)', marginBottom: '12px' }}>
            PA<span style={{ color: 'var(--accent)' }}>Automator</span>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
            Enter Patient ID to begin Prior Authorization
          </p>
          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
              Patient Identifier
            </label>
            <input 
              type="text" 
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                border: '2px solid var(--border)',
                fontSize: '16px',
                outline: 'none',
                fontWeight: '500'
              }}
            />
          </div>
          <button style={buttonStyle} onClick={onNext}>
            Search Patient
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'fetch') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ backgroundColor: 'var(--accent-soft)', width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
            <span style={{ fontSize: '32px', margin: 'auto' }}>📄</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Patient Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
            {patient_context.name} (DOB: {patient_context.dob})
          </p>
          <div style={{ 
            backgroundColor: '#f8fafc', 
            borderRadius: '12px', 
            padding: '16px', 
            border: '1px solid var(--border)',
            marginBottom: '32px',
            textAlign: 'left'
          }}>
            <div style={{ fontSize: '13px', fontWeight: '600' }}>Active Rx Request:</div>
            <div style={{ fontSize: '15px', color: 'var(--accent)', fontWeight: '700' }}>{patient_context.drug}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{patient_context.insurance}</div>
          </div>
          <button style={buttonStyle} onClick={onNext}>
            Fetch Payer Form & EHR
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'choice') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Choose Processing Method</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
            How would you like to complete this Prior Authorization?
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div 
              onClick={() => onChoice('ai')}
              style={{
                padding: '24px',
                borderRadius: '12px',
                border: '2px solid var(--accent)',
                backgroundColor: 'var(--accent-soft)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '24px' }}>🤖</span>
              <div style={{ fontWeight: '700', color: 'var(--primary)' }}>AI-Assisted</div>
              <div style={{ fontSize: '11px', color: 'var(--text-main)', opacity: 0.8 }}>Auto-fill form using medical evidence extraction.</div>
            </div>

            <div 
              onClick={() => onChoice('human')}
              style={{
                padding: '24px',
                borderRadius: '12px',
                border: '2px solid var(--border)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '24px' }}>👤</span>
              <div style={{ fontWeight: '700', color: 'var(--primary)' }}>Human-Only</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Start with a blank form and manual review.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'processing') {
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, width: '400px' }}>
          <div className="processing-ring" style={{
            width: '48px',
            height: '48px',
            border: '4px solid var(--border)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            margin: '0 auto 24px',
            animation: 'spin 1s linear infinite'
          }} />
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Processing with AI</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }} className="loading-dots">
            Extracting medical evidence from EHR docs
          </p>
        </div>
      </div>
    );
  }

  return null;
}
