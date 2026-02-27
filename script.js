// ================= MENGATUR JAM =================
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

// ================= LOGIKA WINDOWS =================
let highestZIndex = 10;

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

// ================= BROWSER LOGIC =================
const urlInput = document.getElementById('url-input');
const iframe = document.getElementById('browser-iframe');

urlInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        let url = urlInput.value.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        iframe.src = url;
        urlInput.value = url;
    }
});

function refreshBrowser() {
    iframe.src = iframe.src;
}

// ================= DRAG & DROP =================
function makeDraggable(windowId, titleBarId) {
    const win = document.getElementById(windowId);
    const titleBar = document.getElementById(titleBarId);

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    titleBar.addEventListener('mousedown', (e) => {
        // PENTING: Jangan aktifkan drag jika yang diklik adalah tombol window controls
        if (e.target.closest('.window-controls')) return;
        if (win.classList.contains('maximized')) return; 
        
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

// Terapkan ke jendela
makeDraggable('browser-window', 'browser-title-bar');
makeDraggable('explorer-window', 'explorer-title-bar');