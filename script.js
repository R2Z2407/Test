let globalData = null; // Simpan data JSON di variabel global biar gampang diakses

// --- 1. Accessibility Logic ---
let currentZoom = 100;
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

// --- 2. Swiper Initialization ---
function initSwiper() {
    new Swiper(".mySwiper", {
        loop: true,
        effect: "fade",
        fadeEffect: { crossFade: true },
        autoplay: { delay: 6000, disableOnInteraction: false },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    });
}

// --- 3. Fetch Data ---
async function loadData() {
    try {
        const response = await fetch('db.json');
        if (!response.ok) throw new Error("Gagal mengambil data dari db.json");
        globalData = await response.json(); // Simpan ke global
        renderWeb(globalData);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('hero-swiper-wrapper').innerHTML = `<div class="swiper-slide loading-slide" style="padding: 100px; color: white;">Error: Pastikan web dijalankan di Local Server.</div>`;
    }
}

// --- 4. Render HTML Components ---
function renderWeb(data) {
    // A. Render Hero Slider
    const swiperWrapper = document.getElementById('hero-swiper-wrapper');
    swiperWrapper.innerHTML = ''; 

    data.berita_utama.forEach(berita => {
        const slideHTML = `
            <div class="swiper-slide">
                <img src="${berita.image_url}" alt="${berita.judul}">
                <div class="slide-content">
                    <span class="badge badge-accent">${berita.kategori}</span>
                    <h2>${berita.judul}</h2>
                    <p>${berita.ringkasan}</p>
                </div>
            </div>
        `;
        swiperWrapper.innerHTML += slideHTML;
    });
    
    initSwiper();

    // B. Render Menu Layanan (Sekarang bisa diklik!)
    const menuContainer = document.getElementById('dynamic-menu');
    menuContainer.innerHTML = ''; 

    data.layanan_unggulan.forEach(layanan => {
        // Tambahkan onclick yang memanggil fungsi openModal(id)
        const menuHTML = `
            <div class="menu-item" tabindex="0" role="button" onclick="openModal(${layanan.id})">
                <div class="menu-icon">${layanan.icon}</div>
                <h4>${layanan.nama}</h4>
                <p>${layanan.deskripsi}</p>
            </div>
        `;
        menuContainer.innerHTML += menuHTML;
    });

    // C. Render Footer
    document.getElementById('footer-address').innerText = data.informasi_desa.kontak;
}

// --- 5. Modal / Pop-up Logic ---
const modal = document.getElementById('service-modal');
const btnCloseModal = document.getElementById('btn-close-modal');

// Fungsi buka modal
function openModal(id) {
    // Cari data layanan berdasarkan ID dari globalData
    const layanan = globalData.layanan_unggulan.find(item => item.id === id);
    
    if (layanan) {
        // Isi konten modal
        document.getElementById('modal-icon').innerText = layanan.icon;
        document.getElementById('modal-title').innerText = layanan.nama;
        document.getElementById('modal-desc').innerText = layanan.detail; // Mengambil dari properti 'detail' di JSON
        
        // Tampilkan modal bawaan HTML5 (showModal bikin background otomatis ke-lock)
        modal.showModal();
    }
}

// Fungsi tutup modal (Klik tombol X)
btnCloseModal.addEventListener('click', () => {
    modal.close();
});

// Fungsi tutup modal (Klik area luar modal / backdrop)
modal.addEventListener('click', (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        modal.close();
    }
});

// Eksekusi saat web dimuat
document.addEventListener('DOMContentLoaded', loadData);
