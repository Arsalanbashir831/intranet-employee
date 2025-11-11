# Intranet Employee - Codebase Structure

## Overview
This is a **Next.js 15** employee intranet application built with **TypeScript**, **React 19**, and **TanStack Query** for data management. The application serves as an internal dashboard for Cartwright King employees.

## Technology Stack

### Core Framework
- **Next.js 15.5.3** (App Router with Turbopack)
- **React 19.1.0**
- **TypeScript 5**

### UI & Styling
- **Tailwind CSS 4** with PostCSS
- **Radix UI** components (comprehensive component library)
- **shadcn/ui** style components
- **Lucide React** for icons
- **Poppins** and **Geist** fonts

### Data Management
- **TanStack Query (React Query) 5.90.2** - Server state management
- **Axios 1.12.2** - HTTP client
- **React Hook Form 7.63.0** - Form management
- **Zod 4.1.11** - Schema validation

### Rich Text & Media
- **TipTap 3.5.0** - Rich text editor
- **React Easy Crop** - Image cropping
- **React Markdown** - Markdown rendering

### Other Key Libraries
- **date-fns** - Date utilities
- **Sonner** - Toast notifications
- **Recharts** - Data visualization
- **@dnd-kit** - Drag and drop functionality

## Project Structure

```
intranet-employee/
├── public/                    # Static assets
│   ├── icons/                 # SVG icons
│   ├── images/                # Image assets
│   └── logos/                 # Company logos
│
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (auth)/            # Auth route group
│   │   │   ├── login/
│   │   │   ├── forgot-password/
│   │   │   ├── otp-verification/
│   │   │   ├── reset-password/
│   │   │   └── layout.tsx     # Auth layout with RightAuthAside
│   │   │
│   │   ├── (dashboard)/       # Dashboard route group
│   │   │   ├── home/          # Home dashboard
│   │   │   ├── company-hub/   # Announcements & polls
│   │   │   ├── knowledge-base/ # Knowledge base folders
│   │   │   ├── people-directory/ # Employee directory
│   │   │   ├── executives/    # Executive members
│   │   │   ├── training-checklist/ # Training checklists
│   │   │   ├── task-checklist/ # Task checklists
│   │   │   ├── profile/       # User profile
│   │   │   └── layout.tsx     # Dashboard layout with Navbar
│   │   │
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Root page (redirects)
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   ├── common/            # Shared/common components
│   │   │   ├── navigation/   # Navbar, mobile menu, user menu
│   │   │   ├── card-table/    # Table components
│   │   │   └── ...            # Various reusable components
│   │   ├── company-hub/       # Company hub specific
│   │   ├── dashboard/         # Dashboard specific
│   │   ├── knowledge-base/    # Knowledge base components
│   │   ├── profile/           # Profile components
│   │   ├── teams/             # Team/branch components
│   │   ├── training-checklist/ # Training checklist components
│   │   └── ui/                # shadcn/ui components (48 files)
│   │
│   ├── constants/             # Application constants
│   │   ├── api-routes.ts      # API endpoint definitions
│   │   ├── routes.ts          # Frontend route definitions
│   │   └── profile.ts         # Profile constants
│   │
│   ├── contexts/              # React contexts
│   │   └── auth-context.tsx   # Authentication context
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── queries/           # React Query hooks (11 files)
│   │   │   ├── use-announcements.ts
│   │   │   ├── use-auth.ts
│   │   │   ├── use-branches.ts
│   │   │   ├── use-comments.ts
│   │   │   ├── use-departments.ts
│   │   │   ├── use-employees.ts
│   │   │   ├── use-executive-members.ts
│   │   │   ├── use-knowledge-folders.ts
│   │   │   ├── use-new-hire.ts
│   │   │   ├── use-polls.ts
│   │   │   └── use-roles.ts
│   │   ├── use-debounce.ts    # Debounce utility
│   │   └── use-mobile.ts      # Mobile detection
│   │
│   ├── lib/                   # Utility libraries
│   │   ├── api.ts             # Axios instance with interceptors
│   │   ├── api-caller.ts      # Generic API caller function
│   │   ├── cookies.ts         # Cookie management
│   │   ├── image-utils.ts     # Image utilities
│   │   ├── pagination-utils.ts # Pagination helpers
│   │   ├── profile-utils.ts   # Profile utilities
│   │   ├── query-utils.ts     # React Query utilities
│   │   └── utils.ts           # General utilities (cn, getApiBaseUrl)
│   │
│   ├── services/              # API service functions
│   │   ├── announcements.ts
│   │   ├── auth.ts
│   │   ├── branches.ts
│   │   ├── comments.ts
│   │   ├── departments.ts
│   │   ├── employees.ts
│   │   ├── executive-members.ts
│   │   ├── knowledge-folders.ts
│   │   ├── new-hire.ts
│   │   ├── polls.ts
│   │   └── roles.ts
│   │
│   ├── types/                 # TypeScript type definitions
│   │   ├── announcements.ts
│   │   ├── api.ts             # API request/response types
│   │   ├── auth.ts
│   │   ├── branches.ts
│   │   ├── comments.ts
│   │   ├── common.ts          # Shared types (Pagination, Branch, etc.)
│   │   ├── components.ts
│   │   ├── departments.ts
│   │   ├── employees.ts
│   │   ├── executive-members.ts
│   │   ├── knowledge-base.ts
│   │   ├── new-hire.ts
│   │   ├── polls.ts
│   │   └── roles.ts
│   │
│   └── middleware.ts          # Next.js middleware (auth protection)
│
├── next.config.ts             # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies
└── README.md
```

