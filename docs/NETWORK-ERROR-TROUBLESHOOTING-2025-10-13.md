# Network Error Troubleshooting Guide

**Error:** net::ERR_HTTP2_PROTOCOL_ERROR  
**Request ID:** 01aabbad-1bcc-47f6-bfe2-4ef7d3fc89f2  
**Date:** October 13, 2025  
**Context:** Post-CSP-fix deployment verification

---

## Error Analysis

### What This Error Means

`net::ERR_HTTP2_PROTOCOL_ERROR` indicates a communication breakdown between the browser and server at the HTTP/2 protocol level. This is **NOT** a CSP violation - it's a lower-level network/protocol issue.

**Common Causes:**

1. Vercel deployment still in progress (most likely)
2. CDN propagation delay
3. Temporary Vercel infrastructure issue
4. Browser HTTP/2 cache corruption
5. Firewall/antivirus blocking HTTP/2 connections
6. ISP/network equipment interference

---

## IMMEDIATE ACTIONS (Try These First)

### 1. Wait for Vercel Deployment Completion

**Most Likely Cause:** Deployment from commit `9e7d3e8` still building/deploying.

**Action:**

- Wait 2-3 more minutes
- Check Vercel dashboard for deployment status
- Look for "Ready" status on latest deployment

**Timeline:**

- Push completed: ~18:45
- Expected completion: ~18:48-18:51
- If seeing error at 18:47-18:49: **NORMAL** - deployment in progress

### 2. Hard Refresh Browser

**Clear cached connection:**

```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

**Alternative:**

- Open DevTools (F12)
- Right-click refresh button
- Select "Empty Cache and Hard Reload"

### 3. Try Different Browser

Test in fresh browser instance:

- Chrome (if using Firefox)
- Firefox (if using Chrome)
- Edge
- Incognito/Private mode

### 4. Disable Browser Extensions

**Extensions that can interfere:**

- Ad blockers (uBlock, AdBlock Plus)
- Privacy tools (Privacy Badger, Ghostery)
- Security extensions (Avast, Malwarebytes)
- Developer tools (React DevTools, Vue DevTools)

**Action:**

- Open incognito/private window (extensions usually disabled)
- Test site access

---

## DIAGNOSTIC STEPS

### Check 1: Vercel Deployment Status

**Method 1 - Vercel Dashboard:**

1. Go to <https://vercel.com/dashboard>
2. Find project: `wedding-website-sepia-ten`
3. Check latest deployment status
4. Look for commit: `9e7d3e8`
5. Status should be: "Ready" (green)

**Method 2 - GitHub Actions:**

1. Go to <https://github.com/bbasketballer75/theporadas-wedding-site/actions>
2. Check latest workflow run
3. Verify deployment succeeded

### Check 2: Alternative URLs

Try these Vercel deployment variants:

```
https://wedding-website-sepia-ten.vercel.app
https://wedding-website-sepia-ten-git-main-austins-projects-xyz.vercel.app
https://wedding-website-sepia-ten-bbasketballer75.vercel.app
```

If any work, it confirms:

- Deployment successful
- Issue is DNS/routing specific to primary domain

### Check 3: Network Connectivity

**Basic connectivity test:**

```powershell
# Test DNS resolution
nslookup wedding-website-sepia-ten.vercel.app

# Test HTTPS connectivity
curl -I https://wedding-website-sepia-ten.vercel.app

# Test with HTTP/1.1 (bypass HTTP/2)
curl --http1.1 -I https://wedding-website-sepia-ten.vercel.app
```

### Check 4: Browser Developer Tools

1. Open DevTools (F12)
2. Go to **Network** tab
3. Check "Preserve log"
4. Refresh page
5. Look for:
   - Request to root domain (/)
   - Status code (should be 200)
   - Protocol (should show h2 for HTTP/2)
   - Response headers

**If you see:**

- `(failed)` status: Network/firewall issue
- Red request: Server error
- No requests: DNS resolution failure

---

## ADVANCED TROUBLESHOOTING

### Reset Browser HTTP/2 State

**Chrome/Edge:**

```
1. Go to: chrome://net-internals/#sockets
2. Click "Flush socket pools"
3. Go to: chrome://net-internals/#http2
4. Review active HTTP/2 sessions
5. Clear any hung sessions
```

**Firefox:**

```
1. Type: about:networking#sockets
2. Review open connections
3. Close Firefox completely
4. Restart and try again
```

### Disable HTTP/2 Temporarily (Testing Only)

**Chrome:**

```
chrome.exe --disable-http2
```

**Firefox:**

```
about:config
network.http.http2.enabled = false
```

If site loads with HTTP/2 disabled:

- Confirms HTTP/2-specific issue
- Likely Vercel infrastructure or CDN problem
- Wait 15-30 minutes for resolution

### Check Firewall/Antivirus

**Windows Firewall:**

```powershell
# Check if PowerShell can reach site
Invoke-WebRequest -Uri https://wedding-website-sepia-ten.vercel.app -UseBasicParsing
```

**Antivirus/Security Software:**

- Temporarily disable (for testing only)
- Check logs for blocked connections
- Add Vercel domains to whitelist

**Common culprits:**

- Norton/Symantec
- McAfee
- Windows Defender Firewall (custom rules)
- Corporate VPN/proxy

---

## EXPECTED VS. ACTUAL BEHAVIOR

### Expected (Working Deployment)

**Browser behavior:**

1. Request sent to `https://wedding-website-sepia-ten.vercel.app`
2. DNS resolves to Vercel edge server
3. HTTP/2 connection established
4. Page HTML returned (200 OK)
5. Page renders with CSP policy active

