
## Database Security Hardening (NEW - 2026-10-11)

### 12. Environment Security ⚠️ **PENDING**
- ❌ `.env` not in `.gitignore` (credential exposure risk)
- ❌ No `.env.example` template for developers
- ✅ `VITE_API_URL` configured in production env

### 13. Password Hashing ⚠️ **PENDING**
- ❌ Backend uses plain `passwordHash` field without bcrypt/argon2 configuration
- ❌ No `BCRYPT_ROUNDS` environment variable
- ❌ `AuthService` doesn't hash passwords on registration
- ❌ No password comparison utility

### 14. Input Validation Constraints ⚠️ **PENDING**
- ❌ `Order.shippingAddress` fields lack `@db.VarChar(N)` length constraints
- ❌ No server-side address sanitization

### 15. Audit Trail ⚠️ **PENDING**
- ❌ `Order` model lacks `statusChangedBy` and `statusChangedAt` fields
- ❌ No way to trace order status modifications

### 16. Infrastructure Hardening ⚠️ **PENDING**
- ❌ Dockerfile runs as root (should use non-root user)
- ❌ PostgreSQL SSL not configured
- ❌ No query logging for slow queries / audit

### 17. Token Security ⚠️ **PENDING**
- ❌ JWT secret should be rotated via env var
- ❌ Access/refresh token expiration not configured via env
- ❌ No token rotation on refresh

**Implementation Plan**: See `SECURITY-IMPLEMENTATION-PLAN.md` for step-by-step guide.
**Security Analysis**: See `Database-Security-Analysis.md` for detailed audit.
