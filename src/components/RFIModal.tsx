import React from 'react';
import { patient_context } from '../mockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  rfiMessage: string;
}

export default function RFIModal({ isOpen, onClose, rfiMessage }: Props) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div style={{
        width: '600px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>Request for Information (RFI)</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Auto-generated based on clinical gaps</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', color: 'var(--text-muted)', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ padding: '24px', flex: 1 }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              RE: {patient_context.name} | {patient_context.drug} PA
            </label>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f8fafc', 
              borderRadius: '8px', 
              border: '1px solid var(--border)',
              fontSize: '14px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              color: 'var(--text-main)',
              fontFamily: 'serif'
            }}>
              {rfiMessage}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span style={{ fontSize: '13px', color: 'var(--danger)', fontWeight: '500' }}>
              Likelihood of Denial without this evidence: 94%
            </span>
          </div>
        </div>

        <div style={{
          padding: '24px',
          borderTop: '1px solid var(--border)',
          backgroundColor: '#f8fafc',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={() => { 
              alert('Form Overridden: Submitting to Payer with existing evidence.'); 
              window.open('/pbm', '_blank');
              onClose(); 
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'white',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Override & Submit to Payer
          </button>


          <button
            onClick={() => { alert('RFI Sent to Doctor'); onClose(); }}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              backgroundColor: 'var(--accent)',
              color: 'white',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            Send RFI to Provider
          </button>
        </div>
      </div>
    </div>
  );
}