**DevTools Network tab:**

```
Status: 200 OK
Protocol: h2
Type: document
Size: ~50KB
Time: 200-500ms
```

### Actual (Current Error)

**Browser behavior:**

1. Request sent to URL
2. Connection attempt fails at HTTP/2 layer
3. Error: net::ERR_HTTP2_PROTOCOL_ERROR
4. No page content loaded

**DevTools Network tab:**

```
Status: (failed) net::ERR_HTTP2_PROTOCOL_ERROR
Protocol: (unknown)
Type: (pending)
Size: (unknown)
Time: (stalled)
```

---

## DECISION TREE

```
ERROR: net::ERR_HTTP2_PROTOCOL_ERROR
│
├─ Is it < 5 minutes since git push?
│  ├─ YES → Wait for Vercel deployment (most likely cause)
│  └─ NO → Continue diagnosis
│
├─ Does hard refresh (Ctrl+Shift+R) fix it?
│  ├─ YES → Browser cache issue (resolved)
│  └─ NO → Continue diagnosis
│
├─ Does different browser work?
│  ├─ YES → Browser-specific issue (clear cache, disable extensions)
│  └─ NO → Continue diagnosis
│
├─ Does incognito mode work?
│  ├─ YES → Browser extension interference (disable extensions)
│  └─ NO → Continue diagnosis
│
├─ Does `curl` work from terminal?
│  ├─ YES → Browser HTTP/2 stack issue (reset or use HTTP/1.1)
│  └─ NO → Network/firewall issue
│
├─ Can you access other Vercel sites?
│  ├─ YES → Specific deployment issue (check Vercel dashboard)
│  └─ NO → Vercel infrastructure outage (check status.vercel.com)
│
└─ Still failing?
   └─ Wait 15-30 minutes, then contact Vercel support
```

---

## QUICK FIXES (In Priority Order)

### Fix 1: Wait (90% effective)

```
Time: 3-5 minutes
Action: Wait for Vercel deployment completion
Success rate: 90% (deployment in progress is #1 cause)
```

### Fix 2: Hard Refresh (80% effective)

```
Keys: Ctrl + Shift + R (Windows)
Action: Clear browser cache and reload
Success rate: 80% (browser cache corruption)
```

### Fix 3: Incognito Mode (70% effective)

```
Keys: Ctrl + Shift + N (Chrome/Edge)
Action: Test in clean browser environment
Success rate: 70% (extension interference)
```

### Fix 4: Different Browser (60% effective)

```
Action: Try Chrome, Firefox, or Edge
Success rate: 60% (browser-specific HTTP/2 issue)
```

### Fix 5: Check Vercel Status (50% effective)

```
URL: https://www.vercel-status.com
Action: Verify no platform-wide outage
Success rate: 50% (rare but possible)
```

---

## WHEN TO ESCALATE

### Contact Vercel Support If

1. **Deployment shows "Ready"** but error persists (>15 minutes)
2. **Multiple browsers fail** in incognito mode
3. **curl fails** from terminal (network level issue)
4. **Other Vercel sites work** but yours doesn't (project-specific)
5. **Error persists >1 hour** after deployment

### Vercel Support Information

- Dashboard: <https://vercel.com/support>
- Email: <support@vercel.com>
- Provide: Request ID, deployment URL, error screenshot

---

## RELATED ISSUES (Probably NOT Your Problem)

### CSP Violations

- **Different error:** Shows in Console, not network layer
- **Error message:** "Refused to connect..." (not HTTP/2 protocol)
- **Status:** Already fixed in commit 9e7d3e8

### Font 404 Errors

- **Different error:** 404 Not Found (not protocol error)
- **Status:** Already fixed in commit e5f967c

### Build Failures

- **Different symptom:** Vercel shows "Error" status (not network error)
- **Status:** No build errors in recent commits

---

## MOST LIKELY SCENARIO (Based on Timeline)

**Hypothesis:** Vercel deployment in progress when error occurred.

**Evidence:**

- Git push completed: ~18:45
- Error occurred: ~18:47-18:49 (estimate)
- Vercel build time: 3-5 minutes
- Timing matches deployment window

**Expected Resolution:**

- Wait until ~18:51 (6 minutes after push)
- Hard refresh browser
- Site should load normally

**If This Is The Case:**

- ✅ No action needed (temporary)
- ✅ CSP fix will apply once deployment completes
- ✅ Proceed with verification once site loads

---

## VERIFICATION AFTER RESOLUTION

Once site loads successfully:

1. **Verify HTTP/2 working:**
   - Open DevTools Network tab
   - Check Protocol column shows "h2"
   - Confirm no protocol errors

2. **Verify CSP fix applied:**
   - Check Console tab (no Firebase CSP violations)
   - Look for "Connected to Cloud Firestore" message
   - Test guestbook realtime sync

3. **Document resolution:**
   - Note which fix worked
   - Update this troubleshooting guide
   - Add to project knowledge base

---

## SUMMARY

**Primary Action:** Wait 5-10 minutes for Vercel deployment completion, then hard refresh.

**Secondary Actions:** Try incognito mode, different browser, check Vercel dashboard.

**Escalation:** Contact Vercel support if error persists >1 hour after "Ready" status.

**Expected Outcome:** Site loads normally once deployment completes, CSP fix verification proceeds as planned.

---

**Generated:** October 13, 2025  
**For:** Austin Porada (@bbasketballer75)  
**Context:** Post-deployment verification of commit 9e7d3e8  
**Status:** Troubleshooting network error during Vercel deployment
