"use client";
import { useMemo } from 'react';
import type { DesignConfig } from '@/src/app/draw/page';

interface MaterialBreakdownProps {
  design: DesignConfig;
}

export function MaterialBreakdown({ design }: MaterialBreakdownProps) {
  const breakdown = useMemo(() => {
    const width = design.width / 1000; // Convert to meters
    const height = design.height / 1000; // Convert to meters
    const area = (design.width * design.height) / 1_000_000; // m²

    // Calculate frame profile lengths
    const horizontalProfiles = width * 2; // Top + bottom
    const verticalProfiles = height * 2; // Left + right
    const mullions = (design.template === 'double' || design.template === 'french') 
      ? height : 0;
    const totalProfiles = horizontalProfiles + verticalProfiles + mullions;

    // Calculate glass area based on template
    const panelCounts: Record<string, number> = {
      'single': 1,
      'double': 2,
      'french': 2,
      'bay': 3,
      'bow': 5,
      'sliding': 2,
      'bifold': 2,
      'entry': 3,
      'patio': 2,
    };
    const panelCount = panelCounts[design.template] || 1;
    const glassAreaPerPanel = area / panelCount;
    const totalGlassArea = area;

    // Hardware quantities
    const handlesCount = design.hardware?.handles && design.hardware.handles !== 'none' 
      ? (design.template === 'double' || design.template === 'french' ? 2 : 1)
      : 0;
    const hingesCount = design.hardware?.hinges && design.hardware.hinges !== 'none'
      ? (design.type === 'door' ? (design.template === 'double' || design.template === 'french' ? 4 : 2) : 0)
      : 0;
    const locksCount = design.hardware?.locks && design.hardware.locks !== 'none' ? 1 : 0;

    // Sills length
    const sillLength = design.sills?.type && design.sills.type !== 'none'
      ? (design.sills.length || design.width) / 1000 // meters
      : 0;

    // Mosquito net area
    const netArea = design.mosquitoNet?.type && design.mosquitoNet.type !== 'none'
      ? totalGlassArea
      : 0;

    // Glass film area
    const filmArea = design.glassFilm?.type && design.glassFilm.type !== 'none'
      ? totalGlassArea * (design.glassFilm.coverage === 'full' ? 1 : 0.5)
      : 0;

    return {
      frameProfiles: {
        horizontal: horizontalProfiles,
        vertical: verticalProfiles,
        mullions: mullions,
        total: totalProfiles
      },
      glass: {
        perPanel: glassAreaPerPanel,
        total: totalGlassArea,
        panelCount: panelCount
      },
      hardware: {
        handles: handlesCount,
        hinges: hingesCount,
        locks: locksCount
      },
      sills: {
        length: sillLength
      },
      mosquitoNet: {
        area: netArea
      },
      glassFilm: {
        area: filmArea
      }
    };
  }, [design]);

  return (
    <div style={{
      marginTop: '16px',
      padding: '16px',
      background: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e0e0e0'
    }}>
      <h4 style={{
        margin: '0 0 12px 0',
        fontSize: '14px',
        fontWeight: '600',
        color: '#333'
      }}>
        📋 Material Breakdown
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Frame Profiles */}
        <div style={{
          padding: '10px',
          background: 'white',
          borderRadius: '6px',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '6px' }}>
            Frame Profiles ({design.material})
          </div>
          <div style={{ fontSize: '11px', color: '#888', display: 'flex', justifyContent: 'space-between' }}>
            <span>Total Length:</span>
            <span style={{ fontWeight: '600', color: '#333' }}>
              {breakdown.frameProfiles.total.toFixed(2)} m
            </span>
          </div>
          {breakdown.frameProfiles.mullions > 0 && (
            <div style={{ fontSize: '10px', color: '#999', marginTop: '4px', paddingLeft: '8px' }}>
              • Horizontal: {breakdown.frameProfiles.horizontal.toFixed(2)} m<br/>
              • Vertical: {breakdown.frameProfiles.vertical.toFixed(2)} m<br/>
              • Mullions: {breakdown.frameProfiles.mullions.toFixed(2)} m
            </div>
          )}
        </div>

        {/* Glass */}
        {design.glass && (
          <div style={{
            padding: '10px',
            background: 'white',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '6px' }}>
              Glass Area
            </div>
            <div style={{ fontSize: '11px', color: '#888', display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Area:</span>
              <span style={{ fontWeight: '600', color: '#333' }}>
                {breakdown.glass.total.toFixed(2)} m²
              </span>
            </div>
            {breakdown.glass.panelCount > 1 && (
              <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
                {breakdown.glass.panelCount} panels × {breakdown.glass.perPanel.toFixed(2)} m² each
              </div>
            )}
          </div>
        )}

        {/* Hardware */}
        {(breakdown.hardware.handles > 0 || breakdown.hardware.hinges > 0 || breakdown.hardware.locks > 0) && (
          <div style={{
            padding: '10px',
            background: 'white',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '6px' }}>
              Hardware
            </div>
            <div style={{ fontSize: '11px', color: '#888', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {breakdown.hardware.handles > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Handles ({design.hardware?.handles || 'standard'}):</span>
                  <span style={{ fontWeight: '600', color: '#333' }}>{breakdown.hardware.handles} pcs</span>
                </div>
              )}
              {breakdown.hardware.hinges > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Hinges ({design.hardware?.hinges || 'hidden'}):</span>
                  <span style={{ fontWeight: '600', color: '#333' }}>{breakdown.hardware.hinges} pcs</span>
                </div>
              )}
              {breakdown.hardware.locks > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Locks ({design.hardware?.locks}):</span>
                  <span style={{ fontWeight: '600', color: '#333' }}>{breakdown.hardware.locks} pc</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sills */}
        {breakdown.sills.length > 0 && (
          <div style={{
            padding: '10px',
            background: 'white',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '6px' }}>
              Window Sills ({design.sills?.type})
            </div>
            <div style={{ fontSize: '11px', color: '#888', display: 'flex', justifyContent: 'space-between' }}>
              <span>Length:</span>
              <span style={{ fontWeight: '600', color: '#333' }}>
                {breakdown.sills.length.toFixed(2)} m
              </span>
            </div>
          </div>
        )}

        {/* Mosquito Net */}
        {breakdown.mosquitoNet.area > 0 && (
          <div style={{
            padding: '10px',
            background: 'white',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '6px' }}>
              Mosquito Net ({design.mosquitoNet?.type})
            </div>
            <div style={{ fontSize: '11px', color: '#888', display: 'flex', justifyContent: 'space-between' }}>
              <span>Area:</span>
              <span style={{ fontWeight: '600', color: '#333' }}>
                {breakdown.mosquitoNet.area.toFixed(2)} m²
              </span>
            </div>
          </div>
        )}

        {/* Glass Film */}
        {breakdown.glassFilm.area > 0 && (
          <div style={{
            padding: '10px',
            background: 'white',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '6px' }}>
              Glass Film ({design.glassFilm?.type})
            </div>
            <div style={{ fontSize: '11px', color: '#888', display: 'flex', justifyContent: 'space-between' }}>
              <span>Coverage:</span>
              <span style={{ fontWeight: '600', color: '#333' }}>
                {breakdown.glassFilm.area.toFixed(2)} m² ({design.glassFilm?.coverage || 'full'})
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}





