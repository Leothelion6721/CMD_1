const { ipcRenderer } = require('electron');
const { Terminal } = require('@xterm/xterm');
const { FitAddon } = require('@xterm/addon-fit');
const { SearchAddon } = require('@xterm/addon-search');
const { WebLinksAddon } = require('@xterm/addon-web-links');
const { WebglAddon } = require('@xterm/addon-webgl');
const { Unicode11Addon } = require('@xterm/addon-unicode11');

class AdvancedTerminal {
  constructor() {
    this.tabs = new Map();
    this.activeTabId = null;
    this.tabCounter = 0;
    this.fontSize = 14;
    this.fontFamily = 'Consolas, "Courier New", monospace';

    this.theme = {
      background: '#0c0c0c',
      foreground: '#cccccc',
      cursor: '#ffffff',
      cursorAccent: '#000000',
      selection: 'rgba(255, 255, 255, 0.3)',
      black: '#0c0c0c',
      red: '#c50f1f',
      green: '#13a10e',
      yellow: '#c19c00',
      blue: '#0037da',
      magenta: '#881798',
      cyan: '#3a96dd',
      white: '#cccccc',
      brightBlack: '#767676',
      brightRed: '#e74856',
      brightGreen: '#16c60c',
      brightYellow: '#f9f1a5',
      brightBlue: '#3b78ff',
      brightMagenta: '#b4009e',
      brightCyan: '#61d6d6',
      brightWhite: '#f2f2f2'
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.createTab();
  }

  setupEventListeners() {
    document.getElementById('new-tab-btn').addEventListener('click', () => this.createTab());

    ipcRenderer.on('new-tab', () => this.createTab());
    ipcRenderer.on('close-tab', () => this.closeTab(this.activeTabId));
    ipcRenderer.on('split-horizontal', () => this.splitPane('horizontal'));
    ipcRenderer.on('split-vertical', () => this.splitPane('vertical'));
    ipcRenderer.on('zoom-in', () => this.adjustFontSize(1));
    ipcRenderer.on('zoom-out', () => this.adjustFontSize(-1));
    ipcRenderer.on('zoom-reset', () => this.resetFontSize());
    ipcRenderer.on('find', () => this.toggleSearch());
    ipcRenderer.on('copy', () => this.copySelection());
    ipcRenderer.on('paste', () => this.pasteToTerminal());

    ipcRenderer.on('terminal-data', (event, { id, data }) => {
      const tab = this.tabs.get(id);
      if (tab && tab.terminal) {
        tab.terminal.write(data);
      }
    });

    ipcRenderer.on('terminal-exit', (event, { id }) => {
      this.closeTab(id);
    });

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this.searchNext();
      } else if (e.key === 'Escape') {
        this.toggleSearch();
      } else {
        this.performSearch();
      }
    });

    document.getElementById('search-prev').addEventListener('click', () => this.searchPrev());
    document.getElementById('search-next').addEventListener('click', () => this.searchNext());
    document.getElementById('search-close').addEventListener('click', () => this.toggleSearch());

    window.addEventListener('resize', () => {
      this.tabs.forEach(tab => {
        if (tab.fitAddon) {
          setTimeout(() => {
            tab.fitAddon.fit();
            this.resizeTerminal(tab.id, tab.fitAddon.proposeDimensions());
          }, 50);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      // Don't handle shortcuts if typing in search
      if (e.target.id === 'search-input') return;

      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        this.createTab();
      } else if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        this.closeTab(this.activeTabId);
      } else if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        this.toggleSearch();
      } else if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        this.splitPane('horizontal');
      } else if (e.ctrlKey && e.shiftKey && e.key === 'V') {
        e.preventDefault();
        this.splitPane('vertical');
      } else if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        this.adjustFontSize(1);
      } else if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        this.adjustFontSize(-1);
      } else if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        this.resetFontSize();
      }
    });

    // Handle clicks on terminal area to refocus
    document.getElementById('terminal-container').addEventListener('click', (e) => {
      if (this.activeTabId) {
        const activeTab = this.tabs.get(this.activeTabId);
        if (activeTab && activeTab.terminal) {
          setTimeout(() => activeTab.terminal.focus(), 10);
        }
      }
    });
  }

  createTab(title = null) {
    const tabId = `tab-${this.tabCounter++}`;
    const tabTitle = title || `Terminal ${this.tabCounter}`;

    const tabElement = document.createElement('div');
    tabElement.className = 'tab';
    tabElement.dataset.tabId = tabId;
    tabElement.innerHTML = `
      <span class="tab-title">${tabTitle}</span>
      <button class="tab-close">×</button>
    `;

    tabElement.addEventListener('click', (e) => {
      if (!e.target.classList.contains('tab-close')) {
        this.switchTab(tabId);
      }
    });

    const closeBtn = tabElement.querySelector('.tab-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.closeTab(tabId);
    });

    document.getElementById('tabs-container').appendChild(tabElement);

    const terminalWrapper = document.createElement('div');
    terminalWrapper.className = 'terminal-wrapper';
    terminalWrapper.dataset.tabId = tabId;

    const terminalElement = document.createElement('div');
    terminalElement.className = 'terminal';
    terminalWrapper.appendChild(terminalElement);

    document.getElementById('terminal-container').appendChild(terminalWrapper);

    const terminal = new Terminal({
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      theme: this.theme,
      cursorBlink: true,
      cursorStyle: 'bar',
      scrollback: 10000,
      allowTransparency: false,
      windowsMode: process.platform === 'win32',
      convertEol: true,
      rendererType: 'canvas'
    });

    const fitAddon = new FitAddon();
    const searchAddon = new SearchAddon();
    const webLinksAddon = new WebLinksAddon();
    const unicode11Addon = new Unicode11Addon();

    terminal.loadAddon(fitAddon);
    terminal.loadAddon(searchAddon);
    terminal.loadAddon(webLinksAddon);
    terminal.loadAddon(unicode11Addon);

    terminal.open(terminalElement);

    // Skip WebGL addon for better compatibility
    // Use canvas renderer instead (still fast and reliable)
    // try {
    //   const webglAddon = new WebglAddon();
    //   terminal.loadAddon(webglAddon);
    // } catch (e) {
    //   console.warn('WebGL addon failed to load, falling back to canvas renderer');
    // }

    terminal.unicode.activeVersion = '11';

    fitAddon.fit();

    terminal.onData(data => {
      ipcRenderer.send('terminal-write', { id: tabId, data });
    });

    terminal.onResize(({ cols, rows }) => {
      this.resizeTerminal(tabId, { cols, rows });
    });

    terminal.onTitleChange(title => {
      this.updateTabTitle(tabId, title);
    });

    const dims = fitAddon.proposeDimensions();
    ipcRenderer.sendSync('create-terminal', {
      id: tabId,
      shell: null,
      cwd: null
    });

    this.resizeTerminal(tabId, dims);

    this.tabs.set(tabId, {
      id: tabId,
      element: tabElement,
      wrapper: terminalWrapper,
      terminal: terminal,
      fitAddon: fitAddon,
      searchAddon: searchAddon,
      title: tabTitle
    });

    // Force wrapper to be visible immediately
    terminalWrapper.classList.remove('hidden');

    this.switchTab(tabId);

    // Focus after a short delay to ensure PTY is ready
    setTimeout(() => {
      terminal.focus();
      terminalWrapper.classList.remove('hidden'); // Double-check visibility
      console.log(`Tab ${tabId} created and focused`);
    }, 100);
  }

  switchTab(tabId) {
    if (this.activeTabId === tabId) return;

    this.tabs.forEach((tab, id) => {
      if (id === tabId) {
        tab.element.classList.add('active');
        tab.wrapper.classList.remove('hidden');
        setTimeout(() => {
          tab.terminal.focus();
          if (tab.fitAddon) {
            tab.fitAddon.fit();
            this.resizeTerminal(tab.id, tab.fitAddon.proposeDimensions());
          }
        }, 50);
      } else {
        tab.element.classList.remove('active');
        tab.wrapper.classList.add('hidden');
      }
    });

    this.activeTabId = tabId;
  }

  closeTab(tabId) {
    const tab = this.tabs.get(tabId);
    if (!tab) {
      console.log('Tab not found:', tabId);
      return;
    }

    console.log('Closing tab:', tabId);

    if (this.tabs.size === 1) {
      window.close();
      return;
    }

    tab.element.remove();
    tab.wrapper.remove();
    tab.terminal.dispose();

    ipcRenderer.send('terminal-kill', { id: tabId });

    this.tabs.delete(tabId);

    if (this.activeTabId === tabId) {
      const remainingTabs = Array.from(this.tabs.keys());
      if (remainingTabs.length > 0) {
        this.switchTab(remainingTabs[0]);
      }
    }
  }

  updateTabTitle(tabId, title) {
    const tab = this.tabs.get(tabId);
    if (tab) {
      tab.title = title;
      const titleElement = tab.element.querySelector('.tab-title');
      if (titleElement) {
        titleElement.textContent = title;
      }
    }
  }

  resizeTerminal(tabId, dimensions) {
    if (dimensions && dimensions.cols && dimensions.rows) {
      ipcRenderer.send('terminal-resize', {
        id: tabId,
        cols: dimensions.cols,
        rows: dimensions.rows
      });
    }
  }

  adjustFontSize(delta) {
    this.fontSize = Math.max(8, Math.min(32, this.fontSize + delta));
    this.tabs.forEach(tab => {
      tab.terminal.options.fontSize = this.fontSize;
      if (tab.fitAddon) {
        setTimeout(() => {
          tab.fitAddon.fit();
          this.resizeTerminal(tab.id, tab.fitAddon.proposeDimensions());
        }, 10);
      }
    });
  }

  resetFontSize() {
    this.fontSize = 14;
    this.tabs.forEach(tab => {
      tab.terminal.options.fontSize = this.fontSize;
      if (tab.fitAddon) {
        setTimeout(() => {
          tab.fitAddon.fit();
          this.resizeTerminal(tab.id, tab.fitAddon.proposeDimensions());
        }, 10);
      }
    });
  }

  toggleSearch() {
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');

    if (searchContainer.classList.contains('hidden')) {
      searchContainer.classList.remove('hidden');
      searchInput.focus();
      searchInput.select();
    } else {
      searchContainer.classList.add('hidden');
      const activeTab = this.tabs.get(this.activeTabId);
      if (activeTab) {
        setTimeout(() => activeTab.terminal.focus(), 10);
      }
    }
  }

  performSearch() {
    const activeTab = this.tabs.get(this.activeTabId);
    if (!activeTab) return;

    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value;

    if (searchTerm) {
      activeTab.searchAddon.findNext(searchTerm, {
        incremental: true,
        caseSensitive: false
      });
    }
  }

  searchNext() {
    const activeTab = this.tabs.get(this.activeTabId);
    if (!activeTab) return;

    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value;

    if (searchTerm) {
      activeTab.searchAddon.findNext(searchTerm, {
        caseSensitive: false
      });
    }
  }

  searchPrev() {
    const activeTab = this.tabs.get(this.activeTabId);
    if (!activeTab) return;

    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value;

    if (searchTerm) {
      activeTab.searchAddon.findPrevious(searchTerm, {
        caseSensitive: false
      });
    }
  }

  copySelection() {
    const activeTab = this.tabs.get(this.activeTabId);
    if (activeTab && activeTab.terminal) {
      const selection = activeTab.terminal.getSelection();
      if (selection) {
        require('electron').clipboard.writeText(selection);
      }
    }
  }

  pasteToTerminal() {
    const activeTab = this.tabs.get(this.activeTabId);
    if (activeTab && activeTab.terminal) {
      const text = require('electron').clipboard.readText();
      if (text) {
        activeTab.terminal.paste(text);
      }
    }
  }

  splitPane(direction) {
    console.log(`Split pane: ${direction}`);
    // Advanced feature: To be implemented
    // This would create a split view with multiple terminals in the same tab
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new AdvancedTerminal();
  window.terminalApp = app;
});
