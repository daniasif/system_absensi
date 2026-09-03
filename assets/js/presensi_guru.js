document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DATA GURU LOG ABSENSI
    let databaseGuru = [
        {
            id: 1,
            nama: 'Dra. Hj. Siti Aminah, M.Pd',
            email: 'siti.aminah@sekolah.sch.id',
            nip: '197508121999032001',
            tugas: 'Guru Pengajar',
            mapel: 'Bahasa Indonesia',
            statusKepegawaian: 'PNS',
            golongan: 'IV/a',
            waliKelas: 'Wali XI MIPA 1',
            foto: 'https://ui-avatars.com/api/?name=Siti+Aminah&background=EC4899&color=fff',
            jamMasuk: '06:45',
            jamPulang: '15:30',
            presensiStatus: 'Hadir'
        },
        {
            id: 2,
            nama: 'Dr. H. M. Yusuf, M.Pd',
            email: 'kepsek@sekolah.sch.id',
            nip: '196803151994031002',
            tugas: 'Kepala Sekolah',
            mapel: 'Manajemen Sekolah',
            statusKepegawaian: 'PNS',
            golongan: 'IV/c',
            waliKelas: '-',
            foto: 'https://ui-avatars.com/api/?name=M+Yusuf&background=2563EB&color=fff',
            jamMasuk: '06:30',
            jamPulang: '16:00',
            presensiStatus: 'Hadir'
        },
        {
            id: 3,
            nama: 'Budi Santoso, S.Pd',
            email: 'budi.santoso@sekolah.sch.id',
            nip: '198205142008011005',
            tugas: 'Wakil Kepala Sekolah',
            mapel: 'Kurikulum',
            statusKepegawaian: 'PNS',
            golongan: 'III/c',
            waliKelas: '-',
            foto: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=2563EB&color=fff',
            jamMasuk: '07:10',
            jamPulang: '-',
            presensiStatus: 'Terlambat'
        },
        {
            id: 4,
            nama: 'Rina Wijaya, S.Psi, M.Psi',
            email: 'rina.bk@sekolah.sch.id',
            nip: '199504102023212012',
            tugas: 'Guru BK',
            mapel: 'Bimbingan Konseling',
            statusKepegawaian: 'PPPK',
            golongan: 'IX',
            waliKelas: '-',
            foto: 'https://ui-avatars.com/api/?name=Rina+Wijaya&background=EC4899&color=fff',
            jamMasuk: '-',
            jamPulang: '-',
            presensiStatus: 'Belum Absen'
        },
        {
            id: 5,
            nama: 'Ahmad Dahlan, S.Kom',
            email: 'ahmad.dahlan@sekolah.sch.id',
            nip: '199001152019031008',
            tugas: 'Guru Pengajar',
            mapel: 'Informatika',
            statusKepegawaian: 'PPPK',
            golongan: 'IX',
            waliKelas: '-',
            foto: 'https://ui-avatars.com/api/?name=Ahmad+Dahlan&background=2563EB&color=fff',
            jamMasuk: '07:00',
            jamPulang: '-',
            presensiStatus: 'Hadir'
        },
        {
            id: 6,
            nama: 'Eko Prasetyo, M.Pd',
            email: 'eko.prasetyo@sekolah.sch.id',
            nip: '198811202022211002',
            tugas: 'Guru Pengajar',
            mapel: 'Matematika Wajib',
            statusKepegawaian: 'Honorer',
            golongan: '-',
            waliKelas: 'Wali X IPS 2',
            foto: 'https://ui-avatars.com/api/?name=Eko+Prasetyo&background=2563EB&color=fff',
            jamMasuk: '-',
            jamPulang: '-',
            presensiStatus: 'Belum Absen'
        }
    ];

    // 2. DATA PENGAJUAN CUTI & IZIN
    let databaseCuti = [
        {
            id: 101,
            guruId: 4,
            nama: 'Rina Wijaya, S.Psi, M.Psi',
            nip: '199504102023212012',
            tipe: 'Cuti Tahunan',
            alasan: 'Urusan Keluarga di Luar Kota',
            tanggal: '26 Agu 2026 - 28 Agu 2026',
            durasi: '3 Hari',
            statusApproval: 'Pending'
        },
        {
            id: 102,
            guruId: 6,
            nama: 'Eko Prasetyo, M.Pd',
            nip: '198811202022211002',
            tipe: 'Izin Sakit',
            alasan: 'Demam dan Butuh Istirahat Dokter',
            tanggal: '26 Agu 2026',
            durasi: '1 Hari',
            statusApproval: 'Disetujui'
        }
    ];

    // 3. SET CURRENT DATE
    const currentDateBadge = document.getElementById('currentDateBadge');
    if (currentDateBadge) {
        const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        currentDateBadge.textContent = new Date().toLocaleDateString('id-ID', options);
    }

    // 4. TAB SWITCHING LOGIC (HADIR VS CUTI)
    const tabBtnHadir = document.getElementById('tabBtnHadir');
    const tabBtnCuti = document.getElementById('tabBtnCuti');
    const viewLogKehadiran = document.getElementById('viewLogKehadiran');
    const viewLogCuti = document.getElementById('viewLogCuti');
    let currentActiveTab = 'hadir';

    if (tabBtnHadir && tabBtnCuti) {
        tabBtnHadir.addEventListener('click', () => {
            currentActiveTab = 'hadir';
            tabBtnHadir.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-white text-primary shadow-sm";
            tabBtnCuti.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-textMuted hover:text-textActive";
            viewLogKehadiran.classList.remove('hidden');
            viewLogCuti.classList.add('hidden');
            applyFilter();
        });

        tabBtnCuti.addEventListener('click', () => {
            currentActiveTab = 'cuti';
            tabBtnCuti.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-white text-primary shadow-sm";
            tabBtnHadir.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-textMuted hover:text-textActive";
            viewLogCuti.classList.remove('hidden');
            viewLogKehadiran.classList.add('hidden');
            applyFilter();
        });
    }

    // 5. RENDER TABEL LOG KEHADIRAN GURU
    function renderTabelGuru(data) {
        const tbody = document.getElementById('tabelGuruBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-400">Data guru tidak ditemukan.</td></tr>`;
            return;
        }

        data.forEach((guru) => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-bgSoft transition-colors border-b border-borderSoft/60";

            let presensiBadge = '';
            if (guru.presensiStatus === 'Hadir') {
                presensiBadge = `<span class="px-2.5 py-1 rounded-full bg-emerald-100 text-success font-bold text-[10px]">Hadir (${guru.jamMasuk})</span>`;
            } else if (guru.presensiStatus === 'Terlambat') {
                presensiBadge = `<span class="px-2.5 py-1 rounded-full bg-amber-100 text-warning font-bold text-[10px]">Terlambat (${guru.jamMasuk})</span>`;
            } else {
                presensiBadge = `<span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px]">Belum Absen</span>`;
            }

            let golBadge = '';
            if (guru.statusKepegawaian === 'PNS') {
                golBadge = `<span class="px-2 py-0.5 rounded bg-blue-100 text-primary font-bold text-[10px]">PNS (${guru.golongan})</span>`;
            } else if (guru.statusKepegawaian === 'PPPK') {
                golBadge = `<span class="px-2 py-0.5 rounded bg-emerald-100 text-success font-bold text-[10px]">PPPK (${guru.golongan})</span>`;
            } else {
                golBadge = `<span class="px-2 py-0.5 rounded bg-amber-100 text-warning font-bold text-[10px]">Honorer</span>`;
            }

            tr.innerHTML = `
                <td class="p-3">
                    <div class="flex items-center gap-2.5">
                        <img src="${guru.foto}" class="w-8 h-8 rounded-full border border-borderSoft shrink-0" alt="Foto">
                        <div>
                            <p class="font-bold text-textActive leading-tight">${guru.nama}</p>
                            <p class="text-[10px] text-textMuted mt-0.5">${guru.email}</p>
                        </div>
                    </div>
                </td>
                <td class="p-3 font-mono text-[11px] font-semibold text-slate-600">${guru.nip}</td>
                <td class="p-3">
                    <p class="font-bold text-slate-700">${guru.tugas}</p>
                    <p class="text-[10px] text-textMuted">${guru.mapel}</p>
                </td>
                <td class="p-3 text-center">${golBadge}</td>
                <td class="p-3 text-center">${presensiBadge}</td>
                <td class="p-3 text-center">
                    <button onclick="editStatusGuru(${guru.id})" class="p-1.5 text-textMuted hover:text-primary transition-colors rounded-lg hover:bg-slate-100" title="Ubah Status Presensi">
                        <i class="fas fa-pen-to-square"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        updateCounters();
    }

    // 6. RENDER TABEL LOG PENGAJUAN CUTI & IZIN (DENGAN EDIT/HAPUS UNTUK PENDING)
    function renderTabelCuti(data) {
        const tbody = document.getElementById('tabelCutiBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-400">Tidak ada pengajuan cuti/izin.</td></tr>`;
            return;
        }

        data.forEach((cuti) => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-bgSoft transition-colors border-b border-borderSoft/60";

            let approvalBadge = '';
            let actionButtons = '';

            if (cuti.statusApproval === 'Disetujui') {
                approvalBadge = `<span class="px-2.5 py-1 rounded-full bg-emerald-100 text-success font-bold text-[10px]"><i class="fas fa-check mr-1"></i>Disetujui</span>`;
                actionButtons = `<span class="text-[10px] text-slate-400 italic">Berkas Final</span>`;
            } else if (cuti.statusApproval === 'Ditolak') {
                approvalBadge = `<span class="px-2.5 py-1 rounded-full bg-red-100 text-danger font-bold text-[10px]"><i class="fas fa-times mr-1"></i>Ditolak</span>`;
                actionButtons = `<span class="text-[10px] text-slate-400 italic">Berkas Final</span>`;
            } else {
                approvalBadge = `<span class="px-2.5 py-1 rounded-full bg-amber-100 text-warning font-bold text-[10px]"><i class="fas fa-clock mr-1"></i>Pending</span>`;
                // Akses Edit & Hapus khusus untuk yang belum diapprove
                actionButtons = `
                    <div class="flex items-center justify-center gap-1">
                        <button onclick="editPengajuanCuti(${cuti.id})" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Pengajuan">
                            <i class="fas fa-pen-to-square"></i>
                        </button>
                        <button onclick="hapusPengajuanCuti(${cuti.id})" class="p-1.5 text-danger hover:bg-red-50 rounded-lg transition-colors" title="Hapus / Batalkan Pengajuan">
                            <i class="fas fa-trash-can"></i>
                        </button>
                    </div>
                `;
            }

            tr.innerHTML = `
                <td class="p-3">
                    <p class="font-bold text-textActive leading-tight">${cuti.nama}</p>
                    <p class="text-[10px] font-mono text-textMuted mt-0.5">${cuti.nip}</p>
                </td>
                <td class="p-3">
                    <span class="px-2 py-0.5 rounded bg-blue-50 text-primary font-bold text-[10px]">${cuti.tipe}</span>
                    <p class="text-[11px] text-slate-600 mt-1 leading-snug">${cuti.alasan}</p>
                </td>
                <td class="p-3 text-center">
                    <p class="font-bold text-slate-700">${cuti.tanggal}</p>
                    <p class="text-[10px] text-textMuted">${cuti.durasi}</p>
                </td>
                <td class="p-3 text-center">${approvalBadge}</td>
                <td class="p-3 text-center">${actionButtons}</td>
            `;
            tbody.appendChild(tr);
        });

        updateCounters();
    }

    function updateCounters() {
        document.getElementById('statTotalGuru').textContent = `${databaseGuru.length} Orang`;
        document.getElementById('statPNS').textContent = `${databaseGuru.filter(g => g.statusKepegawaian === 'PNS' || g.statusKepegawaian === 'PPPK').length} Guru`;
        document.getElementById('statHonorer').textContent = `${databaseGuru.filter(g => g.statusKepegawaian === 'Honorer').length} Guru`;
        document.getElementById('statPengajuanCuti').textContent = `${databaseCuti.length} Berkas`;
    }

    // 7. SEARCH & FILTER LOG
    const searchGuruInput = document.getElementById('searchGuruInput');
    const filterKepegawaian = document.getElementById('filterKepegawaian');

    function applyFilter() {
        const query = searchGuruInput ? searchGuruInput.value.toLowerCase() : '';
        const kepVal = filterKepegawaian ? filterKepegawaian.value : 'Semua';

        if (currentActiveTab === 'hadir') {
            const filteredGuru = databaseGuru.filter(g => {
                const matchQuery = g.nama.toLowerCase().includes(query) || g.nip.includes(query) || g.tugas.toLowerCase().includes(query);
                const matchKep = kepVal === 'Semua' || g.statusKepegawaian === kepVal;
                return matchQuery && matchKep;
            });
            renderTabelGuru(filteredGuru);
        } else {
            const filteredCuti = databaseCuti.filter(c => {
                const matchQuery = c.nama.toLowerCase().includes(query) || c.nip.includes(query) || c.tipe.toLowerCase().includes(query);
                return matchQuery;
            });
            renderTabelCuti(filteredCuti);
        }
    }

    if (searchGuruInput) searchGuruInput.addEventListener('input', applyFilter);
    if (filterKepegawaian) filterKepegawaian.addEventListener('change', applyFilter);

    // 8. AUTO-DETECTION & REFRESH SCANNER SIMULATION
    const btnOpenQRModal = document.getElementById('btnOpenQRModal');
    const btnTriggerQRWidget = document.getElementById('btnTriggerQRWidget');
    const modalQRScanner = document.getElementById('modalQRScanner');
    const btnCloseQRModal = document.getElementById('btnCloseQRModal');
    const qrDisplayImage = document.getElementById('qrDisplayImage');
    const btnSimulateAutoTap = document.getElementById('btnSimulateAutoTap');
    const scanGuruResultNama = document.getElementById('scanGuruResultNama');
    const scanGuruResultStatus = document.getElementById('scanGuruResultStatus');

    let currentScanIndex = 0;

    function openQRModal() {
        if (!modalQRScanner) return;
        modalQRScanner.classList.remove('hidden');
        triggerNextAutoScan();
    }

    function triggerNextAutoScan() {
        const guru = databaseGuru[currentScanIndex];
        if (!guru) return;

        if (qrDisplayImage) {
            qrDisplayImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=NIP_${guru.nip}`;
        }

        if (scanGuruResultNama) scanGuruResultNama.textContent = `${guru.nama} (${guru.nip})`;
        if (scanGuruResultStatus) {
            scanGuruResultStatus.textContent = 'Memindai...';
            scanGuruResultStatus.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700';
        }

        setTimeout(() => {
            const jamSekarang = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            guru.presensiStatus = 'Hadir';
            guru.jamMasuk = jamSekarang;

            if (scanGuruResultStatus) {
                scanGuruResultStatus.textContent = `Berhasil (${jamSekarang})`;
                scanGuruResultStatus.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700';
            }

            applyFilter();
            showToast(`Auto-Scan: ${guru.nama} tercatat Hadir jam ${jamSekarang}`);

            currentScanIndex = (currentScanIndex + 1) % databaseGuru.length;
        }, 1200);
    }

    if (btnOpenQRModal) btnOpenQRModal.addEventListener('click', openQRModal);
    if (btnTriggerQRWidget) btnTriggerQRWidget.addEventListener('click', openQRModal);
    if (btnCloseQRModal) btnCloseQRModal.addEventListener('click', () => modalQRScanner.classList.add('hidden'));
    if (btnSimulateAutoTap) btnSimulateAutoTap.addEventListener('click', triggerNextAutoScan);

    // 9. MODAL PENGAJUAN / EDIT IZIN CUTI
    const btnPengajuanIzin = document.getElementById('btnPengajuanIzin');
    const modalIzin = document.getElementById('modalIzin');
    const btnCloseModalIzin = document.getElementById('btnCloseModalIzin');
    const btnBatalIzin = document.getElementById('btnBatalIzin');
    const selectGuruIzin = document.getElementById('selectGuruIzin');
    const formIzinGuru = document.getElementById('formIzinGuru');
    const modalIzinTitle = document.getElementById('modalIzinTitle');
    const btnSubmitIzin = document.getElementById('btnSubmitIzin');
    const editCutiId = document.getElementById('editCutiId');

    function resetModalIzin() {
        formIzinGuru.reset();
        editCutiId.value = '';
        selectGuruIzin.disabled = false;
        modalIzinTitle.textContent = 'Form Pengajuan Izin / Cuti';
        btnSubmitIzin.textContent = 'Kirim Pengajuan';
    }

    if (btnPengajuanIzin && modalIzin) {
        btnPengajuanIzin.addEventListener('click', () => {
            resetModalIzin();
            selectGuruIzin.innerHTML = databaseGuru.map(g => `<option value="${g.id}">${g.nama} - ${g.tugas}</option>`).join('');
            modalIzin.classList.remove('hidden');
        });
    }

    const closeModalIzin = () => modalIzin.classList.add('hidden');
    if (btnCloseModalIzin) btnCloseModalIzin.addEventListener('click', closeModalIzin);
    if (btnBatalIzin) btnBatalIzin.addEventListener('click', closeModalIzin);

    if (formIzinGuru) {
        formIzinGuru.addEventListener('submit', (e) => {
            e.preventDefault();
            const isEdit = editCutiId.value !== '';
            const idGuru = parseInt(selectGuruIzin.value);
            const tipe = document.getElementById('tipePengajuan').value;
            const ket = document.getElementById('ketIzin').value;
            const targetGuru = databaseGuru.find(g => g.id === idGuru);

            if (isEdit) {
                // LOGIKA SIMPAN EDIT PENGAJUAN (YANG BELUM DI-APPROVE)
                const targetCuti = databaseCuti.find(c => c.id === parseInt(editCutiId.value));
                if (targetCuti && targetCuti.statusApproval === 'Pending') {
                    targetCuti.tipe = tipe;
                    targetCuti.alasan = ket;
                    applyFilter();
                    showToast(`Pengajuan cuti ${targetCuti.nama} berhasil diperbarui!`);
                }
            } else {
                // LOGIKA TAMBAH PENGAJUAN BARU
                if (targetGuru) {
                    const todayFormatted = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                    databaseCuti.unshift({
                        id: Date.now(),
                        guruId: targetGuru.id,
                        nama: targetGuru.nama,
                        nip: targetGuru.nip,
                        tipe: tipe,
                        alasan: ket,
                        tanggal: todayFormatted,
                        durasi: '1 Hari',
                        statusApproval: 'Pending'
                    });

                    applyFilter();
                    showToast(`Pengajuan ${tipe} untuk ${targetGuru.nama} berhasil dibuat!`);
                }
            }
            closeModalIzin();
        });
    }

    // 10. EDIT & HAPUS PENGAJUAN CUTI (YANG BELUM DI-APPROVE)
    window.editPengajuanCuti = function(cutiId) {
        const cuti = databaseCuti.find(c => c.id === cutiId);
        if (!cuti) return;

        if (cuti.statusApproval !== 'Pending') {
            alert('Pengajuan yang sudah disetujui/ditolak tidak dapat diubah.');
            return;
        }

        modalIzinTitle.textContent = 'Edit Pengajuan Cuti / Izin';
        btnSubmitIzin.textContent = 'Simpan Perubahan';
        editCutiId.value = cuti.id;

        selectGuruIzin.innerHTML = `<option value="${cuti.guruId}">${cuti.nama} (${cuti.nip})</option>`;
        selectGuruIzin.disabled = true;

        document.getElementById('tipePengajuan').value = cuti.tipe;
        document.getElementById('ketIzin').value = cuti.alasan;

        modalIzin.classList.remove('hidden');
    };

    window.hapusPengajuanCuti = function(cutiId) {
        const index = databaseCuti.findIndex(c => c.id === cutiId);
        if (index !== -1) {
            const cuti = databaseCuti[index];
            if (cuti.statusApproval !== 'Pending') {
                alert('Pengajuan yang sudah diapprove tidak dapat dihapus.');
                return;
            }

            if (confirm(`Yakin ingin membatalkan/menghapus pengajuan cuti ${cuti.nama}?`)) {
                databaseCuti.splice(index, 1);
                applyFilter();
                showToast(`Pengajuan cuti ${cuti.nama} berhasil dihapus.`);
            }
        }
    };

    window.editStatusGuru = function(id) {
        const guru = databaseGuru.find(g => g.id === id);
        if (guru) {
            const status = prompt(`Ubah Status Presensi ${guru.nama}:\n(Hadir / Terlambat / Belum Absen)`, guru.presensiStatus);
            if (status && ['Hadir', 'Terlambat', 'Belum Absen'].includes(status)) {
                guru.presensiStatus = status;
                if (status === 'Hadir' && (guru.jamMasuk === '-' || !guru.jamMasuk)) {
                    guru.jamMasuk = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                }
                applyFilter();
                showToast(`Status ${guru.nama} diperbarui ke: ${status}`);
            }
        }
    };

    // 11. TOAST GENERATOR
    function showToast(message) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = "bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 pointer-events-auto border border-slate-700 animate-bounce";
        toast.innerHTML = `<i class="fas fa-check-circle text-emerald-400"></i> <span>${message}</span>`;

        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    // INITIAL RENDER
    renderTabelGuru(databaseGuru);
    renderTabelCuti(databaseCuti);
});