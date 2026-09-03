// ==============================================================
// LOGIKA DASHBOARD GURU, WALI KELAS & CUTI (AHMAD DAHLAN, S.Kom)
// ==============================================================

document.addEventListener('DOMContentLoaded', () => {
    initLayout();
    initKBMPresensi();
    initJadwalMengajarPage();
    initDetailJadwalPage();
    initWaliKelasPage();
    initCutiSayaPage();
});

/* --- 1. INTERAKSI LAYOUT (SIDEBAR & DROPDOWN) --- */
function initLayout() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const mobileSearchModal = document.getElementById('mobileSearchModal');
    const closeSearchBtn = document.getElementById('closeSearchBtn');

    const notifBtn = document.getElementById('notifBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    function toggleSidebar() {
        if (window.innerWidth >= 1024) {
            document.body.classList.toggle('sidebar-collapsed');
        } else {
            sidebarMenu?.classList.toggle('-translate-x-full');
            sidebarOverlay?.classList.toggle('hidden');
        }
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

    if (mobileSearchBtn && mobileSearchModal) {
        mobileSearchBtn.addEventListener('click', () => {
            mobileSearchModal.classList.replace('hidden', 'flex');
            document.getElementById('mobileSearchInput')?.focus();
        });
        closeSearchBtn?.addEventListener('click', () => {
            mobileSearchModal.classList.replace('flex', 'hidden');
        });
    }

    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('hidden');
            profileDropdown?.classList.add('hidden');
        });
    }

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('hidden');
            notifDropdown?.classList.add('hidden');
        });
    }

    window.addEventListener('click', () => {
        notifDropdown?.classList.add('hidden');
        profileDropdown?.classList.add('hidden');
    });
}

/* --- 2. DATA KELAS DIAJAR PAK AHMAD DAHLAN --- */
const mockSiswaData = {
    'XI-MIPA-1': [
        { id: 1, nisn: '005432101', nama: 'Andi Pratama', status: 'Hadir', ket: '', time: '09:16' },
        { id: 2, nisn: '005432102', nama: 'Budi Santoso', status: 'Hadir', ket: '', time: '09:17' },
        { id: 3, nisn: '005432103', nama: 'Citra Kirana', status: 'Izin', ket: 'Petugas UKS', time: '-' },
        { id: 4, nisn: '005432104', nama: 'Dewi Lestari', status: 'Hadir', ket: '', time: '09:18' },
        { id: 5, nisn: '005432105', nama: 'Eko Wahyudi', status: 'Alpa', ket: 'Tanpa Keterangan', time: '-' }
    ],
    'XI-MIPA-2': [
        { id: 1, nisn: '0069988771', nama: 'Doni Tata', status: 'Alpa', ket: '', time: '-' },
        { id: 2, nisn: '0069988772', nama: 'Erika Putri', status: 'Alpa', ket: '', time: '-' },
        { id: 3, nisn: '0069988773', nama: 'Fajar Nugraha', status: 'Hadir', ket: '', time: '08:05' },
        { id: 4, nisn: '0069988774', nama: 'Gita Gutawa', status: 'Sakit', ket: 'Demam tinggi', time: '-' },
        { id: 5, nisn: '0069988775', nama: 'Hendra Setiawan', status: 'Hadir', ket: '', time: '08:10' }
    ],
    'X-IPA-1': [
        { id: 1, nisn: '006112233', nama: 'Aditya Rivaldi', status: 'Hadir', ket: '', time: '11:02' },
        { id: 2, nisn: '006112234', nama: 'Bella Safira', status: 'Sakit', ket: 'Surat dokter', time: '-' }
    ]
};

