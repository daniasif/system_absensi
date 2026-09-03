// Data Master Kelas untuk Mengambil Relasi Wali Kelas
const masterKelasRelasi = [
    { namaKelas: 'XI MIPA 1', wali: 'Dra. Hj. Siti Aminah, M.Pd' },
    { namaKelas: 'XI MIPA 2', wali: 'Ahmad Dahlan, S.Kom' },
    { namaKelas: 'X IPS 2', wali: 'Eko Prasetyo, M.Pd' }
];

// Data Master Guru
let masterGuru = [
    { id: 1, nama: 'Dra. Hj. Siti Aminah, M.Pd', nip: '197508121999032001', gender: 'P', jabatan: 'Guru Pengajar', status: 'PNS', golongan: 'IV/a', hp: '081234567890', email: 'siti.aminah@sekolah.sch.id' },
    { id: 2, nama: 'Dr. H. M. Yusuf, M.Pd', nip: '196803151994031002', gender: 'L', jabatan: 'Kepala Sekolah', status: 'PNS', golongan: 'IV/c', hp: '081122334455', email: 'kepsek@sekolah.sch.id' },
    { id: 3, nama: 'Budi Santoso, S.Pd', nip: '198205142008011005', gender: 'L', jabatan: 'Wakil Kepala Sekolah', status: 'PNS', golongan: 'III/c', hp: '081298765432', email: 'budi.santoso@sekolah.sch.id' },
    { id: 4, nama: 'Rina Wijaya, S.Psi, M.Psi', nip: '199504102023212012', gender: 'P', jabatan: 'Guru BK', status: 'PPPK', golongan: 'IX', hp: '085699887766', email: 'rina.bk@sekolah.sch.id' },
    { id: 5, nama: 'Ahmad Dahlan, S.Kom', nip: '199001152019031008', gender: 'L', jabatan: 'Guru Pengajar', status: 'PPPK', golongan: 'IX', hp: '085712345678', email: 'ahmad.dahlan@sekolah.sch.id' },
    { id: 6, nama: 'Eko Prasetyo, M.Pd', nip: '198811202022211002', gender: 'L', jabatan: 'Guru Pengajar', status: 'Honorer', golongan: '-', hp: '081377889900', email: 'eko.prasetyo@sekolah.sch.id' }
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Cek Relasi Wali Kelas
function getWaliKelasStatus(namaGuru) {
    const matched = masterKelasRelasi.find(k => k.wali.trim().toLowerCase() === namaGuru.trim().toLowerCase());
    return matched ? matched.namaKelas : null;
}

// Update Statistik Header
function updateStats(total, pnsPppk, honorer, wali) {
    const statTotal = document.getElementById('statTotalGuru');
    const statPns = document.getElementById('statPnsPppk');
    const statHonorer = document.getElementById('statHonorer');
    const statWali = document.getElementById('statWaliKelas');

    if (statTotal) statTotal.innerHTML = `${total} <span class="text-xs text-slate-400 font-normal">Orang</span>`;
    if (statPns) statPns.innerHTML = `${pnsPppk} <span class="text-xs text-slate-400 font-normal">Guru</span>`;
    if (statHonorer) statHonorer.innerHTML = `${honorer} <span class="text-xs text-slate-400 font-normal">Guru</span>`;
    if (statWali) statWali.innerHTML = `${wali} <span class="text-xs text-slate-400 font-normal">Guru</span>`;
}

// Toast Notification
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-xs font-medium transform transition-all duration-300 translate-x-10 opacity-0 bg-white z-50`;

    if (type === 'success') {
        toast.classList.add('border-green-200');
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
        toast.classList.add('border-red-200');
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

    setTimeout(() => {
        toast.classList.remove('translate-x-10', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('translate-x-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ==========================================
// RENDER & FILTER TABLE
// ==========================================

function renderTable(data = masterGuru) {
    const tbody = document.getElementById('guruTbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-8 text-slate-400">
                    <i class="fas fa-folder-open text-2xl mb-2 block"></i>
                    Data guru tidak ditemukan.
                </td>
            </tr>
        `;
        updateStats(0, 0, 0, 0);
        return;
    }

    let countPnsPppk = 0;
    let countHonorer = 0;
    let countWaliKelas = 0;

    data.forEach((item) => {
        if (item.status === 'PNS' || item.status === 'PPPK') countPnsPppk++;
        if (item.status === 'Honorer' || item.status === 'GTY') countHonorer++;

        const kelasDiampu = getWaliKelasStatus(item.nama);
        if (kelasDiampu) countWaliKelas++;

        const avatarBg = item.gender === 'P' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600';
        const avatarIcon = item.gender === 'P' ? 'fa-user-nurse' : 'fa-user-tie';

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50/80 transition-colors';
        tr.innerHTML = `
            <td class="py-3 px-4 font-semibold text-slate-800">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full ${avatarBg} flex items-center justify-center shrink-0 text-xs font-bold">
                        <i class="fas ${avatarIcon}"></i>
                    </div>
                    <div>
                        <p class="font-bold text-textActive leading-snug">${item.nama}</p>
                        <p class="text-[10px] text-textMuted flex items-center gap-1 mt-0.5">
                            <i class="fas fa-envelope text-[9px]"></i> ${item.email || '-'}
                        </p>
                    </div>
                </div>
            </td>
            <td class="py-3 px-4 font-mono font-semibold text-slate-600">${item.nip}</td>
            <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                    item.jabatan === 'Kepala Sekolah' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    item.jabatan === 'Wakil Kepala Sekolah' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                    item.jabatan === 'Guru BK' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                }">
                    <i class="fas ${
                        item.jabatan === 'Kepala Sekolah' ? 'fa-user-gear' :
                        item.jabatan === 'Guru BK' ? 'fa-user-group' : 'fa-chalkboard-user'
                    } text-[10px]"></i> ${item.jabatan}
                </span>
            </td>
            <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    item.status === 'PNS' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                    item.status === 'PPPK' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    'bg-amber-50 text-amber-600 border border-amber-200'
                }">
                    ${item.status} ${item.golongan && item.golongan !== '-' ? '(' + item.golongan + ')' : ''}
                </span>
            </td>
            <td class="py-3 px-4 text-center">
                ${
                    kelasDiampu 
                    ? `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                         <i class="fas fa-check-circle text-[10px]"></i> Wali ${kelasDiampu}
                       </span>`
                    : `<span class="text-slate-400 text-[11px] font-normal">-</span>`
                }
            </td>
            <td class="py-3 px-4 text-center">
                <div class="flex items-center justify-center gap-1.5">
                    <button onclick="openQrModal(${item.id})" class="p-1.5 text-slate-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors" title="Lihat QR Code ID Card">
                        <i class="fas fa-id-badge text-sm"></i>
                    </button>
                    <button onclick="editGuru(${item.id})" class="p-1.5 text-slate-500 hover:text-warning hover:bg-amber-50 rounded-lg transition-colors" title="Edit Data">
                        <i class="fas fa-pen-to-square text-sm"></i>
                    </button>
                    <button onclick="deleteGuru(${item.id})" class="p-1.5 text-slate-500 hover:text-danger hover:bg-red-50 rounded-lg transition-colors" title="Hapus Data">
                        <i class="fas fa-trash-can text-sm"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    updateStats(masterGuru.length, countPnsPppk, countHonorer, countWaliKelas);
}

function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterStatus = document.getElementById('filterStatus');
    const filterJabatan = document.getElementById('filterJabatan');
    const filterWali = document.getElementById('filterWali');

    const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
    const statusValue = filterStatus ? filterStatus.value : 'SEMUA';
    const jabatanValue = filterJabatan ? filterJabatan.value : 'SEMUA';
    const waliValue = filterWali ? filterWali.value : 'SEMUA';

    const filtered = masterGuru.filter(item => {
        const matchSearch = item.nama.toLowerCase().includes(searchValue) || 
                            item.nip.toLowerCase().includes(searchValue) ||
                            item.jabatan.toLowerCase().includes(searchValue);
        
        const matchStatus = statusValue === 'SEMUA' || item.status === statusValue;
        const matchJabatan = jabatanValue === 'SEMUA' || item.jabatan === jabatanValue;

        const isWali = getWaliKelasStatus(item.nama) !== null;
        let matchWali = true;
        if (waliValue === 'WALI') matchWali = isWali;
        if (waliValue === 'NON_WALI') matchWali = !isWali;

        return matchSearch && matchStatus && matchJabatan && matchWali;
    });

    renderTable(filtered);
}

// ==========================================
// ACTIONS (GLOBAL SCOPE FOR ONCLICK ATTRIBUTES)
// ==========================================

window.editGuru = function(id) {
    const item = masterGuru.find(g => g.id === id);
    if (!item) return;

    document.getElementById('editRowId').value = item.id;
    document.getElementById('inputNama').value = item.nama;
    document.getElementById('inputNip').value = item.nip;
    document.getElementById('inputGender').value = item.gender;
    document.getElementById('inputJabatan').value = item.jabatan;
    document.getElementById('inputStatus').value = item.status;
    document.getElementById('inputGolongan').value = item.golongan !== '-' ? item.golongan : '';
    document.getElementById('inputNoHp').value = item.hp || '';
    document.getElementById('inputEmail').value = item.email || '';

    document.getElementById('modalTitle').textContent = 'Edit Data Guru';
    document.getElementById('guruModal').classList.remove('hidden');
};

window.deleteGuru = function(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data guru ini?')) {
        masterGuru = masterGuru.filter(g => g.id !== id);
        applyFilters();
        showToast('Data guru berhasil dihapus.', 'success');
    }
};

window.openQrModal = function(id) {
    const item = masterGuru.find(g => g.id === id);
    if (!item) return;

    const qrModal = document.getElementById('qrModal');
    const qrImage = document.getElementById('qrImage');
    const qrGuruNama = document.getElementById('qrGuruNama');
    const qrGuruNip = document.getElementById('qrGuruNip');
    const qrGuruJabatan = document.getElementById('qrGuruJabatan');

    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ABSENSI_GURU_${encodeURIComponent(item.nip)}`;
    qrGuruNama.textContent = item.nama;
    qrGuruNip.textContent = `NIP: ${item.nip}`;
    qrGuruJabatan.textContent = item.jabatan;

    qrModal.classList.remove('hidden');

    const closeBtn = document.getElementById('closeQrModalBtn');
    if (closeBtn) {
        closeBtn.onclick = () => qrModal.classList.add('hidden');
    }
};

// ==========================================
// INITIALIZATION & EVENT LISTENERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Render Awal Tabel
    renderTable();

    // CATATAN:
    // Event listener untuk Hamburger/Sidebar Toggle & Dropdown Profil/Notif
    // SUDAH ditangani oleh layout.js. Jangan ditulis ulang di sini agar tidak bentrok!

    // 1. Modal Tambah / Edit Guru
    const guruModal = document.getElementById('guruModal');
    const openTambahBtn = document.getElementById('openTambahBtn');
    const closeGuruModalBtn = document.getElementById('closeGuruModalBtn');
    const cancelGuruModalBtn = document.getElementById('cancelGuruModalBtn');
    const guruForm = document.getElementById('guruForm');

    openTambahBtn?.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Tambah Data Guru Baru';
        guruForm.reset();
        document.getElementById('editRowId').value = '';
        guruModal.classList.remove('hidden');
    });

    const closeGuruModal = () => guruModal.classList.add('hidden');
    closeGuruModalBtn?.addEventListener('click', closeGuruModal);
    cancelGuruModalBtn?.addEventListener('click', closeGuruModal);

    guruForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btnSimpan = document.getElementById('btnSimpanGuru');
        const editId = document.getElementById('editRowId').value;

        btnSimpan.disabled = true;
        btnSimpan.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menyimpan...`;

        setTimeout(() => {
            const formData = {
                nama: document.getElementById('inputNama').value,
                nip: document.getElementById('inputNip').value,
                gender: document.getElementById('inputGender').value,
                jabatan: document.getElementById('inputJabatan').value,
                status: document.getElementById('inputStatus').value,
                golongan: document.getElementById('inputGolongan').value || '-',
                hp: document.getElementById('inputNoHp').value || '-',
                email: document.getElementById('inputEmail').value || '-'
            };

            if (editId) {
                const index = masterGuru.findIndex(item => item.id == editId);
                if (index !== -1) {
                    masterGuru[index] = { id: parseInt(editId), ...formData };
                    showToast('Data guru berhasil diperbarui!', 'success');
                }
            } else {
                const newId = masterGuru.length ? Math.max(...masterGuru.map(g => g.id)) + 1 : 1;
                masterGuru.push({ id: newId, ...formData });
                showToast('Guru baru berhasil ditambahkan!', 'success');
            }

            applyFilters();
            closeGuruModal();

            btnSimpan.disabled = false;
            btnSimpan.innerHTML = `<span>Simpan Data Guru</span>`;
        }, 800);
    });

    // 2. Download Template Excel/CSV
    document.getElementById('downloadTemplateBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        const csvContent = "data:text/csv;charset=utf-8,NIP,Nama,Gender,Jabatan,Status,Golongan,Email,HP\n198501012010011001,Drs. Supriadi,L,Guru Pengajar,PNS,IV/a,supriadi@sekolah.sch.id,08123456789";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Template_Data_Guru.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('Template Excel guru berhasil diunduh!', 'success');
    });

    // 3. Modal Import Excel
    const importModal = document.getElementById('importModal');
    const openImportBtn = document.getElementById('openImportBtn');
    const closeImportModalBtn = document.getElementById('closeImportModalBtn');
    const cancelImportBtn = document.getElementById('cancelImportBtn');
    const excelFileInput = document.getElementById('excelFileInput');
    const fileDetailContainer = document.getElementById('fileDetailContainer');
    const importForm = document.getElementById('importForm');

    openImportBtn?.addEventListener('click', () => {
        importForm.reset();
        fileDetailContainer.classList.add('hidden');
        document.getElementById('uploadText').textContent = 'Klik di sini atau tarik file ke dalam kotak';
        importModal.classList.remove('hidden');
    });

    const closeImportModal = () => importModal.classList.add('hidden');
    closeImportModalBtn?.addEventListener('click', closeImportModal);
    cancelImportBtn?.addEventListener('click', closeImportModal);

    excelFileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            document.getElementById('selectedFileName').textContent = file.name;
            document.getElementById('selectedFileSize').textContent = (file.size / 1024).toFixed(1) + ' KB';
            document.getElementById('uploadText').textContent = 'File siap diimport!';
            fileDetailContainer.classList.remove('hidden');
        }
    });

    importForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btnProses = document.getElementById('btnProsesImport');

        if (!excelFileInput.files.length) {
            showToast('Pilih file Excel terlebih dahulu!', 'error');
            return;
        }

        btnProses.disabled = true;
        btnProses.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Mengimport...`;

        setTimeout(() => {
            masterGuru.push({
                id: masterGuru.length + 1,
                nama: 'Drs. Supriadi (Imported)',
                nip: '198501012010011001',
                gender: 'L',
                jabatan: 'Guru Pengajar',
                status: 'PNS',
                golongan: 'IV/a',
                hp: '08123456789',
                email: 'supriadi@sekolah.sch.id'
            });

            applyFilters();
            closeImportModal();
            showToast('Data guru dari Excel berhasil diimport!', 'success');

            btnProses.disabled = false;
            btnProses.innerHTML = `<i class="fas fa-file-import"></i> Mulai Import`;
        }, 1200);
    });

    // 4. Realtime Filter & Search Listeners
    document.getElementById('searchInput')?.addEventListener('input', applyFilters);
    document.getElementById('filterStatus')?.addEventListener('change', applyFilters);
    document.getElementById('filterJabatan')?.addEventListener('change', applyFilters);
    document.getElementById('filterWali')?.addEventListener('change', applyFilters);
});