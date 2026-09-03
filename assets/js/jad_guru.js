/**
 * jad_guru.js
 * Fitur: Integrative View untuk Jadwal Guru
 * Mengambil & Mengolah data dari Jadwal Pelajaran (scheduleData / LocalStorage)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DATA MASTER (Harus Sinkron dengan jad_pelajaran.js)
    const guruList = [
        { id: '1', name: 'Dra. Hj. Siti Aminah', nip: '19750312 200003 2 001', mapel: 'Bahasa Indonesia' },
        { id: '2', name: 'Ahmad Dahlan, S.Kom', nip: '19881020 201504 1 002', mapel: 'Informatika' },
        { id: '3', name: 'Eko Prasetyo, M.Pd', nip: '19820515 200801 1 003', mapel: 'Matematika Wajib' }
        
    ];

    const masterDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

    const timeSlots = [
        { id: 1, type: 'lesson', name: 'Jam 1', start: '07:15', end: '08:00' },
        { id: 2, type: 'lesson', name: 'Jam 2', start: '08:00', end: '08:45' },
        { id: 'break1', type: 'break', name: 'ISTIRAHAT PERTAMA', start: '08:45', end: '09:15' },
        { id: 3, type: 'lesson', name: 'Jam 3', start: '09:15', end: '10:00' },
        { id: 4, type: 'lesson', name: 'Jam 4', start: '10:00', end: '10:45' }
    ];

    // Ambil daftar tahun ajaran dari LocalStorage (atau default jika belum ada)
    let academicYears = JSON.parse(localStorage.getItem('academic_years_list')) || ['2025/2026', '2026/2027'];

    // STATE
    let selectedGuruId = 'all';
    let selectedSemester = 'Ganjil';
    let selectedTahun = academicYears[0] || '2025/2026';

    // DOM ELEMENTS
    const selectGuru = document.getElementById('selectGuru');
    const selectGanjilGenap = document.getElementById('selectGanjilGenap');
    const selectTahun = document.getElementById('selectTahun');
    const btnExportPDF = document.getElementById('btnExportPDF');
    const btnExportExcel = document.getElementById('btnExportExcel');

    // 2. LOGIKA UTAMA: RETRIEVE & AGGREGATE DATA DARI JADWAL PELAJARAN
    function getAggregatedTeacherSchedules() {
        let aggregated = {};

        // Inisialisasi array kosong untuk tiap guru
        guruList.forEach(g => { aggregated[g.id] = []; });

        // Cek data dummy lokal jika LocalStorage kosong (untuk demo)
        const localScheduleData = JSON.parse(localStorage.getItem('school_schedule_data')) || {
            'XI MIPA 1_Ganjil_2025/2026': [
                { day: 'Senin', slotId: 1, mapelCode: 'BIN-10', mapelName: 'Bahasa Indonesia', guruId: '1' },
                { day: 'Selasa', slotId: 2, mapelCode: 'INF-10', mapelName: 'Informatika', guruId: '2' },
                { day: 'Kamis', slotId: 1, mapelCode: 'INF-10', mapelName: 'Informatika', guruId: '2' }
            ],
            'X IPS 2_Ganjil_2025/2026': [
                { day: 'Selasa', slotId: 1, mapelCode: 'MTK-10', mapelName: 'Matematika Wajib', guruId: '3' },
                { day: 'Rabu', slotId: 3, mapelCode: 'OR-10', mapelName: 'Penjaskes / Olahraga', guruId: '4' }
            ]
        };

        // Filter kunci berdasarkan Semester & Tahun Ajaran yang terpilih
        Object.keys(localScheduleData).forEach(key => {
            const [kelas, semester, tahun] = key.split('_');

            if (semester === selectedSemester && tahun === selectedTahun) {
                const items = localScheduleData[key] || [];
                items.forEach(item => {
                    if (aggregated[item.guruId]) {
                        const slotObj = timeSlots.find(s => s.id == item.slotId);
                        aggregated[item.guruId].push({
                            ...item,
                            kelas: kelas,
                            timeStart: slotObj ? slotObj.start : '00:00',
                            timeEnd: slotObj ? slotObj.end : '00:00',
                            slotName: slotObj ? slotObj.name : `Jam ${item.slotId}`
                        });
                    }
                });
            }
        });

        return aggregated;
    }

    // 3. RENDER DROPDOWNS
    function initFilters() {
        if (selectGuru) {
            let guruOptions = `<option value="all">-- Semua Guru (Matriks) --</option>`;
            guruList.forEach(g => {
                guruOptions += `<option value="${g.id}">${g.name}</option>`;
            });
            selectGuru.innerHTML = guruOptions;
            selectGuru.value = selectedGuruId;
        }

        if (selectTahun) {
            selectTahun.innerHTML = academicYears.map(t => `<option value="${t}">Tahun: ${t}</option>`).join('');
            selectTahun.value = selectedTahun;
        }
    }

    // 4. RENDER TABEL JADWAL GURU
    function renderTeacherTable() {
        const tbody = document.querySelector('table tbody');
        if (!tbody) return;

        const aggregatedData = getAggregatedTeacherSchedules();

        const filteredTeachers = selectedGuruId === 'all' 
            ? guruList 
            : guruList.filter(g => g.id === selectedGuruId);

        tbody.innerHTML = '';

        if (filteredTeachers.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-textMuted font-medium">Data guru tidak ditemukan.</td></tr>`;
            return;
        }

        filteredTeachers.forEach(guru => {
            const tr = document.createElement('tr');
            const teacherSchedules = aggregatedData[guru.id] || [];

            let rowHtml = `
                <td class="p-3 border-r border-borderSoft bg-bgSoft/30 align-top">
                    <p class="font-bold text-textActive text-xs">${guru.name}</p>
                    <p class="text-[10px] text-textMuted mt-0.5">${guru.mapel}</p>
                    <span class="inline-block mt-1.5 text-[9px] bg-slate-100 text-slate-600 font-mono px-1.5 py-0.5 rounded border border-borderSoft">
                        NIP: ${guru.nip}
                    </span>
                </td>
            `;

            // Render per Hari (Senin - Jumat)
            masterDays.forEach(day => {
                const dayItems = teacherSchedules.filter(s => s.day.toLowerCase() === day.toLowerCase());

                rowHtml += `<td class="p-2 border-r border-borderSoft align-top">`;

                if (dayItems.length > 0) {
                    dayItems.forEach(item => {
                        rowHtml += `
                            <div class="p-2 bg-blue-50/90 border border-blue-200 rounded-lg mb-1.5 shadow-sm hover:border-primary transition-all">
                                <div class="flex items-center gap-1 text-primary font-extrabold text-[11px] bg-blue-100/80 px-1.5 py-0.5 rounded w-max mb-1 border border-blue-200/60">
                                    <i class="far fa-clock text-[10px]"></i>
                                    <span>${item.timeStart} - ${item.timeEnd}</span>
                                </div>
                                <p class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">${item.slotName}</p>
                                <p class="font-bold text-textActive text-xs mt-0.5">${item.kelas}</p>
                                <p class="text-[10px] text-textMuted truncate">${item.mapelName}</p>
                            </div>
                        `;
                    });
                } else {
                    rowHtml += `
                        <div class="h-full min-h-[50px] flex items-center justify-center">
                            <span class="text-slate-300 font-medium text-[10px] italic">- Kosong -</span>
                        </div>
                    `;
                }

                rowHtml += `</td>`;
            });

            tr.innerHTML = rowHtml;
            tbody.appendChild(tr);
        });

        updateClashStatusCard(aggregatedData);
    }

    // 5. CEK DETEKSI BENTROK (SATU GURU MENGAJAR KELAS BERBEDA DI HARI & JAM SAMA)
    function updateClashStatusCard(aggregatedData) {
        let clashCount = 0;

        Object.keys(aggregatedData).forEach(guruId => {
            const schedules = aggregatedData[guruId];
            const tracker = {};

            schedules.forEach(item => {
                const key = `${item.day}_${item.slotId}`;
                if (tracker[key]) {
                    clashCount++;
                } else {
                    tracker[key] = true;
                }
            });
        });

        // Update UI untuk Card Bentrok
        const clashContainer = document.getElementById('clashStatusCard');
        if (clashContainer) {
            if (clashCount > 0) {
                clashContainer.innerHTML = `
                    <div class="bg-red-50 p-4 rounded-2xl border border-red-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-[11px] font-semibold text-red-600 uppercase tracking-wider">Status Bentrok Jadwal</p>
                            <h3 class="text-lg font-extrabold text-red-700 mt-0.5">${clashCount} Jadwal Bentrok!</h3>
                            <p class="text-[10px] text-red-500 mt-0.5">Ada guru yang mengajar di 2 kelas pada jam yang sama.</p>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-base">
                            <i class="fas fa-triangle-exclamation"></i>
                        </div>
                    </div>
                `;
            } else {
                clashContainer.innerHTML = `
                    <div class="bg-white p-4 rounded-2xl border border-borderSoft shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-[11px] font-semibold text-textMuted uppercase tracking-wider">Status Bentrok Jadwal</p>
                            <h3 class="text-lg font-bold text-emerald-600 mt-0.5">Aman (0 Bentrok)</h3>
                            <p class="text-[10px] text-textMuted mt-0.5">Semua alokasi jam mengajar guru sudah sesuai.</p>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base">
                            <i class="fas fa-circle-check"></i>
                        </div>
                    </div>
                `;
            }
        }
    }

    // 6. EVENT HANDLERS
    if (selectGuru) {
        selectGuru.addEventListener('change', (e) => {
            selectedGuruId = e.target.value;
            renderTeacherTable();
            showToast(`Filter guru berhasil diubah!`);
        });
    }

    if (selectGanjilGenap) {
        selectGanjilGenap.addEventListener('change', (e) => {
            selectedSemester = e.target.value;
            renderTeacherTable();
            showToast(`Filter semester diubah ke ${selectedSemester}!`);
        });
    }

    if (selectTahun) {
        selectTahun.addEventListener('change', (e) => {
            selectedTahun = e.target.value;
            renderTeacherTable();
            showToast(`Tahun ajaran diubah ke ${selectedTahun}!`);
        });
    }

    // Cetak PDF
    if (btnExportPDF) {
        btnExportPDF.addEventListener('click', () => {
            showToast('Menyiapkan dokumen cetak jadwal guru...', 'info');
            setTimeout(() => {
                window.print();
            }, 800);
        });
    }

    // Export Excel
    if (btnExportExcel) {
        btnExportExcel.addEventListener('click', () => {
            const csvContent = "data:text/csv;charset=utf-8,Guru,Hari,Jam,Kelas,Mata Pelajaran\n" 
                + "Ahmad Dahlan,Senin,07:15-08:00,XI MIPA 1,Informatika";
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Jadwal_Guru_${selectedSemester}_${selectedTahun.replace('/', '-')}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('Jadwal Guru berhasil diexport ke CSV/Excel!');
        });
    }

    // TOAST NOTIFICATION UTILITY
    function showToast(msg, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `${type === 'warning' ? 'bg-amber-500' : type === 'info' ? 'bg-primary' : 'bg-slate-800'} text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center justify-between gap-3 transition-all duration-300`;
        toast.innerHTML = `<span>${msg}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // INITIALIZATION
    initFilters();
    renderTeacherTable();
});