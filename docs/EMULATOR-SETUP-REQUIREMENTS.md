# Firebase Emulator Setup Requirements

## Prerequisites

Firebase emulators require **Java Runtime Environment (JRE) 11 or higher**.

### Check if Java is Installed

```powershell
java -version
```

**Expected output:**

```
java version "11.0.x" (or higher)
Java(TM) SE Runtime Environment
```

### Install Java (If Missing)

**Option 1: OpenJDK (Recommended - Free)**

```powershell
# Using Chocolatey
choco install openjdk11

# OR using winget
winget install Microsoft.OpenJDK.11
```

**Option 2: Oracle JDK**
Download from: <https://www.oracle.com/java/technologies/downloads/>

### Verify Installation

```powershell
java -version
# Should show version 11 or higher

# Ensure java is in PATH
$env:PATH -split ';' | Select-String java
```

### After Installing Java

Restart PowerShell and run:

```powershell
cd f:\wedding-website\site
npm run test:emulator
```

## Alternative: Manual Emulator Start

If automated script fails, start emulators manually:

```powershell
# Terminal 1: Start emulators
cd f:\wedding-website
firebase emulators:start

# Terminal 2: Run tests
cd f:\wedding-website\site
npm run test:integration
```

## Troubleshooting

### Error: "Could not spawn java -version"

**Solution:** Install Java (see above)

### Error: "Port already in use"

**Solution:** Stop existing emulators

```powershell
Get-Process -Name "java" | Where-Object {$_.CommandLine -like "*firebase*"} | Stop-Process
```

### Error: "Firebase CLI not found"

**Solution:** Install Firebase Tools

```powershell
npm install -g firebase-tools
```

## Quick Start Summary

1. **Install Java 11+** (if not installed)
2. **Install Firebase CLI** (if not installed): `npm install -g firebase-tools`
3. **Run tests**: `npm run test:emulator`

---

**Note:** The emulator tests are designed to solve the Playwright context isolation issue by using the Firebase SDK directly. However, they require Java to be installed on your system.
