/**
 * jad_kegiatan.js
 * Fitur: Pengelolaan Agenda Kegiatan Non-Akademik & Integrasi Status Presensi
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DATA INITIAL / LOCALSTORAGE
    const DEFAULT_KEGIATAN = [
        {
            id: 'evt-102',
            nama: 'Peringatan HUT Sekolah & Classmeeting',
            kategori: 'Non-KBM / Event',
            tanggal: '2026-09-12',
            jamMulai: '07:30',
            jamSelesai: '13:00',
            lokasi: 'Aula & Area Sekolah',
            impact: 'Override'
        },
        {
            id: 'evt-103',
            nama: 'Latihan Rutin Pramuka Wajib',
            kategori: 'Ekstrakurikuler',
            tanggal: '2026-08-28',
            jamMulai: '14:30',
            jamSelesai: '16:30',
            lokasi: 'Lapangan Belakang',
            impact: 'Luar Jam'
        }
    ];

    let kegiatanList = JSON.parse(localStorage.getItem('school_activities_data')) || DEFAULT_KEGIATAN;

    // 2. DOM ELEMENTS
    const containerList = document.getElementById('kegiatanListContainer');
    const filterKategori = document.getElementById('filterKategori');
    const filterImpact = document.getElementById('filterImpact');
    const searchKegiatan = document.getElementById('searchKegiatan');

    // Modal Elements
    const modalKegiatan = document.getElementById('modalKegiatan');
    const modalTitle = document.getElementById('modalTitle');
    const formKegiatan = document.getElementById('formKegiatan');
    const btnTambahKegiatan = document.getElementById('btnTambahKegiatan');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');

    // Input Form Elements
    const inputId = document.getElementById('kegiatanId');
    const inputNama = document.getElementById('namaKegiatan');
    const inputKategori = document.getElementById('kategoriKegiatan');
    const inputTanggal = document.getElementById('tanggalKegiatan');
    const inputJamMulai = document.getElementById('jamMulai');
    const inputJamSelesai = document.getElementById('jamSelesai');
    const inputLokasi = document.getElementById('lokasiKegiatan');
    const inputImpact = document.getElementById('impactKegiatan');

    // 3. RENDER CARDS KEGIATAN
    function renderKegiatan() {
        if (!containerList) return;

        const katVal = filterKategori ? filterKategori.value : 'all';
        const impVal = filterImpact ? filterImpact.value : 'all';
        const searchVal = searchKegiatan ? searchKegiatan.value.toLowerCase().trim() : '';

        const filtered = kegiatanList.filter(item => {
            const matchKat = katVal === 'all' || item.kategori === katVal;
            const matchImp = impVal === 'all' || item.impact === impVal;
            const matchSearch = item.nama.toLowerCase().includes(searchVal) || item.lokasi.toLowerCase().includes(searchVal);
            return matchKat && matchImp && matchSearch;
        });

        containerList.innerHTML = '';

        if (filtered.length === 0) {
            containerList.innerHTML = `
                <div class="col-span-full bg-white p-8 rounded-2xl border border-borderSoft text-center">
                    <div class="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
                        <i class="fas fa-calendar-xmark"></i>
                    </div>
                    <p class="text-xs font-bold text-textActive">Tidak Ada Kegiatan Ditemukan</p>
                    <p class="text-[11px] text-textMuted mt-1">Coba ubah kata kunci pencarian atau filter kategori Anda.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(item => {
            // Color badges based on category
            let badgeColor = 'bg-blue-50 text-blue-600 border-blue-200';
            if (item.kategori === 'Non-KBM / Event') badgeColor = 'bg-rose-50 text-rose-600 border-rose-200';
            if (item.kategori === 'Ekstrakurikuler') badgeColor = 'bg-emerald-50 text-emerald-600 border-emerald-200';
            if (item.kategori === 'Rapat / Internal') badgeColor = 'bg-amber-50 text-amber-600 border-amber-200';

            const card = document.createElement('div');
            card.className = 'bg-white rounded-2xl border border-borderSoft p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between';
            
            card.innerHTML = `
                <div>
                    <div class="flex items-start justify-between gap-2 mb-3">
                        <span class="text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}">
                            ${item.kategori}
                        </span>
                        <span class="text-[9px] font-semibold px-2 py-0.5 rounded-full border ${item.impact === 'Override' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'}">
                            ${item.impact === 'Override' ? 'Menggantikan KBM' : 'Diluar Jam KBM'}
                        </span>
                    </div>

                    <h3 class="text-sm font-extrabold text-textActive leading-snug mb-2">${item.nama}</h3>

                    <div class="space-y-1.5 text-xs text-textMuted mb-4">
                        <div class="flex items-center gap-2">
                            <i class="far fa-calendar w-4 text-primary"></i>
                            <span>${formatTanggal(item.tanggal)}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="far fa-clock w-4 text-primary"></i>
                            <span>${item.jamMulai} - ${item.jamSelesai} WIB</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="fas fa-location-dot w-4 text-primary"></i>
                            <span class="truncate">${item.lokasi}</span>
                        </div>
                    </div>
                </div>

                <div class="pt-3 border-t border-borderSoft/70 flex items-center justify-between">
                    <button onclick="bukaSesiPresensi('${item.id}')" class="text-[11px] font-bold text-primary hover:underline flex items-center gap-1">
                        <i class="fas fa-clipboard-user text-[10px]"></i> Buka Presensi
                    </button>

                    <div class="flex items-center gap-1">
                        <button onclick="editKegiatan('${item.id}')" class="p-1.5 text-slate-400 hover:text-primary rounded-lg hover:bg-bgSoft transition-colors">
                            <i class="fas fa-pen-to-square text-xs"></i>
                        </button>
                        <button onclick="hapusKegiatan('${item.id}')" class="p-1.5 text-slate-400 hover:text-danger rounded-lg hover:bg-red-50 transition-colors">
                            <i class="fas fa-trash-can text-xs"></i>
                        </button>
                    </div>
                </div>
            `;

            containerList.appendChild(card);
        });
    }

    // 4. SAVE DATA TO LOCALSTORAGE
    function saveData() {
        localStorage.setItem('school_activities_data', JSON.stringify(kegiatanList));
        renderKegiatan();
    }

    // 5. MODAL CONTROL
    function openModal(isEdit = false) {
        modalTitle.innerText = isEdit ? 'Edit Agenda Kegiatan' : 'Tambah Agenda Kegiatan';
        modalKegiatan.classList.remove('hidden');
    }

    function closeModal() {
        modalKegiatan.classList.add('hidden');
        formKegiatan.reset();
        inputId.value = '';
    }

    if (btnTambahKegiatan) btnTambahKegiatan.addEventListener('click', () => openModal(false));
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    // 6. FORM SUBMIT (CREATE & UPDATE)
    formKegiatan.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = inputId.value || 'evt-' + Date.now();
        const payload = {
            id: id,
            nama: inputNama.value,
            kategori: inputKategori.value,
            tanggal: inputTanggal.value,
            jamMulai: inputJamMulai.value,
            jamSelesai: inputJamSelesai.value,
            lokasi: inputLokasi.value,
            impact: inputImpact.value
        };

        const existingIndex = kegiatanList.findIndex(k => k.id === id);

        if (existingIndex > -1) {
            kegiatanList[existingIndex] = payload;
            showToast('Agenda kegiatan berhasil diperbarui!');
        } else {
            kegiatanList.unshift(payload);
            showToast('Agenda kegiatan baru berhasil ditambahkan!');
        }

        saveData();
        closeModal();
    });

    // 7. GLOBAL FUNCTIONS (EDIT, DELETE, REDIRECT PRESENSI)
    window.editKegiatan = function(id) {
        const item = kegiatanList.find(k => k.id === id);
        if (!item) return;

        inputId.value = item.id;
        inputNama.value = item.nama;
        inputKategori.value = item.kategori;
        inputTanggal.value = item.tanggal;
        inputJamMulai.value = item.jamMulai;
        inputJamSelesai.value = item.jamSelesai;
        inputLokasi.value = item.lokasi;
        inputImpact.value = item.impact;

        openModal(true);
    };

    window.hapusKegiatan = function(id) {
        if (confirm('Apakah Anda yakin ingin menghapus agenda kegiatan ini?')) {
            kegiatanList = kegiatanList.filter(k => k.id !== id);
            saveData();
            showToast('Agenda kegiatan berhasil dihapus!', 'warning');
        }
    };

    window.bukaSesiPresensi = function(id) {
        const item = kegiatanList.find(k => k.id === id);
        if (item) {
            showToast(`Membuka modul presensi untuk: ${item.nama}...`, 'info');
            setTimeout(() => {
                window.location.href = `../absensi/presensi_siswa.html?event=${id}`;
            }, 800);
        }
    };

    // 8. UTILITIES
    function formatTanggal(strDate) {
        if (!strDate) return '-';
        const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(strDate).toLocaleDateString('id-ID', options);
    }

    function showToast(msg, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `${type === 'warning' ? 'bg-amber-500' : type === 'info' ? 'bg-primary' : 'bg-slate-800'} text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center justify-between gap-3 transition-all duration-300 pointer-events-auto`;
        toast.innerHTML = `<span>${msg}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // 9. EVENT LISTENERS FILTER
    if (filterKategori) filterKategori.addEventListener('change', renderKegiatan);
    if (filterImpact) filterImpact.addEventListener('change', renderKegiatan);
    if (searchKegiatan) searchKegiatan.addEventListener('input', renderKegiatan);

    // INITIAL RENDER
    renderKegiatan();
});