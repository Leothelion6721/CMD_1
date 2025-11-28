# Advanced Terminal

A modern, feature-rich terminal emulator built with Electron and xterm.js, designed to be similar to Windows Terminal but with enhanced advanced features.

## Features

### Core Features
- **Multi-Tab Support** - Open multiple terminal sessions in tabs
- **Multiple Shell Support** - PowerShell, CMD, Bash, Zsh, and more
- **GPU-Accelerated Rendering** - WebGL-powered smooth rendering
- **Unicode & UTF-8 Support** - Full international character support
- **Configurable Profiles** - Create custom profiles for different shells

### Advanced Features
- **Advanced Search** - Regex-enabled search with next/previous navigation
- **Split Panes** - Vertical and horizontal terminal splitting (coming soon)
- **Custom Themes** - 6 built-in themes (Campbell, One Half Dark, Dracula, Solarized Dark, Nord, Tokyo Night)
- **Keyboard Shortcuts** - Extensive keyboard shortcut support
- **Web Links** - Clickable URLs in terminal output
- **Smooth Scrolling** - Enhanced scrolling experience
- **Font Zoom** - Adjust font size on the fly
- **Copy/Paste** - Smart clipboard integration

## Installation

For detailed installation instructions, troubleshooting, and platform-specific guidance:
- **All platforms:** See [INSTALL.md](INSTALL.md)
- **Windows users:** See [WINDOWS-SETUP.md](WINDOWS-SETUP.md) for Visual Studio setup

### Quick Start

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

**Note for Windows:** If you get build errors about "Spectre-mitigated libraries", see [WINDOWS-SETUP.md](WINDOWS-SETUP.md)

## Usage

### Development Mode

```bash
npm run dev
```

This runs the terminal in development mode with DevTools open.

### Production Mode

```bash
npm start
```

### Build Executable

```bash
npm run build
```

This creates platform-specific executables in the `dist/` folder.

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New Tab | `Ctrl+T` |
| Close Tab | `Ctrl+W` |
| Next Tab | `Ctrl+Tab` |
| Previous Tab | `Ctrl+Shift+Tab` |
| Find | `Ctrl+F` |
| Copy | `Ctrl+C` (when text is selected) |
| Paste | `Ctrl+V` |
| Split Horizontal | `Ctrl+Shift+H` |
| Split Vertical | `Ctrl+Shift+V` |
| Zoom In | `Ctrl++` |
| Zoom Out | `Ctrl+-` |
| Reset Zoom | `Ctrl+0` |
| Toggle Full Screen | `F11` |
| Developer Tools | `Ctrl+Shift+I` |

## Configuration

Configuration is stored in `config/default-config.json`. You can customize:

- **Profiles**: Different shell configurations
- **Color Schemes**: Custom color themes
- **Settings**: Terminal behavior and appearance
- **Keybindings**: Custom keyboard shortcuts

### Example Profile

```json
{
  "name": "PowerShell",
  "shell": "powershell.exe",
  "icon": "⚡",
  "colorScheme": "Campbell",
  "fontSize": 14,
  "fontFamily": "Consolas, 'Courier New', monospace",
  "cursorShape": "bar",
  "cursorBlink": true
}
```

### Available Themes

1. **Campbell** - Windows Terminal default
2. **One Half Dark** - Popular dark theme
3. **Dracula** - Eye-friendly dark theme
4. **Solarized Dark** - Classic precision theme
5. **Nord** - Arctic-inspired theme
6. **Tokyo Night** - Modern dark theme

## Project Structure

```
advanced-terminal/
├── src/
│   ├── main/
│   │   └── index.js           # Electron main process
│   └── renderer/
│       ├── index.html          # Main UI
│       ├── app.js              # Terminal application logic
│       └── styles/
│           └── main.css        # Styles
├── config/
│   └── default-config.json     # Configuration
├── assets/
│   └── icon.png                # Application icon
└── package.json
```

## Technologies Used

- **Electron** - Cross-platform desktop framework
- **xterm.js** - Terminal emulator component
- **node-pty** - Pseudo-terminal bindings for Node.js
- **WebGL** - Hardware-accelerated rendering

## Advanced Features (Coming Soon)

- AI-powered command suggestions
- Session saving and restoration
- Command history with fuzzy search
- Integrated file browser
- Git integration in status bar
- Plugin architecture
- Custom command palette
- Terminal broadcasting
- SSH connection management

## Development

### Adding a New Theme

Edit `config/default-config.json` and add your theme to the `colorSchemes` object:

```json
"MyTheme": {
  "name": "MyTheme",
  "background": "#000000",
  "foreground": "#ffffff",
  "cursor": "#ffffff",
  ...
}
```

### Adding a New Profile

Add a profile to the `profiles` array in `config/default-config.json`:

```json
{
  "name": "My Shell",
  "shell": "/path/to/shell",
  "icon": "🚀",
  "colorScheme": "Campbell",
  "fontSize": 14
}
```

## Troubleshooting

### node-pty Build Issues

If you encounter build errors with node-pty:

**Windows:**
```bash
npm install --global windows-build-tools
npm rebuild node-pty
```

**Linux:**
```bash
sudo apt-get install build-essential python3
npm rebuild node-pty
```

**macOS:**
```bash
xcode-select --install
npm rebuild node-pty
```

### Terminal Not Starting

- Check that your shell path is correct in the profile
- Verify that the shell executable exists
- Check the DevTools console for error messages

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License - See LICENSE file for details

## Credits

- Built with [Electron](https://electronjs.org/)
- Terminal powered by [xterm.js](https://xtermjs.org/)
- PTY support via [node-pty](https://github.com/microsoft/node-pty)

## Comparison to Windows Terminal

This terminal includes all the core features of Windows Terminal:

✅ Multiple tabs
✅ Multiple shell support
✅ GPU-accelerated rendering
✅ Custom themes
✅ Configurable profiles
✅ Unicode support
✅ Search functionality
✅ Keyboard shortcuts

**Plus additional advanced features:**
- Enhanced search with regex
- More built-in themes
- Cross-platform support (Windows, macOS, Linux)
- Extensible configuration system
- Modern Electron-based architecture

---

**Enjoy your Advanced Terminal!** 🚀
