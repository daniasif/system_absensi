document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. LOGIKA UNGGAH & PREVIEW LOGO
    // ==========================================
    const logoInput = document.getElementById('logoInput');
    const uploadLogoBtn = document.getElementById('uploadLogoBtn');
    const logoPreview = document.getElementById('logoPreview');
    const logoPlaceholderIcon = document.getElementById('logoPlaceholderIcon');

    if (uploadLogoBtn && logoInput) {
        uploadLogoBtn.addEventListener('click', () => logoInput.click());
    }

    if (logoInput) {
        logoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (!file.type.match('image.*')) {
                    alert('Harap pilih file gambar (.png, .jpg, .jpeg)');
                    return;
                }
                if (file.size > 2 * 1024 * 1024) {
                    alert('Ukuran file maksimal 2MB!');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function (event) {
                    logoPreview.src = event.target.result;
                    logoPreview.classList.remove('hidden');
                    if (logoPlaceholderIcon) logoPlaceholderIcon.classList.add('opacity-0');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // ==========================================
    // 2. KONDISIONAL STATUS SEKOLAH & YAYASAN
    // ==========================================
    const statusSekolahSelect = document.getElementById('statusSekolahSelect');
    const yayasanInput = document.getElementById('yayasanInput');

    if (statusSekolahSelect && yayasanInput) {
        statusSekolahSelect.addEventListener('change', (e) => {
            if (e.target.value === 'Swasta') {
                yayasanInput.disabled = false;
                yayasanInput.placeholder = "Masukkan Nama Yayasan / Penyelenggara...";
                yayasanInput.classList.remove('bg-slate-100', 'cursor-not-allowed');
                yayasanInput.focus();
            } else {
                yayasanInput.value = "";
                yayasanInput.disabled = true;
                yayasanInput.placeholder = "Khusus untuk Sekolah Swasta";
                yayasanInput.classList.add('bg-slate-100', 'cursor-not-allowed');
            }
        });
    }

    // ==========================================
    // 3. PETA INTERAKTIF LEAFLET & GEOFENCING GPS
    // ==========================================
    const toggleGPS = document.getElementById('toggleGPS');
    const gpsConfigContainer = document.getElementById('gpsConfigContainer');
    const radiusSlider = document.getElementById('radiusSlider');
    const radiusVal = document.getElementById('radiusVal');
    const latitudeInput = document.getElementById('latitudeInput');
    const longitudeInput = document.getElementById('longitudeInput');
    const alamatTextarea = document.getElementById('alamatTextarea');
    const btnGetLocation = document.getElementById('btnGetLocation');

    // Default Koordinat (Jakarta Pusat / Default)
    let defaultLat = -6.175392;
    let defaultLng = 106.827153;

    // Inisialisasi Peta Leaflet
    const map = L.map('map').setView([defaultLat, defaultLng], 15);

    // Tambahkan Tile Layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Tambahkan Marker Interaktif yang bisa di-drag
    const marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);

    // Tambahkan Lingkaran Radius Geofencing
    let currentRadius = radiusSlider ? parseInt(radiusSlider.value) : 60;
    const circle = L.circle([defaultLat, defaultLng], {
        color: '#2563EB',
        fillColor: '#3B82F6',
        fillOpacity: 0.2,
        radius: currentRadius
    }).addTo(map);

    // Fungsi Reverse Geocoding (Koordinat -> Alamat)
    async function fetchAddressFromCoords(lat, lon) {
        if (!alamatTextarea) return;
        alamatTextarea.value = "Mengambil data alamat...";
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
            if (!response.ok) throw new Error();
            const data = await response.json();
            if (data && data.display_name) {
                alamatTextarea.value = data.display_name;
            } else {
                alamatTextarea.value = "";
                alamatTextarea.placeholder = "Alamat tidak ditemukan. Silakan ketik manual.";
            }
        } catch {
            alamatTextarea.value = "";
            alamatTextarea.placeholder = "Gagal mengambil alamat otomatis. Silakan ketik manual.";
        }
    }

    // Fungsi Update Posisi Marker & Peta saat dipilih
    function updateLocation(lat, lng, updateAddress = true) {
        const fixedLat = parseFloat(lat).toFixed(6);
        const fixedLng = parseFloat(lng).toFixed(6);

        if (latitudeInput) latitudeInput.value = fixedLat;
        if (longitudeInput) longitudeInput.value = fixedLng;

        const newLatLng = new L.LatLng(fixedLat, fixedLng);
        marker.setLatLng(newLatLng);
        circle.setLatLng(newLatLng);
        map.panTo(newLatLng);

        if (updateAddress) {
            fetchAddressFromCoords(fixedLat, fixedLng);
        }
    }

    // Event Klik Pada Peta untuk Pilih Lokasi
    map.on('click', (e) => {
        updateLocation(e.latlng.lat, e.latlng.lng);
    });

    // Event Drag Pin Marker
    marker.on('dragend', (e) => {
        const position = marker.getLatLng();
        updateLocation(position.lat, position.lng);
    });

    // Update Manual via Input Latitude & Longitude
    [latitudeInput, longitudeInput].forEach(input => {
        if (input) {
            input.addEventListener('change', () => {
                const lat = parseFloat(latitudeInput.value);
                const lng = parseFloat(longitudeInput.value);
                if (!isNaN(lat) && !isNaN(lng)) {
                    updateLocation(lat, lng);
                }
            });
        }
    });

    // Update Live Radius Geofencing
    if (radiusSlider && radiusVal) {
        radiusSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            radiusVal.textContent = val + " Meter";
            circle.setRadius(parseInt(val));
        });
    }

    // Toggle GPS On/Off
    if (toggleGPS && gpsConfigContainer) {
        toggleGPS.addEventListener('change', (e) => {
            if (e.target.checked) {
                gpsConfigContainer.classList.remove('opacity-40', 'pointer-events-none');
            } else {
                gpsConfigContainer.classList.add('opacity-40', 'pointer-events-none');
            }
        });
    }

    // Ambil Lokasi GPS User (Browser Geolocation)
    if (btnGetLocation) {
        btnGetLocation.addEventListener('click', () => {
            if (!navigator.geolocation) {
                alert('Browser Anda tidak mendukung Geolocation.');
                return;
            }

            btnGetLocation.disabled = true;
            btnGetLocation.innerHTML = `<i class="fas fa-spinner fa-spin mr-1"></i> Mengambil Lokasi...`;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    updateLocation(position.coords.latitude, position.coords.longitude);
                    map.setZoom(17);

                    btnGetLocation.disabled = false;
                    btnGetLocation.innerHTML = `<i class="fas fa-location-crosshairs mr-1"></i> Gunakan Lokasi Saat Ini`;
                },
                (error) => {
                    btnGetLocation.disabled = false;
                    btnGetLocation.innerHTML = `<i class="fas fa-location-crosshairs mr-1"></i> Gunakan Lokasi Saat Ini`;
                    alert('Gagal mengambil lokasi: ' + error.message);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    }
});

