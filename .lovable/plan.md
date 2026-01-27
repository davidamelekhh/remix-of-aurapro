
# Plan: Create a Clean Frontend-Only Codebase

## Overview

This plan outlines how to remove all backend (Supabase/Lovable Cloud) dependencies from the codebase to produce a clean frontend that a new developer can use as a foundation to build their own backend.

## Current Backend Dependencies

### Files to Delete Entirely
1. **supabase/** folder - All database migrations, edge functions, and config
2. **src/integrations/supabase/** folder - Client and types files
3. **src/lib/backend-utils.ts** - Backend utility functions using Supabase
4. **.env** file content (can keep empty template)

### Files Requiring Modifications

#### Authentication & Auth Hooks
| File | Changes |
|------|---------|
| `src/hooks/useAuth.tsx` | Replace with mock auth context returning null user |
| `src/hooks/useUserRole.tsx` | Replace with mock role hook |
| `src/components/ProtectedRoute.tsx` | Simplify to just render children or redirect |

#### Auth Pages
| File | Changes |
|------|---------|
| `src/pages/auth/ProAuth.tsx` | Remove Supabase calls, keep form UI with TODO comments |
| `src/pages/auth/ClientAuth.tsx` | Remove Supabase calls, keep form UI with TODO comments |

#### Pro Pages (Promoter/Admin Space)
| File | Changes |
|------|---------|
| `src/pages/pro/ProDashboard.tsx` | Replace data fetching with mock data, keep UI |
| `src/pages/pro/ProProjects.tsx` | Replace data fetching with mock data, keep UI |
| `src/pages/pro/ProProjectNew.tsx` | Remove Supabase insert, keep form UI with TODO |
| `src/pages/pro/ProProjectDetail.tsx` | Large file - replace all Supabase calls with mock data |
| `src/pages/pro/ProClients.tsx` | Replace data fetching with mock data |
| `src/pages/pro/ProClientNew.tsx` | Remove edge function call, keep form UI |
| `src/pages/pro/ProSettings.tsx` | Remove Supabase profile/auth calls, keep UI |
| `src/pages/pro/ProAnalytics.tsx` | Replace data with mock analytics |
| `src/pages/pro/ProStakeholders.tsx` | Replace CRUD with mock data |

#### Client Pages
| File | Changes |
|------|---------|
| `src/pages/client/ClientDashboard.tsx` | Replace data fetching with mock projects |
| `src/pages/client/ClientProjectDetail.tsx` | Replace Supabase calls with mock data |

#### Public Pages
| File | Changes |
|------|---------|
| `src/pages/Landing.tsx` | Remove waitlist Supabase insert, keep form UI |
| `src/pages/Contact.tsx` | Remove contact_submissions insert, keep form |

#### Project Components
| File | Changes |
|------|---------|
| `src/components/project/ExpenseDialog.tsx` | Remove Supabase insert, add TODO |
| `src/components/project/PartnerDialog.tsx` | Remove Supabase insert, add TODO |
| `src/components/project/PaymentDialog.tsx` | Remove Supabase operations, add TODO |
| `src/components/project/PaymentEditDialog.tsx` | Remove Supabase operations, add TODO |
| `src/components/project/MilestonesList.tsx` | Remove Supabase calls |
| `src/components/project/StakeholderAssignDialog.tsx` | Remove Supabase calls |
| `src/components/project/ProjectScheduleCalendar.tsx` | Use props only |

---

## Implementation Steps

### Phase 1: Create Mock Data Layer
Create a new folder `src/lib/mock-data/` with:

```text
src/lib/mock-data/
├── index.ts          (export all)
├── projects.ts       (mock projects array)
├── clients.ts        (mock clients array)  
├── users.ts          (mock user/profile data)
├── milestones.ts     (mock milestones)
├── payments.ts       (mock payment schedules)
├── stakeholders.ts   (mock stakeholders)
├── expenses.ts       (mock expenses)
├── partners.ts       (mock project partners)
└── types.ts          (TypeScript interfaces)
```

### Phase 2: Create Backend Interface Template
Create `src/lib/api/` with interface files for future backend:

```text
src/lib/api/
├── index.ts          (central exports)
├── auth.ts           (auth interface with TODO)
├── projects.ts       (projects CRUD interface)
├── clients.ts        (clients CRUD interface)
├── payments.ts       (payments interface)
└── storage.ts        (file storage interface)
```

Each file will have:
- TypeScript interfaces for data types
- Function stubs with clear TODO comments
- Mock implementation returning sample data

### Phase 3: Update Core Hooks

**useAuth.tsx** - New version:
```typescript
// TODO: Implement with your backend authentication
export function useAuth() {
  // Mock data - replace with real auth
  return {
    user: null,
    session: null, 
    loading: false,
    signOut: async () => {},
    signIn: async (email: string, password: string) => {
      // TODO: Implement authentication
    }
  };
}
```

**useUserRole.tsx** - New version:
```typescript  
// TODO: Implement role checking with your backend
export function useUserRole() {
  return {
    role: 'pro' as const, // Mock for development
    loading: false
  };
}
```

### Phase 4: Update All Pages

For each page:
1. Remove `import { supabase }` statements
2. Import from mock-data instead
3. Replace async fetch calls with mock data loading
4. Add clear TODO comments for backend integration points
5. Keep all UI components intact

Example transformation for ProDashboard.tsx:
```typescript
// BEFORE
const { data: projectsData } = await supabase
  .from('projects')
  .select('*')
  .eq('owner_id', user.id);

// AFTER  
import { mockProjects } from '@/lib/mock-data';
// TODO: Replace with API call to your backend
const projectsData = mockProjects;
```

### Phase 5: Update Backend Utility File

Transform `src/lib/backend-utils.ts`:
- Remove all Supabase imports
- Keep pure utility functions (formatCurrency, formatDate, etc.)
- Remove functions that depend on Supabase
- Add TODO comments for backend-dependent functions

### Phase 6: Clean Up Configuration

**package.json** - Remove (after backup):
- `@supabase/supabase-js`

**.env.example** - Create template:
```bash
# Backend Configuration (add your values)
VITE_API_URL=
VITE_API_KEY=

# Authentication (configure based on your provider)
VITE_AUTH_URL=

# Storage (if using external storage)
VITE_STORAGE_URL=
```

**Add README-BACKEND.md** with:
- Database schema requirements (based on current types.ts)
- Required API endpoints
- Authentication requirements
- Storage requirements

---

## Files Structure After Cleanup

```text
src/
├── assets/                   (unchanged - all images)
├── components/
│   ├── dashboard/           (unchanged - UI only)
│   ├── landing/             (unchanged)
│   ├── layout/              (unchanged)
│   ├── project/             (modified - mock data)
│   └── ui/                  (unchanged - shadcn components)
├── hooks/
│   ├── use-mobile.tsx       (unchanged)
│   ├── use-toast.ts         (unchanged)
│   ├── useAuth.tsx          (modified - mock auth)
│   └── useUserRole.tsx      (modified - mock role)
├── lib/
│   ├── api/                 (NEW - backend interfaces)
│   ├── mock-data/           (NEW - sample data)
│   ├── milestones-config.ts (unchanged)
│   ├── translations.ts      (unchanged)
│   └── utils.ts             (unchanged)
├── pages/                   (modified - using mock data)
├── App.tsx                  (unchanged)
├── App.css                  (unchanged)
├── index.css                (unchanged)
└── main.tsx                 (unchanged)
```

---

## Technical Details for New Developer

### Database Schema Required
Based on current types.ts, the new backend needs these tables:

| Table | Key Fields |
|-------|------------|
| `profiles` | id, full_name, email, company_name, phone |
| `user_roles` | user_id, role (pro/client) |
| `projects` | id, owner_id, name, location, progress, status, phase, dates |
| `property_units` | id, project_id, unit_number, type, surface, price, status |
| `clients` | id, owner_id, name, email, phone, status |
| `project_clients` | project_id, client_id, unit_id |
| `project_milestones` | id, project_id, milestone_key, label, status, progress |
| `project_expenses` | id, project_id, title, amount, category, date |
| `project_partners` | id, project_id, name, email, percentage, role |
| `payment_schedules` | id, project_id, title, amount, due_date, status |
| `project_documents` | id, project_id, file_name, file_path |
| `project_messages` | id, project_id, sender_id, message |
| `stakeholders` | id, owner_id, name, role, company, contact |
| `contact_submissions` | id, name, email, message, subject |

### Authentication Requirements
- Email/password authentication
- Role-based access (pro vs client)
- Session management
- Password reset flow

### File Storage Requirements  
- Project images upload
- Document uploads (PDF, etc.)
- Secure file access

---

## Quality Assurance

After cleanup, the application will:
1. Compile without errors
2. Display all UI with mock data
3. Have clear TODO markers for all backend integration points
4. Maintain full TypeScript type safety
5. Keep all styling and responsive design intact

---

## Deliverables Summary

| Item | Description |
|------|-------------|
| Clean codebase | No Supabase dependencies |
| Mock data layer | Realistic sample data for development |
| API interface templates | Clear contracts for backend implementation |
| Documentation | README-BACKEND.md with schema and requirements |
| Environment template | .env.example with needed variables |
| TypeScript types | Preserved data type definitions |
