// Theme Management System
const themeToggle = {
    init() {
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('aeronix-theme') || 'light';
        this.setTheme(savedTheme, false);

        // Add event listener to all theme toggle buttons
        const toggleBtns = document.querySelectorAll('.theme-toggle');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => this.toggle());
        });
        this.updateToggleIcon(savedTheme);
    },

    setTheme(theme, save = true) {
        document.documentElement.setAttribute('data-theme', theme);
        if (save) {
            localStorage.setItem('aeronix-theme', theme);
        }
        this.updateToggleIcon(theme);
    },

    toggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    },

    updateToggleIcon(theme) {
        const toggleBtns = document.querySelectorAll('.theme-toggle');
        toggleBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.className = 'bi bi-sun-fill';
                } else {
                    icon.className = 'bi bi-moon-fill';
                }
            }
        });
    }
};

const rtlToggle = {
    init() {
        // Load saved direction or default to ltr
        const savedDir = localStorage.getItem('aerial-dir') || 'ltr';
        this.setDir(savedDir, false);

        // Add event listener to all rtl toggle buttons
        const toggleBtns = document.querySelectorAll('.rtl-toggle');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => this.toggle());
        });
    },

    setDir(dir, save = true) {
        document.documentElement.setAttribute('dir', dir);
        if (save) {
            localStorage.setItem('aerial-dir', dir);
        }
        this.updateToggleUI(dir);
    },

    toggle() {
        const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        this.setDir(newDir);
    },

    updateToggleUI(dir) {
        // Update button text
        const toggleTexts = document.querySelectorAll('.rtl-toggle .rtl-text');
        toggleTexts.forEach(textEl => {
            textEl.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        });

        // Swap Bootstrap CSS for true RTL support
        const bsCss = document.getElementById('bootstrap-css');
        if (bsCss) {
            if (dir === 'rtl') {
                bsCss.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css';
            } else {
                bsCss.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
            }
        }
    }
};

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    themeToggle.init();
    rtlToggle.init();
});
