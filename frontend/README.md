# Aurralis

**AI Transaction Assistant** - Secure, transparent, and trustworthy transaction management with AI-powered assistance.

## Phase 1: Design System & Layout ✅

This is the foundational "Trust Layer" of Aurralis, featuring:

- ✨ **Dark Mode Design** - Professional, minimal aesthetic with Circle Blue and Success Green accents
- 🎨 **Design System** - Built with Tailwind CSS and custom theming
- 📱 **Responsive Layout** - Three-panel design with sidebar (Policy + Activity) and main chat interface
- 🔄 **State Management** - Transaction lifecycle state machine using Zustand
- 🎯 **Transaction States**: IDLE → THINKING → AWAITING_APPROVAL → EXECUTING → CONFIRMED

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand
- **Font**: Inter (Google Fonts)

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
aurralis/
├── app/
│   ├── layout.tsx          # Root layout with dark mode
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles and theme
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx  # Main layout orchestrator
│   │   ├── Sidebar.tsx     # Policy & Activity sidebar
│   │   └── ChatContainer.tsx # Chat interface
│   └── ui/
│       └── StateIndicator.tsx # Transaction state display
├── store/
│   └── transactionStore.ts # Zustand state management
├── types/
│   └── transaction.ts      # TypeScript type definitions
└── tailwind.config.ts      # Tailwind configuration
```

## Features

### Transaction Lifecycle

The application implements a state machine for transaction management:

1. **IDLE** - Ready for new transactions
2. **THINKING** - AI analyzing the request
3. **AWAITING_APPROVAL** - User review required
4. **EXECUTING** - Transaction in progress
5. **CONFIRMED** - Successfully completed

### Design Principles

- **Trust**: Dark mode with professional accents builds confidence
- **Transparency**: Clear state indicators show exactly what's happening
- **Security**: Approval workflow ensures user control
- **Minimalism**: Clean interface reduces cognitive load

## Color Palette

- **Circle Blue**: `#3B82F6` - Primary actions and states
- **Success Green**: `#10B981` - Confirmations and success states
- **Background**: `#0a0a0a` - Deep dark for reduced eye strain
- **Card**: `#151515` - Subtle elevation
- **Border**: `#2a2a2a` - Gentle separation

## Development

```bash
# Run linting
npm run lint

# Run with turbopack (faster)
npm run dev
```

## Roadmap

- [x] Phase 1: Design System & Layout
- [ ] Phase 2: AI Integration
- [ ] Phase 3: Transaction Execution
- [ ] Phase 4: Security & Audit

## License

MIT

---

**Built with trust, transparency, and security in mind.**
