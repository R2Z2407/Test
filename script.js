let globalData = null;

// Aksesibilitas Font
let currentZoom = 100;
const body = document.getElementById('app-body');
document.getElementById('btn-zoom-in').addEventListener('click', () => {
    if (currentZoom < 130) { currentZoom += 10; body.style.fontSize = `${currentZoom}%`; }
});
document.getElementById('btn-zoom-out').addEventListener('click', () => {
    if (currentZoom > 90) { currentZoom -= 10; body.style.fontSize = `${currentZoom}%`; }
});

// Fetch Data
async function loadData() {
    try {
        const response = await fetch('db.json');
        if (!response.ok) throw new Error("Gagal load JSON");
        globalData = await response.json();
        renderWeb(globalData);
    } catch (error) {
        console.error(error);
    }
}

// Render Konten
function renderWeb(data) {
    // 1. Render Top Info & Footer
    document.getElementById('top-contact').innerText = `📍 ${data.informasi_desa.kontak} | 📞 ${data.informasi_desa.telepon}`;
    
    // 2. Render Stats
    document.getElementById('stat-luas').innerText = data.statistik.luas;
    document.getElementById('stat-populasi').innerText = data.statistik.populasi;
    document.getElementById('stat-rtrw').innerText = data.statistik.rt_rw;

    // 3. Render Vertical Cards (Take Action ala Hinton)
    const servicesContainer = document.getElementById('services-container');
    servicesContainer.innerHTML = '';
    data.layanan_unggulan.forEach(layanan => {
        const cardHTML = `
            <div class="v-card" onclick="openModal(${layanan.id})">
                <img src="${layanan.image_url}" alt="${layanan.nama}">
                <div class="v-card-content">
                    <span class="icon">${layanan.icon}</span>
                    <h4>${layanan.nama}</h4>
                </div>
            </div>
        `;
        servicesContainer.innerHTML += cardHTML;
    });

    // 4. Render Berita
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    data.berita_utama.forEach(berita => {
        const newsHTML = `
            <div class="news-card">
                <img src="${berita.image_url}" alt="${berita.judul}">
                <div class="news-content">
                    <span class="news-date">${berita.tanggal}</span>
                    <h3 class="news-title">${berita.judul}</h3>
                    <a href="#" style="color:var(--accent); font-weight:bold; font-size:14px; text-decoration:none;">Baca Selengkapnya &rarr;</a>
                </div>
            </div>
        `;
        newsContainer.innerHTML += newsHTML;
    });
}

// Modal Logic
const modal = document.getElementById('service-modal');
function openModal(id) {
    const layanan = globalData.layanan_unggulan.find(item => item.id === id);
    if (layanan) {
        document.getElementById('modal-icon').innerText = layanan.icon;
        document.getElementById('modal-title').innerText = layanan.nama;
        document.getElementById('modal-desc').innerText = layanan.detail;
        modal.showModal();
    }
}

document.getElementById('btn-close-modal').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        modal.close();
    }
});

document.addEventListener('DOMContentLoaded', loadData);

// --- 6. Mobile Menu Logic ---
const menuBtn = document.getElementById('mobile-menu-btn');
const mainNav = document.getElementById('main-nav');

menuBtn.addEventListener('click', () => {
    // Toggle class 'active' untuk memunculkan/menyembunyikan menu
    mainNav.classList.toggle('active');
    
    // Ubah ikon tombol jadi X kalau menu lagi kebuka
    if(mainNav.classList.contains('active')){
        menuBtn.innerText = '✕';
    } else {
        menuBtn.innerText = '☰';
    }
});
