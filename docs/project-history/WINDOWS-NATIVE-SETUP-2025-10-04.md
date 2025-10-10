# Windows-Native Setup (No WSL / No Docker)

This guide documents the fully Windows-native developer environment now recommended for theporadas_wedding_site. Follow these steps to remove WSL/Docker and rely on native Windows services.

---

## 1. Uninstall WSL (Optional Feature Removal)

> **Run the following commands in an elevated PowerShell session (Run as Administrator).**

```powershell
# List any installed WSL distributions (take note if you need to export data first)
wsl --list --verbose

# Optional: export a distribution before removal (replace <DistroName> and path)
wsl --export <DistroName> C:\Backups\<DistroName>.tar

# Unregister all WSL distributions you no longer need
wsl --unregister <DistroName>

# Turn off WSL features
Disable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -NoRestart
Disable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart

# Reboot to finish removal
Restart-Computer
```

Once complete, the `wsl` command will no longer be available and VS Code should no longer prompt to use WSL.

---

## 2. Uninstall Docker Desktop

1. Open **Settings → Apps → Installed apps**.
2. Search for **Docker Desktop**.
3. Click **Uninstall** and follow the wizard.
4. After removal, delete leftover folders if desired:
   - `%ProgramData%\Docker`
   - `%ProgramData%\DockerDesktop`
   - `%LocalAppData%\Docker`
   - `%LocalAppData%\Docker Desktop`
5. Reboot if prompted.

The Windows-native workflow no longer requires Docker containers.

---

## 3. Configure Native PostgreSQL 17

PostgreSQL 17 is already installed under `C:\Program Files\PostgreSQL\17`. Complete the following steps once to finish configuration:

1. **Open an elevated PowerShell prompt** (Run as Administrator).
2. **Temporarily enable trust authentication** to set a password:

   ```powershell
   $pgData = "C:\\Program Files\\PostgreSQL\\17\\data"
   (Get-Content "$pgData\\pg_hba.conf").Replace("scram-sha-256", "trust") | Set-Content "$pgData\\pg_hba.conf"
   Restart-Service postgresql-x64-17
   ```

3. **Set a strong password for the `postgres` role**:

   ```powershell
   psql -h localhost -p 5432 -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD 'theporadas2025!';"
   ```

4. **Restore secure authentication**:

   ```powershell
   (Get-Content "$pgData\\pg_hba.conf").Replace("trust", "scram-sha-256") | Set-Content "$pgData\\pg_hba.conf"
   Restart-Service postgresql-x64-17
   ```

5. **Create the project database** (only needs to happen once):

   ```powershell
   psql -h localhost -p 5432 -U postgres -d postgres -c "CREATE DATABASE theporadas_dev;"
   ```

> Replace `theporadas2025!` with any strong password you prefer. Remember the value for your `.env` file.

---

## 4. Update Project Environment File

1. Copy `.env.example` at the repository root to `.env`.
2. Edit `.env` and update the connection string with the password you set:

   ```env
   PG_URL=postgresql://postgres:theporadas2025!@localhost:5432/theporadas_dev
   ```

3. (Optional) Store additional secrets—Firebase, Supabase—here as required.

The MCP startup script now reads this `.env` file automatically.

---

## 5. Start MCP Servers Natively

From the repository root (`theporadas_wedding_site`):

```powershell
pwsh .\scripts\start-mcp-servers.ps1
```

This launches filesystem, memory, sequential-thinking, puppeteer, Playwright, and Postgres MCP servers using native Windows installations. Ensure PostgreSQL is running before starting the Postgres MCP server.

---

## 6. Validate the Environment

```powershell
pwsh .\scripts\validate-mcp-servers.ps1
```

- Confirms `.env` and installed Node.js tools.
- Attempts a Postgres connection using the `PG_URL` value (warns if service is offline).
- Skips custom MCP builds unless `MCP_SERVER_ROOT` is provided.

---

## 7. VS Code Cleanup

Run the extension cleanup script to remove WSL/Docker-specific extensions:

```powershell
pwsh .\scripts\cleanup-extensions.ps1
```

This ensures VS Code stays aligned with the Windows-native workflow.

---

**Result:** The project now runs entirely on native Windows services—no WSL or Docker required. Keep MCP `.env` credentials updated and re-run the validation script after system changes.
