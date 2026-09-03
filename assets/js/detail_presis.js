document.addEventListener('DOMContentLoaded', () => {
    // 1. TANGKAP PARAMETER URL (Dikirim dari presensi_siswa.html)
    const urlParams = new URLSearchParams(window.location.search);
    const paramKelas = urlParams.get('kelas') || 'XI MIPA 1';
    const paramMapel = urlParams.get('mapel') || 'Bahasa Indonesia';

    // Update Text Header Topbar Sesuai Parameter
    const txtJudul = document.getElementById('txtJudulSesiAktif');
    const txtSubJudul = document.getElementById('txtSubJudulSesi');
    const txtQRSubHeader = document.getElementById('txtQRSubHeader');

    if (txtJudul) txtJudul.textContent = `Presensi Siswa: ${paramKelas}`;
    if (txtSubJudul) txtSubJudul.textContent = `Mata Pelajaran: ${paramMapel}`;
    if (txtQRSubHeader) txtQRSubHeader.textContent = `Scan untuk Presensi ${paramKelas}`;

    // 2. DATABASE SISWA (Ditambahkan properti 'kelas')
    const databaseSiswa = {
        'XI MIPA 1': [
            { id: 101, nama: 'Andi Pratama', nis: '22231001', nisn: '0051122334', gender: 'Laki-Laki', kelas: 'XI MIPA 1' },
            { id: 102, nama: 'Bintang Maharani', nis: '22231002', nisn: '0051122335', gender: 'Perempuan', kelas: 'XI MIPA 1' },
            { id: 103, nama: 'Citra Dewi', nis: '22231003', nisn: '0051122336', gender: 'Perempuan', kelas: 'XI MIPA 1' }
        ],
        'XI MIPA 2': [
            { id: 201, nama: 'Doni Tata', nis: '22231006', nisn: '0069988771', gender: 'Laki-Laki', kelas: 'XI MIPA 2' },
            { id: 202, nama: 'Erika Putri', nis: '22231007', nisn: '0069988772', gender: 'Perempuan', kelas: 'XI MIPA 2' }
        ],
        'X IPS 2': [
            { id: 301, nama: 'Ahmad Rizky', nis: '22231009', nisn: '0051234567', gender: 'Laki-Laki', kelas: 'X IPS 2' },
            { id: 302, nama: 'Siti Nurhaliza', nis: '22231010', nisn: '0051234568', gender: 'Perempuan', kelas: 'X IPS 2' }
        ]
    };

    let currentSiswaList = [];
    let logScanQR = [];
    let qrcodeInstance = null;
    let qrTimerInterval = null;
    let countdownSec = 15;

    // Load Data Sesi Presensi & Set Auto-Alpha Default
    function loadSesiPresensi() {
        // Jika parameter berupa gabungan (misal acara gabungan/kegiatan), gunakan data fallback yang menyertakan asal kelas
        const master = databaseSiswa[paramKelas] || [
            { id: 991, nama: 'Andi Pratama', nis: '22231001', nisn: '00999901', gender: 'Laki-Laki', kelas: 'XI MIPA 1' },
            { id: 992, nama: 'Bintang Maharani', nis: '22231002', nisn: '00999902', gender: 'Perempuan', kelas: 'XI MIPA 1' },
            { id: 993, nama: 'Citra Dewi', nis: '22231003', nisn: '00999903', gender: 'Perempuan', kelas: 'XI MIPA 1' },
            { id: 994, nama: 'Doni Tata', nis: '22231004', nisn: '00999904', gender: 'Laki-Laki', kelas: 'XI MIPA 2' },
            { id: 995, nama: 'Erika Putri', nis: '22231005', nisn: '00999905', gender: 'Perempuan', kelas: 'XI MIPA 2' },
            { id: 996, nama: 'Ahmad Rizky', nis: '22231006', nisn: '00999906', gender: 'Laki-Laki', kelas: 'X IPS 2' },
            { id: 997, nama: 'Siti Nurhaliza', nis: '22231007', nisn: '00999907', gender: 'Perempuan', kelas: 'X IPS 2' }
        ];

        currentSiswaList = master.map(s => ({
            ...s,
            status: 'Alpha',
            keterangan: ''
        }));
        logScanQR = [];
        renderTabelManual(currentSiswaList);
        updateSummaryCounters();
    }

    // Render Tabel Manual Siswa (Sudah menampilkan asal kelas)
    function renderTabelManual(data) {
        const tbody = document.getElementById('tabelSiswaBody');
        const totalSiswaCount = document.getElementById('totalSiswaCount');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (totalSiswaCount) totalSiswaCount.textContent = data.length;

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-400">Tidak ada data siswa.</td></tr>`;
            return;
        }

        data.forEach((siswa, index) => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-bgSoft transition-colors";

            tr.innerHTML = `
                <td class="p-3 text-center text-slate-500 font-bold">${index + 1}</td>
                <td class="p-3">
                    <p class="font-bold text-textActive">${siswa.nama}</p>
                    <p class="text-[10px] text-textMuted">${siswa.gender}</p>
                </td>
                <td class="p-3 font-mono text-slate-600">${siswa.nis} / ${siswa.nisn}</td>
                <td class="p-3">
                    <span class="px-2.5 py-1 text-[11px] font-extrabold rounded-lg bg-blue-50 text-primary border border-blue-200">
                        ${siswa.kelas || paramKelas}
                    </span>
                </td>
                <td class="p-3 text-center">
                    <div class="inline-flex rounded-xl p-1 bg-slate-100 border border-borderSoft gap-1">
                        <button type="button" onclick="setIndividualStatus(${siswa.id}, 'Hadir')" class="px-3 py-1 rounded-lg text-xs font-bold transition-all ${siswa.status === 'Hadir' ? 'bg-success text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}">Hadir</button>
                        <button type="button" onclick="setIndividualStatus(${siswa.id}, 'Sakit')" class="px-3 py-1 rounded-lg text-xs font-bold transition-all ${siswa.status === 'Sakit' ? 'bg-warning text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}">Sakit</button>
                        <button type="button" onclick="setIndividualStatus(${siswa.id}, 'Izin')" class="px-3 py-1 rounded-lg text-xs font-bold transition-all ${siswa.status === 'Izin' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}">Izin</button>
                        <button type="button" onclick="setIndividualStatus(${siswa.id}, 'Alpha')" class="px-3 py-1 rounded-lg text-xs font-bold transition-all ${siswa.status === 'Alpha' ? 'bg-danger text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}">Alpha</button>
                    </div>
                </td>
                <td class="p-3">
                    <input type="text" value="${siswa.keterangan}" onchange="updateCatatan(${siswa.id}, this.value)" placeholder="Catatan..." class="w-full bg-bgSoft border border-borderSoft rounded-lg px-3 py-1 text-xs focus:outline-none focus:border-primary">
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Set Status Per Siswa
    window.setIndividualStatus = function(siswaId, statusBaru) {
        const item = currentSiswaList.find(s => s.id === siswaId);
        if (item) {
            item.status = statusBaru;
            filterAndRender();
            updateSummaryCounters();
        }
    };

    window.updateCatatan = function(siswaId, val) {
        const item = currentSiswaList.find(s => s.id === siswaId);
        if (item) item.keterangan = val;
    };

    // Filter Search Live Input (Pencarian juga mendukung berdasarkan Nama Kelas)
    const searchSiswa = document.getElementById('searchSiswa');
    if (searchSiswa) {
        searchSiswa.addEventListener('input', () => filterAndRender());
    }

    function filterAndRender() {
        const q = searchSiswa ? searchSiswa.value.toLowerCase() : '';
        const filtered = currentSiswaList.filter(s => 
            s.nama.toLowerCase().includes(q) || 
            s.nisn.includes(q) || 
            s.nis.includes(q) ||
            (s.kelas && s.kelas.toLowerCase().includes(q))
        );
        renderTabelManual(filtered);
    }

    // Set Semua Hadir
    const setHadirSemuaBtn = document.getElementById('setHadirSemua');
    if (setHadirSemuaBtn) {
        setHadirSemuaBtn.addEventListener('click', () => {
            currentSiswaList.forEach(s => s.status = 'Hadir');
            filterAndRender();
            updateSummaryCounters();
            showToast("Semua siswa diset HADIR!");
        });
    }

    // Simpan Presensi Button
    const simpanBtn = document.getElementById('simpanPresensiManual');
    if (simpanBtn) {
        simpanBtn.addEventListener('click', () => {
            showToast("Data presensi berhasil disimpan ke sistem!");
        });
    }

    function updateSummaryCounters() {
        document.getElementById('cntHadir').textContent = currentSiswaList.filter(s => s.status === 'Hadir').length;
        document.getElementById('cntSakit').textContent = currentSiswaList.filter(s => s.status === 'Sakit').length;
        document.getElementById('cntIzin').textContent = currentSiswaList.filter(s => s.status === 'Izin').length;
        document.getElementById('cntAlpha').textContent = currentSiswaList.filter(s => s.status === 'Alpha').length;
    }

    // 3. QR REAL-TIME ENGINE
    function generateRealQRCode() {
        const qrContainer = document.getElementById('qrcodeCanvas');
        if (!qrContainer) return;
        qrContainer.innerHTML = '';
        const randomToken = 'SECURE-PRESENSE-' + Math.floor(100000 + Math.random() * 900000);
        document.getElementById('txtTokenHash').textContent = '#' + randomToken.substring(0, 14);

        qrcodeInstance = new QRCode(qrContainer, {
            text: randomToken,
            width: 170, height: 170, colorDark: "#0F172A", colorLight: "#FFFFFF", correctLevel: QRCode.CorrectLevel.H
        });
    }

    function startQRTimer() {
        clearInterval(qrTimerInterval);
        countdownSec = 15;
        qrTimerInterval = setInterval(() => {
            countdownSec--;
            const timerEl = document.getElementById('qrTimer');
            if (timerEl) timerEl.textContent = countdownSec;
            if (countdownSec <= 0) {
                generateRealQRCode();
                simulateIncomingScanQR();
                countdownSec = 15;
            }
        }, 1000);
    }

    function simulateIncomingScanQR() {
        const alphaSiswa = currentSiswaList.filter(s => s.status === 'Alpha');
        if (alphaSiswa.length > 0) {
            const scannedSiswa = alphaSiswa[Math.floor(Math.random() * alphaSiswa.length)];
            scannedSiswa.status = 'Hadir';
            logScanQR.unshift({
                waktu: new Date().toLocaleTimeString('id-ID'),
                nama: scannedSiswa.nama,
                kelas: scannedSiswa.kelas || paramKelas,
                nisn: scannedSiswa.nisn,
                status: 'Hadir'
            });
            renderLiveScanTable();
            filterAndRender();
            updateSummaryCounters();
        }
    }

    function renderLiveScanTable() {
        const tbody = document.getElementById('tabelLiveScanBody');
        if (!tbody) return;
        tbody.innerHTML = logScanQR.map(log => `
            <tr class="hover:bg-bgSoft transition-colors">
                <td class="p-3 font-mono text-slate-500">${log.waktu}</td>
                <td class="p-3 font-bold text-textActive">
                    ${log.nama}
                    <span class="text-[10px] text-textMuted block font-normal">${log.kelas}</span>
                </td>
                <td class="p-3 font-mono text-slate-600">${log.nisn}</td>
                <td class="p-3 text-center"><span class="px-2 py-0.5 rounded-full bg-emerald-100 text-success font-bold text-[10px]">Hadir</span></td>
            </tr>
        `).join('');
    }

    const btnRefreshQR = document.getElementById('btnRefreshQR');
    if (btnRefreshQR) {
        btnRefreshQR.addEventListener('click', () => {
            generateRealQRCode();
            countdownSec = 15;
            showToast("Token QR Code diperbarui!");
        });
    }

    // 4. TAB SWITCHER
    const tabManual = document.getElementById('tabModeManual');
    const tabQR = document.getElementById('tabModeQR');
    const containerManual = document.getElementById('containerManual');
    const containerQR = document.getElementById('containerQR');

    if (tabManual && tabQR) {
        tabManual.addEventListener('click', () => {
            containerManual.classList.remove('hidden');
            containerQR.classList.add('hidden');
            tabManual.className = "px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg bg-white text-primary shadow-sm transition-all";
            tabQR.className = "px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-lg text-textMuted hover:text-textActive transition-all";
            clearInterval(qrTimerInterval);
        });

        tabQR.addEventListener('click', () => {
            containerQR.classList.remove('hidden');
            containerManual.classList.add('hidden');
            tabQR.className = "px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg bg-white text-primary shadow-sm transition-all";
            tabManual.className = "px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-lg text-textMuted hover:text-textActive transition-all";
            generateRealQRCode();
            startQRTimer();
        });
    }

    // Toast Notification Helper
    function showToast(message) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = "bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in duration-300 pointer-events-auto";
        toast.innerHTML = `<i class="fas fa-circle-check text-emerald-400"></i> <span>${message}</span>`;

        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // INITIAL LOAD
    loadSesiPresensi();
});