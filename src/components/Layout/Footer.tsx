"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Footer() {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const isDrawPage = pathname?.startsWith('/draw');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Modern Professional SVG Icons - sized per page
  const PhoneIcon = () => (
    <svg width={isDrawPage ? 12 : 16} height={isDrawPage ? 12 : 16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg width={isDrawPage ? 12 : 16} height={isDrawPage ? 12 : 16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378 7.975 7.975 0 01-2.757-2.76c-3.184-5.511.359-12.577 5.895-14.886A10.01 10.01 0 0112.056 2c5.485.002 9.938 4.448 9.938 9.933a9.869 9.869 0 01-1.357 5.038c-.345.656-.98 1.11-1.681 1.259l-2.226.547-.676 1.445a.4.4 0 01-.234.22.408.408 0 01-.359-.057l-2.224-1.314z" 
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );

  // Size scales per page
  // Defaults (all pages): original comfortable size
  let paddingDesktop = '24px 24px';
  let paddingMobile = '20px 16px';
  let mainGap = '12px';
  let nameTitleGap = '6px';
  let nameFont = isMobile ? '18px' : '20px';
  let subFont = isMobile ? '13px' : '14px';
  let iconsGap = '10px';
  let iconsPadding = '10px';
  let iconsSize = '36px';
  let copyrightMarginTop = isMobile ? '16px' : '20px';
  let copyrightPaddingTop = isMobile ? '16px' : '20px';
  let copyrightFont = isMobile ? '11px' : '12px';

  // Draw page: small but readable (~35%)
  if (isDrawPage) {
    paddingDesktop = '8px 8px';
    paddingMobile = '7px 6px';
    mainGap = '4px';
    nameTitleGap = '4px';
    nameFont = isMobile ? '7px' : '8px';
    subFont = isMobile ? '6px' : '7px';
    iconsGap = '4px';
    iconsPadding = '4px';
    iconsSize = '14px';
    copyrightMarginTop = isMobile ? '6px' : '7px';
    copyrightPaddingTop = isMobile ? '6px' : '7px';
    copyrightFont = isMobile ? '6px' : '7px';
  }

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6b 100%)',
      padding: isMobile ? paddingMobile : paddingDesktop,
      borderTop: '1px solid rgba(255,255,255,0.1)',
      boxShadow: isDrawPage ? '0 -1px 4px rgba(0,0,0,0.12)' : '0 -2px 10px rgba(0,0,0,0.15)',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-end',
          gap: mainGap,
          width: '100%'
        }}>
          {/* Name and Title Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isDrawPage ? '2px' : '4px',
            alignItems: isMobile ? 'center' : 'flex-end',
            width: '100%'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: nameTitleGap,
              flexWrap: 'wrap',
              justifyContent: isMobile ? 'center' : 'flex-end'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: nameFont,
                color: '#ffffff',
                fontWeight: '600',
              letterSpacing: isDrawPage ? '0.2px' : '0.3px',
              lineHeight: isDrawPage ? '1.25' : '1.3'
              }}>
                Sherif Rosas
              </h2>
              <span style={{
                fontSize: subFont,
                color: '#e8f4f8',
                fontWeight: '400',
              letterSpacing: isDrawPage ? '0.2px' : '0.2px',
                opacity: 0.9
              }}>
                AI Developer
              </span>
            </div>

            {/* Contact Information Section - Under Titles */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: iconsGap,
              marginTop: isDrawPage ? '3px' : '8px',
              justifyContent: isMobile ? 'center' : 'flex-end'
            }}>
              <a 
                href="tel:+201065661882" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: iconsPadding,
                  borderRadius: isDrawPage ? '4px' : '8px',
                  background: 'rgba(255,255,255,0.1)',
                  transition: 'all 0.2s',
                  border: '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  backdropFilter: isDrawPage ? 'blur(6px)' : 'blur(10px)',
                  width: iconsSize,
                  height: iconsSize,
                  boxShadow: isDrawPage ? '0 1px 4px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.transform = isDrawPage ? 'translateY(-1px) scale(1.05)' : 'translateY(-2px) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
                aria-label="Call +201065661882"
              >
                <PhoneIcon />
              </a>
              
              <a 
                href="https://wa.me/201065661882" 
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: iconsPadding,
                  borderRadius: isDrawPage ? '4px' : '8px',
                  background: 'rgba(37, 211, 102, 0.18)',
                  transition: 'all 0.2s',
                  border: '1px solid rgba(37, 211, 102, 0.25)',
                  cursor: 'pointer',
                  backdropFilter: isDrawPage ? 'blur(6px)' : 'blur(10px)',
                  width: iconsSize,
                  height: iconsSize,
                  boxShadow: isDrawPage ? '0 1px 4px rgba(37, 211, 102, 0.18)' : '0 2px 8px rgba(37, 211, 102, 0.15)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(37, 211, 102, 0.28)';
                  e.currentTarget.style.borderColor = 'rgba(37, 211, 102, 0.4)';
                  e.currentTarget.style.transform = isDrawPage ? 'translateY(-1px) scale(1.05)' : 'translateY(-2px) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(37, 211, 102, 0.18)';
                  e.currentTarget.style.borderColor = 'rgba(37, 211, 102, 0.25)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
                aria-label="Contact via WhatsApp"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div style={{
          marginTop: copyrightMarginTop,
          paddingTop: copyrightPaddingTop,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center'
        }}>
          <p style={{
            margin: 0,
            fontSize: copyrightFont,
            color: '#b0c4de',
            letterSpacing: '0.2px',
            fontWeight: '400',
            opacity: 0.85
          }}>
            © {new Date().getFullYear()} DoorWin Craft. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

