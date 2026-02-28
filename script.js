// --- 1. Fitur Aksesibilitas (Zoom Text) ---
let currentZoom = 100; // Persentase base
const body = document.getElementById('app-body');

document.getElementById('btn-zoom-in').addEventListener('click', () => {
    if (currentZoom < 130) {
        currentZoom += 10;
        body.style.fontSize = `${currentZoom}%`;
    }
});

document.getElementById('btn-zoom-out').addEventListener('click', () => {
    if (currentZoom > 90) {
        currentZoom -= 10;
        body.style.fontSize = `${currentZoom}%`;
    }
});

// --- 2. Fetching Data dari db.json ---
async function loadDesaData() {
    try {
        // Ambil data dari file db.json lokal
        const response = await fetch('db.json');
        
        // Cek kalau responnya gagal (misal file tidak ditemukan)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        renderData(data);
    } catch (error) {
        console.error("Gagal memuat data:", error);
        document.getElementById('news-container').innerHTML = 
            `<p class="text-red-500">Gagal memuat berita. Pastikan Anda menjalankan web ini di local server.</p>`;
    }
}

// --- 3. Render Data ke DOM ---
function renderData(data) {
    // Render Berita
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ''; // Kosongkan placeholder

    data.berita_terbaru.forEach(berita => {
        const articleCard = `
            <article class="bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-300 transition group cursor-pointer shadow-sm">
                <div class="flex items-center gap-3 mb-3">
                    <span class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">${berita.kategori}</span>
                    <span class="text-slate-400 text-sm font-medium">${berita.tanggal}</span>
                </div>
                <h4 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">${berita.judul}</h4>
                <p class="text-slate-600 text-sm leading-relaxed">${berita.ringkasan}</p>
            </article>
        `;
        newsContainer.innerHTML += articleCard;
    });

    // Render Alamat di Footer
    document.getElementById('footer-address').innerText = data.informasi_desa.kontak;
}

// Jalankan fungsi load data saat halaman selesai di-load
document.addEventListener('DOMContentLoaded', loadDesaData);