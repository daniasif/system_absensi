let dummySiswaDatabase = JSON.parse(localStorage.getItem('siswa_database')) || {
    1: [
        { id: 101, noAbsen: 1, nis: '22231001', nisn: '0051122334', nama: 'Andi Pratama', gender: 'L', hp: '081234567891', status: 'Aktif' },
        { id: 102, noAbsen: 2, nis: '22231002', nisn: '0051122335', nama: 'Bintang Maharani', gender: 'P', hp: '081234567892', status: 'Aktif' },
        { id: 103, noAbsen: 3, nis: '22231003', nisn: '0051122336', nama: 'Citra Dewi', gender: 'P', hp: '081234567893', status: 'Aktif' }
    ],
    2: [
        { id: 201, noAbsen: 1, nis: '22231004', nisn: '0069988771', nama: 'Doni Tata', gender: 'L', hp: '085711223344', status: 'Aktif' },
        { id: 202, noAbsen: 2, nis: '22231005', nisn: '0069988772', nama: 'Erika Putri', gender: 'P', hp: '085711223345', status: 'Aktif' }
    ],
    3: [
        { id: 301, noAbsen: 1, nis: '22231006', nisn: '0078899001', nama: 'Faisal Rahman', gender: 'L', hp: '085711223346', status: 'Aktif' },
        { id: 302, noAbsen: 2, nis: '22231007', nisn: '0078899002', nama: 'Gita Sari', gender: 'P', hp: '085711223347', status: 'Aktif' }
    ]
};

const masterKelasSiswa = [
    { id: 1, jenjang: 'SMA Kelas 11', kodeNama: 'XI MIPA 1', jurusan: 'MIPA', wali: 'Dra. Siti Aminah', tahunAjaran: '2025/2026', kapasitasMax: 25 },
    { id: 2, jenjang: 'SMA Kelas 11', kodeNama: 'XI MIPA 2', jurusan: 'MIPA', wali: 'Ahmad Dahlan, S.Kom', tahunAjaran: '2025/2026', kapasitasMax: 25 },
    { id: 3, jenjang: 'SMA Kelas 10', kodeNama: 'X IPS 2', jurusan: 'IPS', wali: 'Eko Prasetyo, M.Pd', tahunAjaran: '2025/2026', kapasitasMax: 22 }
];

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-xs font-medium bg-white transition-all duration-300 ${type === 'success' ? 'border-green-200 text-emerald-800' : 'border-red-200 text-rose-800'}`;
    toast.innerHTML = `<span class="font-bold">${type === 'success' ? 'Berhasil!' : 'Gagal!'}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

const urlParams = new URLSearchParams(window.location.search);
const paramId = parseInt(urlParams.get('id'), 10);
const kelasId = !isNaN(paramId) ? paramId : 1;

let currentKelas = masterKelasSiswa.find(k => k.id === kelasId) || masterKelasSiswa[0];
let currentSiswaList = dummySiswaDatabase[currentKelas.id] || [];

let selectedGenderFilter = 'ALL';

function saveToLocalStorage() {
    dummySiswaDatabase[currentKelas.id] = currentSiswaList;
    localStorage.setItem('siswa_database', JSON.stringify(dummySiswaDatabase));
}

function renderHeaderInfo() {
    const labelJenjang = document.getElementById('labelJenjang');
    const labelJurusan = document.getElementById('labelJurusan');
    const namaKelasHeader = document.getElementById('namaKelasHeader');
    const waliKelasHeader = document.getElementById('waliKelasHeader');
    const tahunAjaranHeader = document.getElementById('tahunAjaranHeader');

    if (labelJenjang) labelJenjang.textContent = currentKelas.jenjang;
    if (labelJurusan) labelJurusan.textContent = currentKelas.jurusan;
    if (namaKelasHeader) namaKelasHeader.textContent = currentKelas.kodeNama;
    if (waliKelasHeader) waliKelasHeader.textContent = currentKelas.wali;
    if (tahunAjaranHeader) tahunAjaranHeader.textContent = currentKelas.tahunAjaran || '-';
}

