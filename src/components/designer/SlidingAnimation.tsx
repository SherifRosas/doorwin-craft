"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { DesignConfig } from '@/src/app/draw/page';

/**
 * Animates sliding panels when template is 'sliding' or 'patio'
 * Creates a smooth back-and-forth sliding motion
 */
export function useSlidingAnimation(
  design: DesignConfig,
  panelGroupRef: React.RefObject<THREE.Group>
) {
  const animationRef = useRef<number>();
  const directionRef = useRef<number>(1); // 1 for right, -1 for left
  const positionRef = useRef<number>(0);
  const startXRef = useRef<number>(0);

  useEffect(() => {
    // Only animate for sliding/patio templates
    if (design.template !== 'sliding' && design.template !== 'patio') {
      return;
    }

    if (!panelGroupRef.current) {
      return;
    }

    const group = panelGroupRef.current;
    
    // Find the sliding panel (the one on the right/positive X)
    const children = Array.from(group.children);
    const slidingPanel = children.find(
      (child) => child instanceof THREE.Mesh && child.position.x > 0
    ) as THREE.Mesh | undefined;

    if (!slidingPanel) {
      return;
    }

    // Store initial position
    startXRef.current = slidingPanel.position.x;
    positionRef.current = 0;
    
    // Calculate max slide distance (30% of panel width)
    const maxSlide = (design.width * 0.01) * 0.3; // Convert mm to units and take 30%
    const speed = 0.008; // Animation speed

    const animate = () => {
      positionRef.current += speed * directionRef.current;

      // Reverse direction at limits
      if (positionRef.current >= maxSlide) {
        directionRef.current = -1;
        positionRef.current = maxSlide;
      } else if (positionRef.current <= 0) {
        directionRef.current = 1;
        positionRef.current = 0;
      }

      // Update panel position - slides horizontally
      slidingPanel.position.x = startXRef.current - positionRef.current;

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [design.template, design.width, panelGroupRef]);
}

