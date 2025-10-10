# MCP Server Recommendations for Wedding Website Project

## Date: October 5, 2025

## Current Setup (12/12 servers - 100% configured!)

✅ **All Configured with Auth:**

- firebase, filesystem, postgres, github, brave-search, memory
- mode-manager, sequential-thinking, fetch, playwright, puppeteer, context7

## Research: Additional MCP Servers (October 2025)

Based on the latest MCP registry, here are servers that could benefit your wedding website project:

### 🎯 Highly Recommended

#### 1. **Sentry MCP** (Error Tracking & Monitoring)

- **Purpose:** Production error tracking, performance monitoring, crash reports
- **Benefit:** Real-time alerts for RSVP failures, photo upload errors, production issues
- **Setup:** `npx -y @sentry/mcp-server`
- **Auth:** SENTRY_AUTH_TOKEN from sentry.io
- **Priority:** HIGH - Essential for production monitoring

#### 2. **Vercel MCP** (Deployment & Hosting)

- **Purpose:** Deploy Next.js app, manage domains, check deployments
- **Benefit:** Deploy from chat, check build status, manage preview URLs
- **Setup:** Would need official Vercel MCP (checking if exists...)
- **Auth:** VERCEL_TOKEN
- **Priority:** MEDIUM - Useful for deployment automation

### 🔧 Potentially Useful

#### 3. **Supabase MCP** (Alternative to Firebase)

- **Purpose:** If you ever migrate from Firebase
- **Benefit:** Similar to Firebase but open-source
- **Setup:** `npx -y @supabase-community/supabase-mcp`
- **Note:** You're already on Firebase, so LOW priority

#### 4. **Resend MCP** (Email Service)

- **Purpose:** Send RSVP confirmations, wedding reminders
- **Benefit:** Email automation for guests
- **Setup:** `npx -y @resend/mcp-server` (if exists)
- **Priority:** MEDIUM - Depends on email needs

#### 5. **Cloudinary MCP** (Image Optimization)

- **Purpose:** Advanced image processing for wedding photos
- **Benefit:** Auto-optimize, resize, transform uploaded images
- **Setup:** `npx -y cloudinary-mcp-server` (if exists)
- **Priority:** LOW - Firebase Storage may be sufficient

### ❌ Not Recommended (Redundant)

- **Postgres alternatives** (you have postgres MCP)
- **File system alternatives** (you have filesystem MCP)
- **Browser automation beyond Playwright/Puppeteer**
- **Alternative search** (you have Brave Search)

## Analysis Summary

### Current Coverage (Excellent!)

Your 12 MCP servers provide:

- ✅ Database (PostgreSQL)
- ✅ Cloud Storage (Firebase)
- ✅ File Access (filesystem)
- ✅ Web Search (Brave)
- ✅ Code Repository (GitHub)
- ✅ Testing (Playwright, Puppeteer)
- ✅ Memory & Reasoning (memory, sequential-thinking)
- ✅ Documentation (fetch, context7)
- ✅ Config Management (mode-manager)

### Coverage Gaps

1. **Error Monitoring** ⚠️ - No Sentry/monitoring
2. **Deployment Automation** ⚠️ - Manual Firebase deployment
3. **Email Services** ⚠️ - No email MCP (may not need)

## Recommendations

### Option 1: Add Sentry Only (Recommended)

**Why:** Production monitoring is critical. Your test suite is 86.4% complete, and you'll deploy soon. Sentry catches production errors that tests miss.

```json
{
  "sentry": {
    "command": "npx",
    "args": ["-y", "@sentry/mcp-server"]
  }
}
```

**Setup:**

1. Sign up at sentry.io (free tier available)
2. Get SENTRY_AUTH_TOKEN
3. Set environment variable
4. Restart VS Code

**Expected Benefit:**

- Real-time error alerts
- Performance monitoring
- User session replay
- Integration with Firebase/Next.js

### Option 2: Minimal (Keep Current 12)

**Why:** Your current setup covers all major needs. Adding more servers increases tool count and complexity.

**Current tool count:** ~60-80 (under 128 limit)
**With Sentry:** ~70-90 (still safe)

### Option 3: Maximum Coverage

Add Sentry + Vercel (if you plan to deploy to Vercel instead of Firebase Hosting)

## Final Recommendation: **Add Sentry MCP Only**

**Reasoning:**

1. Your 12 servers cover development perfectly
2. Missing production monitoring is the main gap
3. Sentry is industry standard for error tracking
4. Free tier works for small projects
5. Won't overload tool limit (128)
6. Easy to set up and test

**Next Steps:**

1. Create Sentry account (sentry.io)
2. Get authentication token
3. Add to mcp.json
4. Set SENTRY_AUTH_TOKEN environment variable
5. Restart VS Code
6. Configure Sentry SDK in Next.js app

---

**Verdict:** You have excellent MCP coverage. Adding Sentry for production monitoring is the only significant gap to fill.

**Current Setup Quality:** 9/10 (missing only production monitoring)
**With Sentry:** 10/10 (complete development + production stack)
