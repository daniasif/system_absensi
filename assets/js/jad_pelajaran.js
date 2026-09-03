/**
 * jad_pelajaran.js
 * Fitur: Kelola Hari, Import/Download Excel, Semester Ganjil/Genap & Dynamic Input Tahun Ajaran
 * Update: Sinkronisasi data master guruList, guruId, dan localStorage 'school_schedule_data' dengan jad_guru.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DATA MASTER (SINKRON DENGAN jad_guru.js)
    const guruList = [
        { id: '1', name: 'Dra. Hj. Siti Aminah', nip: '19750312 200003 2 001', mapel: 'Bahasa Indonesia' },
        { id: '2', name: 'Ahmad Dahlan, S.Kom', nip: '19881020 201504 1 002', mapel: 'Informatika' },
        { id: '3', name: 'Eko Prasetyo, M.Pd', nip: '19820515 200801 1 003', mapel: 'Matematika Wajib' }
        
    ];

    // Master Mapel Turunan dari guruList + Mapel Umum
    const masterMapel = [
        { code: 'BIN-10', name: 'Bahasa Indonesia' },
        { code: 'INF-10', name: 'Informatika' },
        { code: 'MTK-10', name: 'Matematika Wajib' },
        { code: 'BIG-10', name: 'Bahasa Inggris' },
        { code: 'FIS-10', name: 'Fisika' }
    ];

    let masterDays = [
        { name: 'Senin', active: true },
        { name: 'Selasa', active: true },
        { name: 'Rabu', active: true },
        { name: 'Kamis', active: true },
        { name: 'Jumat', active: true },
        { name: 'Sabtu', active: false },
        { name: 'Minggu', active: false }
    ];

    let timeSlots = [
        { id: 1, type: 'lesson', name: 'Jam 1', start: '07:15', end: '08:00' },
        { id: 2, type: 'lesson', name: 'Jam 2', start: '08:00', end: '08:45' },
        { id: 'break1', type: 'break', name: 'ISTIRAHAT PERTAMA', start: '08:45', end: '09:15' },
        { id: 3, type: 'lesson', name: 'Jam 3', start: '09:15', end: '10:00' },
        { id: 4, type: 'lesson', name: 'Jam 4', start: '10:00', end: '10:45' }
    ];

    let academicYears = JSON.parse(localStorage.getItem('academic_years_list')) || ['2025/2026', '2026/2027'];

    // Ambil Data dari LocalStorage agar Sinkron dengan jad_guru.js
    let scheduleData = JSON.parse(localStorage.getItem('school_schedule_data')) || {
        'XI MIPA 1_Ganjil_2025/2026': [
            { day: 'Senin', slotId: 1, agendaName: '', mapelCode: 'BIN-10', mapelName: 'Bahasa Indonesia', guruId: '1' },
            { day: 'Selasa', slotId: 2, agendaName: '', mapelCode: 'INF-10', mapelName: 'Informatika', guruId: '2' },
            { day: 'Kamis', slotId: 1, agendaName: '', mapelCode: 'INF-10', mapelName: 'Informatika', guruId: '2' }
        ],
        'X IPS 2_Ganjil_2025/2026': [
            { day: 'Selasa', slotId: 1, agendaName: '', mapelCode: 'MTK-10', mapelName: 'Matematika Wajib', guruId: '3' }
            
        ]
    };

    let selectedTarget = 'XI MIPA 1';
    let selectedSemester = 'Ganjil';
    let selectedTahun = academicYears[0] || '2025/2026';

    function getStorageKey() {
        return `${selectedTarget}_${selectedSemester}_${selectedTahun}`;
    }

    function saveScheduleToLocalStorage() {
        localStorage.setItem('school_schedule_data', JSON.stringify(scheduleData));
    }

    function getActiveDays() {
        return masterDays.filter(d => d.active);
    }

    // DOM ELEMENTS
    const selectTarget = document.getElementById('selectTarget');
    const selectGanjilGenap = document.getElementById('selectGanjilGenap');
    const selectTahun = document.getElementById('selectTahun');
    const btnTambahTahun = document.getElementById('btnTambahTahun');

    // Modals
    const modalTahunAjaran = document.getElementById('modalTahunAjaran');
    const closeModalTahunBtn = document.getElementById('closeModalTahunBtn');
    const cancelModalTahunBtn = document.getElementById('cancelModalTahunBtn');
    const formTahunAjaran = document.getElementById('formTahunAjaran');
    const inputTahunAjaran = document.getElementById('inputTahunAjaran');

    const btnManageDays = document.getElementById('btnManageDays');
    const modalKelolaHari = document.getElementById('modalKelolaHari');
    const closeModalHariBtn = document.getElementById('closeModalHariBtn');
    const daysCheckboxContainer = document.getElementById('daysCheckboxContainer');
    const formTambahHariBaru = document.getElementById('formTambahHariBaru');
    const saveHariBtn = document.getElementById('saveHariBtn');

    const btnImportExcel = document.getElementById('btnImportExcel');
    const btnDownloadTemplate = document.getElementById('btnDownloadTemplate');
    const modalImportExcel = document.getElementById('modalImportExcel');
    const closeModalImportBtn = document.getElementById('closeModalImportBtn');
    const cancelModalImportBtn = document.getElementById('cancelModalImportBtn');
    const formImportExcel = document.getElementById('formImportExcel');
    const dropzoneExcel = document.getElementById('dropzoneExcel');
    const inputExcelFile = document.getElementById('inputExcelFile');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    const modalPlotJadwal = document.getElementById('modalPlotJadwal');
    const closeModalPlotBtn = document.getElementById('closeModalPlotBtn');
    const cancelModalPlotBtn = document.getElementById('cancelModalPlotBtn');
    const formPlotJadwal = document.getElementById('formPlotJadwal');
    
    const plotAgendaInput = document.getElementById('plotAgendaInput');
    const plotMapelSelect = document.getElementById('plotMapelSelect');
    const plotGuruSelect = document.getElementById('plotGuruSelect');

    const modalSlotJam = document.getElementById('modalSlotJam');
    const closeModalSlotBtn = document.getElementById('closeModalSlotBtn');
    const cancelModalSlotBtn = document.getElementById('cancelModalSlotBtn');
    const formSlotJam = document.getElementById('formSlotJam');

    // INITIALIZATION
    function init() {
        renderTahunAjaranOptions();
        populateSelectOptions();
        renderScheduleTable();
    }

    // Populate Select Box Mapel & Guru (Menggunakan guruList)
    function populateSelectOptions() {
        if (plotMapelSelect) {
            plotMapelSelect.innerHTML = `<option value="">-- Pilih Mata Pelajaran (Opsional) --</option>` +
                masterMapel.map(m => `<option value="${m.name}" data-code="${m.code}">${m.name}</option>`).join('');
        }
        if (plotGuruSelect) {
            plotGuruSelect.innerHTML = `<option value="">-- Pilih Guru / Penanggung Jawab --</option>` +
                guruList.map(g => `<option value="${g.id}">${g.name} (${g.mapel})</option>`).join('');
        }
    }

    // Otomatis Pilih Mapel saat Guru Dipilih di Modal
    if (plotGuruSelect && plotMapelSelect) {
        plotGuruSelect.addEventListener('change', (e) => {
            const gId = e.target.value;
            const selectedGuru = guruList.find(g => g.id === gId);
            if (selectedGuru) {
                // Cari mapel yang sesuai dengan guru
                const matchedOption = Array.from(plotMapelSelect.options).find(opt => opt.value === selectedGuru.mapel);
                if (matchedOption) {
                    plotMapelSelect.value = selectedGuru.mapel;
                }
            }
        });
    }

    function renderTahunAjaranOptions() {
        if (!selectTahun) return;
        selectTahun.innerHTML = academicYears.map(t => `<option value="${t}">Tahun: ${t}</option>`).join('');
        selectTahun.value = selectedTahun;
    }

    // RENDER TABLE MATRIX
    function renderScheduleTable() {
        const activeDays = getActiveDays();
        const headerRow = document.getElementById('tableHeaderRow');
        
        if (headerRow) {
            let headerHtml = `
                <th class="p-3.5 text-center w-20 border-r border-borderSoft">
                    <button id="btnAddTimeSlot" title="Tambah Jam Pelajaran/Istirahat" class="px-2 py-1 bg-primary text-white text-[10px] rounded-lg hover:bg-primaryDark transition-all flex items-center gap-1 mx-auto">
                        <i class="fas fa-plus"></i> Jam
                    </button>
                </th>
                <th class="p-3.5 text-center w-36 border-r border-borderSoft font-bold">Waktu</th>
            `;

            activeDays.forEach(day => {
                headerHtml += `
                    <th class="p-3.5 border-r border-borderSoft text-center">
                        <div class="flex items-center justify-between">
                            <span class="font-bold">${day.name}</span>
                            <button class="btn-remove-day text-slate-300 hover:text-danger text-[11px]" data-day="${day.name}" title="Sembunyikan Hari ${day.name}">
                                <i class="fas fa-xmark"></i>
                            </button>
                        </div>
                    </th>
                `;
            });

            headerHtml += `
                <th class="p-3.5 text-center w-28 bg-slate-50">
                    <button id="btnQuickAddDay" class="px-2.5 py-1.5 border border-dashed border-primary text-primary hover:bg-primarySoft rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 w-full transition-all">
                        <i class="fas fa-plus-circle"></i> Hari
                    </button>
                </th>
            `;

            headerRow.innerHTML = headerHtml;

            document.getElementById('btnAddTimeSlot').onclick = () => openSlotModal();
            document.getElementById('btnQuickAddDay').onclick = () => openKelolaHariModal();

            document.querySelectorAll('.btn-remove-day').forEach(btn => {
                btn.onclick = (e) => {
                    const dayName = e.currentTarget.dataset.day;
                    toggleDayStatus(dayName, false);
                };
            });
        }

        const tbody = document.querySelector('table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        timeSlots.forEach((slot) => {
            const tr = document.createElement('tr');

            if (slot.type === 'break') {
                tr.className = 'bg-amber-50/60';
                tr.innerHTML = `
                    <td class="p-2 text-center border-r border-borderSoft">
                        <div class="flex items-center justify-center gap-1">
                            <button class="btn-edit-slot text-amber-600 hover:text-amber-800 text-xs" data-id="${slot.id}"><i class="fas fa-pen"></i></button>
                            <button class="btn-delete-slot text-slate-300 hover:text-danger text-xs" data-id="${slot.id}"><i class="fas fa-trash-can"></i></button>
                        </div>
                    </td>
                    <td class="p-2.5 text-center font-bold text-amber-800 border-r border-borderSoft text-[11px]" colspan="${activeDays.length + 2}">
                        <div class="flex items-center justify-center gap-2">
                            <i class="fas fa-mug-hot"></i>
                            <span>${slot.name} (${slot.start} - ${slot.end})</span>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
                return;
            }

            let rowHtml = `
                <td class="p-2 text-center border-r border-borderSoft bg-bgSoft/30">
                    <div class="flex items-center justify-center gap-1.5">
                        <button class="btn-edit-slot text-slate-400 hover:text-primary text-xs" data-id="${slot.id}"><i class="fas fa-pen"></i></button>
                        <button class="btn-delete-slot text-slate-300 hover:text-danger text-xs" data-id="${slot.id}"><i class="fas fa-trash-can"></i></button>
                    </div>
                </td>
                <td class="p-3 text-center bg-bgSoft/50 font-bold text-slate-600 border-r border-borderSoft">
                    <span class="block text-xs">${slot.name}</span>
                    <span class="text-[10px] font-normal text-textMuted">${slot.start} - ${slot.end}</span>
                </td>
            `;

            activeDays.forEach((day) => {
                const item = getScheduleItem(day.name, slot.id);

                if (item) {
                    const guruObj = guruList.find(g => g.id === item.guruId);
                    const guruName = guruObj ? guruObj.name : '-';

                    const titleDisplay = item.agendaName || item.mapelName;
                    const badgeDisplay = item.agendaName ? 'AGENDA' : (item.mapelCode || 'MP');
                    const badgeClass = item.agendaName ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-primary';

                    rowHtml += `
                        <td class="p-2 border-r border-borderSoft">
                            <div class="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 hover:border-primary transition-all cursor-pointer group relative">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-[9px] font-bold ${badgeClass} px-1.5 py-0.5 rounded">${badgeDisplay}</span>
                                    <div class="flex items-center gap-1.5">
                                        <button class="btn-edit-jadwal text-[10px] text-slate-400 hover:text-primary" data-day="${day.name}" data-slot="${slot.id}"><i class="fas fa-pen"></i></button>
                                        <button class="btn-delete-jadwal text-[10px] text-slate-400 hover:text-danger" data-day="${day.name}" data-slot="${slot.id}"><i class="fas fa-trash"></i></button>
                                    </div>
                                </div>
                                <p class="font-bold text-textActive text-xs leading-snug">${titleDisplay}</p>
                                <p class="text-[10px] text-textMuted mt-0.5 truncate">${guruName}</p>
                            </div>
                        </td>
                    `;
                } else {
                    rowHtml += `
                        <td class="p-2 border-r border-borderSoft">
                            <div class="btn-add-slot p-2.5 rounded-xl border border-dashed border-borderSoft hover:border-primary bg-bgSoft flex flex-col items-center justify-center py-3 cursor-pointer text-slate-400 hover:text-primary transition-all"
                                 data-day="${day.name}" data-slot="${slot.id}">
                                <i class="fas fa-plus text-xs mb-1"></i>
                                <span class="text-[10px] font-semibold">Kosong</span>
                            </div>
                        </td>
                    `;
                }
            });

            rowHtml += `<td class="bg-slate-50/50 border-r border-borderSoft"></td>`;

            tr.innerHTML = rowHtml;
            tbody.appendChild(tr);
        });

        bindEvents();
    }

    function getScheduleItem(day, slotId) {
        const key = getStorageKey();
        const list = scheduleData[key] || [];
        return list.find(s => s.day.toLowerCase() === day.toLowerCase() && s.slotId == slotId);
    }

    function toggleDayStatus(dayName, status) {
        const target = masterDays.find(d => d.name.toLowerCase() === dayName.toLowerCase());
        if (target) {
            target.active = status;
            renderScheduleTable();
            showToast(`Status hari ${dayName} diperbarui!`);
        }
    }

    // TAHUN AJARAN LOGIC
    if (btnTambahTahun) btnTambahTahun.onclick = () => modalTahunAjaran.classList.remove('hidden');
    if (closeModalTahunBtn) closeModalTahunBtn.onclick = () => modalTahunAjaran.classList.add('hidden');
    if (cancelModalTahunBtn) cancelModalTahunBtn.onclick = () => modalTahunAjaran.classList.add('hidden');

    if (formTahunAjaran) {
        formTahunAjaran.onsubmit = (e) => {
            e.preventDefault();
            const val = inputTahunAjaran.value.trim();
            if (val) {
                if (!academicYears.includes(val)) {
                    academicYears.push(val);
                    localStorage.setItem('academic_years_list', JSON.stringify(academicYears));
                    selectedTahun = val;
                    renderTahunAjaranOptions();
                    renderScheduleTable();
                    showToast(`Tahun ajaran ${val} berhasil ditambahkan!`);
                    inputTahunAjaran.value = '';
                    modalTahunAjaran.classList.add('hidden');
                } else {
                    showToast('Tahun ajaran sudah ada!', 'warning');
                }
            }
        };
    }

    // KELOLA HARI LOGIC
    function openKelolaHariModal() {
        if (!modalKelolaHari || !daysCheckboxContainer) return;

        daysCheckboxContainer.innerHTML = masterDays.map((d, index) => `
            <label class="flex items-center justify-between p-2 rounded-lg hover:bg-white border border-transparent hover:border-borderSoft cursor-pointer">
                <span class="text-xs font-semibold text-textActive">${d.name}</span>
                <input type="checkbox" data-index="${index}" ${d.active ? 'checked' : ''} class="w-4 h-4 text-primary rounded border-slate-300">
            </label>
        `).join('');

        modalKelolaHari.classList.remove('hidden');
    }

    if (btnManageDays) btnManageDays.onclick = openKelolaHariModal;
    if (closeModalHariBtn) closeModalHariBtn.onclick = () => modalKelolaHari.classList.add('hidden');

    if (formTambahHariBaru) {
        formTambahHariBaru.onsubmit = (e) => {
            e.preventDefault();
            const input = document.getElementById('inputCustomDay');
            const dayName = input.value.trim();
            if (dayName) {
                const exists = masterDays.some(d => d.name.toLowerCase() === dayName.toLowerCase());
                if (!exists) {
                    masterDays.push({ name: dayName, active: true });
                    openKelolaHariModal();
                    input.value = '';
                    renderScheduleTable();
                    showToast(`Hari ${dayName} ditambahkan!`);
                } else {
                    showToast('Hari sudah ada!', 'warning');
                }
            }
        };
    }

    if (saveHariBtn) {
        saveHariBtn.onclick = () => {
            const checkboxes = daysCheckboxContainer.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                const idx = cb.dataset.index;
                masterDays[idx].active = cb.checked;
            });
            modalKelolaHari.classList.add('hidden');
            renderScheduleTable();
            showToast('Daftar blok hari berhasil diperbarui!');
        };
    }

    // EXCEL IMPORT & DOWNLOAD LOGIC
    if (btnDownloadTemplate) {
        btnDownloadTemplate.onclick = () => {
            const templateData = "Hari,JamKe,AgendaAtauMapel,GuruID\nSenin,1,Bahasa Indonesia,1\nSelasa,2,Informatika,2";
            const blob = new Blob([templateData], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', `Template_Jadwal_${selectedTarget}_${selectedSemester}_${selectedTahun.replace('/', '-')}.csv`);
            a.click();
            showToast('Template Excel berhasil diunduh!');
        };
    }

    if (btnImportExcel) btnImportExcel.onclick = () => modalImportExcel.classList.remove('hidden');
    if (closeModalImportBtn) closeModalImportBtn.onclick = () => modalImportExcel.classList.add('hidden');
    if (cancelModalImportBtn) cancelModalImportBtn.onclick = () => modalImportExcel.classList.add('hidden');

    if (dropzoneExcel && inputExcelFile) {
        dropzoneExcel.onclick = () => inputExcelFile.click();
        inputExcelFile.onchange = (e) => {
            if (e.target.files.length > 0) {
                fileNameDisplay.textContent = `File dipilih: ${e.target.files[0].name}`;
                fileNameDisplay.classList.remove('hidden');
            }
        };
    }

    if (formImportExcel) {
        formImportExcel.onsubmit = (e) => {
            e.preventDefault();
            if (!inputExcelFile.files.length) {
                showToast('Pilih file Excel terlebih dahulu!', 'warning');
                return;
            }
            modalImportExcel.classList.add('hidden');
            showToast('Data jadwal berhasil diimport!');
            inputExcelFile.value = '';
            fileNameDisplay.classList.add('hidden');
        };
    }

    // PLOT JADWAL ACTION
    function openPlotModal(day, slotId) {
        document.getElementById('plotDayInput').value = day;
        document.getElementById('plotSlotIdInput').value = slotId;

        const existing = getScheduleItem(day, slotId);
        if (existing) {
            plotAgendaInput.value = existing.agendaName || '';
            plotMapelSelect.value = existing.mapelName || '';
            plotGuruSelect.value = existing.guruId || '';
        } else {
            plotAgendaInput.value = '';
            plotMapelSelect.value = '';
            plotGuruSelect.value = '';
        }

        modalPlotJadwal.classList.remove('hidden');
    }

    if (formPlotJadwal) {
        formPlotJadwal.onsubmit = (e) => {
            e.preventDefault();
            const day = document.getElementById('plotDayInput').value;
            const slotId = document.getElementById('plotSlotIdInput').value;
            
            const agenda = plotAgendaInput.value.trim();
            const selectedMapelOption = plotMapelSelect.options[plotMapelSelect.selectedIndex];
            const mapelName = plotMapelSelect.value;
            const mapelCode = selectedMapelOption ? selectedMapelOption.dataset.code || 'MP' : '';
            const guruId = plotGuruSelect.value;

            if (!agenda && !mapelName) {
                showToast('Isi agenda kegiatan atau pilih mata pelajaran!', 'warning');
                return;
            }

            const key = getStorageKey();
            if (!scheduleData[key]) scheduleData[key] = [];
            
            // Hapus data eksisting di slot jam & hari ini
            scheduleData[key] = scheduleData[key].filter(s => !(s.day.toLowerCase() === day.toLowerCase() && s.slotId == slotId));
            
            // Push data baru
            scheduleData[key].push({
                day,
                slotId: isNaN(slotId) ? slotId : parseInt(slotId),
                agendaName: agenda,
                mapelCode: mapelCode,
                mapelName: mapelName,
                guruId: guruId
            });

            saveScheduleToLocalStorage(); // Simpan ke LocalStorage agar terhubung dengan jad_guru.js
            modalPlotJadwal.classList.add('hidden');
            renderScheduleTable();
            showToast('Jadwal berhasil disimpan!');
        };
    }

    if (closeModalPlotBtn) closeModalPlotBtn.onclick = () => modalPlotJadwal.classList.add('hidden');
    if (cancelModalPlotBtn) cancelModalPlotBtn.onclick = () => modalPlotJadwal.classList.add('hidden');

    function openSlotModal(slotId = null) {
        document.getElementById('slotIdInput').value = slotId || '';
        modalSlotJam.classList.remove('hidden');
    }

    if (formSlotJam) {
        formSlotJam.onsubmit = (e) => {
            e.preventDefault();
            const id = document.getElementById('slotIdInput').value;
            const type = document.getElementById('slotTypeInput').value;
            const name = document.getElementById('slotNameInput').value;
            const start = document.getElementById('startTimeInput').value;
            const end = document.getElementById('endTimeInput').value;

            if (id) {
                const slot = timeSlots.find(s => s.id == id);
                if (slot) Object.assign(slot, { type, name, start, end });
            } else {
                timeSlots.push({ id: Date.now(), type, name, start, end });
            }

            modalSlotJam.classList.add('hidden');
            renderScheduleTable();
            showToast('Slot jam berhasil disesuaikan!');
        };
    }

    if (closeModalSlotBtn) closeModalSlotBtn.onclick = () => modalSlotJam.classList.add('hidden');
    if (cancelModalSlotBtn) cancelModalSlotBtn.onclick = () => modalSlotJam.classList.add('hidden');

    function bindEvents() {
        document.querySelectorAll('.btn-add-slot').forEach(el => el.onclick = (e) => openPlotModal(e.currentTarget.dataset.day, e.currentTarget.dataset.slot));
        document.querySelectorAll('.btn-edit-jadwal').forEach(el => el.onclick = (e) => openPlotModal(e.currentTarget.dataset.day, e.currentTarget.dataset.slot));
        document.querySelectorAll('.btn-delete-jadwal').forEach(el => el.onclick = (e) => {
            const { day, slot } = e.currentTarget.dataset;
            const key = getStorageKey();
            scheduleData[key] = (scheduleData[key] || []).filter(s => !(s.day.toLowerCase() === day.toLowerCase() && s.slotId == slot));
            saveScheduleToLocalStorage();
            renderScheduleTable();
            showToast('Jadwal dihapus!', 'warning');
        });
        document.querySelectorAll('.btn-edit-slot').forEach(el => el.onclick = (e) => openSlotModal(e.currentTarget.dataset.id));
        document.querySelectorAll('.btn-delete-slot').forEach(el => el.onclick = (e) => {
            timeSlots = timeSlots.filter(s => s.id != e.currentTarget.dataset.id);
            renderScheduleTable();
            showToast('Slot jam dihapus!', 'warning');
        });
    }

    if (selectTarget) selectTarget.onchange = (e) => { selectedTarget = e.target.value; renderScheduleTable(); };
    if (selectGanjilGenap) selectGanjilGenap.onchange = (e) => { selectedSemester = e.target.value; renderScheduleTable(); };
    if (selectTahun) selectTahun.onchange = (e) => { selectedTahun = e.target.value; renderScheduleTable(); };

    function showToast(msg, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `${type === 'warning' ? 'bg-amber-500' : 'bg-slate-800'} text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center justify-between gap-3`;
        toast.innerHTML = `<span>${msg}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    init();
});