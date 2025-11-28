# Installation Guide

## Prerequisites

Before installing Advanced Terminal, ensure you have the following installed:

### Required Software

1. **Node.js** (v16 or later)
   - Download from https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Build Tools**

   **Windows:**
   ```bash
   npm install --global windows-build-tools
   ```
   Or install Visual Studio Build Tools manually

   **macOS:**
   ```bash
   xcode-select --install
   ```

   **Linux (Ubuntu/Debian):**
   ```bash
   sudo apt-get update
   sudo apt-get install -y build-essential python3 make g++
   ```

   **Linux (Fedora/RHEL):**
   ```bash
   sudo dnf install -y gcc-c++ make python3
   ```

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

If you encounter network errors during installation, try:

```bash
# Clear npm cache
npm cache clean --force

# Retry installation
npm install

# Or install with verbose logging
npm install --loglevel=verbose
```

### 2. Troubleshooting Common Issues

#### node-pty Build Errors

If you get errors compiling node-pty:

**Windows:**
```bash
npm install --global windows-build-tools
npm rebuild node-pty
```

**macOS:**
```bash
xcode-select --install
npm rebuild node-pty
```

**Linux:**
```bash
sudo apt-get install build-essential python3
npm rebuild node-pty
```

#### Electron Download Issues

If Electron fails to download:

```bash
# Use a different Electron mirror
npm config set electron_mirror https://npmmirror.com/mirrors/electron/
npm install electron

# Or set a proxy if behind corporate firewall
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

#### Permission Errors

On Linux/macOS, if you get permission errors:

```bash
# Don't use sudo with npm install
# Instead fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

### 3. Verify Installation

After successful installation, verify by checking if node_modules exists:

```bash
ls node_modules
```

You should see folders including:
- @xterm
- electron
- node-pty

### 4. Run the Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

## Building Executables

To create standalone executables:

```bash
npm run build
```

This will create platform-specific packages in the `dist/` folder:

- **Windows**: `.exe` installer
- **macOS**: `.dmg` disk image
- **Linux**: `.AppImage` executable

## Platform-Specific Notes

### Windows

- Make sure PowerShell is available (comes with Windows)
- The terminal will default to PowerShell
- You may need to run as Administrator for first build

### macOS

- Xcode Command Line Tools are required
- The app may need to be signed for distribution
- Default shell is Zsh (macOS 10.15+) or Bash (older)

### Linux

- Works on most distributions with X11 or Wayland
- Default shell is typically Bash
- May need additional libraries: `libx11-dev libxkbfile-dev`

## Network Issues

If you're behind a corporate firewall or proxy:

```bash
# Set proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Or use a different registry
npm config set registry https://registry.npmmirror.com

# Then retry installation
npm install
```

## Getting Help

If you encounter issues:

1. Check the error message carefully
2. Search for the error on GitHub Issues
3. Make sure all prerequisites are installed
4. Try clearing npm cache: `npm cache clean --force`
5. Delete `node_modules` and `package-lock.json`, then reinstall

## Alternative Installation (Offline)

If you need to install offline:

1. On a machine with internet, run:
   ```bash
   npm install
   npm pack
   ```

2. Copy the `.tgz` file and `node_modules` folder to the offline machine

3. Extract and use

---

For more information, see the main [README.md](README.md)
