import type { DesignConfig } from '@/src/app/draw/page';

export interface ValidationError {
  field: string;
  message: string;
}

const MIN_WIDTH = 300;
const MAX_WIDTH = 3000;
const MIN_HEIGHT = 300;
const MAX_HEIGHT = 3000;
const MIN_RATIO = 0.3;
const MAX_RATIO = 3.0;

export function validateDesign(design: DesignConfig): ValidationError[] {
  const errors: ValidationError[] = [];

  // Width validation
  if (design.width < MIN_WIDTH) {
    errors.push({ field: 'width', message: `Width must be at least ${MIN_WIDTH}mm` });
  }
  if (design.width > MAX_WIDTH) {
    errors.push({ field: 'width', message: `Width cannot exceed ${MAX_WIDTH}mm` });
  }

  // Height validation
  if (design.height < MIN_HEIGHT) {
    errors.push({ field: 'height', message: `Height must be at least ${MIN_HEIGHT}mm` });
  }
  if (design.height > MAX_HEIGHT) {
    errors.push({ field: 'height', message: `Height cannot exceed ${MAX_HEIGHT}mm` });
  }

  // Aspect ratio validation
  const ratio = design.width / design.height;
  if (ratio < MIN_RATIO) {
    errors.push({ field: 'dimensions', message: 'Window is too tall for its width' });
  }
  if (ratio > MAX_RATIO) {
    errors.push({ field: 'dimensions', message: 'Window is too wide for its height' });
  }

  // Template-specific validations
  const templateConstraints: Record<string, { minWidth?: number; minHeight?: number; message?: string }> = {
    double: { minWidth: 800, message: 'Double windows should be at least 800mm wide' },
    sliding: { minWidth: 1200, message: 'Sliding windows should be at least 1200mm wide' },
    bay: { minWidth: 2000, message: 'Bay windows should be at least 2000mm wide' },
    bow: { minWidth: 2500, message: 'Bow windows should be at least 2500mm wide' },
    picture: { minWidth: 1500, minHeight: 1200, message: 'Picture windows should be at least 1500x1200mm' },
    french: { minWidth: 1400, message: 'French doors should be at least 1400mm wide' },
    patio: { minWidth: 1800, message: 'Patio doors should be at least 1800mm wide' },
    pivot: { minHeight: 2000, message: 'Pivot doors should be at least 2000mm tall' },
  };

  const constraint = templateConstraints[design.template];
  if (constraint) {
    if (constraint.minWidth && design.width < constraint.minWidth) {
      errors.push({ field: 'width', message: constraint.message || `Width should be at least ${constraint.minWidth}mm` });
    }
    if (constraint.minHeight && design.height < constraint.minHeight) {
      errors.push({ field: 'height', message: constraint.message || `Height should be at least ${constraint.minHeight}mm` });
    }
  }

  return errors;
}



