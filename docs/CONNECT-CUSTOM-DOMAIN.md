# Connect Your Custom Domain (theporadas.com)

## Overview

Your wedding website is already live on Vercel's free hosting, but it's using a Vercel subdomain. This guide will connect your custom domain **theporadas.com** so visitors can access your site at your own URL.

## Current Status

- ✅ Website is live: `https://wedding-website-4yudfrkuq-austins-projects-bb7c50ab.vercel.app`
- ✅ Vercel free hosting (unlimited bandwidth, automatic HTTPS)
- ✅ You own theporadas.com
- ❌ Domain not yet connected

## Step-by-Step Instructions

### Step 1: Add Domain in Vercel (2 minutes)

1. Go to your Vercel project: <https://vercel.com/bbasketballer75s-projects/theporadas-wedding-site>
2. Click **Settings** → **Domains**
3. In the "Add Domain" box, type: `theporadas.com`
4. Click **Add**
5. Vercel will also suggest adding `www.theporadas.com` - click **Add** for that too

Vercel will now show you DNS records that need to be configured.

### Step 2: Configure DNS at Your Domain Registrar (3 minutes)

**Where you bought theporadas.com** (GoDaddy, Namecheap, Google Domains, etc.):

1. Log in to your domain registrar
2. Find DNS settings (usually called "DNS Management" or "Nameservers")
3. Add these records:

#### For theporadas.com (root domain)

```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

#### For <www.theporadas.com>

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

### Step 3: Wait for DNS Propagation (5-30 minutes)

- DNS changes take 5-30 minutes to propagate worldwide
- Vercel will automatically verify and issue FREE SSL certificates
- You'll get email confirmation when it's ready

### Step 4: Set Primary Domain (1 minute)

Back in Vercel:

1. Go to Settings → Domains
2. Find **theporadas.com** in the list
3. Click the three dots ⋯ → **Set as Primary Domain**

This makes all other URLs (like the Vercel subdomain) automatically redirect to theporadas.com.

## After Setup

✅ **Your site will be available at:**

- <https://theporadas.com>
- <https://www.theporadas.com>
- Old Vercel URL will redirect automatically

✅ **You get for FREE:**

- Automatic HTTPS (SSL certificate)
- Global CDN (fast loading worldwide)
- Unlimited bandwidth
- Automatic deployments from GitHub
- 99.99% uptime

## Troubleshooting

### "Domain not verified" after 30 minutes

- Check DNS records are exactly as shown above
- Some registrars have a "Proxy" toggle - turn it OFF
- Contact your registrar's support

### "DNS records not found"

- Make sure you're editing the correct domain
- Some registrars show old records - delete conflicting A or CNAME records

### Need help?

- Vercel support: <https://vercel.com/help>
- Your registrar's DNS help docs
- Screenshot your DNS settings and share with support

## What's Next?

Once connected, you can:

1. Share theporadas.com with guests
2. Print it on wedding invitations/cards
3. Post on social media
4. Add to your email signature

Every time you push code to GitHub, Vercel automatically deploys to theporadas.com within 2 minutes!

## Cost: $0 Forever

- ✅ Vercel hosting: FREE (Hobby tier)
- ✅ SSL certificate: FREE (automatic)
- ✅ CDN: FREE (worldwide)
- ✅ Deployments: FREE (unlimited)
- 💰 Domain registration: ~$12/year (you already own it)

No credit card needed for Vercel. Your current domain registration fee is the only cost.
