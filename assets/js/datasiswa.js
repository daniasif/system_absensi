// Database Master Kelas & Siswa
const dummySiswaDatabase = JSON.parse(localStorage.getItem('siswa_database')) || {
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
    { id: 3, jenjang: 'SMA Kelas 10', kodeNama: 'X IPS 2', jurusan: 'IPS', wali: 'Eko Prasetyo, M.Pd', tahunAjaran: '2024/2025', kapasitasMax: 22 }
];

let selectedTahunAjaranFilter = 'ALL';

function renderTableKelas(data = masterKelasSiswa) {
    const tbody = document.getElementById('kelasTbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    let totalSiswaAll = 0;

    data.forEach((item) => {
        const jumlahSiswaTerisi = (dummySiswaDatabase[item.id] || []).length;
        totalSiswaAll += jumlahSiswaTerisi;

        const isFull = jumlahSiswaTerisi >= item.kapasitasMax;

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50/80 transition-colors';
        tr.innerHTML = `
            <td class="py-3.5 px-4 font-semibold text-slate-800">
                <span class="px-2.5 py-1 rounded-lg text-[11px] bg-blue-50 text-blue-700 border border-blue-200">
                    ${item.jenjang}
                </span>
            </td>
            <td class="py-3.5 px-4 font-bold text-textActive">${item.kodeNama}</td>
            <td class="py-3.5 px-4">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    item.jurusan === 'MIPA' ? 'bg-purple-50 text-purple-600 border border-purple-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
                }">
                    ${item.jurusan}
                </span>
            </td>
            <td class="py-3.5 px-4 font-medium text-slate-700">${item.wali}</td>
            <td class="py-3.5 px-4 font-medium text-slate-600 text-center font-mono text-[11px]">
                <span class="px-2 py-1 bg-slate-100 rounded-md border border-slate-200">${item.tahunAjaran || '-'}</span>
            </td>
            <td class="py-3.5 px-4 text-center">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                    isFull ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }">
                    <i class="fas fa-users text-[10px]"></i> ${jumlahSiswaTerisi} / ${item.kapasitasMax} Siswa
                </span>
            </td>
            <td class="py-3.5 px-4 text-center">
                <a href="detailsiswa.html?id=${item.id}" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primaryDark text-white rounded-xl text-xs font-semibold shadow-sm transition-all">
                    <i class="fas fa-folder-open text-xs"></i> Lihat Siswa
                </a>
            </td>
        `;
        tbody.appendChild(tr);
    });

    const globalBadge = document.getElementById('totalSiswaGlobal');
    if (globalBadge) globalBadge.innerHTML = `${totalSiswaAll} <span class="text-xs text-slate-400 font-normal">Siswa</span>`;
}

function getFilteredData() {
    const searchVal = document.getElementById('searchKelasInput')?.value.toLowerCase() || '';
    
    return masterKelasSiswa.filter(k => {
        const matchSearch = k.kodeNama.toLowerCase().includes(searchVal) || 
                            k.wali.toLowerCase().includes(searchVal) ||
                            k.jurusan.toLowerCase().includes(searchVal) ||
                            (k.tahunAjaran && k.tahunAjaran.toLowerCase().includes(searchVal));
        
        const matchTahunAjaran = selectedTahunAjaranFilter === 'ALL' || k.tahunAjaran === selectedTahunAjaranFilter;

        return matchSearch && matchTahunAjaran;
    });
}

function initTahunAjaranDropdown() {
    const container = document.getElementById('tahunAjaranListContainer');
    if (!container) return;

    // Ambil daftar unik tahun ajaran dari master data
    const uniqueTahunAjaran = [...new Set(masterKelasSiswa.map(k => k.tahunAjaran).filter(Boolean))];
    
    container.innerHTML = '';
    uniqueTahunAjaran.forEach(tahun => {
        const btn = document.createElement('button');
        btn.className = 'tahun-ajaran-option w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between font-medium text-slate-700';
        btn.setAttribute('data-value', tahun);
        btn.innerHTML = `<span>${tahun}</span><i class="fas fa-check text-primary text-[10px] hidden"></i>`;
        container.appendChild(btn);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTahunAjaranDropdown();
    renderTableKelas();

    // Event Pencarian
    document.getElementById('searchKelasInput')?.addEventListener('input', () => {
        renderTableKelas(getFilteredData());
    });

    // Event Dropdown Tahun Ajaran Toggle
    const dropdownBtn = document.getElementById('tahunAjaranDropdownBtn');
    const dropdownMenu = document.getElementById('tahunAjaranDropdownMenu');
    const selectedLabel = document.getElementById('tahunAjaranSelectedLabel');

    dropdownBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('hidden');
    });

    // Event Pilih Opsi Tahun Ajaran
    document.addEventListener('click', (e) => {
        const option = e.target.closest('.tahun-ajaran-option');
        if (option) {
            const val = option.getAttribute('data-value');
            selectedTahunAjaranFilter = val;

            // Update centang aktif pada dropdown
            document.querySelectorAll('.tahun-ajaran-option i.fa-check').forEach(i => i.classList.add('hidden'));
            option.querySelector('i.fa-check')?.classList.remove('hidden');

            // Update label tombol
            selectedLabel.textContent = val === 'ALL' ? 'Semua Tahun Ajaran' : val;

            dropdownMenu.classList.add('hidden');
            renderTableKelas(getFilteredData());
        } else {
            dropdownMenu?.classList.add('hidden');
        }
    });
});