'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';

import { patient_context } from '../../mockData';


export default function PBMPage() {
  const [status, setStatus] = useState<'analyzing' | 'rejected'>('analyzing');

  useEffect(() => {
    // Simulated PBM AI Adjudication
    const timer = setTimeout(() => {
      setStatus('rejected');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f1f5f9' }}>
      <header style={{
        height: '64px',
        backgroundColor: '#1e293b',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '18px', fontWeight: '800', border: '2px solid #38bdf8', padding: '2px 8px', borderRadius: '4px' }}>
            PAYER<span style={{ color: '#38bdf8' }}>CORE</span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#94a3b8' }}>
            Adjudication Portal v4.2
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Logged in as: Claims_Admin_99</div>
        </div>
      </header>

      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '900px' }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            padding: '24px', 
            boxShadow: 'var(--shadow-md)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Submission ID: #PA-99283-X</h1>
                <p style={{ fontSize: '13px', color: '#64748b' }}>Received: May 28, 2026 18:52:10</p>
              </div>
              <div style={{
                backgroundColor: status === 'analyzing' ? '#fef3c7' : '#fee2e2',
                color: status === 'analyzing' ? '#92400e' : '#991b1b',
                padding: '6px 16px',
                borderRadius: '30px',
                fontSize: '13px',
                fontWeight: '700',
                border: status === 'analyzing' ? '1px solid #f59e0b' : '1px solid #ef4444'
              }}>
                {status === 'analyzing' ? 'AI ANALYZING CLAIM...' : 'CLAIM REJECTED'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Member</div>
                <div style={{ fontSize: '15px', fontWeight: '600' }}>{patient_context.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>ID: {patient_context.id}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Drug Requested</div>
                <div style={{ fontSize: '15px', fontWeight: '600' }}>{patient_context.drug}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>30-Day Supply</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Provider</div>
                <div style={{ fontSize: '15px', fontWeight: '600' }}>Dermatology Associates</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>NPI: 992881726</div>
              </div>
            </div>
          </div>

          {status === 'analyzing' ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="processing-ring" style={{
                width: '48px',
                height: '48px',
                border: '4px static #e2e8f0',
                borderTopColor: '#38bdf8',
                borderRadius: '50%',
                margin: '0 auto 24px',
                animation: 'spin 1s linear infinite'
              }} />
              <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Payer AI Adjudicating...</h2>
              <p style={{ color: '#64748b', fontSize: '14px' }} className="loading-dots">Verifying prerequisite trials and clinical notes</p>
            </div>
          ) : (
            <div style={{ animation: 'slideUp 0.4s ease-out' }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '32px', 
                boxShadow: 'var(--shadow-md)',
                borderLeft: '8px solid #ef4444'
              }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ fontSize: '40px' }}>🚫</div>
                  <div>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#991b1b', marginBottom: '12px' }}>Adjudication Outcome: REJECTED</h2>
                    <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', marginBottom: '24px' }}>
                      <p style={{ marginBottom: '12px' }}><strong>Denial Code:</strong> SEC-302 (Step-Therapy Not Satisfied)</p>
                      <p><strong>Clinical Reason:</strong> The Payer Review Agent failed to identify clinical evidence of a 3-month trial and failure of a preferred biologic (Adalimumab) or Methotrexate, as mandated by Benefit Guideline G-102. The provider's manual override was flagged as non-compliant with standard medical necessity criteria.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        onClick={() => alert('Appeal process initiated.')}
                        style={{
                          padding: '12px 24px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: 'white',
                          fontWeight: '600',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        Initiate Manual Review
                      </button>
                      <button 
                        onClick={() => alert('Outcome sent to provider.')}
                        style={{
                          padding: '12px 24px',
                          borderRadius: '8px',
                          backgroundColor: '#1e293b',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '14px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Send Result to Pharmacy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
                Note: This decision was generated by PayerAI Engine v1.5 based on 3 submitted clinical data points.
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
