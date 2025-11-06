"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: '🎨',
      title: 'Interactive 2D/3D Designer',
      description: 'Real-time visualization with animated previews for all window and door types. See your designs come to life before manufacturing.'
    },
    {
      icon: '📐',
      title: 'Precise Material Calculations',
      description: 'Automatic breakdown of profiles, glass, hardware, and components. Accurate quantities for cost estimation and ordering.'
    },
    {
      icon: '⚡',
      title: 'Quick Quote Wizard',
      description: 'Simplified workflow for fast quotes. Select size, type, and material - get instant pricing and material lists.'
    },
    {
      icon: '🏗️',
      title: 'Professional Templates',
      description: '13 window types and 8 door configurations. From standard casement to custom bay windows and bifold doors.'
    },
    {
      icon: '💰',
      title: 'Instant Pricing',
      description: 'Real-time cost calculation with material breakdown. Export quotes and share with clients instantly.'
    },
    {
      icon: '🔧',
      title: 'Extended Components',
      description: 'Sills, mosquito nets, glass films, installation services. Complete configuration for every project need.'
    }
  ];

  const templates = [
    { name: 'Sliding Windows', icon: '↔️', count: '3 variants' },
    { name: 'Casement Windows', icon: '⬜', count: '4 variants' },
    { name: 'Specialty Windows', icon: '🏛️', count: '6 variants' },
    { name: 'Entry Doors', icon: '🚪', count: '5 variants' },
    { name: 'Sliding Doors', icon: '🌳', count: '2 variants' },
    { name: 'French Doors', icon: '🏛️', count: '1 variant' }
  ];

  if (!mounted) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <main style={{ 
      width: '100%',
      overflowX: 'hidden',
      backgroundColor: '#ffffff'
    }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6b 50%, #1e3a5f 100%)',
        color: '#ffffff',
        padding: '80px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            fontSize: '64px',
            fontWeight: 'bold',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #ffffff 0%, #e0f2ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            DoorWin Craft
          </div>
          <p style={{
            fontSize: '24px',
            marginBottom: '8px',
            color: '#e0f2ff',
            fontWeight: 300
          }}>
            Professional Window & Door Design Platform
          </p>
          <p style={{
            fontSize: '18px',
            marginBottom: '40px',
            color: '#b8d4f0',
            maxWidth: '700px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6'
          }}>
            Design, visualize, and quote custom windows and doors with precision. 
            From concept to production with professional-grade tools.
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => router.push('/draw')}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                fontWeight: '600',
                backgroundColor: '#4caf50',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(76, 175, 80, 0.4)',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#45a049';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4caf50';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(76, 175, 80, 0.4)';
              }}
            >
              <span>🎨</span>
              <span>Start Designing</span>
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                fontWeight: '600',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '2px solid #ffffff',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              View Dashboard
            </button>
          </div>
        </div>
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 1
        }} />
      </section>

      {/* Features Section */}
      <section style={{
        padding: '80px 24px',
        backgroundColor: '#f8f9fa',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#1e3a5f',
            marginBottom: '16px'
          }}>
            Professional Design Tools
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#666',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Everything you need to design, quote, and deliver custom windows and doors
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#ffffff',
                padding: '32px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                border: '1px solid #e8e8e8'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1e3a5f',
                marginBottom: '12px'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#666',
                lineHeight: '1.6',
                margin: 0
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates Showcase */}
      <section style={{
        padding: '80px 24px',
        backgroundColor: '#ffffff',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#1e3a5f',
            marginBottom: '16px'
          }}>
            Comprehensive Template Library
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#666',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Choose from 21+ professional templates with animated previews
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {templates.map((template, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#f8f9fa',
                padding: '24px',
                borderRadius: '10px',
                textAlign: 'center',
                border: '2px solid #e8e8e8',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2196f3';
                e.currentTarget.style.backgroundColor = '#f0f7ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e8e8e8';
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                fontSize: '40px',
                marginBottom: '12px'
              }}>
                {template.icon}
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e3a5f',
                marginBottom: '8px'
              }}>
                {template.name}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#666'
              }}>
                {template.count}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6b 100%)',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#ffffff'
          }}>
            Ready to Create Your Design?
          </h2>
          <p style={{
            fontSize: '20px',
            marginBottom: '40px',
            color: '#e0f2ff',
            lineHeight: '1.6'
          }}>
            Start designing custom windows and doors with professional-grade tools. 
            Get instant pricing and material calculations.
          </p>
          <button
            onClick={() => router.push('/draw')}
            style={{
              padding: '18px 48px',
              fontSize: '20px',
              fontWeight: '600',
              backgroundColor: '#4caf50',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(76, 175, 80, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#45a049';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4caf50';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(76, 175, 80, 0.4)';
            }}
          >
            Launch Designer →
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '60px 24px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e8e8e8'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          maxWidth: '1000px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#2196f3',
              marginBottom: '8px'
            }}>
              21+
            </div>
            <div style={{
              fontSize: '18px',
              color: '#666'
            }}>
              Window & Door Templates
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#4caf50',
              marginBottom: '8px'
            }}>
              100%
            </div>
            <div style={{
              fontSize: '18px',
              color: '#666'
            }}>
              Real-time Calculations
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#ff9800',
              marginBottom: '8px'
            }}>
              3D
            </div>
            <div style={{
              fontSize: '18px',
              color: '#666'
            }}>
              Interactive Previews
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#9c27b0',
              marginBottom: '8px'
            }}>
              ⚡
            </div>
            <div style={{
              fontSize: '18px',
              color: '#666'
            }}>
              Instant Quotes
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
