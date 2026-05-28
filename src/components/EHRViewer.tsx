import React, { useEffect, useRef } from 'react';
import { ehr_documents } from '../mockData';

interface Props {
  highlightId: string | null;
}

export default function EHRViewer({ highlightId }: Props) {
  const docRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (highlightId && docRefs.current[highlightId]) {
      docRefs.current[highlightId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightId]);

  return (
    <div style={{
      width: '50%',
      height: '100%',
      backgroundColor: 'white',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f1f5f9'
      }}>
        <h2 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Electronic Health Record (EHR)
        </h2>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', backgroundColor: '#fff', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
          {ehr_documents.length} Source Documents
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {ehr_documents.map((doc) => (
          <div
            key={doc.id}
            ref={(el) => { docRefs.current[doc.id] = el; }}
            style={{
              marginBottom: '32px',
              padding: '20px',
              borderRadius: '8px',
              border: highlightId === doc.id ? '2px solid var(--accent)' : '1px solid var(--border)',
              backgroundColor: highlightId === doc.id ? 'var(--accent-soft)' : 'white',
              transition: 'all 0.3s ease',
              boxShadow: highlightId === doc.id ? 'var(--shadow-md)' : 'none'
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', marginBottom: '12px', textTransform: 'uppercase' }}>
              {doc.title}
            </div>
            <div style={{
              fontSize: '15px',
              fontFamily: '"JetBrains Mono", monospace',
              lineHeight: '1.6',
              color: '#334155',
              whiteSpace: 'pre-wrap'
            }}>
              {doc.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
