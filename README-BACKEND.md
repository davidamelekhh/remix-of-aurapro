# Backend Integration Guide

This document provides complete guidance for implementing the backend for this application.

## Overview

This frontend application was originally built with Supabase but has been converted to use **mock data** and **API interface stubs**. A new developer can implement any backend technology while keeping the existing UI intact.

## Project Structure

```
src/
├── lib/
│   ├── api/                    # API interface functions (TODO: implement)
│   │   ├── auth.ts             # Authentication functions
│   │   ├── projects.ts         # Project CRUD operations
│   │   ├── clients.ts          # Client management
│   │   ├── payments.ts         # Payments, expenses, partners
│   │   ├── stakeholders.ts     # Stakeholder management
│   │   ├── storage.ts          # File upload/download
│   │   └── index.ts            # Central exports
│   └── mock-data/              # Sample data for development
│       ├── types.ts            # TypeScript interfaces
│       ├── projects.ts         # Mock projects & units
│       ├── clients.ts          # Mock clients
│       ├── users.ts            # Mock user data
│       ├── stakeholders.ts     # Mock stakeholders
│       ├── payments.ts         # Mock payment schedules
│       ├── expenses.ts         # Mock expenses
│       ├── partners.ts         # Mock partners
│       ├── milestones.ts       # Mock updates, docs, messages
│       └── index.ts            # Central exports
├── hooks/
│   ├── useAuth.tsx             # Authentication hook (TODO: implement)
│   └── useUserRole.tsx         # User role hook (TODO: implement)
```

## Database Schema Required

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profile information |
| `user_roles` | Role assignments (pro/client) |
| `projects` | Real estate projects |
| `property_units` | Individual units within projects |
| `clients` | Client records |
| `project_clients` | Project-client-unit assignments |
| `project_milestones` | Project milestones/phases |
| `project_configurations` | Conditional milestone settings |
| `project_expenses` | Project expenses tracking |
| `project_partners` | Project partner/investor records |
| `payment_schedules` | Payment milestones |
| `project_documents` | Uploaded documents |
| `project_messages` | Project chat/messages |
| `project_updates` | Project progress updates |
| `stakeholders` | Contractor/vendor contacts |
| `stakeholder_assignments` | Stakeholder-milestone links |
| `contact_submissions` | Contact form submissions |
| `waitlist` | Landing page signups |

### Key Relationships

- `projects.owner_id` → User who owns the project
- `property_units.project_id` → Project containing the unit
- `project_clients` → Links clients to projects and optionally units
- `project_milestones.parent_milestone_id` → For sub-milestones
- All tables with `owner_id` → User who created the record

## Authentication Requirements

1. **Email/Password Authentication**
   - Sign up with email, password, name, company
   - Sign in with email/password
   - Password reset flow

2. **Role-Based Access**
   - `pro` role: Promoters/developers who manage projects
   - `client` role: Buyers who view their assigned projects

3. **Session Management**
   - Persistent sessions
   - Auto token refresh

## API Functions to Implement

All functions are in `src/lib/api/` with TODO comments. Key functions:

### Authentication (`auth.ts`)
- `signIn(email, password)`
- `signUp(email, password, fullName, companyName, phone)`
- `signOut()`
- `getCurrentUser()`
- `getUserRole(userId)`
- `updatePassword(newPassword)`

### Projects (`projects.ts`)
- `getProjects(userId)`
- `getProject(projectId)`
- `createProject(data)`
- `updateProject(projectId, data)`
- `getProjectUnits(projectId)`
- `getProjectMilestones(projectId)`
- `getProjectDocuments(projectId)`
- `uploadDocument(projectId, file)`
- `getProjectMessages(projectId)`
- `sendMessage(projectId, message, senderId)`

### Clients (`clients.ts`)
- `getClients(ownerId)`
- `createClientAccount(name, email, phone, password, ownerId)`
- `getClientProjects(clientEmail)`
- `assignClientToProject(projectId, clientId, unitId)`

### Payments (`payments.ts`)
- `getProjectPayments(projectId)`
- `createPayment(data)`
- `getProjectExpenses(projectId)`
- `createExpense(data)`
- `getProjectPartners(projectId)`
- `createPartner(data)`

### Storage (`storage.ts`)
- `uploadProjectImage(userId, file)`
- `uploadProjectDocument(projectId, file)`
- `downloadFile(filePath)`

## Recommended Backend Options

1. **Supabase** - PostgreSQL + Auth + Storage (original stack)
2. **Firebase** - Firestore + Auth + Storage
3. **AWS** - DynamoDB/RDS + Cognito + S3
4. **Custom Node.js** - Express/Fastify + PostgreSQL + JWT

## Implementation Steps

1. Set up your backend and database
2. Create the database schema (see types in `mock-data/types.ts`)
3. Implement API functions in `src/lib/api/`
4. Update hooks (`useAuth`, `useUserRole`) for your auth provider
5. Remove mock data imports once API is working
6. Configure environment variables

## Environment Variables

Create a `.env` file:

```bash
# Your backend API URL
VITE_API_URL=https://your-api.com

# Authentication configuration
VITE_AUTH_URL=https://your-auth-provider.com

# Storage configuration (if using external storage)
VITE_STORAGE_URL=https://your-storage.com
```

## Testing the UI

The app currently works with mock data. Run `npm run dev` to see the UI with sample data. All functionality is visible but operations (create, update, delete) only log to console.

## Questions?

Each API file has detailed TODO comments explaining what each function should do. The TypeScript interfaces in `mock-data/types.ts` define the exact data structures expected.
