# Windows SDK Update Guide for node-pty ConPTY Errors

## The Problem

You're seeing these errors:
```
error C2065: 'PFNCREATEPSEUDOCONSOLE': undeclared identifier
error C2065: 'PFNRESIZEPSEUDOCONSOLE': undeclared identifier
```

This means the Windows 10 SDK installed with Visual Studio is missing ConPTY API headers.

## Solution 1: Install Windows 10 SDK 10.0.17763.0 or Later (RECOMMENDED)

### Step 1: Open Visual Studio Installer
- Press Windows key → Search "Visual Studio Installer"

### Step 2: Modify Visual Studio 2022
- Click **Modify** on Visual Studio 2022 Community

### Step 3: Install Windows 10 SDK
- Go to **Individual components** tab
- Search for "Windows 10 SDK"
- Make sure these are checked:
  - ✅ **Windows 10 SDK (10.0.19041.0)** or later
  - ✅ **Windows 11 SDK (10.0.22000.0)** (even better)

### Step 4: Also ensure these are installed:
- ✅ **C++ CMake tools for Windows**
- ✅ **Windows Universal CRT SDK**

### Step 5: Click Modify and wait for installation

### Step 6: After installation, try again:
```cmd
rmdir /s /q node_modules
del package-lock.json
npm install
```

## Solution 2: Downgrade to Older node-pty Version

The current node-pty might have compatibility issues. Try an older, more stable version:

```cmd
# Clean install
rmdir /s /q node_modules
del package-lock.json

# Edit package.json to use older node-pty
# Change "node-pty": "^1.0.0" to "node-pty": "0.10.1"

npm install
```

## Solution 3: Use Prebuilt node-pty (QUICKEST FIX)

Skip building from source and use prebuilt binaries:

```cmd
# Clean up
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force

# Install with prebuilt binaries
npm install node-pty@1.1.0-beta17 --force
npm install
```

## Solution 4: Downgrade Node.js Version

Node.js 22.20.0 is very new. node-pty works better with LTS versions:

1. Download Node.js 20.x LTS from https://nodejs.org/
2. Install it
3. Verify: `node -v` (should show v20.x.x)
4. Try again:
   ```cmd
   npm install
   ```

## Solution 5: Use Alternative Package

Instead of building node-pty, we can modify the terminal to work differently:

### Option A: Create a simpler version without node-pty

I can create a version that launches terminals differently without needing node-pty compilation.

### Option B: Use WSL2

Windows Subsystem for Linux doesn't have these build issues:

1. Install WSL2:
   ```cmd
   wsl --install
   ```

2. Open Ubuntu and install:
   ```bash
   sudo apt update
   sudo apt install nodejs npm build-essential
   cd /mnt/e/Project_CMD/CMD_1
   npm install
   npm run dev
   ```

## Quick Test: Which SDK Do You Have?

Check your Windows SDK version:

```cmd
dir "C:\Program Files (x86)\Windows Kits\10\Include"
```

You need version **10.0.17763.0** or higher for ConPTY support.

If you see only older versions (like 10.0.16299.0), you MUST install a newer SDK.

## Recommended Quick Fix Right Now

Try this immediately:

```cmd
npm install node-pty@0.10.1 --save-exact --force
npm install
```

This uses an older node-pty version that might compile better with your setup.

---

**What would you like to try first?**
1. Update Windows SDK (takes 10-15 min)
2. Try older node-pty version (takes 2 min)
3. Use WSL2 (if you have it or want to install)
4. I can create a simplified version without node-pty

Let me know and I'll guide you through it!
