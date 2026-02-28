// --- 1. Accessibility Logic (Zoom) ---
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
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}

// --- 3. Fetch Data ---
async function loadData() {
    try {
        const response = await fetch('db.json');
        if (!response.ok) throw new Error("Gagal mengambil data dari db.json");
        const data = await response.json();
        renderWeb(data);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('hero-swiper-wrapper').innerHTML = `<div class="swiper-slide loading-slide" style="padding: 100px; color: white;">Error: Pastikan web dijalankan di Local Server.</div>`;
    }
}

// --- 4. Render HTML Components ---
function renderWeb(data) {
    // Render Hero Slider
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
    
    initSwiper(); // Jalankan swiper setelah elemen ada di DOM

    // Render Menu Layanan
    const menuContainer = document.getElementById('dynamic-menu');
    menuContainer.innerHTML = ''; 

    data.layanan_unggulan.forEach(layanan => {
        const menuHTML = `
            <div class="menu-item" tabindex="0" role="button">
                <div class="menu-icon">${layanan.icon}</div>
                <h4>${layanan.nama}</h4>
                <p>${layanan.deskripsi}</p>
            </div>
        `;
        menuContainer.innerHTML += menuHTML;
    });

    // Render Footer
    document.getElementById('footer-address').innerText = data.informasi_desa.kontak;
}

// Eksekusi saat web dimuat
document.addEventListener('DOMContentLoaded', loadData);
