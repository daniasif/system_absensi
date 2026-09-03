/**
 * kalender.js
 * Kalender Akademik + Mini Calendar Datepicker Preview Pop-up
 */

document.addEventListener('DOMContentLoaded', () => {
    let academicEvents = JSON.parse(localStorage.getItem('academic_calendar_events')) || [
        { id: '1', date: '2026-08-17', endDate: '2026-08-17', title: 'HUT RI ke-81', category: 'libur', desc: 'Upacara dan Libur Nasional' },
        { id: '2', date: '2026-08-25', endDate: '2026-08-25', title: 'Rapat Dewan Guru', category: 'penting', desc: 'Evaluasi Pembelajaran Bulanan' },
        { id: '3', date: '2026-08-12', endDate: '2026-08-14', title: 'Ujian Sekolah', category: 'ujian', desc: 'Pelaksanaan Ujian' }
    ];

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth(); 
    let currentYear = currentDate.getFullYear();

    // Mini Popover Picker State
    let miniPickerMonth = currentMonth;
    let miniPickerYear = currentYear;

    // DOM Elements
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthYearLabel = document.getElementById('currentMonthYearLabel');

    // Popover Elements
    const btnToggleMiniPicker = document.getElementById('btnToggleMiniPicker');
    const miniPickerPopover = document.getElementById('miniPickerPopover');
    const closeMiniPickerBtn = document.getElementById('closeMiniPickerBtn');
    const miniYearSelect = document.getElementById('miniYearSelect');
    const miniMonthSelect = document.getElementById('miniMonthSelect');
    const miniCalendarGrid = document.getElementById('miniCalendarGrid');
    const miniPrevBtn = document.getElementById('miniPrevBtn');
    const miniNextBtn = document.getElementById('miniNextBtn');

    // Nav Controls
    const btnPrevMonth = document.getElementById('btnPrevMonth');
    const btnNextMonth = document.getElementById('btnNextMonth');
    const btnToday = document.getElementById('btnToday');

    // Modal Elements
    const btnTambahAgenda = document.getElementById('btnTambahAgenda');
    const modalAgenda = document.getElementById('modalAgenda');
    const closeModalAgendaBtn = document.getElementById('closeModalAgendaBtn');
    const cancelModalAgendaBtn = document.getElementById('cancelModalAgendaBtn');
    const formAgenda = document.getElementById('formAgenda');

    const agendaIdInput = document.getElementById('agendaIdInput');
    const agendaTitleInput = document.getElementById('agendaTitleInput');
    const agendaDateInput = document.getElementById('agendaDateInput');
    const agendaEndDateInput = document.getElementById('agendaEndDateInput');
    const agendaCategoryInput = document.getElementById('agendaCategoryInput');
    const agendaDescInput = document.getElementById('agendaDescInput');
    const btnDeleteAgenda = document.getElementById('btnDeleteAgenda');
    const btnExportPDF = document.getElementById('btnExportPDF');
    const btnDownloadTemplate = document.getElementById('btnDownloadTemplate');
    const inputImportExcel = document.getElementById('inputImportExcel');

    function init() {
        populateMiniYears();
        renderCalendar();
    }

    function saveEventsToStorage() {
        localStorage.setItem('academic_calendar_events', JSON.stringify(academicEvents));
    }

    function populateMiniYears() {
        if (!miniYearSelect) return;
        miniYearSelect.innerHTML = '';
        for (let y = 1903; y <= 2100; y++) {
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = y;
            if (y === currentYear) opt.selected = true;
            miniYearSelect.appendChild(opt);
        }
    }

    // RENDER MAIN CALENDAR
    function renderCalendar() {
        if (!calendarGrid) return;

        if (currentMonthYearLabel) {
            currentMonthYearLabel.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        }

        calendarGrid.innerHTML = '';

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
        const today = new Date();

        // 1. Hari Bulan Sebelumnya
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const dayNum = prevMonthDays - i;
            const cell = createCellElement(dayNum, 'text-slate-300 bg-slate-50/40 opacity-50');
            calendarGrid.appendChild(cell);
        }

        // 2. Hari Bulan Ini
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;

            let cellClass = 'bg-white hover:bg-slate-50 transition-colors group';
            if (isToday) cellClass += ' bg-blue-50/40';

            const cell = createCellElement(day, cellClass, dateStr, true, isToday);

            // Filter event rentang multi-day (dari tgl mulai sampe tgl selesai otomatis ke-render)
            const dayEvents = academicEvents.filter(e => {
                const start = e.date;
                const end = e.endDate || e.date;
                return dateStr >= start && dateStr <= end;
            });

            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'space-y-1 mb-2 flex-1';

            dayEvents.forEach(evt => {
                const badge = document.createElement('div');
                badge.className = `p-1.5 rounded-lg text-[10px] font-bold leading-tight truncate shadow-2xs cursor-pointer transition-transform hover:scale-[1.02] flex items-center gap-1.5 ${getCategoryBadgeStyle(evt.category)}`;
                badge.innerHTML = `<i class="fas fa-circle text-[6px]"></i><span>${evt.title}</span>`;
                badge.onclick = (e) => {
                    e.stopPropagation();
                    openAgendaModal(evt);
                };
                eventsContainer.appendChild(badge);
            });

            cell.appendChild(eventsContainer);

            // Kartu Tombol Tambah + Kosong persis seperti gaya jadwal pelajaran di gambar referensi
            const addCardBtn = document.createElement('div');
            addCardBtn.className = 'w-full p-2 border-2 border-dashed border-blue-200 group-hover:border-blue-400 rounded-xl flex flex-col items-center justify-center text-primary bg-blue-50/20 group-hover:bg-blue-50/60 transition-all cursor-pointer mt-auto shadow-2xs';
            addCardBtn.innerHTML = `
                <i class="fas fa-plus text-xs"></i>
                <span class="text-[10px] font-bold leading-tight mt-0.5">Kosong</span>
            `;
            addCardBtn.onclick = (e) => {
                e.stopPropagation();
                openAgendaModal({ date: dateStr });
            };
            cell.appendChild(addCardBtn);

            calendarGrid.appendChild(cell);
        }

        // 3. Hari Bulan Berikutnya
        const totalCells = calendarGrid.children.length;
        const remainingCells = (totalCells > 35 ? 42 : 35) - totalCells;

        for (let i = 1; i <= remainingCells; i++) {
            const cell = createCellElement(i, 'text-slate-300 bg-slate-50/40 opacity-50');
            calendarGrid.appendChild(cell);
        }
    }

    function createCellElement(dayNum, customClasses, dateStr = null, isCurrentMonth = false, isToday = false) {
        const cell = document.createElement('div');
        cell.className = `min-h-[120px] p-2 border-b border-r border-borderSoft flex flex-col justify-between relative overflow-y-auto ${customClasses}`;

        const headerDiv = document.createElement('div');
        headerDiv.className = 'flex items-center justify-between mb-1';

        const numSpan = document.createElement('span');
        numSpan.className = `text-xs font-bold ${isToday ? 'w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-xs' : 'text-slate-700'}`;
        numSpan.textContent = dayNum;

        headerDiv.appendChild(numSpan);
        cell.appendChild(headerDiv);

        return cell;
    }

    function getCategoryBadgeStyle(category) {
        switch (category) {
            case 'libur': return 'bg-red-100 text-danger border border-red-200';
            case 'ujian': return 'bg-amber-100 text-amber-800 border border-amber-200';
            case 'penting': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
            case 'kegiatan': default: return 'bg-blue-100 text-primary border border-blue-200';
        }
    }

    // RENDER MINI DATEPICKER PREVIEW IN POPOVER
    function renderMiniCalendar() {
        if (!miniCalendarGrid) return;
        miniCalendarGrid.innerHTML = '';

        if (miniYearSelect) miniYearSelect.value = miniPickerYear;
        if (miniMonthSelect) miniMonthSelect.value = miniPickerMonth;

        const firstDay = new Date(miniPickerYear, miniPickerMonth, 1).getDay();
        const daysInMonth = new Date(miniPickerYear, miniPickerMonth + 1, 0).getDate();
        const prevMonthDays = new Date(miniPickerYear, miniPickerMonth, 0).getDate();
        const today = new Date();

        // Prev Month Days
        for (let i = firstDay - 1; i >= 0; i--) {
            const btn = document.createElement('div');
            btn.className = 'py-1 text-slate-300 pointer-events-none';
            btn.textContent = prevMonthDays - i;
            miniCalendarGrid.appendChild(btn);
        }

        // Current Month Days
        for (let d = 1; d <= daysInMonth; d++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            const isToday = today.getDate() === d && today.getMonth() === miniPickerMonth && today.getFullYear() === miniPickerYear;

            btn.className = `py-1 rounded-lg font-semibold transition-all hover:bg-primarySoft hover:text-primary ${
                isToday ? 'bg-primary text-white font-bold' : 'text-slate-700'
            }`;
            btn.textContent = d;

            btn.onclick = () => {
                currentMonth = miniPickerMonth;
                currentYear = miniPickerYear;
                renderCalendar();
                miniPickerPopover.classList.add('hidden');
            };

            miniCalendarGrid.appendChild(btn);
        }
    }

    if (btnToggleMiniPicker) {
        btnToggleMiniPicker.onclick = (e) => {
            e.stopPropagation();
            miniPickerMonth = currentMonth;
            miniPickerYear = currentYear;
            renderMiniCalendar();
            miniPickerPopover.classList.toggle('hidden');
        };
    }

    if (closeMiniPickerBtn) {
        closeMiniPickerBtn.onclick = () => miniPickerPopover.classList.add('hidden');
    }

    if (miniYearSelect) {
        miniYearSelect.onchange = (e) => {
            miniPickerYear = parseInt(e.target.value, 10);
            renderMiniCalendar();
        };
    }

    if (miniMonthSelect) {
        miniMonthSelect.onchange = (e) => {
            miniPickerMonth = parseInt(e.target.value, 10);
            renderMiniCalendar();
        };
    }

    if (miniPrevBtn) {
        miniPrevBtn.onclick = () => {
            miniPickerMonth--;
            if (miniPickerMonth < 0) {
                miniPickerMonth = 11;
                miniPickerYear--;
            }
            renderMiniCalendar();
        };
    }

    if (miniNextBtn) {
        miniNextBtn.onclick = () => {
            miniPickerMonth++;
            if (miniPickerMonth > 11) {
                miniPickerMonth = 0;
                miniPickerYear++;
            }
            renderMiniCalendar();
        };
    }

    document.addEventListener('click', (e) => {
        if (miniPickerPopover && !miniPickerPopover.classList.contains('hidden')) {
            if (!miniPickerPopover.contains(e.target) && !btnToggleMiniPicker.contains(e.target)) {
                miniPickerPopover.classList.add('hidden');
            }
        }
    });

    if (btnPrevMonth) {
        btnPrevMonth.onclick = () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        };
    }

    if (btnNextMonth) {
        btnNextMonth.onclick = () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        };
    }

    if (btnToday) {
        btnToday.onclick = () => {
            const now = new Date();
            currentMonth = now.getMonth();
            currentYear = now.getFullYear();
            renderCalendar();
        };
    }

    // Modal Agenda Handlers
    function openAgendaModal(data = {}) {
        if (!modalAgenda) return;
        if (data.id) {
            agendaIdInput.value = data.id;
            agendaTitleInput.value = data.title || '';
            agendaDateInput.value = data.date || '';
            if (agendaEndDateInput) agendaEndDateInput.value = data.endDate || data.date || '';
            agendaCategoryInput.value = data.category || 'kegiatan';
            agendaDescInput.value = data.desc || '';
            if (btnDeleteAgenda) btnDeleteAgenda.classList.remove('hidden');
        } else {
            agendaIdInput.value = '';
            agendaTitleInput.value = '';
            agendaDateInput.value = data.date || `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
            if (agendaEndDateInput) agendaEndDateInput.value = data.date || `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
            agendaCategoryInput.value = 'kegiatan';
            agendaDescInput.value = '';
            if (btnDeleteAgenda) btnDeleteAgenda.classList.add('hidden');
        }
        modalAgenda.classList.remove('hidden');
    }

    function closeModal() {
        if (modalAgenda) modalAgenda.classList.add('hidden');
    }

    if (btnTambahAgenda) btnTambahAgenda.onclick = () => openAgendaModal();
    if (closeModalAgendaBtn) closeModalAgendaBtn.onclick = closeModal;
    if (cancelModalAgendaBtn) cancelModalAgendaBtn.onclick = closeModal;

    if (formAgenda) {
        formAgenda.onsubmit = (e) => {
            e.preventDefault();
            const id = agendaIdInput.value;
            const title = agendaTitleInput.value.trim();
            const startDateStr = agendaDateInput.value;
            const endDateStr = (agendaEndDateInput && agendaEndDateInput.value) ? agendaEndDateInput.value : startDateStr;
            const category = agendaCategoryInput.value;
            const desc = agendaDescInput.value.trim();

            if (id) {
                const item = academicEvents.find(e => e.id === id);
                if (item) Object.assign(item, { title, date: startDateStr, endDate: endDateStr, category, desc });
            } else {
                academicEvents.push({
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
                    title,
                    date: startDateStr,
                    endDate: endDateStr >= startDateStr ? endDateStr : startDateStr,
                    category,
                    desc
                });
            }

            saveEventsToStorage();
            renderCalendar();
            closeModal();
            showToast('Agenda kalender berhasil disimpan!');
        };
    }

    if (btnDeleteAgenda) {
        btnDeleteAgenda.onclick = () => {
            const id = agendaIdInput.value;
            if (id) {
                academicEvents = academicEvents.filter(e => e.id !== id);
                saveEventsToStorage();
                renderCalendar();
                closeModal();
                showToast('Agenda berhasil dihapus!', 'warning');
            }
        };
    }

    if (btnDownloadTemplate) {
        btnDownloadTemplate.onclick = () => {
            const csvContent = "data:text/csv;charset=utf-8," 
                + "Tanggal Mulai (YYYY-MM-DD),Tanggal Selesai (YYYY-MM-DD),Judul Agenda,Kategori (kegiatan/ujian/libur/penting),Keterangan\n"
                + "2026-08-17,2026-08-17,HUT RI Ke-81,libur,Upacara Bendera\n"
                + "2026-09-12,2026-09-14,Ujian Sekolah,ujian,Ujian Semester";

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "Template_Kalender_Akademik.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('Template berhasil diunduh!');
        };
    }

    if (inputImportExcel) {
        inputImportExcel.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                const lines = text.split('\n');
                let countImported = 0;

                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    const cols = line.split(',');
                    if (cols.length >= 2) {
                        const date = cols[0].trim();
                        const endDate = cols[1] ? cols[1].trim() : date;
                        const title = cols[2] ? cols[2].trim() : cols[1].trim();
                        const category = cols[3] ? cols[3].trim().toLowerCase() : 'kegiatan';
                        const desc = cols[4] ? cols[4].trim() : '';

                        if (date && title) {
                            academicEvents.push({
                                id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
                                date, 
                                endDate,
                                title,
                                category: ['libur', 'ujian', 'penting', 'kegiatan'].includes(category) ? category : 'kegiatan',
                                desc
                            });
                            countImported++;
                        }
                    }
                }

                if (countImported > 0) {
                    saveEventsToStorage();
                    renderCalendar();
                    showToast(`${countImported} agenda berhasil di-import!`);
                } else {
                    showToast('Gagal membaca data dari file!', 'warning');
                }
                inputImportExcel.value = '';
            };
            reader.readAsText(file);
        };
    }

    if (btnExportPDF) {
        btnExportPDF.onclick = () => {
            showToast('Memproses cetak PDF Kalender Akademik...');
            window.print();
        };
    }

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