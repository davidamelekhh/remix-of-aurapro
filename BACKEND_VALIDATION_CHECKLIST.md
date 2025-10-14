# ✅ Aura Pro - Backend Validation Checklist

**Use this checklist to manually validate all security measures are working correctly.**

---

## 🔐 **1. AUTHENTICATION FLOWS**

### Promoter Registration
- [ ] Go to `/auth/promoteur`
- [ ] Click "S'inscrire"
- [ ] Fill: Name, Company, Email, Password (min 6 chars)
- [ ] Submit → Should create account and auto-login
- [ ] Verify redirected to `/pro/dashboard`
- [ ] Check user_roles table → role should be 'pro'
- [ ] Check profiles table → company_name should be set

### Promoter Login
- [ ] Log out if logged in
- [ ] Go to `/auth/promoteur`
- [ ] Enter valid credentials
- [ ] Submit → Should login successfully
- [ ] Verify redirected to `/pro/dashboard`

### Client Login
- [ ] Have promoter create a client first (see step 3)
- [ ] Log out
- [ ] Go to `/auth/client`
- [ ] Enter client credentials
- [ ] Submit → Should login successfully
- [ ] Verify redirected to `/client/dashboard`

### Wrong Role Access
- [ ] Login as promoter
- [ ] Try to access `/client/dashboard`
- [ ] Should be automatically logged out
- [ ] Should show error message about wrong access
- [ ] Same test with client trying `/pro/dashboard`

---

## 👥 **2. CLIENT MANAGEMENT (PROMOTER)**

### Create Client
- [ ] Login as promoter
- [ ] Go to `/pro/clients`
- [ ] Click "Nouveau client"
- [ ] Fill: Name, Email, Phone, Password
- [ ] Submit → Should create client
- [ ] Verify client appears in list
- [ ] Check clients table → owner_id = your user ID
- [ ] Check user_roles table → new client has role 'client'

### Duplicate Email Prevention
- [ ] Try to create client with existing email
- [ ] Should show error: "Un client avec cet email existe déjà"
- [ ] Verify no duplicate created

### Client List
- [ ] View clients list
- [ ] Should only show YOUR clients
- [ ] Create second promoter account
- [ ] Login as second promoter
- [ ] Should NOT see first promoter's clients

---

## 🏗️ **3. PROJECT MANAGEMENT**

### Create Project
- [ ] Login as promoter
- [ ] Go to `/pro/projects/new`
- [ ] Fill all required fields
- [ ] Submit → Should create project
- [ ] Verify project appears in dashboard
- [ ] Check projects table → owner_id = your user ID

### Edit Project
- [ ] Go to project detail page
- [ ] Click edit project
- [ ] Modify fields
- [ ] Save → Changes should persist
- [ ] Refresh page → Changes still there

### Delete Project
- [ ] Create test project
- [ ] Delete project
- [ ] Verify project removed from list
- [ ] Check property_units table → units deleted (CASCADE)
- [ ] Check project_updates table → updates deleted (CASCADE)
- [ ] Check payment_schedules table → payments deleted (CASCADE)
- [ ] Check project_clients table → assignments deleted (CASCADE)

### Cross-Tenant Access
- [ ] Login as promoter A
- [ ] Note a project ID
- [ ] Login as promoter B
- [ ] Try to access promoter A's project via URL
- [ ] Should get error or empty page (RLS blocks access)

---

## 🏢 **4. UNIT MANAGEMENT**

### Create Unit
- [ ] Go to project detail
- [ ] Click "Ajouter un lot"
- [ ] Fill: Unit number, type, surface, price
- [ ] Submit → Should create unit
- [ ] Verify unit appears in list

### Unique Unit Number
- [ ] Try to create unit with duplicate unit_number
- [ ] Should fail (unique constraint)

### Delete Unit
- [ ] Delete a unit
- [ ] Verify removed from list
- [ ] Check project_clients table → assignments removed (CASCADE)

---

## 🔗 **5. CLIENT ASSIGNMENT**

### Assign Client to Unit
- [ ] Go to project with units
- [ ] Click "Assigner un client" on a unit
- [ ] Select a client
- [ ] Submit → Should create assignment
- [ ] Verify client shows as assigned

### One Client Per Unit
- [ ] Try to assign second client to same unit
- [ ] Should fail (unique constraint)

### Client Can See Project
- [ ] Login as assigned client
- [ ] Go to `/client/dashboard`
- [ ] Should see assigned project
- [ ] Should see assigned unit details

### Client Cannot See Other Projects
- [ ] Create project without assigning this client
- [ ] Client should NOT see unassigned project
- [ ] Verify isolation

---

## 💳 **6. PAYMENT SCHEDULES**

### Create Payment
- [ ] Go to project detail → Updates tab
- [ ] Click "Ajouter un paiement"
- [ ] Fill: Title, Amount, Due date, Client (optional)
- [ ] Submit → Should create payment
- [ ] Verify appears in payment list

### Client Can See Their Payments
- [ ] Assign payment to specific client
- [ ] Login as that client
- [ ] Should see payment in their dashboard
- [ ] Should NOT see payments for other clients

### Amount Validation
- [ ] Try to create payment with negative amount
- [ ] Should fail (CHECK constraint)
- [ ] Try to create payment with 0 amount
- [ ] Should fail (amount > 0)

---

## 📄 **7. DOCUMENTS & FILES**

