"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { DesignConfig, WindowTemplate, DoorTemplate } from '@/src/app/draw/page';

const windowTemplates: WindowTemplate[] = [
  'single', 'double', 'triple', 'sliding', 'fixed', 'casement',
  'tilt_turn', 'awning', 'hopper', 'bay', 'bow', 'arch', 'picture',
  'jalousie', 'transom', 'skylight', 'corner', 'garden', 'storm',
  'clerestory', 'greenhouse'
];

const doorTemplates: DoorTemplate[] = [
  'single', 'double', 'sliding', 'bifold', 'pivot', 'french',
  'entry', 'patio', 'barn', 'pocket', 'accordion', 'security',
  'sliding_panel', 'louvre'
];

interface TestResult {
  type: 'window' | 'door';
  template: string;
  status: 'pending' | 'testing' | 'passed' | 'failed';
  error?: string;
  timestamp?: string;
}

export default function TestTemplatesPage() {
  const router = useRouter();
  const [currentTest, setCurrentTest] = useState<{ type: 'window' | 'door'; template: string } | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [autoTest, setAutoTest] = useState(false);

  const allTests: { type: 'window' | 'door'; template: string }[] = [
    ...windowTemplates.map(t => ({ type: 'window' as const, template: t })),
    ...doorTemplates.map(t => ({ type: 'door' as const, template: t }))
  ];

  const testTemplate = async (type: 'window' | 'door', template: string) => {
    // Update status to testing
    setResults(prev => prev.map(r => 
      r.type === type && r.template === template 
        ? { ...r, status: 'testing', timestamp: new Date().toISOString() }
        : r
    ));

    // Navigate to designer with this template
    const design: DesignConfig = {
      type,
      template: template as any,
      width: 1500,
      height: 2000,
      frameDepth: 60,
      material: 'upvc',
      glass: true,
      color: '#2196f3',
      profileType: 'square'
    };

    // Store in localStorage for the designer to pick up
    localStorage.setItem('testDesign', JSON.stringify(design));
    
    // Open designer in new tab
    const url = `/draw?test=${type}_${template}`;
    window.open(url, '_blank');

    // Wait a bit for user to verify
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mark as passed (user will mark as failed if needed)
    setResults(prev => prev.map(r => 
      r.type === type && r.template === template 
        ? { ...r, status: 'passed', timestamp: new Date().toISOString() }
        : r
    ));
  };

  const startAutoTest = async () => {
    setIsRunning(true);
    setAutoTest(true);

    for (const test of allTests) {
      setCurrentTest(test);
      
      // Initialize result if not exists
      if (!results.find(r => r.type === test.type && r.template === test.template)) {
        setResults(prev => [...prev, {
          type: test.type,
          template: test.template,
          status: 'pending'
        }]);
      }

      await testTemplate(test.type, test.template);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait between tests
    }

    setIsRunning(false);
    setAutoTest(false);
    setCurrentTest(null);
  };

  const markAsFailed = (type: 'window' | 'door', template: string, error?: string) => {
    setResults(prev => prev.map(r => 
      r.type === type && r.template === template 
        ? { ...r, status: 'failed', error, timestamp: new Date().toISOString() }
        : r
    ));
  };

  const resetTests = () => {
    setResults([]);
    setCurrentTest(null);
  };

  useEffect(() => {
    // Initialize results
    if (results.length === 0) {
      setResults(allTests.map(test => ({
        type: test.type,
        template: test.template,
        status: 'pending'
      })));
    }
  }, []);

  const passedCount = results.filter(r => r.status === 'passed').length;
  const failedCount = results.filter(r => r.status === 'failed').length;
  const pendingCount = results.filter(r => r.status === 'pending' || r.status === 'testing').length;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '2px solid #e0e0e0'
        }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#1e3a5f' }}>
              Template Test Suite
            </h1>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Test all window and door templates systematically
            </p>
          </div>
          <button
            onClick={() => router.push('/draw')}
            style={{
              padding: '10px 20px',
              background: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Open Designer
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '16px',
            background: '#e3f2fd',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {allTests.length}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Total Templates</div>
          </div>
          <div style={{
            padding: '16px',
            background: '#c8e6c9',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#388e3c' }}>
              {passedCount}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Passed</div>
          </div>
          <div style={{
            padding: '16px',
            background: '#ffcdd2',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#c62828' }}>
              {failedCount}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Failed</div>
          </div>
          <div style={{
            padding: '16px',
            background: '#fff9c4',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f57f17' }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Pending</div>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          padding: '16px',
          background: '#f8f9fa',
          borderRadius: '6px'
        }}>
          <button
            onClick={startAutoTest}
            disabled={isRunning}
            style={{
              padding: '10px 20px',
              background: isRunning ? '#ccc' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {isRunning ? 'Testing...' : 'Start Auto Test'}
          </button>
          <button
            onClick={resetTests}
            disabled={isRunning}
            style={{
              padding: '10px 20px',
              background: isRunning ? '#ccc' : '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Reset Tests
          </button>
        </div>

        {/* Current Test Indicator */}
        {currentTest && (
          <div style={{
            padding: '16px',
            background: '#e3f2fd',
            borderRadius: '6px',
            marginBottom: '24px',
            border: '2px solid #2196f3'
          }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1976d2' }}>
              Currently Testing: {currentTest.type} - {currentTest.template}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Check the designer window that opened to verify this template works correctly
            </div>
          </div>
        )}

        {/* Results Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px'
          }}>
            <thead>
              <tr style={{
                background: '#f5f5f5',
                borderBottom: '2px solid #ddd'
              }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Template</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid #eee',
                    background: result.status === 'testing' ? '#fff9c4' : 'white'
                  }}
                >
                  <td style={{ padding: '12px', textTransform: 'capitalize' }}>
                    {result.type}
                  </td>
                  <td style={{ padding: '12px', fontWeight: '500' }}>
                    {result.template}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: result.status === 'passed' ? '#c8e6c9' :
                                  result.status === 'failed' ? '#ffcdd2' :
                                  result.status === 'testing' ? '#fff9c4' : '#e0e0e0',
                      color: result.status === 'passed' ? '#388e3c' :
                             result.status === 'failed' ? '#c62828' :
                             result.status === 'testing' ? '#f57f17' : '#666'
                    }}>
                      {result.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => testTemplate(result.type, result.template)}
                      disabled={isRunning}
                      style={{
                        padding: '6px 12px',
                        marginRight: '8px',
                        background: '#2196f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      Test
                    </button>
                    <button
                      onClick={() => markAsFailed(result.type, result.template, 'Manual failure')}
                      disabled={isRunning}
                      style={{
                        padding: '6px 12px',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      Mark Failed
                    </button>
                  </td>
                  <td style={{ padding: '12px', fontSize: '11px', color: '#999' }}>
                    {result.timestamp ? new Date(result.timestamp).toLocaleTimeString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}