const mockLogAktivitasAbsensi = [
    { tgl: "03 Sep 2026", jam: "09:15 - 10:00", kelas: "XI MIPA 1", materi: "BAB 2: CSS Flexbox & Grid Layout", hadir: "32/34 Siswa", status: "Selesai" },
    { tgl: "01 Sep 2026", jam: "08:00 - 08:45", kelas: "XI MIPA 2", materi: "BAB 1: Algoritma Pencarian (Binary Search)", hadir: "30/32 Siswa", status: "Selesai" },
    { tgl: "28 Aug 2026", jam: "10:45 - 12:00", kelas: "X IPS 1", materi: "Pengenalan Sistem Komputer & Hardware", hadir: "35/35 Siswa", status: "Selesai" }
];

/* --- 3. LOGIKA PRESENSI KBM JADWAL MENGAJAR (HALAMAN DETAIL PRESENSI KELAS) --- */
function initKBMPresensi() {
    const selectKelasKBM = document.getElementById('selectKelasKBM');
    const siswaTableBody = document.getElementById('siswaTableBody');
    const labelKelasAktif = document.getElementById('labelKelasAktif');
    const btnSetAllHadir = document.getElementById('btnSetAllHadir');
    const btnSimpanKBM = document.getElementById('btnSimpanKBM');

    if (!siswaTableBody || !selectKelasKBM) return;

    function renderTable(kelasKey) {
        const list = mockSiswaData[kelasKey] || [];
        if(labelKelasAktif) {
            labelKelasAktif.innerText = selectKelasKBM.options[selectKelasKBM.selectedIndex].text;
        }
        
        siswaTableBody.innerHTML = list.map((siswa, idx) => `
            <tr class="hover:bg-bgSoft/50 transition-colors">
                <td class="py-3 px-4 font-semibold text-slate-400">${idx + 1}</td>
                <td class="py-3 px-4 font-bold text-textActive">${siswa.nama}</td>
                <td class="py-3 px-4 text-center">
                    <div class="inline-flex rounded-lg border border-borderSoft p-0.5 bg-bgSoft">
                        <button type="button" onclick="setStatus('${kelasKey}', ${idx}, 'Hadir')" class="btn-status px-2.5 py-1 text-[10px] font-bold rounded-md ${siswa.status === 'Hadir' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-textActive'}">Hadir</button>
                        <button type="button" onclick="setStatus('${kelasKey}', ${idx}, 'Sakit')" class="btn-status px-2.5 py-1 text-[10px] font-bold rounded-md ${siswa.status === 'Sakit' ? 'bg-amber-500 text-white' : 'text-slate-500 hover:text-textActive'}">Sakit</button>
                        <button type="button" onclick="setStatus('${kelasKey}', ${idx}, 'Izin')" class="btn-status px-2.5 py-1 text-[10px] font-bold rounded-md ${siswa.status === 'Izin' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-textActive'}">Izin</button>
                        <button type="button" onclick="setStatus('${kelasKey}', ${idx}, 'Alpa')" class="btn-status px-2.5 py-1 text-[10px] font-bold rounded-md ${siswa.status === 'Alpa' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-textActive'}">Alpa</button>
                    </div>
                </td>
                <td class="py-3 px-4">
                    <input type="text" value="${siswa.ket}" onchange="updateKet('${kelasKey}', ${idx}, this.value)" placeholder="Catatan..." class="w-full bg-white border border-borderSoft rounded-md px-2.5 py-1 text-xs focus:outline-none focus:border-primary">
                </td>
            </tr>
        `).join('');
    }

    selectKelasKBM.addEventListener('change', (e) => renderTable(e.target.value));

    btnSetAllHadir?.addEventListener('click', () => {
        const currentKelas = selectKelasKBM.value;
        mockSiswaData[currentKelas].forEach(s => s.status = 'Hadir');
        renderTable(currentKelas);
    });

    btnSimpanKBM?.addEventListener('click', () => {
        alert(`Tersimpan! Presensi KBM & Jurnal Mata Pelajaran Informatika berhasil disimpan.`);
    });

    renderTable(selectKelasKBM.value);
}

