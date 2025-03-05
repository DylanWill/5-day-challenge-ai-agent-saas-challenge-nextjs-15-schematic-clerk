# Real Estate Agent Platform

A comprehensive platform for real estate agents to manage their business, including:

- Document management with OCR and Google Drive integration
- Market analysis tools
- Email management
- Property reports generation
- Calendar management
- AI assistant for real estate tasks

## Features

- **Dashboard**: Central hub for quick stats, upcoming appointments, recent emails, market updates, and tasks
- **Document Management**: Upload, process, and organize documents with OCR capabilities
- **Market Analysis**: Get real-time market trends and property data
- **Email Management**: Draft and categorize emails for clients
- **Property Reports**: Generate comparative market analysis reports
- **Calendar Management**: Schedule and manage appointments

## Technologies Used

- Next.js 15
- Clerk for authentication
- Schematic for feature flags
- Anthropic Claude for AI capabilities
- Tailwind CSS for styling

## Getting Started

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server with `pnpm dev`

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Schematic
NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_KEY=
SCHEMATIC_API_KEY=

# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Claude API
CLAUDE_API_KEY=

# OpenAI API
OPENAI_API_KEY=

# Redfin API (for market data)
REDFIN_API_KEY=

# Zillow API (for market data)
ZILLOW_API_KEY=

# QuickChart API (for visualizations)
QUICKCHART_API_KEY=
```

## Project Structure

```
/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── calendar/         # Calendar management pages
│   ├── email/            # Email management pages
│   ├── market-analysis/  # Market analysis pages
│   ├── reports/          # Client report pages
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/               # UI components
│   ├── calendar/         # Calendar components
│   ├── email/            # Email components
│   ├── market/           # Market analysis components
│   └── reports/          # Report components
├── lib/                  # Utility functions
├── actions/              # Server actions
├── tools/                # AI agent tools
├── convex/               # Convex database schema and functions
└── public/               # Static assets
```

## License

MIT
