import React from 'react';
import { pa_form_schema } from '../mockData';

interface Props {
  answers: { [key: string]: string };
  setAnswers: (id: string, val: string) => void;
  onHighlight: (id: string | null) => void;
  onReview: () => void;
  reviewStatus: 'idle' | 'reviewing' | 'completed';
  liveAgentData: any;
}

export default function PAForm({ answers, setAnswers, onHighlight, onReview, reviewStatus, liveAgentData }: Props) {
  const isVisible = (qId: string) => {
    const q = pa_form_schema.find(x => x.id === qId);
    if (!q?.depends_on) return true;
    const parentQ = pa_form_schema.find(x => x.id === q.depends_on);
    if (!parentQ) return true;
    return answers[parentQ.id] === 'No';
  };

  return (
    <div style={{
      width: '50%',
      height: '100%',
      backgroundColor: 'var(--bg-main)',
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
        backgroundColor: '#fff'
      }}>
        <h2 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Prior Authorization Workspace
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '600', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
            Live AI Processing
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {pa_form_schema.filter(q => isVisible(q.id)).map((q) => {
          const agentRes = liveAgentData ? liveAgentData[q.id] : null;
          return (
            <div key={q.id} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', color: 'var(--primary)' }}>
                {q.text}
              </div>

              {q.type === 'boolean' ? (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  {q.options?.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setAnswers(q.id, opt)}
                      style={{
                        padding: '8px 24px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        backgroundColor: answers[q.id] === opt ? 'var(--accent)' : 'white',
                        color: answers[q.id] === opt ? 'white' : 'var(--text-main)',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswers(q.id, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    fontSize: '14px',
                    minHeight: '100px',
                    marginBottom: '16px'
                  }}
                  placeholder="Enter clinical rationale..."
                />
              )}

              {agentRes && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      AI Agent Extraction
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: agentRes.confidence > 0.9 ? 'var(--success)' : 'var(--warning)' }}>
                      {(agentRes.confidence * 100).toFixed(0)}% Confidence
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '8px' }}>
                    "{agentRes.rationale}"
                  </div>
                  <button
                    onClick={() => onHighlight(agentRes.source_id)}
                    onMouseLeave={() => onHighlight(null)}
                    style={{
                      fontSize: '12px',
                      color: 'var(--accent)',
                      fontWeight: '600',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    View Clinical Source ↗
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{
        padding: '24px',
        backgroundColor: 'white',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px'
      }}>
        <button
          onClick={onReview}
          disabled={reviewStatus === 'reviewing'}
          style={{
            padding: '12px 32px',
            borderRadius: '8px',
            backgroundColor: 'var(--primary)',
            color: 'white',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            opacity: reviewStatus === 'reviewing' ? 0.7 : 1,
            transition: 'all 0.2s'
          }}
        >
          {reviewStatus === 'reviewing' ? <span className="loading-dots">Live Agent Reviewing</span> : 'Final Review & Submit'}
        </button>
      </div>
    </div>
  );
}
