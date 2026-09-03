document.addEventListener('DOMContentLoaded', () => {

    // DATA MASTER APPROVAL (Mencakup Guru/Staf & Siswa sesuai Konsep)
    let listApproval = [
        {
            id: 201,
            roleGroup: 'Guru/Staf',
            nama: 'Rina Wijaya, S.Psi, M.Psi',
            identity: 'NIP: 199504102023212012 • Guru BK',
            foto: 'https://ui-avatars.com/api/?name=Rina+Wijaya&background=2563EB&color=fff',
            tipe: 'Cuti Tahunan',
            alasan: 'Urusan keluarga penting ke luar daerah.',
            tanggal: '26 Agu 2026 - 28 Agu 2026',
            durasi: '3 Hari',
            guruPengganti: 'Budi Santoso, S.Pd',
            lampiran: 'Surat_Permohonan_Cuti.pdf',
            statusApproval: 'Pending',
            workflowStep: 'Menunggu Kepala Sekolah',
            catatanPenolakan: ''
        },
        
        
        {
            id: 204,
            roleGroup: 'Siswa',
            nama: 'Siti Nurhaliza',
            identity: 'NIS: 24251089 • Kelas XI IPS 2',
            foto: 'https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=7C3AED&color=fff',
            tipe: 'Izin / Sakit',
            alasan: 'Demam tinggi dan butuh istirahat sesuai anjuran dokter.',
            tanggal: '26 Agu 2026 - 27 Agu 2026',
            durasi: '2 Hari',
            guruPengganti: '-',
            lampiran: 'Surat_Dokter_Klinik.jpg',
            statusApproval: 'Disetujui',
            workflowStep: 'Verified',
            catatanPenolakan: ''
        }
        
    ];

    let activeRoleTab = 'Semua';

    const filterStatus = document.getElementById('filterStatus');
    const filterKategori = document.getElementById('filterKategori');
    const searchInput = document.getElementById('searchApprovalInput');

    // TAB SWITCHER FUNCTION (Semua / Guru / Siswa)
    window.switchRoleTab = function(role) {
        activeRoleTab = role;
        
        document.querySelectorAll('.role-tab').forEach(btn => {
            btn.classList.remove('bg-white', 'text-primary', 'shadow-sm', 'font-bold');
            btn.classList.add('text-textMuted', 'font-semibold');
        });

        if (role === 'Semua') {
            document.getElementById('tabRoleAll').classList.add('bg-white', 'text-primary', 'shadow-sm', 'font-bold');
        } else if (role === 'Guru/Staf') {
            document.getElementById('tabRoleGuru').classList.add('bg-white', 'text-primary', 'shadow-sm', 'font-bold');
        } else if (role === 'Siswa') {
            document.getElementById('tabRoleSiswa').classList.add('bg-white', 'text-primary', 'shadow-sm', 'font-bold');
        }

        applyFilters();
    };

    // RENDER TABEL APPROVAL
    function renderTabel(data) {
        const tbody = document.getElementById('tabelApprovalBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-400">Tidak ada pengajuan berkas yang sesuai filter.</td></tr>`;
            return;
        }

        data.forEach((item) => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-bgSoft transition-colors border-b border-borderSoft/60";

            // Status Badge UI
            let statusBadge = '';
            let actionButtons = '';

            if (item.statusApproval === 'Pending') {
                statusBadge = `<span class="px-2.5 py-1 rounded-full bg-amber-100 text-warning font-bold text-[10px] inline-flex items-center gap-1"><i class="fas fa-clock"></i>Menunggu</span>`;
                actionButtons = `
                    <div class="flex items-center justify-center gap-1.5">
                        <button onclick="approveRequest(${item.id})" title="Setujui" class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-1 text-[11px]">
                            <i class="fas fa-check"></i> Setujui
                        </button>
                        <button onclick="openRejectModal(${item.id})" title="Tolak" class="px-2.5 py-1.5 bg-red-50 text-danger hover:bg-red-100 border border-red-200 font-bold rounded-xl transition-all flex items-center gap-1 text-[11px]">
                            <i class="fas fa-xmark"></i> Tolak
                        </button>
                        <button onclick="openDetailModal(${item.id})" title="Detail" class="px-2 py-1.5 bg-bgSoft hover:bg-slate-200 text-textMuted font-bold rounded-xl transition-all text-[11px]">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                `;
            } else if (item.statusApproval === 'Disetujui') {
                statusBadge = `<span class="px-2.5 py-1 rounded-full bg-emerald-100 text-success font-bold text-[10px] inline-flex items-center gap-1"><i class="fas fa-check"></i>Disetujui</span>`;
                actionButtons = `
                    <div class="flex items-center justify-center gap-2">
                        <span class="text-[10px] text-slate-400 font-medium italic">Verified</span>
                        <button onclick="openDetailModal(${item.id})" class="px-2 py-1 bg-bgSoft hover:bg-slate-200 text-textMuted font-bold rounded-lg text-[10px]">
                            <i class="fas fa-eye"></i> Detail
                        </button>
                    </div>
                `;
            } else {
                statusBadge = `<span class="px-2.5 py-1 rounded-full bg-red-100 text-danger font-bold text-[10px] inline-flex items-center gap-1"><i class="fas fa-xmark"></i>Ditolak</span>`;
                actionButtons = `
                    <div class="flex items-center justify-center gap-2">
                        <span class="text-[10px] text-danger font-medium italic truncate max-w-[100px]" title="${item.catatanPenolakan}">Ditolak</span>
                        <button onclick="openDetailModal(${item.id})" class="px-2 py-1 bg-bgSoft hover:bg-slate-200 text-textMuted font-bold rounded-lg text-[10px]">
                            <i class="fas fa-eye"></i> Detail
                        </button>
                    </div>
                `;
            }

            // Category Badge Color
            let catColor = "bg-blue-50 text-primary";
            if (item.tipe.includes("Dispensasi")) catColor = "bg-purple-50 text-purple-600";
            if (item.tipe.includes("Sakit") || item.tipe.includes("Izin")) catColor = "bg-amber-50 text-amber-700";
            if (item.tipe.includes("Koreksi")) catColor = "bg-sky-50 text-sky-600";

            tr.innerHTML = `
                <td class="p-3">
                    <div class="flex items-center space-x-2.5">
                        <img src="${item.foto}" class="w-8 h-8 rounded-full object-cover shrink-0">
                        <div class="min-w-0">
                            <p class="font-bold text-textActive leading-tight truncate">${item.nama}</p>
                            <p class="text-[10px] font-mono text-textMuted mt-0.5 truncate">${item.identity}</p>
                        </div>
                    </div>
                </td>
                <td class="p-3">
                    <span class="px-2 py-0.5 rounded font-bold text-[10px] ${catColor}">${item.tipe}</span>
                    <p class="text-[11px] text-slate-600 mt-1 leading-snug line-clamp-2">${item.alasan}</p>
                </td>
                <td class="p-3 text-center">
                    <p class="font-bold text-slate-700">${item.tanggal}</p>
                    <p class="text-[10px] text-textMuted font-semibold">${item.durasi}</p>
                </td>
                <td class="p-3 text-center">
                    ${statusBadge}
                    <p class="text-[9px] text-slate-400 mt-1">${item.workflowStep}</p>
                </td>
                <td class="p-3 text-center">${actionButtons}</td>
            `;
            tbody.appendChild(tr);
        });

        updateCounters();
    }

    // UPDATE COUNTER HEADER CARDS
    function updateCounters() {
        const pending = listApproval.filter(a => a.statusApproval === 'Pending').length;
        const approved = listApproval.filter(a => a.statusApproval === 'Disetujui').length;
        const rejected = listApproval.filter(a => a.statusApproval === 'Ditolak').length;

        document.getElementById('statPending').textContent = `${pending} Berkas`;
        document.getElementById('statApproved').textContent = `${approved} Berkas`;
        document.getElementById('statRejected').textContent = `${rejected} Berkas`;
        document.getElementById('statTotal').textContent = `${listApproval.length} Berkas`;
    }

    // FILTER LOGIC COMBINED
    function applyFilters() {
        const query = searchInput.value.toLowerCase();
        const statusVal = filterStatus.value;
        const kategoriVal = filterKategori.value;

        const filtered = listApproval.filter(item => {
            const matchRole = activeRoleTab === 'Semua' || item.roleGroup === activeRoleTab;
            const matchQuery = item.nama.toLowerCase().includes(query) || item.identity.toLowerCase().includes(query);
            const matchStatus = statusVal === 'Semua' || item.statusApproval === statusVal;
            const matchKategori = kategoriVal === 'Semua' || item.tipe.includes(kategoriVal);

            return matchRole && matchQuery && matchStatus && matchKategori;
        });

        renderTabel(filtered);
    }

    if (filterStatus) filterStatus.addEventListener('change', applyFilters);
    if (filterKategori) filterKategori.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);

    // APPROVE ACTION WITH AUTOMATION UPDATE
    window.approveRequest = function(id) {
        const item = listApproval.find(a => a.id === id);
        if (item) {
            item.statusApproval = 'Disetujui';
            item.workflowStep = 'Verified & Auto-Updated';
            applyFilters();
            showToast(`Pengajuan ${item.nama} telah DISETUJUI & Status Rekap Otomatis Diperbarui.`);
        }
    };

    // DETAIL MODAL LOGIC
    const modalDetail = document.getElementById('modalDetail');
    const btnCloseModalDetail = document.getElementById('btnCloseModalDetail');
    const btnCloseModalDetail2 = document.getElementById('btnCloseModalDetail2');

    window.openDetailModal = function(id) {
        const item = listApproval.find(a => a.id === id);
        if (!item) return;

        document.getElementById('mFoto').src = item.foto;
        document.getElementById('mNama').textContent = item.nama;
        document.getElementById('mMeta').textContent = `${item.roleGroup} • ${item.identity}`;
        document.getElementById('mTipe').textContent = item.tipe;
        document.getElementById('mWaktu').textContent = `${item.tanggal} (${item.durasi})`;
        document.getElementById('mAlasan').textContent = item.alasan;
        document.getElementById('mLampiranText').textContent = item.lampiran;

        // Guru Pengganti block
        const containerPengganti = document.getElementById('mContainerPengganti');
        if (item.guruPengganti && item.guruPengganti !== '-') {
            document.getElementById('mGuruPengganti').textContent = item.guruPengganti;
            containerPengganti.classList.remove('hidden');
        } else {
            containerPengganti.classList.add('hidden');
        }

        // Kepsek Workflow badge text
        const mWorkflowKepsek = document.getElementById('mWorkflowKepsek');
        if (item.statusApproval === 'Disetujui') {
            mWorkflowKepsek.className = "px-2 py-0.5 rounded-full bg-emerald-100 text-success text-[9px] font-bold";
            mWorkflowKepsek.innerHTML = `<i class="fas fa-check mr-0.5"></i>Disetujui`;
        } else if (item.statusApproval === 'Ditolak') {
            mWorkflowKepsek.className = "px-2 py-0.5 rounded-full bg-red-100 text-danger text-[9px] font-bold";
            mWorkflowKepsek.innerHTML = `<i class="fas fa-xmark mr-0.5"></i>Ditolak`;
        } else {
            mWorkflowKepsek.className = "px-2 py-0.5 rounded-full bg-amber-100 text-warning text-[9px] font-bold";
            mWorkflowKepsek.innerHTML = `<i class="fas fa-clock mr-0.5"></i>Menunggu Decision`;
        }

        modalDetail.classList.remove('hidden');
    };

    const closeModalDetail = () => modalDetail.classList.add('hidden');
    if (btnCloseModalDetail) btnCloseModalDetail.addEventListener('click', closeModalDetail);
    if (btnCloseModalDetail2) btnCloseModalDetail2.addEventListener('click', closeModalDetail);

    // REJECT MODAL LOGIC
    const modalTolak = document.getElementById('modalTolak');
    const btnCloseModalTolak = document.getElementById('btnCloseModalTolak');
    const btnBatalTolak = document.getElementById('btnBatalTolak');
    const btnConfirmTolak = document.getElementById('btnConfirmTolak');
    const targetRejectId = document.getElementById('targetRejectId');
    const catatanPenolakan = document.getElementById('catatanPenolakan');

    window.openRejectModal = function(id) {
        targetRejectId.value = id;
        catatanPenolakan.value = '';
        modalTolak.classList.remove('hidden');
    };

    const closeModalTolak = () => modalTolak.classList.add('hidden');
    if (btnCloseModalTolak) btnCloseModalTolak.addEventListener('click', closeModalTolak);
    if (btnBatalTolak) btnBatalTolak.addEventListener('click', closeModalTolak);

    if (btnConfirmTolak) {
        btnConfirmTolak.addEventListener('click', () => {
            const id = parseInt(targetRejectId.value);
            const item = listApproval.find(a => a.id === id);
            if (item) {
                item.statusApproval = 'Ditolak';
                item.catatanPenolakan = catatanPenolakan.value || 'Ditolak oleh Approver';
                item.workflowStep = 'Ditolak dengan Catatan';
                applyFilters();
                showToast(`Pengajuan ${item.nama} telah DITOLAK.`);
            }
            closeModalTolak();
        });
    }

    // HELPER TOAST
    function showToast(message) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = "bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-slate-700 animate-bounce";
        toast.innerHTML = `<i class="fas fa-check-circle text-emerald-400"></i> <span>${message}</span>`;

        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    // INITIAL LOAD
    applyFilters();
});