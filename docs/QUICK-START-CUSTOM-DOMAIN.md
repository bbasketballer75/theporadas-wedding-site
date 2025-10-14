# Quick Start: Connect theporadas.com (5 Minutes)

## What You Need

- Access to where you bought **theporadas.com** (GoDaddy, Namecheap, Google Domains, etc.)
- Access to your Vercel account (you're already logged in)

## Steps

### 1. Add Domain in Vercel (1 minute)

Visit: <https://vercel.com/bbasketballer75s-projects/theporadas-wedding-site/settings/domains>

1. Type `theporadas.com` in the "Add Domain" box
2. Click **Add**
3. Also add `www.theporadas.com` when prompted
4. Vercel will show you DNS instructions - **keep this page open**

### 2. Update DNS Records (3 minutes)

Log in to your domain registrar (where you bought theporadas.com).

Find "DNS Settings" or "DNS Management" and add these TWO records:

**Record 1 - For theporadas.com**

```dns
Type: A
Name: @ (or blank)
Value: 76.76.21.21
```

**Record 2 - For <www.theporadas.com>**

```dns
Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

Save changes.

### 3. Wait & Verify (5-30 minutes)

- DNS changes take 5-30 minutes to go live
- Vercel will automatically detect and verify
- You'll get an email when ready
- Free SSL certificate is issued automatically

### 4. Set as Primary (1 minute)

Back in Vercel (Settings → Domains):

1. Find **theporadas.com**
2. Click three dots ⋯
3. Click **Set as Primary Domain**

## Done! 🎉

Your site is now live at:

- <https://theporadas.com>
- <https://www.theporadas.com>

Old Vercel URL redirects automatically.

## Need Help?

**Can't find DNS settings?**

- GoDaddy: My Products → Domain → Manage DNS
- Namecheap: Domain List → Manage → Advanced DNS
- Google Domains: My Domains → DNS → Custom Records
- Other: Search "[your registrar] DNS settings"

**Domain not working after 30 minutes?**

1. Check DNS records match exactly (no typos)
2. Delete any old/conflicting A or CNAME records
3. Turn OFF any "Proxy" or "CDN" toggles
4. Contact your registrar's support with screenshot

**Questions?**
Ask me! I can help troubleshoot or create step-by-step screenshots for your specific registrar.