function renderTableSiswa(data = getFilteredSiswa()) {
    const tbody = document.getElementById('siswaTbody');
    const badge = document.getElementById('totalSiswaBadge');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (badge) badge.textContent = `Menampilkan ${data.length} Siswa (Terisi ${currentSiswaList.length}/${currentKelas.kapasitasMax})`;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-slate-400">Belum ada data siswa.</td></tr>`;
        return;
    }

    data.sort((a, b) => Number(a.noAbsen) - Number(b.noAbsen));

    data.forEach((item) => {
        const avatarBg = item.gender === 'P' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600';
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50/80 transition-colors';
        tr.innerHTML = `
            <td class="py-3 px-3 text-center font-bold text-slate-700">${item.noAbsen || '-'}</td>
            <td class="py-3 px-4 font-semibold text-slate-800">
                <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-full ${avatarBg} flex items-center justify-center text-xs font-bold shrink-0">
                        ${item.gender}
                    </div>
                    <span>${item.nama}</span>
                </div>
            </td>
            <td class="py-3 px-4 font-mono font-semibold text-slate-600">${item.nis || '-'}</td>
            <td class="py-3 px-4 font-mono font-semibold text-slate-600">${item.nisn || '-'}</td>
            <td class="py-3 px-4">${item.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</td>
            <td class="py-3 px-4 font-mono text-slate-600">${item.hp || '-'}</td>
            <td class="py-3 px-4 text-center">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    ${item.status || 'Aktif'}
                </span>
            </td>
            <td class="py-3 px-4 text-center">
                <div class="flex items-center justify-center gap-1">
                    <button onclick="editSiswa(${item.id})" class="p-1.5 text-slate-400 hover:text-primary rounded-lg transition-colors" title="Edit Siswa">
                        <i class="fas fa-pen-to-square text-sm"></i>
                    </button>
                    <button onclick="deleteSiswa(${item.id})" class="p-1.5 text-slate-400 hover:text-danger rounded-lg transition-colors" title="Hapus Siswa">
                        <i class="fas fa-trash-can text-sm"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function getFilteredSiswa() {
    const searchVal = document.getElementById('searchSiswaInput')?.value.toLowerCase() || '';
    return currentSiswaList.filter(s => {
        const matchSearch = s.nama.toLowerCase().includes(searchVal) || 
                            (s.nis && s.nis.includes(searchVal)) || 
                            (s.nisn && s.nisn.includes(searchVal));
        const matchGender = selectedGenderFilter === 'ALL' || s.gender === selectedGenderFilter;
        return matchSearch && matchGender;
    });
}

window.editSiswa = function(id) {
    const siswa = currentSiswaList.find(s => s.id === id);
    if (!siswa) return;

    document.getElementById('modalTitle').textContent = 'Edit Data Siswa';
    document.getElementById('editSiswaId').value = siswa.id;
    document.getElementById('inputNoAbsen').value = siswa.noAbsen || '';
    document.getElementById('inputNamaSiswa').value = siswa.nama;
    document.getElementById('inputNis').value = siswa.nis || '';
    document.getElementById('inputNisn').value = siswa.nisn || '';
    document.getElementById('inputGenderSiswa').value = siswa.gender;
    document.getElementById('inputHpOrtu').value = siswa.hp !== '-' ? siswa.hp : '';

    document.getElementById('siswaModal').classList.remove('hidden');
};

window.deleteSiswa = function(id) {
    if (confirm('Yakin ingin menghapus siswa ini?')) {
        currentSiswaList = currentSiswaList.filter(s => s.id !== id);
        saveToLocalStorage();
        renderTableSiswa();
        showToast('Data siswa berhasil dihapus.');
    }
};

function downloadExcelTemplate() {
    if (typeof XLSX === 'undefined') {
        showToast('Library XLSX belum siap.', 'danger');
        return;
    }
    const templateData = [
        { "No Absen": 1, "Nama Lengkap": "Ahmad Rizky", "NIS": "22231001", "NISN": "0051234567", "Gender (L/P)": "L", "No HP Ortua": "081234567890" },
        { "No Absen": 2, "Nama Lengkap": "Siti Nurhaliza", "NIS": "22231002", "NISN": "0051234568", "Gender (L/P)": "P", "No HP Ortua": "081234567891" }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Siswa");
    XLSX.writeFile(workbook, `Template_Data_Siswa_${currentKelas.kodeNama.replace(/\s+/g, '_')}.xlsx`);
}

function handleExcelImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);

            if (json.length === 0) {
                showToast('File Excel kosong atau format salah.', 'danger');
                return;
            }

            let importCount = 0;
            json.forEach(row => {
                const nama = row["Nama Lengkap"] || row["Nama"] || row["nama"];
                if (nama) {
                    const newSiswa = {
                        id: Date.now() + Math.floor(Math.random() * 1000),
                        noAbsen: row["No Absen"] || row["No"] || (currentSiswaList.length + 1),
                        nama: nama,
                        nis: String(row["NIS"] || '-'),
                        nisn: String(row["NISN"] || '-'),
                        gender: String(row["Gender (L/P)"] || row["Gender"] || 'L').toUpperCase() === 'P' ? 'P' : 'L',
                        hp: String(row["No HP Ortua"] || row["HP"] || '-'),
                        status: 'Aktif'
                    };
                    currentSiswaList.push(newSiswa);
                    importCount++;
                }
            });

            saveToLocalStorage();
            renderTableSiswa();
            showToast(`Berhasil mengimpor ${importCount} data siswa!`);
            event.target.value = '';
        } catch (err) {
            showToast('Gagal memproses file Excel.', 'danger');
        }
    };
    reader.readAsArrayBuffer(file);
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeaderInfo();
    renderTableSiswa();

    document.getElementById('searchSiswaInput')?.addEventListener('input', () => renderTableSiswa());
    document.getElementById('downloadTemplateBtn')?.addEventListener('click', downloadExcelTemplate);
    document.getElementById('excelFileInput')?.addEventListener('change', handleExcelImport);

    const genderBtn = document.getElementById('genderDropdownBtn');
    const genderMenu = document.getElementById('genderDropdownMenu');
    const genderSelectedLabel = document.getElementById('genderDropdownSelectedLabel');

    genderBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        genderMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.gender-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const val = opt.getAttribute('data-value');
            selectedGenderFilter = val;
            
            document.querySelectorAll('.gender-option i.fa-check').forEach(i => i.classList.add('hidden'));
            opt.querySelector('i.fa-check')?.classList.remove('hidden');

            if (val === 'L') {
                genderSelectedLabel.innerHTML = `<i class="fas fa-mars text-blue-500"></i> Laki-Laki`;
            } else if (val === 'P') {
                genderSelectedLabel.innerHTML = `<i class="fas fa-venus text-pink-500"></i> Perempuan`;
            } else {
                genderSelectedLabel.innerHTML = `<i class="fas fa-venus-mars text-slate-400"></i> Semua Gender`;
            }

            genderMenu.classList.add('hidden');
            renderTableSiswa();
        });
    });

    document.addEventListener('click', () => genderMenu?.classList.add('hidden'));

    const modal = document.getElementById('siswaModal');
    const form = document.getElementById('siswaForm');

    document.getElementById('openTambahSiswaBtn')?.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Tambah Siswa Baru';
        document.getElementById('editSiswaId').value = '';
        form.reset();
        document.getElementById('inputNoAbsen').value = currentSiswaList.length + 1;
        modal.classList.remove('hidden');
    });

    document.getElementById('closeSiswaModalBtn')?.addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('cancelSiswaModalBtn')?.addEventListener('click', () => modal.classList.add('hidden'));

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('editSiswaId').value;

        const payload = {
            noAbsen: document.getElementById('inputNoAbsen').value,
            nama: document.getElementById('inputNamaSiswa').value,
            nis: document.getElementById('inputNis').value,
            nisn: document.getElementById('inputNisn').value,
            gender: document.getElementById('inputGenderSiswa').value,
            hp: document.getElementById('inputHpOrtu').value || '-',
            status: 'Aktif'
        };

        if (editId) {
            const index = currentSiswaList.findIndex(s => s.id == editId);
            if (index !== -1) {
                currentSiswaList[index] = { ...currentSiswaList[index], ...payload };
                showToast('Data siswa berhasil diperbarui!');
            }
        } else {
            payload.id = Date.now();
            currentSiswaList.push(payload);
            showToast('Siswa baru berhasil ditambahkan!');
        }

        saveToLocalStorage();
        renderTableSiswa();
        modal.classList.add('hidden');
        form.reset();
    });
});