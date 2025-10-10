# How to Run PostgreSQL Setup with Admin Rights

## Quick Start (3 Easy Methods)

### Method 1: Right-Click in VS Code (EASIEST)

1. In VS Code Explorer, find the script:

   ```
   scripts/setup-postgresql-elevated.ps1
   ```

2. **Right-click** on the file

3. Select **"Run with PowerShell"**

4. Windows will ask for admin permission - click **"Yes"**

5. Follow the on-screen prompts:
   - Enter a password when asked (e.g., `theporadas2025!`)
   - The script will automatically configure everything

✅ **Done!** The script handles everything automatically.

---

### Method 2: From Windows Explorer

1. Open File Explorer

2. Navigate to:

   ```
   D:\wedding-website\theporadas_wedding_site\scripts\
   ```

3. **Right-click** `setup-postgresql-elevated.ps1`

4. Select **"Run with PowerShell"**

5. Click **"Yes"** when Windows asks for permission

6. Enter your password when prompted

---

### Method 3: From PowerShell (Manual)

1. Press `Win + X` and select **"Windows PowerShell (Admin)"**

2. Navigate to the project:

   ```powershell
   cd D:\wedding-website\theporadas_wedding_site
   ```

3. Run the script:

   ```powershell
   .\scripts\setup-postgresql-elevated.ps1
   ```

4. Enter your password when prompted

---

## What the Script Does Automatically

The script handles everything for you:

1. ✅ Requests admin privileges automatically
2. ✅ Backs up your PostgreSQL configuration
3. ✅ Temporarily enables trust authentication
4. ✅ Restarts PostgreSQL service
5. ✅ Sets your new password securely
6. ✅ Creates the `theporadas_dev` database
7. ✅ Restores secure authentication
8. ✅ Restarts service again
9. ✅ Tests the connection

**Total time:** About 30 seconds

---

## After Running the Script

### Step 1: Update .env File

Open `.env` in the project root and add your password:

```env
PG_URL=postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/theporadas_dev
```

Replace `YOUR_PASSWORD_HERE` with the password you set.

### Step 2: Verify Everything Works

Run the validation script:

```powershell
pwsh -File .\scripts\validate-mcp-servers.ps1
```

You should see:

```
✓ PASS - Database Connection
```

### Step 3: Start MCP Servers

```powershell
pwsh .\scripts\start-mcp-servers.ps1
```

---

## Troubleshooting

### "Execution Policy" Error

If you see an error about execution policy:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try running the script again.

### "Cannot open service" Error

This means PowerShell doesn't have admin rights. Use Method 1 or 3 above to ensure elevation.

### Password Doesn't Work

If the connection fails after setup:

1. The script created a backup at `C:\Program Files\PostgreSQL\17\data\pg_hba.conf.backup-YYYYMMDD-HHMMSS`
2. You can run the script again to set a new password
3. Or manually reset using the instructions in `WINDOWS-NATIVE-SETUP-2025-10-04.md`

### Script Won't Start

If Windows blocks the script:

1. Right-click the script file
2. Select **Properties**
3. Check **"Unblock"** at the bottom
4. Click **OK**
5. Try running again

---

## Security Notes

- ✅ The script uses secure password input (hidden characters)
- ✅ Password is never displayed or logged
- ✅ Original configuration is backed up before changes
- ✅ Secure authentication (scram-sha-256) is restored after setup
- ✅ Script requires explicit administrator elevation

---

## Alternative: Skip PostgreSQL

If you don't need the PostgreSQL MCP server right now:

1. Leave `.env` without the `PG_URL` line
2. Start MCP servers without PostgreSQL:

   ```powershell
   pwsh .\scripts\start-mcp-servers.ps1 -NoPostgres
   ```

You can always run this setup script later when you need database functionality.
