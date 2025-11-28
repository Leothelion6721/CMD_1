# Windows Setup Guide for Advanced Terminal

## Current Error Fix

You're seeing this error:
```
error MSB8040: Spectre-mitigated libraries are required for this project
```

This is because `node-pty` requires native compilation on Windows.

## Solutions

### Solution 1: Install Spectre-Mitigated Libraries (RECOMMENDED)

1. **Open Visual Studio Installer:**
   - Press Windows key, search for "Visual Studio Installer"
   - Or find it in Start Menu under Visual Studio 2022

2. **Modify Installation:**
   - Click the **Modify** button next to Visual Studio 2022 Community

3. **Add Required Components:**
   - Switch to the **Individual components** tab
   - In the search box, type "Spectre"
   - Check these boxes:
     - ✅ `MSVC v143 - VS 2022 C++ x64/x86 Spectre-mitigated libs (Latest)`
     - ✅ `C++ ATL for latest v143 build tools with Spectre Mitigations (x86 & x64)`
     - ✅ `C++ MFC for latest v143 build tools with Spectre Mitigations (x86 & x64)`

4. **Also Ensure These Are Installed:**
   - ✅ `Desktop development with C++` (Workloads tab)
   - ✅ `Node.js development tools` (optional but helpful)

5. **Install:**
   - Click **Modify** button at bottom right
   - Wait for installation (may take 5-15 minutes)

6. **Retry npm install:**
   ```cmd
   npm install
   ```

### Solution 2: Use Pre-built Binaries (QUICK FIX)

If you don't want to install additional VS components:

```cmd
npm install --force
```

Or try installing node-pty separately with ignore-scripts:

```cmd
npm install node-pty --ignore-scripts
npm install
```

### Solution 3: Use Windows Build Tools Alternative

Install older build tools that don't require Spectre:

```cmd
npm install --global windows-build-tools
npm config set msvs_version 2017
npm install
```

### Solution 4: Disable Spectre Requirement

Create a file `node_modules/node-pty/binding.gyp.patch` and modify the build settings:

```cmd
set npm_config_msvs_version=2022
set GYP_MSVS_VERSION=2022
npm install --node-pty:spectre=false
```

## Step-by-Step: Complete Fresh Install

If you want to start fresh:

1. **Delete existing node_modules:**
   ```cmd
   rmdir /s /q node_modules
   del package-lock.json
   ```

2. **Clear npm cache:**
   ```cmd
   npm cache clean --force
   ```

3. **Install Spectre libraries** (Solution 1 above)

4. **Install dependencies:**
   ```cmd
   npm install
   ```

5. **If still fails, try:**
   ```cmd
   npm install --build-from-source
   ```

## Verification

After successful installation, verify:

```cmd
dir node_modules\node-pty
dir node_modules\electron
dir node_modules\@xterm\xterm
```

All should exist without errors.

## Running the Terminal

Once installed:

```cmd
# Development mode
npm run dev

# Production mode
npm start

# Build executable
npm run build
```

## Common Issues

### Issue: "Cannot find module 'node-pty'"

**Fix:** The native module didn't build. Follow Solution 1 above.

### Issue: "EPERM: operation not permitted"

**Fix:** Close any running instances of the terminal, then:
```cmd
npm cache clean --force
rmdir /s /q node_modules
npm install
```

### Issue: Python not found

**Fix:** Install Python 3.x from python.org, then:
```cmd
npm config set python C:\Users\YourUser\AppData\Local\Programs\Python\Python3XX\python.exe
npm install
```

### Issue: MSBuild errors

**Fix:** Ensure Visual Studio 2022 is properly installed with C++ tools.

## Alternative: Use WSL (Windows Subsystem for Linux)

If native Windows build continues to fail, you can run the terminal in WSL:

1. Install WSL2: `wsl --install`
2. Open Ubuntu (or your preferred distro)
3. Install Node.js in WSL:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs build-essential
   ```
4. Clone repo and run:
   ```bash
   npm install
   npm run dev
   ```

## Need More Help?

1. Check the full error log: `C:\Users\YourUser\AppData\Local\npm-cache\_logs\`
2. Review official node-pty docs: https://github.com/microsoft/node-pty
3. Check Visual Studio installation: Run "Visual Studio Installer" and verify C++ tools

---

**Quick Command Reference:**

```cmd
# Clean install
rmdir /s /q node_modules && del package-lock.json && npm install

# Force rebuild
npm rebuild node-pty

# Verify installation
npm list node-pty

# Check Node/npm versions
node -v && npm -v
```

## Expected Working Environment

- ✅ Windows 10/11
- ✅ Node.js v16+
- ✅ Visual Studio 2022 Community (with C++ and Spectre libs)
- ✅ Python 3.x
- ✅ npm 8+

Good luck! The terminal will work great once node-pty builds successfully.
