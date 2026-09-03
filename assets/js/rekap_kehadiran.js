document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. DATABASE DUMMY LENGKAP MAPEL & KELAS
    // ==========================================
    const databaseMapel = [
        {
            id: 'bind',
            nama: 'Bahasa Indonesia',
            kode: 'BIN-101',
            icon: 'fa-book-open',
            colorBg: 'bg-blue-50',
            colorText: 'text-blue-600',
            totalKelas: 4,
            avgKehadiran: 94.2,
            kelasList: [
                {
                    idKelas: 'x-mipa-1',
                    namaKelas: 'X MIPA 1',
                    tingkat: 'X',
                    guruPengajar: 'Dra. Hj. Siti Aminah, M.Pd',
                    nipGuru: '197508121999032001',
                    fotoGuru: 'https://ui-avatars.com/api/?name=Siti+Aminah&background=EC4899&color=fff',
                    totalSiswa: 32,
                    avgHadir: 96.5,
                    siswaData: [
                        { nisn: '0051234001', nama: 'Andi Pratama', h: 18, s: 1, i: 0, a: 0, foto: 'https://ui-avatars.com/api/?name=Andi+Pratama&background=2563EB&color=fff', ortu: 'Bpk. Hendra Pratama', waOrtu: '6281234567890', alamat: 'Jl. Merdeka No. 12, Jakarta', riwayat: ['12 Feb: Sakit (Surat dokter)'] },
                        { nisn: '0051234002', nama: 'Budi Setiawan', h: 12, s: 2, i: 1, a: 4, foto: 'https://ui-avatars.com/api/?name=Budi+Setiawan&background=DC2626&color=fff', ortu: 'Bpk. Santoso Setiawan', waOrtu: '6281987654321', alamat: 'Jl. Melati No. 45, Jakarta', riwayat: ['05 Feb: Alpha', '14 Feb: Alpha', '20 Feb: Alpha', '22 Feb: Alpha'] },
                        { nisn: '0051234003', nama: 'Citra Dewi', h: 19, s: 0, i: 0, a: 0, foto: 'https://ui-avatars.com/api/?name=Citra+Dewi&background=16A34A&color=fff', ortu: 'Ibu Rina Dewi', waOrtu: '6281311223344', alamat: 'Jl. Mawar No. 08, Jakarta', riwayat: [] },
                        { nisn: '0051234004', nama: 'Deni Kurniawan', h: 13, s: 1, i: 2, a: 3, foto: 'https://ui-avatars.com/api/?name=Deni+Kurniawan&background=F59E0B&color=fff', ortu: 'Bpk. Agus Kurniawan', waOrtu: '6285211224455', alamat: 'Jl. Anggrek No. 19, Jakarta', riwayat: ['02 Feb: Alpha', '11 Feb: Alpha', '18 Feb: Alpha'] }
                    ]
                },
                {
                    idKelas: 'x-mipa-2',
                    namaKelas: 'X MIPA 2',
                    tingkat: 'X',
                    guruPengajar: 'Budi Santoso, S.Pd',
                    nipGuru: '198205142008011005',
                    fotoGuru: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=2563EB&color=fff',
                    totalSiswa: 30,
                    avgHadir: 91.8,
                    siswaData: [
                        { nisn: '0051234005', nama: 'Eka Putri', h: 18, s: 1, i: 0, a: 0, foto: 'https://ui-avatars.com/api/?name=Eka+Putri&background=EC4899&color=fff', ortu: 'Ibu Susanti', waOrtu: '6281299887766', alamat: 'Jl. Dahlia No. 03, Jakarta', riwayat: [] },
                        { nisn: '0051234006', nama: 'Fajar Nugraha', h: 11, s: 1, i: 1, a: 6, foto: 'https://ui-avatars.com/api/?name=Fajar+Nugraha&background=DC2626&color=fff', ortu: 'Bpk. Bambang Nugraha', waOrtu: '6287766554433', alamat: 'Jl. Kenanga No. 88, Jakarta', riwayat: ['01 Feb: Alpha', '08 Feb: Alpha', '15 Feb: Alpha', '19 Feb: Alpha'] }
                    ]
                },
                {
                    idKelas: 'xi-ips-1',
                    namaKelas: 'XI IPS 1',
                    tingkat: 'XI',
                    guruPengajar: 'Dra. Hj. Siti Aminah, M.Pd',
                    nipGuru: '197508121999032001',
                    fotoGuru: 'https://ui-avatars.com/api/?name=Siti+Aminah&background=EC4899&color=fff',
                    totalSiswa: 28,
                    avgHadir: 95.0,
                    siswaData: [
                        { nisn: '0051234007', nama: 'Gilang Ramadhan', h: 19, s: 1, i: 0, a: 0, foto: 'https://ui-avatars.com/api/?name=Gilang+R&background=2563EB&color=fff', ortu: 'Bpk. Herman', waOrtu: '6281233445566', alamat: 'Jl. Flamboyan No. 2, Jakarta', riwayat: [] }
                    ]
                },
                {
                    idKelas: 'xii-mipa-1',
                    namaKelas: 'XII MIPA 1',
                    tingkat: 'XII',
                    guruPengajar: 'Ahmad Dahlan, S.Kom',
                    nipGuru: '198501012010012003',
                    fotoGuru: 'https://ui-avatars.com/api/?name=Ahmad+Dahlan&background=7C3AED&color=fff',
                    totalSiswa: 34,
                    avgHadir: 97.2,
                    siswaData: [
                        { nisn: '0051234008', nama: 'Hany Handayani', h: 20, s: 0, i: 0, a: 0, foto: 'https://ui-avatars.com/api/?name=Hany+H&background=EC4899&color=fff', ortu: 'Ibu Maryam', waOrtu: '6281277889900', alamat: 'Jl. Teratai No. 10, Jakarta', riwayat: [] }
                    ]
                }
            ]
        },
        {
            id: 'mtk',
            nama: 'Matematika Wajib',
            kode: 'MTK-102',
            icon: 'fa-calculator',
            colorBg: 'bg-emerald-50',
            colorText: 'text-emerald-600',
            totalKelas: 3,
            avgKehadiran: 92.0,
            kelasList: [
                {
                    idKelas: 'x-mipa-1',
                    namaKelas: 'X MIPA 1',
                    tingkat: 'X',
                    guruPengajar: 'Eko Prasetyo, M.Pd',
                    nipGuru: '198811202022211002',
                    fotoGuru: 'https://ui-avatars.com/api/?name=Eko+Prasetyo&background=2563EB&color=fff',
                    totalSiswa: 32,
                    avgHadir: 93.0,
                    siswaData: [
                        { nisn: '0051234001', nama: 'Andi Pratama', h: 19, s: 0, i: 0, a: 0, foto: 'https://ui-avatars.com/api/?name=Andi+Pratama&background=2563EB&color=fff', ortu: 'Bpk. Hendra Pratama', waOrtu: '6281234567890', alamat: 'Jl. Merdeka No. 12, Jakarta', riwayat: [] },
                        { nisn: '0051234002', nama: 'Budi Setiawan', h: 13, s: 1, i: 1, a: 4, foto: 'https://ui-avatars.com/api/?name=Budi+Setiawan&background=DC2626&color=fff', ortu: 'Bpk. Santoso Setiawan', waOrtu: '6281987654321', alamat: 'Jl. Melati No. 45, Jakarta', riwayat: ['03 Feb: Alpha', '10 Feb: Alpha', '17 Feb: Alpha', '24 Feb: Alpha'] }
                    ]
                },
                {
                    idKelas: 'xi-mipa-1',
                    namaKelas: 'XI MIPA 1',
                    tingkat: 'XI',
                    guruPengajar: 'Eko Prasetyo, M.Pd',
                    nipGuru: '198811202022211002',
                    fotoGuru: 'https://ui-avatars.com/api/?name=Eko+Prasetyo&background=2563EB&color=fff',
                    totalSiswa: 31,
                    avgHadir: 90.5,
                    siswaData: [
                        { nisn: '0051234009', nama: 'Indra Wijaya', h: 17, s: 2, i: 0, a: 1, foto: 'https://ui-avatars.com/api/?name=Indra+W&background=F59E0B&color=fff', ortu: 'Bpk. Gunawan', waOrtu: '6281244556677', alamat: 'Jl. Cempaka No. 04, Jakarta', riwayat: ['15 Feb: Alpha'] }
                    ]
                },
                {
                    idKelas: 'xii-ips-1',
                    namaKelas: 'XII IPS 1',
                    tingkat: 'XII',
                    guruPengajar: 'Ahmad Dahlan, S.Kom',
                    nipGuru: '199004122015022001',
                    fotoGuru: 'https://ui-avatars.com/api/?name=Ahmad+Dahlan&background=7C3AED&color=fff',
                    totalSiswa: 29,
                    avgHadir: 92.5,
                    siswaData: [
                        { nisn: '0051234010', nama: 'Joko Susilo', h: 18, s: 1, i: 1, a: 0, foto: 'https://ui-avatars.com/api/?name=Joko+S&background=16A34A&color=fff', ortu: 'Bpk. Slamet', waOrtu: '6281355667788', alamat: 'Jl. Kamboja No. 11, Jakarta', riwayat: [] }
                    ]
                }
            ]
        },
        {
            id: 'informatika',
            nama: 'Informatika',
            kode: 'INF-101',
            icon: 'fa-laptop',
            colorBg: 'bg-blue-50',
            colorText: 'text-blue-600',
            totalKelas: 2,
            avgKehadiran: 95.1,
            kelasList: [
                {
                    idKelas: 'xi-mipa-1',
                    namaKelas: 'XI MIPA 1',
                    tingkat: 'XI',
                    guruPengajar: 'Ahmad Dahlan, S.Kom',
                    nipGuru: '196705051993031004',
                    fotoGuru: 'https://ui-avatars.com/api/?name=Ahmad+Dahlan&background=7C3AED&color=fff',
                    totalSiswa: 31,
                    avgHadir: 95.1,
                    siswaData: [
                        { nisn: '0051234009', nama: 'Indra Wijaya', h: 19, s: 1, i: 0, a: 0, foto: 'https://ui-avatars.com/api/?name=Indra+W&background=F59E0B&color=fff', ortu: 'Bpk. Gunawan', waOrtu: '6281244556677', alamat: 'Jl. Cempaka No. 04, Jakarta', riwayat: [] }
                    ]
                }
            ]
        }
    ];

    // ==========================================
    // 2. DATABASE DUMMY REKAP GURU
    // ==========================================
    const databaseGuruRekap = [
        { id: 1, nama: 'Dra. Hj. Siti Aminah, M.Pd', nip: '197508121999032001', jabatan: 'Guru Pengajar', kepegawaian: 'PNS', tepatWaktu: 20, terlambat: 0, izin: 1, alpha: 0, jjm: '24 / 24 Jam', foto: 'https://ui-avatars.com/api/?name=Siti+Aminah&background=EC4899&color=fff', logs: ['10 Feb: Izin Acara Keluarga'] },
        { id: 2, nama: 'Dr. H. M. Yusuf, M.Pd', nip: '196803151994031002', jabatan: 'Kepala Sekolah', kepegawaian: 'PNS', tepatWaktu: 21, terlambat: 0, izin: 0, alpha: 0, jjm: '12 / 12 Jam', foto: 'https://ui-avatars.com/api/?name=M+Yusuf&background=2563EB&color=fff', logs: [] },
        { id: 3, nama: 'Budi Santoso, S.Pd', nip: '198205142008011005', jabatan: 'Wakil Kepala Sekolah', kepegawaian: 'PNS', tepatWaktu: 18, terlambat: 3, izin: 0, alpha: 0, jjm: '18 / 18 Jam', foto: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=2563EB&color=fff', logs: ['02 Feb: Terlambat 15 Menit', '11 Feb: Terlambat 10 Menit', '23 Feb: Terlambat 20 Menit'] },
        { id: 4, nama: 'Eko Prasetyo, M.Pd', nip: '198811202022211002', jabatan: 'Guru Pengajar', kepegawaian: 'PPPK', tepatWaktu: 22, terlambat: 0, izin: 0, alpha: 0, jjm: '24 / 24 Jam', foto: 'https://ui-avatars.com/api/?name=Eko+Prasetyo&background=2563EB&color=fff', logs: [] },
        { id: 5, nama: 'Sri Wahyuni, S.Pd', nip: '199004122015022001', jabatan: 'Guru Pengajar', kepegawaian: 'Honorer', tepatWaktu: 19, terlambat: 1, izin: 1, alpha: 0, jjm: '20 / 20 Jam', foto: 'https://ui-avatars.com/api/?name=Sri+Wahyuni&background=F59E0B&color=fff', logs: ['05 Feb: Terlambat 5 Menit'] }
    ];

    let selectedMapelObj = null;
    let selectedKelasObj = null;

    // ==========================================
    // 3. TAB SWITCHING
    // ==========================================
    const tabBtnSiswa = document.getElementById('tabBtnSiswa');
    const tabBtnGuru = document.getElementById('tabBtnGuru');
    const sectionSiswa = document.getElementById('sectionSiswa');
    const sectionGuru = document.getElementById('sectionGuru');

    if (tabBtnSiswa && tabBtnGuru) {
        tabBtnSiswa.addEventListener('click', () => {
            tabBtnSiswa.className = "flex-1 md:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all bg-white text-primary shadow-sm text-center whitespace-nowrap";
            tabBtnGuru.className = "flex-1 md:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs font-bold text-textMuted hover:text-textActive transition-all text-center whitespace-nowrap";
            sectionSiswa.classList.remove('hidden');
            sectionGuru.classList.add('hidden');
        });

        tabBtnGuru.addEventListener('click', () => {
            tabBtnGuru.className = "flex-1 md:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all bg-white text-primary shadow-sm text-center whitespace-nowrap";
            tabBtnSiswa.className = "flex-1 md:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs font-bold text-textMuted hover:text-textActive transition-all text-center whitespace-nowrap";
            sectionGuru.classList.remove('hidden');
            sectionSiswa.classList.add('hidden');
            renderRekapGuru(databaseGuruRekap);
        });
    }

    // ==========================================
    // 4. LOGIKA DRILL-DOWN (LEVEL 1 -> 2 -> 3)
    // ==========================================
    const levelMapelView = document.getElementById('levelMapelView');
    const levelKelasView = document.getElementById('levelKelasView');
    const levelDetailView = document.getElementById('levelDetailView');

    const bcStep1 = document.getElementById('bcStep1');
    const bcSep1 = document.getElementById('bcSep1');
    const bcStep2 = document.getElementById('bcStep2');
    const bcSep2 = document.getElementById('bcSep2');
    const bcStep3 = document.getElementById('bcStep3');

    // FILTER CONTROL ELEMENTS
    const filterKelasSiswa = document.getElementById('filterKelasSiswa');
    const filterTahunAjaran = document.getElementById('filterTahunAjaran');
    const filterRentangWaktu = document.getElementById('filterRentangWaktu');
    const filterKepegawaianGuru = document.getElementById('filterKepegawaianGuru');
    const globalSearchInput = document.getElementById('globalSearchInput');
    const mobileSearchInput = document.getElementById('mobileSearchInput');

    function renderLevel1Mapel() {
        const gridContainer = document.getElementById('gridMapelContainer');
        if (!gridContainer) return;

        levelMapelView.classList.remove('hidden');
        levelKelasView.classList.add('hidden');
        levelDetailView.classList.add('hidden');

        bcSep1.classList.add('hidden');
        bcStep2.classList.add('hidden');
        bcSep2.classList.add('hidden');
        bcStep3.classList.add('hidden');

        const selectedTingkat = filterKelasSiswa ? filterKelasSiswa.value : 'semua';
        const searchKeyword = (globalSearchInput?.value || mobileSearchInput?.value || '').toLowerCase().trim();

        gridContainer.innerHTML = '';

        databaseMapel.forEach(mapel => {
            const filteredKelas = mapel.kelasList.filter(k => {
                const matchTingkat = selectedTingkat === 'semua' || k.tingkat === selectedTingkat;
                const matchSearch = searchKeyword === '' || 
                                    mapel.nama.toLowerCase().includes(searchKeyword) || 
                                    k.namaKelas.toLowerCase().includes(searchKeyword) || 
                                    k.guruPengajar.toLowerCase().includes(searchKeyword);
                return matchTingkat && matchSearch;
            });

            if (filteredKelas.length === 0 && selectedTingkat !== 'semua') return;

            const card = document.createElement('div');
            card.className = "bg-white p-4 sm:p-5 rounded-2xl border border-borderSoft shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group";
            card.onclick = () => selectMapel(mapel);

            card.innerHTML = `
                <div class="flex items-center justify-between mb-3">
                    <div class="w-10 h-10 rounded-xl ${mapel.colorBg} ${mapel.colorText} flex items-center justify-center text-lg font-bold">
                        <i class="fas ${mapel.icon}"></i>
                    </div>
                    <span class="text-[10px] bg-bgSoft border border-borderSoft text-textMuted px-2.5 py-1 rounded-full font-mono">${mapel.kode}</span>
                </div>
                <h4 class="text-sm font-bold text-textActive group-hover:text-primary transition-colors">${mapel.nama}</h4>
                <div class="flex items-center justify-between mt-4 pt-3 border-t border-borderSoft/60 text-xs text-textMuted">
                    <span><i class="fas fa-door-closed mr-1"></i> ${filteredKelas.length} Kelas Terkait</span>
                    <span class="font-semibold text-emerald-600"><i class="fas fa-chart-line mr-1"></i> ${mapel.avgKehadiran}% Kehadiran</span>
                </div>
            `;
            gridContainer.appendChild(card);
        });

        if (gridContainer.children.length === 0) {
            gridContainer.innerHTML = `<div class="col-span-full bg-white p-8 rounded-2xl text-center border border-borderSoft text-slate-400 text-xs">Tidak ada mata pelajaran atau kelas yang cocok dengan filter.</div>`;
        }
    }

    function selectMapel(mapel) {
        selectedMapelObj = mapel;
        
        levelMapelView.classList.add('hidden');
        levelKelasView.classList.remove('hidden');
        levelDetailView.classList.add('hidden');

        bcSep1.classList.remove('hidden');
        bcStep2.classList.remove('hidden');
        bcStep2.textContent = mapel.nama;
        bcSep2.classList.add('hidden');
        bcStep3.classList.add('hidden');

        document.getElementById('selectedMapelTitle').textContent = `Mata Pelajaran: ${mapel.nama}`;

        renderLevel2Kelas();
    }

    function renderLevel2Kelas() {
        if (!selectedMapelObj) return;

        const gridKelas = document.getElementById('gridKelasContainer');
        gridKelas.innerHTML = '';

        const selectedTingkat = filterKelasSiswa ? filterKelasSiswa.value : 'semua';
        const searchKeyword = (globalSearchInput?.value || mobileSearchInput?.value || '').toLowerCase().trim();

        const filteredKelas = selectedMapelObj.kelasList.filter(k => {
            const matchTingkat = selectedTingkat === 'semua' || k.tingkat === selectedTingkat;
            const matchSearch = searchKeyword === '' || 
                                k.namaKelas.toLowerCase().includes(searchKeyword) || 
                                k.guruPengajar.toLowerCase().includes(searchKeyword);
            return matchTingkat && matchSearch;
        });

        filteredKelas.forEach(kelas => {
            const card = document.createElement('div');
            card.className = "bg-white p-4 sm:p-5 rounded-2xl border border-borderSoft shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group";
            card.onclick = () => selectKelas(kelas);

            card.innerHTML = `
                <div class="flex items-center justify-between mb-3">
                    <span class="px-2.5 py-1 rounded-lg bg-primarySoft text-primary font-bold text-xs">${kelas.namaKelas}</span>
                    <span class="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 font-bold px-2 py-0.5 rounded-full">${kelas.avgHadir}% Rata-rata</span>
                </div>
                <div class="flex items-center gap-3 my-2">
                    <img src="${kelas.fotoGuru}" class="w-9 h-9 rounded-full border border-borderSoft shrink-0" alt="Guru">
                    <div>
                        <p class="text-[10px] text-textMuted font-bold uppercase">Guru Pengajar:</p>
                        <p class="text-xs font-bold text-textActive leading-tight group-hover:text-primary transition-colors">${kelas.guruPengajar}</p>
                    </div>
                </div>
                <div class="mt-3 pt-2 border-t border-borderSoft/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span><i class="fas fa-users mr-1"></i> ${kelas.totalSiswa} Siswa Terdaftar</span>
                    <span class="text-primary font-bold">Buka Detail <i class="fas fa-chevron-right text-[9px]"></i></span>
                </div>
            `;
            gridKelas.appendChild(card);
        });

        if (gridKelas.children.length === 0) {
            gridKelas.innerHTML = `<div class="col-span-full bg-white p-8 rounded-2xl text-center border border-borderSoft text-slate-400 text-xs">Tidak ada kelas yang sesuai dengan pilihan filter.</div>`;
        }
    }

    function selectKelas(kelas) {
        selectedKelasObj = kelas;

        levelMapelView.classList.add('hidden');
        levelKelasView.classList.add('hidden');
        levelDetailView.classList.remove('hidden');

        bcSep2.classList.remove('hidden');
        bcStep3.classList.remove('hidden');
        bcStep3.textContent = kelas.namaKelas;

        const taText = filterTahunAjaran ? filterTahunAjaran.options[filterTahunAjaran.selectedIndex].text : '';
        const rentangText = filterRentangWaktu ? filterRentangWaktu.options[filterRentangWaktu.selectedIndex].text : '';

        document.getElementById('detailHeaderTitle').textContent = `Rekap Kehadiran Siswa - ${kelas.namaKelas}`;
        document.getElementById('detailHeaderSubtitle').textContent = `Mata Pelajaran: ${selectedMapelObj.nama} | Guru Pengajar: ${kelas.guruPengajar} (${kelas.nipGuru}) | ${taText} (${rentangText})`;

        renderTabelDetailSiswa(kelas.siswaData);
    }

    document.getElementById('btnBackToMapel').onclick = renderLevel1Mapel;
    document.getElementById('btnBackToKelas').onclick = () => selectMapel(selectedMapelObj);
    bcStep1.onclick = renderLevel1Mapel;
    bcStep2.onclick = () => selectMapel(selectedMapelObj);

    // EVENT LISTENERS UNTUK FILTER
    if (filterKelasSiswa) {
        filterKelasSiswa.addEventListener('change', () => {
            if (!levelMapelView.classList.contains('hidden')) renderLevel1Mapel();
            else if (!levelKelasView.classList.contains('hidden')) renderLevel2Kelas();
        });
    }

    if (filterTahunAjaran || filterRentangWaktu) {
        const updateHeaderAndData = () => {
            if (selectedKelasObj && !levelDetailView.classList.contains('hidden')) {
                selectKelas(selectedKelasObj);
            }
        };
        if (filterTahunAjaran) filterTahunAjaran.addEventListener('change', updateHeaderAndData);
        if (filterRentangWaktu) filterRentangWaktu.addEventListener('change', updateHeaderAndData);
    }

    const handleSearchInput = (e) => {
        const keyword = e.target.value.toLowerCase().trim();
        if (!levelMapelView.classList.contains('hidden')) renderLevel1Mapel();
        else if (!levelKelasView.classList.contains('hidden')) renderLevel2Kelas();
        else if (!levelDetailView.classList.contains('hidden') && selectedKelasObj) {
            const filteredSiswa = selectedKelasObj.siswaData.filter(s => 
                s.nama.toLowerCase().includes(keyword) || s.nisn.includes(keyword)
            );
            renderTabelDetailSiswa(filteredSiswa);
        }
    };

    if (globalSearchInput) globalSearchInput.addEventListener('input', handleSearchInput);
    if (mobileSearchInput) mobileSearchInput.addEventListener('input', handleSearchInput);

    // ==========================================
    // 5. RENDER TABEL DETAIL SISWA
    // ==========================================
    function renderTabelDetailSiswa(siswaList) {
        const tbody = document.getElementById('tabelDetailSiswaBody');
        const alertWidget = document.getElementById('highAlphaAlertWidget');
        const alertContainer = document.getElementById('highAlphaListContainer');

        if (!tbody) return;
        tbody.innerHTML = '';
        alertContainer.innerHTML = '';

        if (!siswaList || siswaList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" class="p-4 text-center text-slate-400">Belum ada data absensi siswa untuk kelas ini.</td></tr>`;
            alertWidget.classList.add('hidden');
            return;
        }

        let highAlphaSiswa = [];

        siswaList.forEach((s, idx) => {
            const totalPertemuan = s.h + s.s + s.i + s.a;
            const persentase = totalPertemuan > 0 ? Math.round((s.h / totalPertemuan) * 100) : 100;
            const isWarning = s.a >= 3 || persentase < 80;

            if (isWarning) highAlphaSiswa.push({ ...s, persentase });

            const tr = document.createElement('tr');
            tr.className = `hover:bg-bgSoft transition-colors border-b border-borderSoft/60 ${isWarning ? 'bg-rose-50/30' : ''}`;

            tr.innerHTML = `
                <td class="p-3 font-semibold text-slate-500">${idx + 1}</td>
                <td class="p-3 font-mono font-semibold text-slate-600">${s.nisn}</td>
                <td class="p-3">
                    <div class="flex items-center gap-2.5">
                        <img src="${s.foto}" class="w-7 h-7 rounded-full border border-borderSoft shrink-0" alt="Foto">
                        <span class="font-bold text-textActive whitespace-nowrap">${s.nama}</span>
                    </div>
                </td>
                <td class="p-3 text-center font-bold text-emerald-600 bg-emerald-50/40">${s.h}</td>
                <td class="p-3 text-center font-bold text-blue-600 bg-blue-50/40">${s.s}</td>
                <td class="p-3 text-center font-bold text-amber-600 bg-amber-50/40">${s.i}</td>
                <td class="p-3 text-center font-bold text-rose-600 bg-rose-50/40">${s.a}</td>
                <td class="p-3 text-center">
                    <span class="font-bold ${persentase >= 85 ? 'text-emerald-600' : 'text-rose-600'}">${persentase}%</span>
                </td>
                <td class="p-3 text-center no-print">
                    ${isWarning 
                        ? `<button onclick="openModalOrtu('${s.nisn}')" class="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-danger text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 mx-auto whitespace-nowrap">
                            <i class="fas fa-triangle-exclamation"></i> Warning & Ortu
                           </button>`
                        : `<button onclick="openModalOrtu('${s.nisn}')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 mx-auto whitespace-nowrap">
                            <i class="fas fa-user-gear"></i> Detail Data
                           </button>`
                    }
                </td>
            `;
            tbody.appendChild(tr);
        });

        if (highAlphaSiswa.length > 0) {
            alertWidget.classList.remove('hidden');
            highAlphaSiswa.forEach(s => {
                const box = document.createElement('div');
                box.className = "bg-white p-3 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between gap-3";
                box.innerHTML = `
                    <div class="flex items-center gap-3 min-w-0">
                        <img src="${s.foto}" class="w-10 h-10 rounded-xl object-cover ring-2 ring-rose-500/20 shrink-0" alt="Foto">
                        <div class="min-w-0">
                            <p class="text-xs font-bold text-textActive truncate">${s.nama}</p>
                            <p class="text-[10px] text-rose-600 font-bold">Alpha: ${s.a}x | Kehadiran: ${s.persentase}%</p>
                            <p class="text-[10px] text-textMuted truncate">Orang Tua: ${s.ortu}</p>
                        </div>
                    </div>
                    <button onclick="openModalOrtu('${s.nisn}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1">
                        <i class="fab fa-whatsapp"></i> Kontak
                    </button>
                `;
                alertContainer.appendChild(box);
            });
        } else {
            alertWidget.classList.add('hidden');
        }
    }

    // ==========================================
    // 6. MODAL ORTU & DETAIL SISWA
    // ==========================================
    const modalOrtuSiswa = document.getElementById('modalOrtuSiswa');
    const btnCloseModalOrtu = document.getElementById('btnCloseModalOrtu');

    window.openModalOrtu = function(nisn) {
        if (!selectedKelasObj) return;
        const s = selectedKelasObj.siswaData.find(siswa => siswa.nisn === nisn);
        if (!s) return;

        document.getElementById('modalSiswaFoto').src = s.foto;
        document.getElementById('modalSiswaNama').textContent = s.nama;
        document.getElementById('modalSiswaNisn').textContent = `NISN: ${s.nisn}`;
        document.getElementById('modalSiswaKelas').textContent = selectedKelasObj.namaKelas;
        
        const warningBadge = document.getElementById('modalSiswaWarningBadge');
        if (s.a >= 3) {
            warningBadge.textContent = `High Alpha (${s.a} Kali)`;
            warningBadge.className = "px-2 py-0.5 rounded bg-rose-100 text-danger font-bold text-[10px]";
        } else {
            warningBadge.textContent = "Status Aman";
            warningBadge.className = "px-2 py-0.5 rounded bg-emerald-100 text-success font-bold text-[10px]";
        }

        document.getElementById('modalOrtuNama').textContent = s.ortu;
        document.getElementById('modalSiswaAlamat').textContent = s.alamat;

        const riwayatContainer = document.getElementById('modalSiswaRiwayatAbsen');
        riwayatContainer.innerHTML = '';
        if (s.riwayat && s.riwayat.length > 0) {
            s.riwayat.forEach(r => {
                const li = document.createElement('li');
                li.textContent = r;
                riwayatContainer.appendChild(li);
            });
        } else {
            riwayatContainer.innerHTML = `<li>Tidak ada catatan ketidakhadiran (Hadir Sempurna)</li>`;
        }

        const textWA = encodeURIComponent(`Halo Bpk/Ibu ${s.ortu}, kami dari pihak sekolah ingin mengonfirmasikan ketidakhadiran ananda ${s.nama} (${selectedKelasObj.namaKelas}) pada mata pelajaran ${selectedMapelObj.nama}. Mohon konfirmasinya. Terima kasih.`);
        document.getElementById('modalBtnWhatsApp').href = `https://wa.me/${s.waOrtu}?text=${textWA}`;

        modalOrtuSiswa.classList.remove('hidden');
    };

    if (btnCloseModalOrtu) {
        btnCloseModalOrtu.addEventListener('click', () => modalOrtuSiswa.classList.add('hidden'));
    }

    // ==========================================
    // 7. RENDER GURU REKAP & FILTER KEPEGAWAIAN
    // ==========================================
    function renderRekapGuru(data) {
        const tbody = document.getElementById('tabelGuruRekapBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        const filterStatus = filterKepegawaianGuru ? filterKepegawaianGuru.value : 'Semua';
        const filteredGuru = data.filter(g => filterStatus === 'Semua' || g.kepegawaian === filterStatus);

        filteredGuru.forEach(g => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-bgSoft transition-colors border-b border-borderSoft/60";

            let kepegBadge = '';
            if (g.kepegawaian === 'PNS') kepegBadge = `<span class="px-2 py-0.5 rounded bg-blue-100 text-primary font-bold text-[10px]">PNS</span>`;
            else if (g.kepegawaian === 'PPPK') kepegBadge = `<span class="px-2 py-0.5 rounded bg-emerald-100 text-success font-bold text-[10px]">PPPK</span>`;
            else kepegBadge = `<span class="px-2 py-0.5 rounded bg-amber-100 text-warning font-bold text-[10px]">Honorer</span>`;

            tr.innerHTML = `
                <td class="p-3">
                    <div class="flex items-center gap-2.5">
                        <img src="${g.foto}" class="w-8 h-8 rounded-full border border-borderSoft shrink-0" alt="Foto">
                        <div>
                            <p class="font-bold text-textActive leading-tight whitespace-nowrap">${g.nama}</p>
                            <p class="text-[10px] font-mono text-textMuted mt-0.5">${g.nip}</p>
                        </div>
                    </div>
                </td>
                <td class="p-3">
                    <p class="font-semibold text-slate-700 whitespace-nowrap">${g.jabatan}</p>
                    <div class="mt-0.5">${kepegBadge}</div>
                </td>
                <td class="p-3 text-center font-bold text-emerald-600">${g.tepatWaktu} Hari</td>
                <td class="p-3 text-center font-bold text-amber-600">${g.terlambat} Kali</td>
                <td class="p-3 text-center font-bold text-blue-600">${g.izin} Hari</td>
                <td class="p-3 text-center font-bold text-rose-600">${g.alpha} Hari</td>
                <td class="p-3 text-center font-bold text-slate-700 font-mono whitespace-nowrap">${g.jjm}</td>
                <td class="p-3 text-center no-print">
                    <button onclick="openModalGuru(${g.id})" class="p-1.5 text-textMuted hover:text-primary transition-colors rounded-lg hover:bg-slate-100" title="Rincian Kedisiplinan">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    if (filterKepegawaianGuru) {
        filterKepegawaianGuru.addEventListener('change', () => renderRekapGuru(databaseGuruRekap));
    }

    // MODAL DETAIL GURU
    const modalDetailGuru = document.getElementById('modalDetailGuru');
    const btnCloseModalGuru = document.getElementById('btnCloseModalGuru');
    const btnCloseModalGuru2 = document.getElementById('btnCloseModalGuru2');

    window.openModalGuru = function(id) {
        const g = databaseGuruRekap.find(guru => guru.id === id);
        if (!g) return;

        document.getElementById('modalGuruFoto').src = g.foto;
        document.getElementById('modalGuruNama').textContent = g.nama;
        document.getElementById('modalGuruNip').textContent = `NIP: ${g.nip}`;

        const logsContainer = document.getElementById('modalGuruLogs');
        logsContainer.innerHTML = '';

        if (g.logs && g.logs.length > 0) {
            g.logs.forEach(log => {
                const item = document.createElement('div');
                item.className = "p-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold";
                item.textContent = log;
                logsContainer.appendChild(item);
            });
        } else {
            logsContainer.innerHTML = `<p class="text-slate-400 italic text-xs">Sempurna! Belum ada catatan keterlambatan atau izin bulan ini.</p>`;
        }

        modalDetailGuru.classList.remove('hidden');
    };

    if (btnCloseModalGuru) btnCloseModalGuru.onclick = () => modalDetailGuru.classList.add('hidden');
    if (btnCloseModalGuru2) btnCloseModalGuru2.onclick = () => modalDetailGuru.classList.add('hidden');

    // ==========================================
    // 8. FUNGSI EKSPOR EXCEL (CSV) & CETAK PDF
    // ==========================================
    function exportTableToCSV(tableId, filename) {
        const table = document.getElementById(tableId);
        if (!table) return;

        let csv = [];
        const rows = table.querySelectorAll("tr");

        for (let i = 0; i < rows.length; i++) {
            let row = [];
            const cols = rows[i].querySelectorAll("td, th");

            for (let j = 0; j < cols.length; j++) {
                if (cols[j].classList.contains("no-print")) continue;

                let text = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ").trim();
                text = text.replace(/"/g, '""');
                row.push('"' + text + '"');
            }
            csv.push(row.join(","));
        }

        const csvFile = new Blob(["\ufeff" + csv.join("\n")], { type: "text/csv;charset=utf-8;" });
        const downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    // EVENT LISTENER BUTTON EXPORT SISWA
    document.getElementById('btnExportExcelSiswa').onclick = () => {
        const nameKelas = selectedKelasObj ? selectedKelasObj.namaKelas : 'Siswa';
        exportTableToCSV('tabelSiswaElement', `Rekap_Kehadiran_${nameKelas}.csv`);
    };

    document.getElementById('btnExportPdfSiswa').onclick = () => window.print();

    // EVENT LISTENER BUTTON EXPORT GURU
    document.getElementById('btnExportExcelGuru').onclick = () => exportTableToCSV('tabelGuruElement', 'Rekap_Kedisiplinan_Guru.csv');

    document.getElementById('btnExportPdfGuru').onclick = () => window.print();

    // INITIALIZATION
    renderLevel1Mapel();
});