/* --- 4. HALAMAN JADWAL MENGAJAR & DETAIL JADWAL --- */
function initJadwalMengajarPage() {
    const tableBody = document.getElementById('logAktivitasTableBody');
    const searchInput = document.getElementById('searchLogInput');

    if (!tableBody) return;

    function renderLog(filter = '') {
        const filtered = mockLogAktivitasAbsensi.filter(item => 
            item.kelas.toLowerCase().includes(filter.toLowerCase()) ||
            item.materi.toLowerCase().includes(filter.toLowerCase()) ||
            item.tgl.toLowerCase().includes(filter.toLowerCase())
        );

        if (filtered.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="p-4 text-center text-slate-400 italic">Data riwayat KBM tidak ditemukan.</td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = filtered.map(item => `
            <tr class="hover:bg-bgSoft/50 transition-colors">
                <td class="p-3 font-semibold text-textActive">
                    ${item.tgl}
                    <span class="block text-[10px] text-textMuted font-mono mt-0.5"><i class="far fa-clock mr-1"></i>${item.jam}</span>
                </td>
                <td class="p-3 font-bold text-primary">${item.kelas}</td>
                <td class="p-3 text-slate-700">${item.materi}</td>
                <td class="p-3 text-center font-semibold text-emerald-600 bg-emerald-50/50 rounded-lg">${item.hadir}</td>
                <td class="p-3 text-center">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        ${item.status}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => renderLog(e.target.value));
    }

    renderLog();
}

let qrTimerInterval = null;

function initDetailJadwalPage() {
    const containerManual = document.getElementById('containerManual');
    const containerQR = document.getElementById('containerQR');
    const tabModeManual = document.getElementById('tabModeManual');
    const tabModeQR = document.getElementById('tabModeQR');

    if (!containerManual || !containerQR) return;

    const urlParams = new URLSearchParams(window.location.search);
    const selectedKelasKey = urlParams.get('kelas') || 'XI-MIPA-1';
    let currentSiswaList = mockSiswaData[selectedKelasKey] || mockSiswaData['XI-MIPA-1'];

    const txtJudul = document.getElementById('txtJudulSesiAktif');
    const txtSubJudul = document.getElementById('txtSubJudulSesi');
    const txtQRSub = document.getElementById('txtQRSubHeader');

    if (txtJudul) txtJudul.innerText = `Presensi Siswa: ${selectedKelasKey.replace(/-/g, ' ')}`;
    if (txtSubJudul) txtSubJudul.innerText = `Mata Pelajaran: Informatika`;
    if (txtQRSub) txtQRSub.innerText = `Scan untuk Presensi ${selectedKelasKey.replace(/-/g, ' ')}`;

    tabModeManual?.addEventListener('click', () => {
        containerManual.classList.remove('hidden');
        containerQR.classList.add('hidden');
        tabModeManual.className = "flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold rounded-lg bg-white text-primary shadow-sm transition-all text-center whitespace-nowrap";
        tabModeQR.className = "flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-lg text-textMuted hover:text-textActive transition-all text-center whitespace-nowrap";
    });

    tabModeQR?.addEventListener('click', () => {
        containerQR.classList.remove('hidden');
        containerManual.classList.add('hidden');
        tabModeQR.className = "flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold rounded-lg bg-white text-primary shadow-sm transition-all text-center whitespace-nowrap";
        tabModeManual.className = "flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-lg text-textMuted hover:text-textActive transition-all text-center whitespace-nowrap";
        initQRCode();
    });

    const tabelBody = document.getElementById('tabelSiswaBody');
    const searchSiswa = document.getElementById('searchSiswa');

    function renderTabelSiswa(filter = '') {
        const filtered = currentSiswaList.filter(s => 
            s.nama.toLowerCase().includes(filter.toLowerCase()) || 
            s.nisn.toLowerCase().includes(filter.toLowerCase())
        );

        if (document.getElementById('totalSiswaCount')) {
            document.getElementById('totalSiswaCount').innerText = currentSiswaList.length;
        }

        if (filtered.length === 0) {
            tabelBody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-400 italic">Siswa tidak ditemukan.</td></tr>`;
            updateCounterSummary();
            return;
        }

        tabelBody.innerHTML = filtered.map((siswa, idx) => {
            const isAlpa = siswa.status === 'Alpa' || siswa.status === 'Alpha';
            return `
                <tr class="hover:bg-bgSoft/50 transition-colors">
                    <td class="p-3 text-center font-bold text-slate-400">${idx + 1}</td>
                    <td class="p-3 font-bold text-textActive">${siswa.nama}</td>
                    <td class="p-3 font-mono text-slate-500 text-[11px]">${siswa.nisn}</td>
                    <td class="p-3 text-center">
                        <div class="inline-flex rounded-lg border border-borderSoft p-0.5 bg-bgSoft gap-1">
                            <button type="button" onclick="updateStatusSiswaDetail('${selectedKelasKey}', ${idx}, 'Hadir')" class="px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${siswa.status === 'Hadir' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'}">Hadir</button>
                            <button type="button" onclick="updateStatusSiswaDetail('${selectedKelasKey}', ${idx}, 'Sakit')" class="px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${siswa.status === 'Sakit' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'}">Sakit</button>
                            <button type="button" onclick="updateStatusSiswaDetail('${selectedKelasKey}', ${idx}, 'Izin')" class="px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${siswa.status === 'Izin' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'}">Izin</button>
                            <button type="button" onclick="updateStatusSiswaDetail('${selectedKelasKey}', ${idx}, 'Alpa')" class="px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${isAlpa ? 'bg-red-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'}">Alpa</button>
                        </div>
                    </td>
                    <td class="p-3">
                        <input type="text" value="${siswa.ket || ''}" onchange="updateCatatanSiswaDetail('${selectedKelasKey}', ${idx}, this.value)" placeholder="Catatan..." class="w-full bg-white border border-borderSoft rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-primary">
                    </td>
                </tr>
            `;
        }).join('');

        updateCounterSummary();
    }

    function updateCounterSummary() {
        let h = 0, s = 0, i = 0, a = 0;
        currentSiswaList.forEach(item => {
            const st = item.status.toLowerCase();
            if (st === 'hadir') h++;
            else if (st === 'sakit') s++;
            else if (st === 'izin') i++;
            else a++;
        });

        if (document.getElementById('cntHadir')) document.getElementById('cntHadir').innerText = h;
        if (document.getElementById('cntSakit')) document.getElementById('cntSakit').innerText = s;
        if (document.getElementById('cntIzin')) document.getElementById('cntIzin').innerText = i;
        if (document.getElementById('cntAlpha')) document.getElementById('cntAlpha').innerText = a;
    }

    window.updateStatusSiswaDetail = function(kKey, idx, newStatus) {
        mockSiswaData[kKey][idx].status = newStatus;
        renderTabelSiswa(searchSiswa?.value || '');
    };

    window.updateCatatanSiswaDetail = function(kKey, idx, val) {
        mockSiswaData[kKey][idx].ket = val;
    };

    document.getElementById('setHadirSemua')?.addEventListener('click', () => {
        currentSiswaList.forEach(s => s.status = 'Hadir');
        renderTabelSiswa(searchSiswa?.value || '');
    });

    document.getElementById('simpanPresensiManual')?.addEventListener('click', () => {
        alert('Data Presensi Kelas Berhasil Disimpan!');
    });

    searchSiswa?.addEventListener('input', (e) => renderTabelSiswa(e.target.value));

    renderTabelSiswa();
}

function initQRCode() {
    const qrCanvas = document.getElementById('qrcodeCanvas');
    if (!qrCanvas) return;

    function generateNewQR() {
        qrCanvas.innerHTML = '';
        const randomToken = `#SECURE-` + Math.floor(100000 + Math.random() * 900000);
        if (document.getElementById('txtTokenHash')) {
            document.getElementById('txtTokenHash').innerText = randomToken;
        }

        if (typeof QRCode !== 'undefined') {
            new QRCode(qrCanvas, {
                text: `https://absensi.sekolah.id/scan?token=${randomToken}`,
                width: 160,
                height: 160,
                colorDark: "#0f172a",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    }

    if (qrCanvas.childElementCount === 0) {
        generateNewQR();
    }

    let timeLeft = 15;
    const timerElem = document.getElementById('qrTimer');

    if (qrTimerInterval) clearInterval(qrTimerInterval);

    qrTimerInterval = setInterval(() => {
        timeLeft--;
        if (timerElem) timerElem.innerText = timeLeft;
        if (timeLeft <= 0) {
            timeLeft = 15;
            generateNewQR();
        }
    }, 1000);

    document.getElementById('btnRefreshQR')?.addEventListener('click', () => {
        timeLeft = 15;
        if (timerElem) timerElem.innerText = timeLeft;
        generateNewQR();
    });
}

/* --- 5. DATA & LOGIKA HALAMAN WALI KELAS (XI MIPA 2) --- */
const mockRekapWaliKelas = [
    { nama: "Ahmad Rizky Febrian", hadir: 14, sakit: 1, izin: 0, alpa: 4, log: "Sudah di-WA, ortu janji datang besok." },
    { nama: "Anisa Rahmawati", hadir: 18, sakit: 1, izin: 0, alpa: 0, log: "-" },
    { nama: "Bagus Adi Putra", hadir: 15, sakit: 0, izin: 1, alpa: 3, log: "Nomor orang tua tidak aktif saat dihubungi." },
    { nama: "Dimas Anggara", hadir: 19, sakit: 0, izin: 0, alpa: 0, log: "-" },
    { nama: "Farah Diba", hadir: 17, sakit: 2, izin: 0, alpa: 0, log: "-" },
    { nama: "Gilang Ramadhan", hadir: 13, sakit: 1, izin: 1, alpa: 4, log: "Surat panggilan 1 sudah dikirim." }
];

let mockSuratIzin = [
    { id: 1, namaSiswa: "Anisa Rahmawati", tgl: "31 Aug 2026", jenis: "Sakit", ket: "Sakit demam tinggi, ada surat dokter." },
    { id: 2, namaSiswa: "Farah Diba", tgl: "30 Aug 2026", jenis: "Izin", ket: "Acara pernikahan kakak di luar kota." }
];

function initWaliKelasPage() {
    const rekapTableBody = document.getElementById('rekapTableBody');
    if (!rekapTableBody) return;

    renderRekapTable();
    renderRadarBermasalah();
    renderApprovalSurat();

    const searchInput = document.getElementById('searchRekap');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderRekapTable(e.target.value.toLowerCase());
        });
    }
}

function renderRekapTable(filter = '') {
    const rekapTableBody = document.getElementById('rekapTableBody');
    if (!rekapTableBody) return;

    const filtered = mockRekapWaliKelas.filter(item => item.nama.toLowerCase().includes(filter));
    
    rekapTableBody.innerHTML = filtered.map((item, idx) => {
        const total = item.hadir + item.sakit + item.izin + item.alpa;
        const persen = Math.round((item.hadir / total) * 100);
        return `
            <tr class="hover:bg-bgSoft/50 transition-colors">
                <td class="py-3 px-4 font-semibold text-slate-400">${idx + 1}</td>
                <td class="py-3 px-4 font-bold text-textActive">${item.nama}</td>
                <td class="py-3 px-4 text-center font-semibold text-emerald-600">${item.hadir}</td>
                <td class="py-3 px-4 text-center font-semibold text-amber-600">${item.sakit}</td>
                <td class="py-3 px-4 text-center font-semibold text-blue-600">${item.izin}</td>
                <td class="py-3 px-4 text-center font-bold ${item.alpa >= 3 ? 'text-red-600 bg-red-50' : 'text-slate-600'}">${item.alpa}</td>
                <td class="py-3 px-4 text-center">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${persen < 80 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}">
                        ${persen}%
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

function renderRadarBermasalah() {
    const container = document.getElementById('radarCardsContainer');
    if (!container) return;

    const bermasalah = mockRekapWaliKelas.filter(item => item.alpa >= 3);

    container.innerHTML = bermasalah.map(siswa => `
        <div class="bg-white p-4 rounded-2xl border border-red-200 shadow-sm space-y-3 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1.5 h-full bg-danger"></div>
            <div class="flex justify-between items-start pl-2">
                <div>
                    <h4 class="text-sm font-bold text-textActive">${siswa.nama}</h4>
                    <p class="text-[11px] text-textMuted">Wali Kelas XI MIPA 2</p>
                </div>
                <span class="px-2.5 py-1 bg-red-100 text-danger text-[10px] font-extrabold rounded-lg border border-red-200">
                    Alpa: ${siswa.alpa} Hari
                </span>
            </div>

            <div class="bg-bgSoft p-2.5 rounded-xl border border-borderSoft text-xs space-y-1 pl-3">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Catatan / Log Tindakan:</span>
                <p class="text-slate-600 italic">"${siswa.log}"</p>
            </div>

            <div class="pt-1 flex items-center justify-between pl-2">
                <button onclick="sendWA('${siswa.nama}')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center transition-colors shadow-sm">
                    <i class="fab fa-whatsapp mr-1.5 text-sm"></i> Hubungi Orang Tua
                </button>
                <button onclick="updateLogPrompt('${siswa.nama}')" class="text-xs text-primary hover:underline font-semibold">
                    Edit Log
                </button>
            </div>
        </div>
    `).join('');
}

function renderApprovalSurat() {
    const container = document.getElementById('approvalSuratContainer');
    if (!container) return;

    if (mockSuratIzin.length === 0) {
        container.innerHTML = `
            <div class="p-6 text-center text-slate-400 border border-dashed border-borderSoft rounded-xl">
                Tidak ada pengajuan surat izin pending.
            </div>
        `;
        return;
    }

    container.innerHTML = mockSuratIzin.map(surat => `
        <div class="p-3.5 bg-white border border-borderSoft rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="space-y-1">
                <div class="flex items-center space-x-2">
                    <span class="font-bold text-xs text-textActive">${surat.namaSiswa}</span>
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-primary">${surat.jenis}</span>
                    <span class="text-[10px] text-slate-400">${surat.tgl}</span>
                </div>
                <p class="text-xs text-textMuted">${surat.ket}</p>
            </div>
            <div class="flex items-center space-x-2 shrink-0">
                <button onclick="approveSurat(this)" class="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition-colors">
                    ACC / Setujui
                </button>
                <button onclick="rejectSurat(this)" class="px-3 py-1.5 bg-red-100 text-danger font-bold text-xs rounded-lg hover:bg-red-200 transition-colors">
                    Tolak
                </button>
            </div>
        </div>
    `).join('');
}

/* --- 6. LOGIKA HALAMAN CUTI & IZIN SAYA --- */
let mockRiwayatCuti = [
    { tgl: "12 Aug 2026", alasan: "Dinas Luar", ket: "Pelatihan Implementasi Kurikulum", status: "Disetujui" },
    { tgl: "01 Jun 2026", alasan: "Sakit", ket: "Rawat inap DBD", status: "Disetujui" }
];

function initCutiSayaPage() {
    const riwayatBody = document.getElementById('riwayatCutiBody');
    const formCuti = document.getElementById('formPengajuanCuti');

    if (!riwayatBody) return;

    renderRiwayatCuti();

    if (formCuti) {
        formCuti.addEventListener('submit', (e) => {
            e.preventDefault();
            const alasan = document.getElementById('cutiAlasan').value;
            const tglMulai = document.getElementById('cutiTglMulai').value;
            const tglSelesai = document.getElementById('cutiTglSelesai').value;
            const ket = document.getElementById('cutiKet').value;

            mockRiwayatCuti.unshift({
                tgl: `${tglMulai} s/d ${tglSelesai}`,
                alasan: alasan,
                ket: ket,
                status: "Pending"
            });

            renderRiwayatCuti();
            formCuti.reset();
            alert("Pengajuan cuti/izin berhasil dikirim ke Kepala Sekolah!");
        });
    }
}

function renderRiwayatCuti() {
    const riwayatBody = document.getElementById('riwayatCutiBody');
    if (!riwayatBody) return;

    riwayatBody.innerHTML = mockRiwayatCuti.map(item => `
        <tr class="hover:bg-bgSoft/50 transition-colors">
            <td class="py-3 px-4 font-bold text-textActive">${item.tgl}</td>
            <td class="py-3 px-4"><span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">${item.alasan}</span></td>
            <td class="py-3 px-4 text-textMuted">${item.ket}</td>
            <td class="py-3 px-4 text-center">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                    item.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' :
                    item.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }">
                    ${item.status}
                </span>
            </td>
        </tr>
    `).join('');
}

/* --- 7. GLOBAL HANDLERS --- */
window.openModalSilabus = function(namaKelas) {
    const modal = document.getElementById('silabusModal');
    const title = document.getElementById('silabusModalTitle');
    if (modal && title) {
        title.innerText = `Silabus Informatika - ${namaKelas}`;
        modal.classList.remove('hidden');
    }
};

window.closeModalSilabus = function() {
    const modal = document.getElementById('silabusModal');
    if (modal) modal.classList.add('hidden');
};

window.setStatus = function(kelasKey, index, status) {
    mockSiswaData[kelasKey][index].status = status;
    const selectKelasKBM = document.getElementById('selectKelasKBM');
    if (selectKelasKBM) {
        const event = new Event('change');
        selectKelasKBM.dispatchEvent(event);
    }
};

window.updateKet = function(kelasKey, index, val) {
    mockSiswaData[kelasKey][index].ket = val;
};

window.sendWA = function(namaSiswa) {
    const text = encodeURIComponent(`Halo Bapak/Ibu, saya Ahmad Dahlan (Wali Kelas XI MIPA 2). Menginformasikan bahwa ${namaSiswa} hari ini tidak hadir tanpa keterangan. Mohon konfirmasinya.`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
};

window.updateLogPrompt = function(namaSiswa) {
    const newLog = prompt(`Update log tindakan untuk ${namaSiswa}:`);
    if (newLog !== null && newLog.trim() !== '') {
        const target = mockRekapWaliKelas.find(s => s.nama === namaSiswa);
        if (target) {
            target.log = newLog;
            renderRadarBermasalah();
        }
    }
};

window.approveSurat = function(btn) {
    alert("Surat Izin Disetujui!");
    btn.closest('.p-3.5').remove();
};

window.rejectSurat = function(btn) {
    alert("Surat Izin Ditolak!");
    btn.closest('.p-3.5').remove();
};

window.switchWaliTab = function(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-primary', 'text-primary', 'font-bold');
        btn.classList.add('border-transparent', 'text-textMuted', 'font-semibold');
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    if (tabId === 'tab1') {
        document.getElementById('tabBtn1').classList.add('border-primary', 'text-primary', 'font-bold');
        document.getElementById('tabContent1').classList.remove('hidden');
    } else if (tabId === 'tab2') {
        document.getElementById('tabBtn2').classList.add('border-primary', 'text-primary', 'font-bold');
        document.getElementById('tabContent2').classList.remove('hidden');
    } else if (tabId === 'tab3') {
        document.getElementById('tabBtn3').classList.add('border-primary', 'text-primary', 'font-bold');
        document.getElementById('tabContent3').classList.remove('hidden');
    }
};