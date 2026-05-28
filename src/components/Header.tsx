import React from 'react';
import { patient_context } from '../mockData';

export default function Header() {
  return (
    <header style={{
      height: '64px',
      backgroundColor: 'var(--primary)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--primary-light)',
      boxShadow: 'var(--shadow-md)',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          PA<span style={{ color: 'var(--accent)' }}>Automator</span>
        </div>
        <div style={{ height: '24px', width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
        <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Patient:</span>
            <span style={{ marginLeft: '8px', fontWeight: '500' }}>{patient_context.name}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>DOB:</span>
            <span style={{ marginLeft: '8px', fontWeight: '500' }}>{patient_context.dob}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>ID:</span>
            <span style={{ marginLeft: '8px', fontWeight: '500' }}>{patient_context.id}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{
          backgroundColor: 'var(--accent)',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase'
        }}>
          {patient_context.drug}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {patient_context.insurance}
        </div>
      </div>
    </header>
  );
}
