# Competitive Analysis: DoorWin Craft vs PVC Windows Studio

## Overview

**PVC Windows Studio** ([Google Play](https://play.google.com/store/apps/details?id=com.blogspot.turbocolor.winstudio)) is an Android mobile app with 100K+ downloads and 4.5-star rating, focused on on-site window cost calculation for businesses.

**DoorWin Craft** is our web-based professional design platform built with Next.js, offering both design visualization and cost calculation.

---

## Feature Comparison Matrix

| Feature | PVC Windows Studio | DoorWin Craft | Winner |
|---------|-------------------|---------------|--------|
| **Platform** | Android Mobile App | Web-based (Desktop/Tablet) | 🟡 Different markets |
| **Design Visualization** | Basic 2D drawings | 2D Interactive Canvas + 3D Preview (Three.js) | ✅ **DoorWin** |
| **Price Calculation** | ✅ Built-in editor | ✅ Real-time calculation | 🟡 Tie |
| **Customer Database** | ✅ Full database of customers & facilities | ❌ Not implemented | ✅ **PVC Windows** |
| **Order History** | ✅ Tracks all windows ever ordered | ❌ Not implemented | ✅ **PVC Windows** |
| **Price Editor** | ✅ Powerful built-in editor | ⚠️ Hardcoded pricing | ✅ **PVC Windows** |
| **Components** | Windows, sills, glass, films, nets, works | Windows, doors, hardware, materials | 🟡 Similar |
| **Template Types** | Unknown (likely standard) | Single, Double, Sliding, Fixed | ✅ **DoorWin** |
| **Material Types** | Unknown | Aluminum, Wood, uPVC | ✅ **DoorWin** |
| **Export Options** | Unknown | PNG, JSON export | ✅ **DoorWin** |
| **Undo/Redo** | Unknown | ✅ Full history management | ✅ **DoorWin** |
| **Interactive Editing** | Unknown | ✅ Drag handles, grid snapping | ✅ **DoorWin** |
| **3D Preview** | ❌ Not mentioned | ✅ Real-time 3D rendering | ✅ **DoorWin** |
| **Arch Shapes** | ❌ Missing (user complaint) | ❌ Not implemented | 🟡 Tie (both missing) |
| **View Options** | Inside view (UK users want outside) | Inside view only | 🟡 Similar limitation |
| **Hardware Selection** | Unknown | ✅ Handles, hinges, locks | ✅ **DoorWin** |

---

## Strengths & Weaknesses

### 🏆 PVC Windows Studio Strengths
1. **Business-Focused Features**
   - ✅ Customer and facility database management
   - ✅ Complete order history tracking
   - ✅ Customizable price editor for businesses
   - ✅ Proven mobile solution (100K+ downloads)

2. **Industry-Specific Components**
   - ✅ Window sills calculation
   - ✅ Glass films pricing
   - ✅ Mosquito nets
   - ✅ Work/installation costs

3. **On-Site Utility**
   - ✅ Mobile-first for field use
   - ✅ "On the fly" calculation during customer visits

### 🏆 DoorWin Craft Strengths
1. **Superior Visualization**
   - ✅ Interactive 2D canvas with drag controls
   - ✅ Real-time 3D preview with material rendering
   - ✅ Professional design experience
   - ✅ Export to PNG/JSON

2. **Advanced Design Tools**
   - ✅ Undo/redo history
   - ✅ Design validation
   - ✅ Size presets for common dimensions
   - ✅ Grid snapping and precision controls

3. **Modern Tech Stack**
   - ✅ Web-based (no installation)
   - ✅ Responsive design
   - ✅ Cross-platform compatibility

4. **Parametric Control**
   - ✅ Real-time dimension editing
   - ✅ Material selection with visual feedback
   - ✅ Hardware customization

### ⚠️ DoorWin Craft Weaknesses (vs PVC Windows Studio)
1. **Missing Business Features**
   - ❌ No customer database
   - ❌ No order history
   - ❌ No facility management
   - ❌ No customizable price editor

2. **Missing Product Components**
   - ❌ No window sills
   - ❌ No glass films
   - ❌ No mosquito nets
   - ❌ No work/installation pricing

3. **View Limitations**
   - ❌ Only inside view (UK market needs outside view option)
   - ❌ No view angle toggle

---

## User Feedback Analysis (PVC Windows Studio)

### Pain Points Identified:
1. **Pricing**: £70/year subscription too expensive for infrequent users
   - *Solution opportunity*: Offer per-project pricing or lower tier

2. **UK Market Needs**:
   - Need outside view option (surveys from outside)
   - Triangle indicator reversed (point shows hinge side)
   - Don't need to see handle from outside

3. **Missing Features**:
   - Arch shape windows not available (user request)

---

## Recommendations for DoorWin Craft

### 🎯 High Priority (To Match Competition)
1. **Customer & Order Management**
   ```typescript
   // Add to Prisma schema:
   model Customer {
     id        String   @id @default(cuid())
     name      String
     email     String?
     phone     String?
     address   String?
     orgId     String
     orders    Order[]
     createdAt DateTime @default(now())
   }

   model Order {
     id        String   @id @default(cuid())
     customerId String
     design     Json     // Store DesignConfig
     price      Int
     status     OrderStatus
     notes      String?
     createdAt  DateTime @default(now())
   }
   ```

2. **Extended Product Components**
   - Window sills (various profiles)
   - Glass films (privacy, tinting, energy-efficient)
   - Mosquito nets (fixed, sliding, retractable)
   - Installation/work costs (separate line items)

3. **Customizable Price Editor**
   - Admin interface to set base prices
   - Material multipliers configuration
   - Component pricing per unit
   - Regional pricing support (KSA-specific)

### 🎯 Medium Priority (Market Differentiators)
4. **Arch Shape Templates**
   - Circular/arched windows
   - Custom curve editor
   - Gothic arch option

5. **View Options**
   - Toggle between inside/outside view
   - Reversible triangle indicator for hinge side
   - Hide handles option for outside view

6. **Enhanced Price Calculation**
   - Line-item breakdown (frame, glass, hardware, sills, nets, work)
   - VAT calculation (KSA 15%)
   - Discount system
   - Quote generation with PDF export

### 🎯 Low Priority (Nice-to-Have)
7. **Mobile Optimization**
   - Progressive Web App (PWA) support
   - Touch-optimized controls
   - Offline capability

8. **Advanced Features**
   - Batch order processing
   - Design templates library
   - Material texture library
   - Installation time estimation

---

## Competitive Positioning

### Target Market Differentiation

**PVC Windows Studio** → **Mobile field sales tool**
- Best for: On-site quotes during customer visits
- Strength: Quick calculation, customer database

**DoorWin Craft** → **Professional design studio**
- Best for: Detailed design, visualization, presentation
- Strength: Visual quality, parametric control, web access

### Winning Strategy
1. **Hybrid Approach**: Match business features (customers, orders) while maintaining design superiority
2. **Price Flexibility**: Offer lower pricing tier than £70/year competitor
3. **Market-Specific**: Focus on KSA market with proper VAT, regional pricing
4. **Feature Completeness**: Add missing components (sills, nets, films) to compete on functionality

---

## Feature Gap Summary

| Category | Gap Count | Priority |
|----------|-----------|----------|
| **Business Management** | 4 features | 🔴 High |
| **Product Components** | 4 features | 🔴 High |
| **View Options** | 2 features | 🟡 Medium |
| **Templates** | 1 feature (arches) | 🟡 Medium |
| **Price Editor** | 1 feature | 🔴 High |

---

## Conclusion

**DoorWin Craft** excels in **design visualization and user experience** but lacks **business management features** that make PVC Windows Studio valuable for field sales.

**Recommendation**: Prioritize adding customer database, order history, and extended product components to compete effectively while maintaining our superior design tools advantage.


