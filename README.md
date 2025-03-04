# Real Estate Agent AI Assistant

A powerful web application that integrates AI agentic tools to help real estate agents automate time-consuming tasks and enhance their productivity.

## Features

### Calendar Management
- AI-powered scheduling and appointment management
- Smart reminders and notifications
- Conflict detection and resolution
- Integration with popular calendar services (Google Calendar, Outlook)

### Email Management
- Smart inbox organization and prioritization
- AI-powered email drafting and responses
- Email categorization and tagging
- Follow-up reminders and tracking

### Market Analysis
- Real-time property market trends from Redfin and Zillow
- Comparative market analysis (CMA) reports
- Neighborhood insights and statistics
- Price trend forecasting

### Client Reports
- Automated property comparison reports
- Data visualization with interactive charts and graphs
- Customizable report templates
- Easy sharing options (PDF, email, link)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Authentication**: Clerk
- **Database**: Convex
- **AI Integration**: Claude API, OpenAI API
- **Feature Management**: Schematic
- **Data Visualization**: QuickChart API

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
