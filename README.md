# Canopy Studio
### 3D Product Configurator

## 1. Overview

Canopy Studio is an interactive commercial canopy tent configurator built as a client-side React and TypeScript web application. It provides a real-time product design experience allowing users to customize physical canopy tent dimensions, frame finishes, fabric colors, and 2D panel graphic branding.

Core Experience:
- Select from multiple canopy tent product models (5'×5', 6.5'×6.5', 8'×8')
- Customize canopy fabric colors and frame finishes with option persistence
- Select independently customizable canopy panels (Front Valance, Front Slope, Side Slope)
- Design panel branding using a 2D canvas editor supporting text graphics and client logo uploads
- Synchronize 2D panel designs in real time with an interactive 3D WebGL canopy model
- Configure production order quantities
- Calculate dynamic pricing through an asynchronous service contract
- Generate structured Shopify cart payloads ready for e-commerce checkout integration
- Export a production summary PDF document complete with configuration specs, pricing, and visual snapshots
- Embed the configurator into external storefront pages via an iframe container

---

## 2. Technical Stack

- **React** (`^18.3.1`): UI framework and component architecture
- **TypeScript** (`^5.7.2`): Type-safe application development and interface contracts
- **Vite** (`^6.0.7`): Module bundler and development server
- **Three.js** (`^0.170.0`): WebGL 3D graphics rendering engine
- **React Three Fiber** (`^8.17.10`): React renderer wrapper for Three.js
- **Drei** (`^9.121.0`): Helper primitives for React Three Fiber (OrbitControls, Environment)
- **Zustand** (`^5.0.2`): Centralized state management store
- **Tailwind CSS** (`^3.4.17`): Utility-first CSS styling framework
- **jsPDF** (`^3.0.4`): Client-side PDF generation library
- **Lucide React** (`^0.475.0`): UI icon library

---

## 3. Architecture

Canopy Studio uses a feature-oriented directory structure separating catalog definitions, core application state, isolated feature modules, and shared utilities.

```
src/
├── catalog/           # Product definitions, UV region manifests, canopy colors, frame finishes
├── core/              # Global state management and application-wide type contracts
│   └── state/         # Zustand store (useConfiguratorStore.ts) and state interfaces
├── features/          # Domain-specific feature modules
│   ├── branding/      # Offscreen 2D canvas texture generator (TextureGenerator.ts)
│   ├── configurator/  # Product selectors, option selectors, spec sheets, sidebar layout
│   ├── editor2d/      # 2D panel editor artboard, toolbar, and element inspector
│   ├── pdf/           # Production summary PDF service, preview capture, download UI
│   ├── pricing/       # Dynamic pricing service contract and mock implementation
│   ├── shopify/       # Shopify cart adapter, mock service, and cart payload modal
│   └── viewer/        # R3F WebGL 3D canvas viewer, camera rig, and studio lighting
└── shared/            # Shared utility functions and classname helpers
```

### Architectural Data Flow

```
User Interaction
      ↓
Zustand Configuration State
      ↓
 ┌────┼───────────────┬──────────────┐
 ↓    ↓               ↓              ↓
2D   3D            Pricing        PDF/Shopify
Editor Viewer      Service         Services
 ↓    ↓               ↓              ↓
Design → Texture → GLB Material   Structured Output
```

---

## 4. Configuration State

Centralized state management is implemented using Zustand (`src/core/state/useConfiguratorStore.ts`) as a single source of truth for all configurator selections.

Primary State Categories:
- **Product Selection**: `selectedProductId`
- **Material Choices**: `canopyColorId`, `frameFinishId`
- **Order Quantity**: `quantity`
- **Editor Selections**: `selectedPanelId`, `selectedElementId`
- **2D Panel Branding State**: `panelDesigns` (Record mapping panel IDs to element arrays)
- **Viewport Controls**: `autoRotate`, `showGrid`, `cameraPreset`

State Serializability:
The state tree consists strictly of serializable JS primitives, arrays, and plain objects. Three.js mesh instances, WebGL textures, DOM references, and blob URLs are explicitly excluded from state to preserve data integrity and predictability.

---

## 5. Product Catalog & Reusability

Product models are defined in `src/catalog/products.ts` as structured catalog objects rather than hardcoded UI elements.

Each `ProductDefinition` includes:
- Product ID, name, tagline, and size label
- Physical dimensions (width, depth, peak height, footprint area)
- 3D model GLB URL and scale vector
- Default frame finish and canopy color IDs
- Supported frame finish and canopy color options
- Shared panel definitions and UV region mapping manifests

Adding new product sizes or models involves extending catalog definitions. UI components render product options dynamically from catalog manifests without requiring structural component rewrites.

---

## 6. 2D Editor → 3D Synchronization

Real-time synchronization bridges the 2D design artboard with the 3D WebGL viewport:

