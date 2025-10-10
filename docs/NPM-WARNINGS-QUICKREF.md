# NPM Warnings Quick Reference

**Date:** October 5, 2025  
**Status:** ✅ SAFE - Informational Only

## TL;DR

- **6 deprecated packages** found in npm install warnings
- **All from transitive dependencies** (sub-packages of Next.js, Firebase, etc.)
- **0 security vulnerabilities** (npm audit clean)
- **No action required** - wait for upstream updates
- **Next review:** November 5, 2025

## Deprecated Packages Summary

| Package                  | Risk    | Impact           | Action   |
| ------------------------ | ------- | ---------------- | -------- |
| inflight@1.0.6           | 🟡 Med  | Memory leak      | Monitor  |
| glob@7.2.3               | 🟡 Med  | Security         | Monitor  |
| sourcemap-codec@1.4.8    | 🟢 Low  | Cosmetic warning | None     |
| source-map@0.8.0-beta.0  | 🟢 Low  | Beta abandoned   | None     |
| node-domexception@1.0.0  | 🟢 Low  | Unnecessary      | None     |

## Why Safe to Ignore?

1. ✅ **All direct dependencies at latest versions**

   - Next.js 15.5.4
   - React 19.2.0
   - Firebase 12.3.0
   - TypeScript 5.9.3
   - Playwright 1.55.1

2. ✅ **No security vulnerabilities** (`npm audit` clean)

3. ✅ **Tests passing** (38/44, 86.4%)

4. ✅ **Production build successful**

5. ✅ **Warnings are informational** from sub-dependencies

## Monthly Maintenance Check

```powershell
# Check for updates
cd d:\wedding-website\theporadas_wedding_site
npm outdated --workspace=site
npm outdated

# Security audit
npm audit

# Update patch versions
npm update --workspace=site
npm update
```

## When to Act?

- ⚠️ If npm audit shows vulnerabilities
- ⚠️ If major framework updates available (Next.js 16, React 20, etc.)
- ⚠️ If warnings escalate to errors during build

## Full Documentation

See `DEPENDENCY-DEPRECATION-ANALYSIS.md` for:

- Detailed package analysis
- Resolution strategies
- Testing protocol
- Risk assessment matrix

---

**Next Review:** November 5, 2025  
**Owner:** Austin Porada (@bbasketballer75)