### Upload Document
- [ ] Go to project detail → Documents tab
- [ ] Click upload
- [ ] Select file
- [ ] Choose visibility (Promoter only / Client & Promoter)
- [ ] Upload → Should succeed
- [ ] Verify document appears in list

### Client Visibility
- [ ] Upload document with "Client & Promoter" visibility
- [ ] Login as assigned client
- [ ] Should see document
- [ ] Upload document with "Promoter only" visibility
- [ ] Client should NOT see it

---

## 🎯 **8. MILESTONES**

### Complete Milestone
- [ ] Go to project detail → Updates tab
- [ ] Click on pending milestone
- [ ] Add description and photos
- [ ] Submit → Should mark milestone complete
- [ ] Verify green checkmark appears
- [ ] Verify project progress updates

### Milestone Assignments
- [ ] Create stakeholders first
- [ ] Click "Intervenants" on milestone
- [ ] Assign stakeholders
- [ ] Save → Should create assignments
- [ ] Verify assignments persist

---

## 👷 **9. STAKEHOLDERS**

### Create Stakeholder
- [ ] Go to `/pro/stakeholders`
- [ ] Click "Ajouter un intervenant"
- [ ] Fill: Name, Role, Company, Contact
- [ ] Submit → Should create stakeholder
- [ ] Verify appears in list

### Stakeholder Isolation
- [ ] Login as promoter A
- [ ] Create stakeholder
- [ ] Login as promoter B
- [ ] Should NOT see promoter A's stakeholders
- [ ] Verify complete isolation

---

## 📊 **10. ANALYTICS**

### View Analytics
- [ ] Go to `/pro/analytics`
- [ ] Should see project statistics
- [ ] Should calculate total revenue correctly
- [ ] Should show paid revenue based on payments
- [ ] Verify all data is only from YOUR projects

---

## 🔒 **11. DATA SECURITY TESTS**

### SQL Injection Protection
- [ ] Try entering SQL in form fields: `'; DROP TABLE projects; --`
- [ ] Should be sanitized/escaped
- [ ] Check database → No damage

### XSS Protection
- [ ] Try entering HTML/JS in text fields: `<script>alert('XSS')</script>`
- [ ] Should be escaped when displayed
- [ ] Should not execute JavaScript

### Direct API Access
- [ ] Open browser DevTools
- [ ] Try to fetch data for other promoter's projects
- [ ] Should fail (RLS policy blocks)

---

## 🚀 **12. PERFORMANCE TESTS**

### Load Test
- [ ] Create 50+ clients
- [ ] Create 20+ projects
- [ ] Create 100+ units
- [ ] Navigate dashboards
- [ ] Should load quickly (< 2 seconds)
- [ ] Check DevTools → Queries should be indexed

### Concurrent Users
- [ ] Login as promoter A
- [ ] Login as promoter B (different browser)
- [ ] Login as client (incognito)
- [ ] All should work simultaneously
- [ ] No data leaks between sessions

---

## 📝 **13. ERROR HANDLING**

### Network Errors
- [ ] Disable internet
- [ ] Try to create project
- [ ] Should show user-friendly error
- [ ] Re-enable internet
- [ ] Retry → Should work

### Validation Errors
- [ ] Submit forms with empty required fields
- [ ] Should show validation errors
- [ ] Should highlight problematic fields
- [ ] Fix errors → Should submit successfully

### Permission Errors
- [ ] Login as client
- [ ] Try to access `/pro/dashboard`
- [ ] Should auto-logout with clear message
- [ ] Should redirect to login

---

## ✅ **FINAL VERIFICATION**

### Database Integrity
```sql
-- Run these queries to verify constraints:

-- Check all tables have RLS enabled
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = false;
-- Should return 0 rows

-- Check foreign key constraints
SELECT tc.table_name, tc.constraint_name
FROM information_schema.table_constraints tc
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public';
-- Should show all expected FK constraints

-- Check unique constraints
SELECT tc.table_name, tc.constraint_name
FROM information_schema.table_constraints tc
WHERE tc.constraint_type = 'UNIQUE'
AND tc.table_schema = 'public';
-- Should show email+owner, unit+project, etc.
```

### Access Control Matrix
| User Type | Projects | Clients | Units | Payments | Documents | Analytics |
|-----------|----------|---------|-------|----------|-----------|-----------|
| Promoter A | Own only | Own only | Own only | Own only | Own only | Own only |
| Promoter B | Own only | Own only | Own only | Own only | Own only | Own only |
| Client A | Assigned | No access | Assigned | Own only | Visible only | No access |
| Client B | Assigned | No access | Assigned | Own only | Visible only | No access |

---

## 🎯 **CHECKLIST SUMMARY**

- [ ] All authentication flows tested
- [ ] Client creation and management tested
- [ ] Project CRUD operations tested
- [ ] Unit management tested
- [ ] Client assignments tested
- [ ] Payment schedules tested
- [ ] Document uploads tested
- [ ] Milestone completion tested
- [ ] Stakeholder management tested
- [ ] Analytics verified
- [ ] Cross-tenant access blocked
- [ ] Data integrity validated
- [ ] Error handling verified
- [ ] Performance acceptable

---

## 📋 **SIGN-OFF**

**Tested by:** _______________  
**Date:** _______________  
**All tests passed:** [ ] YES [ ] NO  
**Issues found:** _______________  
**Production ready:** [ ] YES [ ] NO  

---

**Notes:**
- Any failed test should be documented with reproduction steps
- Critical failures must be fixed before production deployment
- Non-critical issues can be added to backlog
- Re-test after fixes applied
