// ================= MENGATUR JAM DI TASKBAR =================
function updateClock() {
    const now = new Date();
    
    // Format Jam (HH:MM AM/PM)
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Jam '0' menjadi '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const timeString = `${hours}:${minutes} ${ampm}`;

    // Format Tanggal (DD/MM/YYYY)
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateString = `${day}/${month}/${year}`;

    // Update elemen HTML
    document.getElementById('clock').innerHTML = `${timeString}<br>${dateString}`;
}
setInterval(updateClock, 1000);
updateClock(); // Panggil sekali di awal

// ================= LOGIKA BUKA/TUTUP/MAXIMIZE JENDELA =================
const browserWindow = document.getElementById('browser-window');
let isMaximized = false;

function toggleBrowser() {
    // Jika ada class 'hidden', hapus. Jika tidak ada, tambahkan.
    browserWindow.classList.toggle('hidden');
}

function maximizeBrowser() {
    isMaximized = !isMaximized;
    if (isMaximized) {
        browserWindow.classList.add('maximized');
    } else {
        browserWindow.classList.remove('maximized');
    }
}

// ================= LOGIKA DRAG & DROP JENDELA =================
const titleBar = document.getElementById('browser-title-bar');

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

titleBar.addEventListener('mousedown', (e) => {
    // Jangan drag jika sedang di-maximize
    if (isMaximized) return; 

    isDragging = true;
    
    // Hitung posisi klik mouse relatif terhadap pojok kiri atas jendela
    const rect = browserWindow.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    // Hitung posisi baru
    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;

    // Terapkan posisi baru (gunakan absolute px)
    browserWindow.style.left = `${newX}px`;
    browserWindow.style.top = `${newY}px`;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});