```
2D Panel Editor
      ↓
Normalized Element Coordinates (x, y, width, height, rotation)
      ↓
Zustand panelDesigns State
      ↓
TextureGenerator (Offscreen HTML5 Canvas)
      ↓
Three.js CanvasTexture (SRGBColorSpace, flipY = false)
      ↓
GLB Model fabric_Mat Material
      ↓
3D Viewport Render
```

Technical Implementation:
- **Normalized Elements**: Text and uploaded logo image elements store positions relative to artboard dimensions (`artboardWidth` × `artboardHeight`).
- **Offscreen Canvas Texture**: `TextureGenerator` composes base fabric colors and panel design elements onto a 2048×2048 master texture map.
- **Orientation Alignment**: Textures are applied to Three.js materials with `SRGBColorSpace` and `flipY = false`, ensuring text on front panels renders upright and un-inverted from the front camera view.
- **Resource Management**: Previous `CanvasTexture` instances are disposed (`texture.dispose()`) upon state updates to prevent GPU memory leaks.

---

## 7. Dynamic Pricing

Pricing calculations are decoupled from UI components via an explicit service interface contract:

- **Interface Contract**: `IPricingService` (`src/features/pricing/types.ts`)
- **Service Implementation**: `MockPricingService` (`src/features/pricing/pricingService.ts`)

Calculation Rules:
- **Base Model Price**: 5'×5' (Rs. 14,999), 6.5'×6.5' (Rs. 19,999), 8'×8' (Rs. 27,999)
- **Frame Finish Surcharges**: Anodized Silver (Rs. 0), Matte Black (+Rs. 1,500), Alpine White (+Rs. 1,000)
- **Customization Charges**: Rs. 499 per text element; Rs. 999 per uploaded logo element across customized panels
- **Quantity Multiplier**: Applied to compute order subtotal

The service operates asynchronously with a simulated 120ms network delay. Replacing the mock service with a live backend API requires updating only the service implementation class.

---

## 8. Shopify Integration Approach

Shopify e-commerce integration is structured using a service adapter pattern:

- **Interface Contract**: `IShopifyService` (`src/features/shopify/types.ts`)
- **Adapter Transformation**: `buildShopifyCartPayload()` (`src/features/shopify/shopifyAdapter.ts`)
- **Payload Structure**: Transforms state and pricing into typed `ShopifyCartLineItem` objects containing line-item custom attributes:
  - Model Name & Dimensions
  - Canopy Color (Name + Hex) & Frame Finish
  - Customized Panels List
  - Text & Logo Element Counts
  - Unit Price & Authoritative Subtotal Price
- **Modal Inspector**: `ShopifyCartModal.tsx` renders structured line-item attributes alongside a raw JSON payload viewer with single-click clipboard copying and checkout URL simulation.

---

## 9. Production PDF

Production summaries are generated client-side using `jsPDF` (`src/features/pdf/pdfService.ts`):

Document Content:
- **Header & Metadata**: Unique Configuration ID (`CS-YYYYMMDD-XXXX`), creation timestamp, company title
- **Specifications & Options**: Product model, physical dimensions, canopy color, frame finish, order quantity
- **Commercial Summary**: Itemized price breakdown table and order subtotal (displayed in Rs.)
- **Visual Previews**: High-resolution 3D WebGL viewport snapshot and 2D master texture print map
- **Customization Details**: Panel-by-panel graphic element list with content strings, coordinates, dimensions, and font specs
- **Shopify Metadata**: Product variant GID and custom line-item attribute matrix

Preview snapshots are captured asynchronously using `previewGenerator.ts` without interrupting live viewport rendering.

---

## 10. Responsive Design & Embedding

Layout Adaptability:
- **Desktop (1280px+)**: Dual split 2D artboard editor and 3D WebGL viewport with expandable sidebar
- **Laptop / Tablet (768px - 1024px)**: Responsive side-by-side workspace with collapsible icon sidebar
- **Mobile (< 768px)**: Vertical column layout positioning viewports on top and a collapsible drawer tab bar at the bottom

Container & IFrame Embedding:
- Application layout uses `h-full w-full min-h-0` to render within any host DOM element or iframe container.
- An embedding demonstration is provided in `public/embed-demo.html`.
- `embed-demo.html` uses `window.location.origin` at runtime to set the iframe `src` and render the copyable HTML embed snippet dynamically across local development and production environments.

---

## 11. Performance & Resource Management

- **Selective State Subscriptions**: Components subscribe to specific Zustand slice selectors to minimize unnecessary re-renders.
- **GPU Resource Cleanup**: Previous Three.js `CanvasTexture` instances are disposed on updates.
- **Image Caching**: `TextureGenerator` caches loaded image instances in an in-memory `Map<string, HTMLImageElement>` to prevent duplicate network requests.
- **OrbitControls Damping**: Smooth camera interaction with `dampingFactor={0.08}`.
- **Vite Production Bundling**: Production build outputs minified JavaScript assets with code splitting.

