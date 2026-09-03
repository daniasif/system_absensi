document.addEventListener('DOMContentLoaded', () => {
    // 1. Live Clock & Server Time Banner Logic
    function updateClock() {
        const now = new Date();
        const clockEl = document.getElementById('liveClockDisplay');
        const hariEl = document.getElementById('labelHariAktif');
        
        if (clockEl) clockEl.textContent = now.toLocaleTimeString('id-ID') + ' WIB';
        if (hariEl) {
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            hariEl.textContent = days[now.getDay()];
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 2. Master Data Kelas & Jadwal Mock
    const dataKelasMaster = [
        { id: 1, nama: 'XI MIPA 1', wali: 'Dra. Hj. Siti Aminah', totalSiswa: 25 },
        { id: 2, nama: 'XI MIPA 2', wali: 'Ahmad Dahlan, S.Kom', totalSiswa: 25 },
        { id: 3, nama: 'X IPS 2', wali: 'Eko Prasetyo, M.Pd', totalSiswa: 22 }
    ];

    const databaseJadwal = {
        'XI MIPA 1': [
            { jam: '07:30 - 09:00', mapel: 'Bahasa Indonesia', guru: 'Dra. Hj. Siti Aminah', status: 'Sedang Berlangsung' },
            { jam: '09:15 - 10:45', mapel: 'Matematika Peminatan', guru: 'Budi Santoso, M.Pd', status: 'Akan Datang' },
            { jam: '11:00 - 12:30', mapel: 'Fisika', guru: 'Drs. Supardi', status: 'Akan Datang' }
        ],
        'XI MIPA 2': [
            { jam: '07:30 - 09:00', mapel: 'Informatika', guru: 'Ahmad Dahlan, S.Kom', status: 'Sedang Berlangsung' },
            { jam: '09:15 - 10:45', mapel: 'Bahasa Inggris', guru: 'Nabila, S.Pd', status: 'Akan Datang' }
        ],
        'X IPS 2': [
            { jam: '07:30 - 09:00', mapel: 'Matematika Wajib', guru: 'Eko Prasetyo, M.Pd', status: 'Selesai' },
            { jam: '09:15 - 10:45', mapel: 'Sosiologi', guru: 'Rina Astuti, S.Sos', status: 'Sedang Berlangsung' }
        ]
    };

    // 3. Master Data Kegiatan Luar Jam KBM (Non-KBM)
    const databaseKegiatan = [
        {
            id: 'keg-1',
            nama: 'Upacara Bendera Senin',
            target: 'Seluruh Siswa (Semua Kelas)',
            waktu: '07:00 - 07:30 WIB',
            pj: 'Bpk. Herman, S.Pd (Kesiswaan)',
            status: 'Selesai'
        },
        {
            id: 'keg-2',
            nama: 'Senam Sehat / Kebersihan Lingkungan',
            target: 'Seluruh Siswa (Semua Kelas)',
            waktu: '06:30 - 07:15 WIB',
            pj: 'Tim Pembina Akses Kesehatan',
            status: 'Akan Datang'
        },
        {
            id: 'keg-3',
            nama: 'Ekskul Pramuka Wajib',
            target: 'Kelas X IPS 2',
            waktu: '15:30 - 17:00 WIB',
            pj: 'Kak Danang & Kak Tri',
            status: 'Akan Datang'
        }
    ];

    // 4. Render Card Semua Kelas Terdaftar
    const gridContainer = document.getElementById('gridKelasContainer');
    const selectKelasFilter = document.getElementById('selectKelasFilter');

    function renderCards(filterTingkat = 'Semua') {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';

        const filtered = dataKelasMaster.filter(k => {
            if (filterTingkat === 'Semua') return true;
            if (filterTingkat === 'X') return k.nama.startsWith('X ') || k.nama.startsWith('X-');
            return k.nama.startsWith(filterTingkat);
        });

        filtered.forEach(k => {
            const card = document.createElement('div');
            card.className = "bg-white p-5 rounded-2xl border border-borderSoft shadow-sm hover:shadow-md transition-all space-y-4";
            card.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <span class="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-blue-50 text-primary border border-blue-200">
                            Terdaftar Active
                        </span>
                        <h4 class="text-base font-bold text-textActive mt-2">${k.nama}</h4>
                        <p class="text-xs text-textMuted">Wali Kelas: ${k.wali}</p>
                    </div>
                    <div class="w-8 h-8 rounded-lg bg-bgSoft text-slate-500 flex items-center justify-center text-xs">
                        <i class="fas fa-users"></i>
                    </div>
                </div>
                <div class="flex justify-between items-center text-xs text-textMuted border-t border-borderSoft pt-3">
                    <span>Kapasitas: <strong class="text-textActive">${k.totalSiswa} Siswa</strong></span>
                    <button onclick="bukaModalJadwal('${k.nama}')" class="px-3.5 py-1.5 bg-primary text-white font-bold rounded-xl hover:bg-primaryDark transition-all shadow-sm">
                        Kelola Presensi <i class="fas fa-calendar-alt ml-1"></i>
                    </button>
                </div>
            `;
            gridContainer.appendChild(card);
        });
    }

    if (selectKelasFilter) {
        selectKelasFilter.addEventListener('change', (e) => renderCards(e.target.value));
    }

    // 5. Render Card Kegiatan Luar KBM
    const gridKegiatanContainer = document.getElementById('gridKegiatanContainer');

    function renderKegiatanCards() {
        if (!gridKegiatanContainer) return;
        gridKegiatanContainer.innerHTML = '';

        if (databaseKegiatan.length === 0) {
            gridKegiatanContainer.innerHTML = `<p class="col-span-full text-center text-xs text-textMuted py-8">Belum ada agenda kegiatan di luar KBM.</p>`;
            return;
        }

        databaseKegiatan.forEach(k => {
            const card = document.createElement('div');
            card.className = "bg-white p-5 rounded-2xl border border-borderSoft shadow-sm hover:shadow-md transition-all space-y-4";
            card.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <span class="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                            ${k.status}
                        </span>
                        <h4 class="text-base font-bold text-textActive mt-2">${k.nama}</h4>
                        <p class="text-xs text-textMuted"><i class="fas fa-user-tie text-slate-400 mr-1"></i> PJ: ${k.pj}</p>
                    </div>
                    <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                        <i class="fas fa-bullhorn"></i>
                    </div>
                </div>
                <div class="text-xs space-y-1 bg-bgSoft p-3 rounded-xl border border-borderSoft/60">
                    <p class="text-slate-600"><i class="fas fa-users text-primary mr-1.5"></i> Target: <strong class="text-textActive">${k.target}</strong></p>
                    <p class="text-slate-600"><i class="fas fa-clock text-amber-500 mr-1.5"></i> Waktu: <strong class="text-textActive">${k.waktu}</strong></p>
                </div>
                <div class="pt-2">
                    <a href="detail_presis.html?kelas=${encodeURIComponent(k.target)}&mapel=${encodeURIComponent(k.nama)}" class="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-sm flex items-center justify-center gap-1.5 text-xs">
                        <i class="fas fa-clipboard-user"></i> Mulai Absen Kegiatan
                    </a>
                </div>
            `;
            gridKegiatanContainer.appendChild(card);
        });
    }

    // 6. Tab Mode Switcher Logic (KBM vs Kegiatan)
    const btnModeKBM = document.getElementById('btnModeKBM');
    const btnModeKegiatan = document.getElementById('btnModeKegiatan');
    const sectionKBM = document.getElementById('sectionKBM');
    const sectionKegiatan = document.getElementById('sectionKegiatan');
    const actionKegiatanBox = document.getElementById('actionKegiatanBox');

    if (btnModeKBM && btnModeKegiatan) {
        btnModeKBM.addEventListener('click', () => {
            sectionKBM.classList.remove('hidden');
            sectionKegiatan.classList.add('hidden');
            actionKegiatanBox.classList.add('hidden');

            btnModeKBM.className = "flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-white text-primary shadow-sm";
            btnModeKegiatan.className = "flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-semibold transition-all text-textMuted hover:text-textActive";
        });

        btnModeKegiatan.addEventListener('click', () => {
            sectionKegiatan.classList.remove('hidden');
            sectionKBM.classList.add('hidden');
            actionKegiatanBox.classList.remove('hidden');

            btnModeKegiatan.className = "flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-white text-emerald-600 shadow-sm";
            btnModeKBM.className = "flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-semibold transition-all text-textMuted hover:text-textActive";

            renderKegiatanCards();
        });
    }

    // 7. Modal Form Tambah Kegiatan
    const btnTambahKegiatan = document.getElementById('btnTambahKegiatan');
    const modalTambahKegiatan = document.getElementById('modalTambahKegiatan');
    const closeModalKegiatanBtn = document.getElementById('closeModalKegiatanBtn');
    const batalTambahKegiatanBtn = document.getElementById('batalTambahKegiatanBtn');
    const formTambahKegiatan = document.getElementById('formTambahKegiatan');

    if (btnTambahKegiatan) {
        btnTambahKegiatan.addEventListener('click', () => modalTambahKegiatan.classList.remove('hidden'));
    }

    function tutupModalKegiatan() {
        modalTambahKegiatan.classList.add('hidden');
        if (formTambahKegiatan) formTambahKegiatan.reset();
    }

    if (closeModalKegiatanBtn) closeModalKegiatanBtn.addEventListener('click', tutupModalKegiatan);
    if (batalTambahKegiatanBtn) batalTambahKegiatanBtn.addEventListener('click', tutupModalKegiatan);

    if (formTambahKegiatan) {
        formTambahKegiatan.addEventListener('submit', (e) => {
            e.preventDefault();
            const nama = document.getElementById('inputNamaKegiatan').value;
            const target = document.getElementById('inputTargetKegiatan').value;
            const wktMulai = document.getElementById('inputWaktuMulai').value;
            const wktSelesai = document.getElementById('inputWaktuSelesai').value;
            const pj = document.getElementById('inputPJ').value;

            databaseKegiatan.unshift({
                id: 'keg-' + Date.now(),
                nama: nama,
                target: target,
                waktu: `${wktMulai} - ${wktSelesai} WIB`,
                pj: pj,
                status: 'Akan Datang'
            });

            renderKegiatanCards();
            tutupModalKegiatan();
        });
    }

    // 8. Modal Pop-up Jadwal KBM
    const modal = document.getElementById('modalJadwalKelas');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalTitleKelas = document.getElementById('modalTitleKelas');
    const containerListJadwal = document.getElementById('containerListJadwal');

    window.bukaModalJadwal = function(namaKelas) {
        modalTitleKelas.textContent = `Jadwal Pelajaran: ${namaKelas}`;
        const list = databaseJadwal[namaKelas] || [];

        containerListJadwal.innerHTML = '';

        if (list.length === 0) {
            containerListJadwal.innerHTML = `<p class="text-xs text-textMuted text-center py-4">Tidak ada jadwal KBM untuk hari ini.</p>`;
        } else {
            list.forEach(j => {
                const isCurrent = j.status === 'Sedang Berlangsung';
                const div = document.createElement('div');
                div.className = `p-3 rounded-xl border ${isCurrent ? 'bg-primarySoft/50 border-primary/40' : 'bg-bgSoft border-borderSoft'} flex items-center justify-between hover:border-primary transition-all`;
                div.innerHTML = `
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isCurrent ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700'}">${j.jam}</span>
                            ${isCurrent ? '<span class="text-[9px] text-primary font-bold animate-pulse">● LIVE JAM INI</span>' : ''}
                        </div>
                        <p class="text-xs font-bold text-textActive mt-1">${j.mapel}</p>
                        <p class="text-[10px] text-textMuted">${j.guru}</p>
                    </div>
                    <a href="detail_presis.html?kelas=${encodeURIComponent(namaKelas)}&mapel=${encodeURIComponent(j.mapel)}" class="px-3 py-1.5 bg-white text-primary border border-primary/30 text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm">
                        Masuk Absen
                    </a>
                `;
                containerListJadwal.appendChild(div);
            });
        }

        modal.classList.remove('hidden');
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    renderCards();
});