# RBAC Test Accounts

## Quick Access

| Role | Email | Password | Access Level |
|------|-------|----------|-------------|
| **Admin** | `admin@example.com` | `Admin123!` | Full access (create, edit, delete all) |
| **Editor** | `editor@example.com` | `Editor123!` | Create & edit own articles |
| **Viewer** | `viewer@example.com` | `Viewer123!` | Read-only (published articles) |

## Setup

```bash
cd backend
npm run prisma:seed
```

## Permissions Summary

- **Admin**: Can do everything
- **Editor**: Can create and edit own articles
- **Viewer**: Can only view published articles

## Notes

- Seed script creates 3 sample articles for testing
- Run `npm run prisma:seed` to reset accounts
- These are test accounts - use strong passwords in production

