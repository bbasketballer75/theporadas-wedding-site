# Add Supabase to Vercel (Fix Photo Uploads)

## The Issue

Your site shows: "Supabase environment variables are missing. Photo and video upload features are currently disabled."

## The Fix (2 Minutes)

### Step 1: Go to Vercel Environment Variables

Visit: <https://vercel.com/bbasketballer75s-projects/theporadas-wedding-site/settings/environment-variables>

### Step 2: Check if Variables Exist

Look for these two variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3A: If They DON'T Exist - Add Them

Click **Add New** button and add:

**Variable 1:**

```text
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://shegniwzcjkqfsrgvajs.supabase.co
Environments: ✓ Production ✓ Preview ✓ Development
```

**Variable 2:**

```text
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZWduaXd6Y2prcWZzcmd2YWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxMjM3OTYsImV4cCI6MjA0NDY5OTc5Nn0.sb_publishable_Fnh_6F0mDVMaknnWj7qIjA_zeeS5AGJ
Environments: ✓ Production ✓ Preview ✓ Development
```

### Step 3B: If They DO Exist - Update Them

1. Find each variable
2. Click **Edit** (pencil icon)
3. Update the value to match above
4. Save

### Step 4: Redeploy

After adding/updating, Vercel will ask to redeploy. Click **Redeploy** or:

1. Go to: <https://vercel.com/bbasketballer75s-projects/theporadas-wedding-site>
2. Find latest deployment
3. Click three dots **⋯**
4. Click **Redeploy**

Or just push any small change to GitHub and it will auto-deploy.

### Step 5: Verify

After redeployment (2-3 minutes), visit:

- <https://theporadas.com/guestbook>

The yellow warning should be gone and photo uploads should work!

## Why This Happened

Supabase credentials were in your local `.env.local` file but not in Vercel's production environment variables. Vercel deployments don't have access to your local files, so environment variables must be added through the Vercel dashboard.

## Done! 🎉

Once added and redeployed:

- ✅ Photo uploads work
- ✅ Video uploads work  
- ✅ No more yellow warning
- ✅ Supabase 50MB free storage active
