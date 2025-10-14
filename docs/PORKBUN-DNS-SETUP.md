# Porkbun DNS Setup for theporadas.com

## Step-by-Step Instructions

### 1. Log in to Porkbun

Go to: <https://porkbun.com/account/domain>

Find **theporadas.com** in your domain list and click **Details**.

### 2. Access DNS Settings

1. Click on the **DNS** tab (or scroll down to DNS Records section)
2. You'll see a list of existing DNS records

### 3. Delete Conflicting Records (Important!)

**Before adding new records, delete these if they exist:**

- Any **A Record** with Host `@` or blank
- Any **CNAME Record** with Host `www`
- Any records pointing to Porkbun's parking page

To delete: Click the **trash icon** 🗑️ next to each record.

### 4. Add Vercel DNS Records

Click **Add** or **Add Record** button.

#### Record 1: Root Domain (theporadas.com)

```text
Type: A
Host: (leave blank or use @)
Answer: 76.76.21.21
TTL: 600 (default is fine)
```

Click **Add** or **Save**.

#### Record 2: WWW Subdomain (<www.theporadas.com>)

```text
Type: CNAME
Host: www
Answer: cname.vercel-dns.com
TTL: 600 (default is fine)
```

Click **Add** or **Save**.

### 5. Verify Your Records

After adding, you should see:

```text
Type  | Host | Answer
------|------|------------------
A     | @    | 76.76.21.21
CNAME | www  | cname.vercel-dns.com
```

### 6. Add Domain in Vercel

While DNS propagates, add your domain in Vercel:

1. Go to: <https://vercel.com/bbasketballer75s-projects/theporadas-wedding-site/settings/domains>
2. Type `theporadas.com` and click **Add**
3. Also add `www.theporadas.com`
4. Vercel will show "Invalid Configuration" initially - **this is normal**

### 7. Wait for Propagation

- **Porkbun DNS is fast**: Usually 5-15 minutes
- Vercel checks automatically every few minutes
- You'll get an email when SSL certificate is issued

### 8. Set as Primary Domain

Once verified (checkmark appears in Vercel):

1. Find **theporadas.com** in domain list
2. Click three dots ⋯
3. Click **Set as Primary Domain**

## Done! 🎉

Your site will be live at:

- <https://theporadas.com>
- <https://www.theporadas.com>

## Porkbun-Specific Tips

### Check DNS Propagation

Porkbun provides a DNS checker:

1. Go to your domain Details page
2. Click **DNS Checker** tab
3. Enter `theporadas.com` to see if changes are live

### Common Porkbun Issues

**Issue: Can't add CNAME for www**

- Solution: Delete any existing A record for `www` first

**Issue: "This domain is parked" message**

- Solution: Delete all Porkbun parking page records (usually A records pointing to Porkbun IPs)

**Issue: Changes not saving**

- Solution: Make sure you clicked **Add** or **Save** after entering each record

**Issue: Vercel shows "Invalid Configuration" after 30 minutes**

- Check records match exactly (no typos in `76.76.21.21` or `cname.vercel-dns.com`)
- Make sure there are no duplicate records
- Verify you deleted all old/conflicting records

### Porkbun Support

If stuck, Porkbun has excellent support:

- **Email**: <hello@porkbun.com> (usually responds in 1-2 hours)
- **Live Chat**: Available during business hours
- **Knowledge Base**: <https://kb.porkbun.com/>

## Need Help?

Send me a screenshot of your Porkbun DNS records page and I can verify everything is correct!