## Architecture Patterns

### 1. **API Layer Architecture**

#### API Client (`lib/api.ts`)
- Centralized Axios instance with interceptors
- Automatic token attachment to requests
- Token refresh on 401 errors with request queuing
- Automatic redirect to login on auth failure
- Error handling for various HTTP status codes

#### API Caller (`lib/api-caller.ts`)
- Generic wrapper around Axios instance
- Supports both JSON and FormData
- Handles Content-Type headers automatically

#### Services Layer (`services/`)
- Domain-specific service functions
- Each service file corresponds to a domain (auth, employees, etc.)
- Functions call `apiCaller` with appropriate endpoints from `API_ROUTES`

### 2. **Data Fetching Pattern**

#### React Query Hooks (`hooks/queries/`)
- Custom hooks wrapping `useQuery` and `useMutation`
- Consistent patterns:
  - Normalized query keys using `normalizeParams`
  - Debounced search terms
  - Pagination support
  - Placeholder data for smooth transitions
  - Configurable stale time and cache time

#### Example Pattern:
```typescript
export function useResource(
  params?: Record<string, string | number | boolean>,
  pagination?: { page?: number; pageSize?: number }
) {
  const normalizedParams = useMemo(() => normalizeParams(params), [JSON.stringify(params)]);
  
  return useQuery({
    queryKey: ["resource", normalizedParams, pagination],
    queryFn: () => serviceFunction(params, pagination),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}
```

### 3. **Authentication Flow**

#### Middleware Protection (`middleware.ts`)
- Protects dashboard routes
- Redirects unauthenticated users to login
- Redirects authenticated users away from auth pages

#### Auth Context (`contexts/auth-context.tsx`)
- Provides user state across the app
- Handles token refresh
- Listens for auth events
- Exposes `useAuth()` hook

#### Token Management
- Tokens stored in HTTP-only cookies
- Automatic refresh via API interceptor
- Request queuing during token refresh

### 4. **Routing Structure**

#### Route Groups
- `(auth)` - Authentication pages with special layout
- `(dashboard)` - Protected dashboard pages with navbar

#### Route Constants (`constants/routes.ts`)
- Centralized route definitions
- Type-safe navigation

### 5. **Component Organization**

#### Feature-Based Components
- Components organized by feature/domain
- Shared components in `common/`
- UI primitives in `ui/` (shadcn/ui)

#### Component Patterns
- Client components marked with `"use client"`
- Server components by default (Next.js App Router)
- Form components use React Hook Form + Zod

### 6. **Type Safety**

#### Type Definitions (`types/`)
- Domain-specific types in separate files
- Common types in `common.ts`
- API types in `api.ts`

#### Type Patterns
- Consistent naming: `ResourceListResponse`, `Resource`, etc.
- Pagination types standardized
- API request/response types separated

## Key Features

### 1. **Authentication & Authorization**
- JWT-based authentication
- Token refresh mechanism
- Protected routes via middleware
- User context with profile data

### 2. **Dashboard Features**
- Home dashboard with announcements
- Company Hub (announcements & polls)
- Knowledge Base (folder structure)
- People Directory
- Training Checklists
- Executive Management
- User Profile Management

### 3. **Data Management**
- Pagination support throughout
- Search functionality with debouncing
- Filtering capabilities
- Real-time updates via React Query

### 4. **UI/UX Features**
- Responsive design (mobile-first)
- Rich text editor (TipTap)
- Image upload and cropping
- Drag and drop (for checklists)
- Toast notifications
- Loading states and skeletons
- Error handling

## Configuration

### Environment Variables
- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL

### Next.js Config (`next.config.ts`)
- Image optimization with remote patterns
- API proxy rewrites for development/production
- Different configs for dev/prod environments

### API Proxy
- Development: Proxies to `http://127.0.0.1:8000`
- Production: Proxies to `https://api.lordevs.com`

## Development Workflow

### Scripts
- `pnpm dev` - Development server with Turbopack
- `pnpm build` - Production build with Turbopack
- `pnpm start` - Production server
- `pnpm lint` - ESLint

### Package Manager
- Uses **pnpm** (version 10.20.0)

## Code Quality

### TypeScript
- Strict mode enabled
- Path aliases (`@/*` → `./src/*`)
- Type-safe API calls

### Linting
- ESLint with Next.js config
- TypeScript checking

## Data Flow

1. **User Action** → Component
2. **Component** → React Query Hook
3. **Hook** → Service Function
4. **Service** → API Caller
5. **API Caller** → Axios Instance
6. **Axios** → Backend API (with interceptors)
7. **Response** → Service → Hook → Component
8. **Component** → UI Update

## Security Features

- HTTP-only cookies for tokens
- Automatic token refresh
- Protected routes via middleware
- CSRF protection (SameSite cookies)
- Secure API communication

## Performance Optimizations

- React Query caching (1 min stale time, 5 min cache time)
- Placeholder data for smooth transitions
- Debounced search inputs
- Image optimization via Next.js Image
- Code splitting via Next.js App Router
- Turbopack for faster builds

## Testing & Development Tools

- React Query DevTools
- TypeScript for type checking
- ESLint for code quality

---

This codebase follows modern React/Next.js best practices with a clear separation of concerns, type safety, and scalable architecture patterns.