// ==========================================
// FUNGSI TOAST NOTIFIKASI RESPONSIIF
// ==========================================
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    // Buat elemen Toast
    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-xs font-medium transform transition-all duration-300 translate-x-10 opacity-0 bg-white`;

    // Warna & Ikon berdasarkan status
    if (type === 'success') {
        toast.classList.add('border-green-200', 'text-slate-800');
        toast.innerHTML = `
            <div class="w-7 h-7 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <i class="fas fa-check"></i>
            </div>
            <div>
                <p class="font-bold text-slate-800">Berhasil!</p>
                <p class="text-slate-500 text-[11px]">${message}</p>
            </div>
        `;
    } else {
        toast.classList.add('border-red-200', 'text-slate-800');
        toast.innerHTML = `
            <div class="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <i class="fas fa-xmark"></i>
            </div>
            <div>
                <p class="font-bold text-slate-800">Gagal!</p>
                <p class="text-slate-500 text-[11px]">${message}</p>
            </div>
        `;
    }

    toastContainer.appendChild(toast);

    // Efek Animasi Masuk
    setTimeout(() => {
        toast.classList.remove('translate-x-10', 'opacity-0');
    }, 10);

    // Efek Hilang Otomatis setelah 3.5 detik
    setTimeout(() => {
        toast.classList.add('translate-x-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ==========================================
// EVENT SIMPAN DATA (SIMULASI LOADING & VALIDASI)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const btnSimpan = document.getElementById('btnSimpan');

    if (btnSimpan) {
        btnSimpan.addEventListener('click', () => {
            // Ubah state tombol jadi Loading
            const originalText = btnSimpan.innerHTML;
            btnSimpan.disabled = true;
            btnSimpan.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menyimpan...`;

            // Simulasi Request ke Backend (Delayed 1.2 Detik)
            setTimeout(() => {
                // Kamu bisa menguji kondisi gagal/berhasil di sini
                const isSuccess = true; // Ubah ke false untuk tes UI saat gagal

                if (isSuccess) {
                    showToast('Data profil instansi berhasil diperbarui.', 'success');
                } else {
                    showToast('Gagal menyimpan data. Periksa koneksi atau inputan.', 'error');
                }

                // Kembalikan state tombol
                btnSimpan.disabled = false;
                btnSimpan.innerHTML = originalText;
            }, 1200);
        });
    }
});