---

## 12. Error Handling

- **3D Viewer Error Boundary**: `CanvasViewer.tsx` catches WebGL or model loading failures and renders a user-friendly `ErrorFallback` retry UI.
- **PDF Generation**: `PDFDownloadButton.tsx` wraps PDF compilation in try/catch blocks with alert indicators to prevent application crashes.
- **Image Load Handling**: `TextureGenerator.ts` handles image load errors gracefully to ensure texture generation completes even if an external image asset fails to load.

---

## 13. Running Locally

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```
Open `http://localhost:5173` to view the application, or `http://localhost:5173/embed-demo.html` to view the iframe embed demonstration.

### Typecheck

```bash
npm run typecheck
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 14. Project Structure

```
canopy-studio/
├── public/
│   ├── models/
│   │   ├── Tent_5_5.glb
│   │   ├── Tent_6.5_6.5.glb
│   │   └── Tent_8_8.glb
│   └── embed-demo.html
├── src/
│   ├── catalog/
│   │   ├── products.ts
│   │   └── types.ts
│   ├── core/
│   │   └── state/
│   │       ├── types.ts
│   │       └── useConfiguratorStore.ts
│   ├── features/
│   │   ├── branding/
│   │   │   └── services/
│   │   │       └── TextureGenerator.ts
│   │   ├── configurator/
│   │   │   └── components/
│   │   │       ├── Header.tsx
│   │   │       ├── OptionSelector.tsx
│   │   │       ├── PanelSelector.tsx
│   │   │       ├── ProductSelector.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       └── SpecSummary.tsx
│   │   ├── editor2d/
│   │   │   └── components/
│   │   │       ├── EditorToolbar.tsx
│   │   │       ├── ElementInspector.tsx
│   │   │       └── PanelEditor2D.tsx
│   │   ├── pdf/
│   │   │   ├── components/
│   │   │   │   └── PDFDownloadButton.tsx
│   │   │   ├── pdfService.ts
│   │   │   ├── previewGenerator.ts
│   │   │   └── types.ts
│   │   ├── pricing/
│   │   │   ├── pricingService.ts
│   │   │   └── types.ts
│   │   ├── shopify/
│   │   │   ├── components/
│   │   │   │   └── ShopifyCartModal.tsx
│   │   │   ├── shopifyAdapter.ts
│   │   │   ├── shopifyService.ts
│   │   │   └── types.ts
│   │   └── viewer/
│   │       └── components/
│   │           ├── CanvasViewer.tsx
│   │           ├── ErrorFallback.tsx
│   │           ├── LoadingFallback.tsx
│   │           ├── StudioEnvironment.tsx
│   │           ├── TentModel.tsx
│   │           └── ViewerControls.tsx
│   ├── shared/
│   │   └── utils/
│   │       └── classnames.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── vite.config.ts
```

---

## 15. Technical Decisions

- **React + TypeScript**: Provides component-based UI architecture with compile-time type safety across domain models and service contracts.
- **Zustand for Centralized State**: Delivers a lightweight, single source of truth using plain, serializable JavaScript state objects.
- **Catalog-Driven Definitions**: Encapsulates product dimensions, scale, GLB URLs, and UV manifests in structured catalog files for maintainability.
- **React Three Fiber & Three.js**: Powers interactive 3D WebGL rendering with OrbitControls camera rigs and studio lighting.
- **CanvasTexture Synchronization**: Uses an offscreen 2D HTML5 canvas texture generator to bridge 2D design elements with GLB model fabric materials.
- **Service Interfaces**: Decouples UI components from pricing, Shopify, and PDF implementations via explicit TypeScript interface abstractions.
- **Client-Side PDF Generation**: Uses `jsPDF` to compile 2-page production summary PDFs with embedded 3D/2D visual snapshots.
- **Dynamic Origin Embedding**: Uses container-aware flex layouts and `window.location.origin` detection for iframe embedding readiness.

---

## 16. Assessment Scope & Integration Status

- **Pricing Service**: Implemented using an asynchronous `MockPricingService` class behind an `IPricingService` interface contract.
- **Shopify Integration**: Implemented as a structured payload adapter and mock checkout service (`MockShopifyService`) behind an `IShopifyService` interface.
- **Production PDF**: Implemented client-side using `jsPDF`.
- **Backend Architecture**: The application is intentionally structured with service boundaries so mock pricing and Shopify services can be replaced with real API endpoints in production.

---

## 17. Known Technical Considerations

- **WebGL 3D Snapshot Capture**: Capturing 3D WebGL viewport canvas snapshots for PDF generation requires `preserveDrawingBuffer: true` on the Three.js WebGL renderer, which is enabled on the R3F `<Canvas>` component.
- **External Image CORS**: Uploaded local images render via data URLs; external image URLs used in canvas texture generation require valid CORS headers for canvas export.
