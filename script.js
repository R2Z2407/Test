// ================= MENGATUR JAM DI TASKBAR =================
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    document.getElementById('clock').innerHTML = `${hours}:${minutes} ${ampm}<br>${day}/${month}/${year}`;
}
setInterval(updateClock, 1000);
updateClock();

// ================= LOGIKA WINDOWS (BUKA, TUTUP, Z-INDEX) =================
let highestZIndex = 10; // Agar jendela yang diklik maju ke depan

function toggleWindow(windowId) {
    const win = document.getElementById(windowId);
    win.classList.toggle('hidden');
    if (!win.classList.contains('hidden')) {
        bringToFront(win);
    }
}

function maximizeWindow(windowId) {
    const win = document.getElementById(windowId);
    win.classList.toggle('maximized');
}

function bringToFront(winElement) {
    highestZIndex++;
    winElement.style.zIndex = highestZIndex;
}

// ================= BROWSER: ADDRESS BAR & IFRAME =================
const urlInput = document.getElementById('url-input');
const iframe = document.getElementById('browser-iframe');

// Berfungsi saat tombol Enter ditekan
urlInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        let url = urlInput.value.trim();
        
        // Tambahkan https:// jika user lupa mengetiknya
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        iframe.src = url;
        urlInput.value = url;
    }
});

// Tombol Refresh
function refreshBrowser() {
    iframe.src = iframe.src;
}

// ================= LOGIKA DRAG & DROP JENDELA =================
function makeDraggable(windowId, titleBarId) {
    const win = document.getElementById(windowId);
    const titleBar = document.getElementById(titleBarId);

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    titleBar.addEventListener('mousedown', (e) => {
        if (win.classList.contains('maximized')) return; // Jangan drag kalau layar penuh
        isDragging = true;
        bringToFront(win);

        const rect = win.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        win.style.left = `${e.clientX - offsetX}px`;
        win.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// Terapkan fungsi drag ke kedua jendela
makeDraggable('browser-window', 'browser-title-bar');
makeDraggable('explorer-window', 'explorer-title-bar');