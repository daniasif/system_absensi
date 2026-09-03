// MATAPELAJARAN.JS - Grid View dengan Complete Multi-Silabus & Responsif CRUD

// 1. DATA MASTER GURU
const masterGuruList = [
    { id: 1, nama: 'Dra. Hj. Siti Aminah, M.Pd', nip: '197508121999032001', email: 'siti.aminah@sekolah.sch.id' },
    { id: 2, nama: 'Ahmad Dahlan, S.Kom', nip: '199001152019031008', email: 'ahmad.dahlan@sekolah.sch.id' },
    { id: 3, nama: 'Eko Prasetyo, M.Pd', nip: '198811202022211002', email: 'eko.prasetyo@sekolah.sch.id' }
];

// 2. DATA MASTER KELAS
const masterKelasList = ['XI MIPA 1', 'XI MIPA 2', 'X IPS 2'];

// 3. DATA MASTER MAPEL
let masterMapel = [
    {
        id: 1,
        kode: 'BIN-10',
        nama: 'Bahasa Indonesia',
        kelompok: 'Wajib A',
        beban: 3,
        silabus: [
            { id: 'sil-1', name: 'Silabus_Bahasa_Indonesia_X.pdf', size: '1.2 MB', url: '#' }
        ],
        pengampu: [
            { 
                guruId: 1, 
                namaGuru: 'Dra. Hj. Siti Aminah, M.Pd', 
                nip: '197508121999032001',
                email: 'siti.aminah@sekolah.sch.id',
                kelas: ['XI MIPA 1', 'XI MIPA 2'] 
            }
        ]
    },
    {
        id: 2,
        kode: 'MTK-10',
        nama: 'Matematika Wajib',
        kelompok: 'Wajib A',
        beban: 4,
        silabus: [
            { id: 'sil-2', name: 'Silabus_Matematika_X_Sem1.pdf', size: '2.4 MB', url: '#' },
            { id: 'sil-3', name: 'Silabus_Matematika_X_Sem2.pdf', size: '2.1 MB', url: '#' }
        ],
        pengampu: [
            { 
                guruId: 3, 
                namaGuru: 'Eko Prasetyo, M.Pd', 
                nip: '198811202022211002',
                email: 'eko.prasetyo@sekolah.sch.id',
                kelas: ['XI MIPA 1'] 
            },
            { 
                guruId: 2, 
                namaGuru: 'Ahmad Dahlan, S.Kom', 
                nip: '199001152019031008',
                email: 'ahmad.dahlan@sekolah.sch.id',
                kelas: ['X IPS 2'] 
            }
        ]
    },
    {
        id: 3,
        kode: 'IF-1',
        nama: 'Informatika',
        kelompok: 'Peminatan',
        beban: 2,
        silabus: [],
        pengampu: [
            { 
                guruId: 2, 
                namaGuru: 'Ahmad Dahlan, S.Kom', 
                nip: '199001152019031008',
                email: 'ahmad.dahlan@sekolah.sch.id',
                kelas: ['XI MIPA 1', 'XI MIPA 2', 'X IPS 2'] 
            }
        ]
    }
];

let activeMapelId = null; 

// --- TOAST NOTIFICATION ---
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
    setTimeout(() => toast.classList.remove('translate-x-10', 'opacity-0'), 10);
    setTimeout(() => {
        toast.classList.add('translate-x-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// --- RENDER GRID MAPEL ---
function renderGrid(data = masterMapel) {
    const container = document.getElementById('mapelGridContainer');
    if (!container) return;

    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = `
            <div class="col-span-full bg-white border border-borderSoft rounded-2xl p-8 text-center text-slate-400">
                <i class="fas fa-folder-open text-3xl mb-2 block"></i>
                <p class="text-xs font-medium">Mata pelajaran tidak ditemukan.</p>
            </div>
        `;
        updateStats(0, 0, 0);
        return;
    }

    let totalBeban = 0;
    let silabusTerisi = 0;

    data.forEach(mapel => {
        totalBeban += parseInt(mapel.beban || 0);
        const jmlSilabus = mapel.silabus ? mapel.silabus.length : 0;
        if (jmlSilabus > 0) silabusTerisi++;

        const totalGuru = mapel.pengampu ? mapel.pengampu.length : 0;

        const card = document.createElement('div');
        card.className = 'bg-white border border-borderSoft rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group';
        
        card.innerHTML = `
            <div>
                <div class="flex items-start justify-between gap-3 mb-3">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="px-2 py-0.5 rounded-md bg-blue-50 text-primary text-[10px] font-bold border border-blue-100">${mapel.kode}</span>
                            <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">${mapel.kelompok}</span>
                        </div>
                        <h3 class="text-sm font-bold text-textActive group-hover:text-primary transition-colors">${mapel.nama}</h3>
                    </div>
                    <div class="flex items-center gap-1">
                        <button onclick="editMapel(${mapel.id})" class="p-1.5 text-slate-400 hover:text-warning hover:bg-amber-50 rounded-lg transition-colors">
                            <i class="fas fa-pen-to-square text-xs"></i>
                        </button>
                        <button onclick="deleteMapel(${mapel.id})" class="p-1.5 text-slate-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors">
                            <i class="fas fa-trash-can text-xs"></i>
                        </button>
                    </div>
                </div>

                <div class="flex items-center justify-between py-2 px-3 bg-bgSoft rounded-xl mb-4 border border-borderSoft/60 text-xs flex-wrap gap-2">
                    <span class="text-slate-500 font-medium">Beban: <strong class="text-textActive font-semibold">${mapel.beban} Jam/mgg</strong></span>
                    ${
                        jmlSilabus > 0
                        ? `<button onclick="openSilabusModal(${mapel.id})" class="text-[11px] text-emerald-600 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                                <i class="fas fa-file-pdf"></i> ${jmlSilabus} Silabus File
                           </button>`
                        : `<button onclick="openSilabusModal(${mapel.id})" class="text-[11px] text-slate-400 italic hover:text-primary flex items-center gap-1 cursor-pointer">
                                <i class="fas fa-plus-circle"></i> + Tambah Silabus
                           </button>`
                    }
                </div>

                <div class="space-y-2 mb-4">
                    <div class="flex items-center justify-between">
                        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pengampu (${totalGuru} Guru):</p>
                    </div>
                    <div class="space-y-1.5">
                        ${
                            mapel.pengampu && mapel.pengampu.length > 0
                            ? mapel.pengampu.slice(0, 2).map(p => `
                                <div class="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <div class="truncate">
                                        <span class="font-semibold text-slate-700 block truncate">${p.namaGuru}</span>
                                        <span class="text-[9px] text-slate-400 font-mono">${p.nip}</span>
                                    </div>
                                    <span class="text-[10px] text-primary bg-blue-50 px-1.5 py-0.5 rounded font-mono font-medium shrink-0 ml-2">${p.kelas.length} Kelas</span>
                                </div>
                            `).join('')
                            : `<p class="text-xs text-slate-400 italic">Belum ada guru pengampu</p>`
                        }
                        ${
                            totalGuru > 2 
                            ? `<p class="text-[10px] text-slate-400 italic text-center">+${totalGuru - 2} guru lainnya</p>` 
                            : ''
                        }
                    </div>
                </div>
            </div>

            <button onclick="showPengampuDetail(${mapel.id})" class="w-full py-2 bg-primarySoft hover:bg-blue-100 text-primary text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border border-blue-100/80 cursor-pointer mt-2">
                <i class="fas fa-chalkboard-user"></i> Kelola Guru & Kelas
            </button>
		`;

        container.appendChild(card);
    });

    updateStats(masterMapel.length, totalBeban, silabusTerisi);
}

// --- SILABUS MODAL & MANAGEMENT ---
function openSilabusModal(mapelId) {
    activeMapelId = mapelId;
    const mapel = masterMapel.find(m => m.id === mapelId);
    if (!mapel) return;

    document.getElementById('silabusModalTitle').textContent = `Dokumen Silabus: ${mapel.nama}`;
    renderSilabusList();

    const previewContainer = document.getElementById('silabusPreviewFrame');
    if (previewContainer) {
        previewContainer.classList.add('hidden');
        previewContainer.src = 'about:blank';
    }

    const modal = document.getElementById('silabusModal');
    if (modal) modal.classList.remove('hidden');
}

function renderSilabusList() {
    const mapel = masterMapel.find(m => m.id === activeMapelId);
    const container = document.getElementById('silabusListContainer');
    if (!container || !mapel) return;

    container.innerHTML = '';

    if (!mapel.silabus || mapel.silabus.length === 0) {
        container.innerHTML = `
            <div class="p-4 text-center text-xs text-slate-400 bg-bgSoft rounded-xl border border-dashed border-borderSoft">
                Belum ada berkas silabus yang diunggah. Silakan tambahkan file di bawah.
            </div>
        `;
        return;
    }

    mapel.silabus.forEach((file) => {
        const item = document.createElement('div');
        item.className = 'p-3 bg-bgSoft border border-borderSoft rounded-xl flex items-center justify-between gap-2 hover:border-blue-200 transition-all flex-wrap sm:flex-nowrap';
        item.innerHTML = `
            <div class="flex items-center gap-2.5 min-w-0 flex-1">
                <div class="w-8 h-8 bg-red-100 text-danger rounded-lg flex items-center justify-center text-sm shrink-0">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <div class="truncate">
                    <p class="text-xs font-bold text-textActive truncate" title="${file.name}">${file.name}</p>
                    <p class="text-[10px] text-slate-400 font-mono">${file.size || 'Ukuran tidak diketahui'}</p>
                </div>
            </div>
            <div class="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                <button onclick="previewSingleSilabus('${file.name}', '${file.url}')" class="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 text-primary hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer">
                    <i class="fas fa-eye"></i> Preview
                </button>
                <button onclick="downloadSilabusFile('${file.name}', '${file.url}')" class="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer">
                    <i class="fas fa-download"></i> Unduh
                </button>
                <button onclick="deleteSilabusFile('${file.id}')" class="p-1 text-slate-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Hapus Berkas">
                    <i class="fas fa-trash-can text-xs"></i>
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

function uploadNewSilabus(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const mapel = masterMapel.find(m => m.id === activeMapelId);
    if (!mapel) return;

    if (!mapel.silabus) mapel.silabus = [];

    Array.from(files).forEach(file => {
        const fileObj = {
            id: 'sil-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            url: URL.createObjectURL(file)
        };
        mapel.silabus.push(fileObj);
    });

    showToast(`${files.length} file silabus berhasil diunggah!`, 'success');
    renderSilabusList();
    renderGrid();
    event.target.value = ''; 
}

function deleteSilabusFile(fileId) {
    if (confirm('Yakin ingin menghapus berkas silabus ini?')) {
        const mapel = masterMapel.find(m => m.id === activeMapelId);
        if (mapel) {
            mapel.silabus = mapel.silabus.filter(f => f.id !== fileId);
            showToast('Berkas silabus berhasil dihapus.', 'success');
            renderSilabusList();
            renderGrid();

            const previewFrame = document.getElementById('silabusPreviewFrame');
            if (previewFrame) {
                previewFrame.classList.add('hidden');
                previewFrame.src = 'about:blank';
            }
        }
    }
}

function downloadSilabusFile(fileName, fileUrl) {
    showToast(`Mengunduh ${fileName}...`, 'success');
    
    const link = document.createElement('a');
    if (fileUrl && fileUrl !== '#') {
        link.href = fileUrl;
    } else {
        // Mock download dummy content
        const dummyContent = `Dokumen Silabus Resmi\nFile: ${fileName}\nTanggal: ${new Date().toLocaleDateString()}`;
        const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
        link.href = URL.createObjectURL(blob);
    }
    
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function previewSingleSilabus(fileName, fileUrl) {
    const previewContainer = document.getElementById('silabusPreviewContainer');
    const previewFrame = document.getElementById('silabusPreviewFrame');
    const previewTitle = document.getElementById('silabusPreviewTitle');

    if (!previewFrame) return;

    if (previewTitle) previewTitle.textContent = `Menampilkan: ${fileName}`;
    
    if (fileUrl && fileUrl !== '#') {
        previewFrame.src = fileUrl;
    } else {
        // Visual HTML Preview Mocking jika file dummy
        const mockPdfHTML = `
            <html>
                <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; color: #334155;">
                    <div style="text-align: center; padding: 20px; background: white; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                        <h3 style="margin-bottom: 8px; color: #2563eb;">${fileName}</h3>
                        <p style="font-size: 12px; color: #64748b;">Pratinjau Berkas Silabus Sistem Absensi Sekolah</p>
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
                        <p style="font-size: 13px;">Dokumen ini valid dan tersimpan di server.</p>
                    </div>
                </body>
            </html>
        `;
        const blob = new Blob([mockPdfHTML], { type: 'text/html' });
        previewFrame.src = URL.createObjectURL(blob);
    }

    if (previewContainer) previewContainer.classList.remove('hidden');
    previewFrame.classList.remove('hidden');
}

// --- CRUD GURU PENGAMPU (MODAL LOGIC) ---
function showPengampuDetail(mapelId) {
    activeMapelId = mapelId;
    const mapel = masterMapel.find(m => m.id === mapelId);
    if (!mapel) return;

    document.getElementById('modalDetailTitle').textContent = `Kelola Pengampu: ${mapel.nama}`;
    document.getElementById('modalDetailSubtitle').textContent = `Kode: ${mapel.kode} | Kelompok: ${mapel.kelompok}`;

    renderPengampuList();
    hideFormPengampu();

    document.getElementById('detailPengampuModal').classList.remove('hidden');
}

function renderPengampuList() {
    const mapel = masterMapel.find(m => m.id === activeMapelId);
    const container = document.getElementById('detailGuruList');
    if (!container || !mapel) return;

    container.innerHTML = '';

    if (!mapel.pengampu || mapel.pengampu.length === 0) {
        container.innerHTML = `<div class="p-4 text-center text-xs text-slate-400 bg-bgSoft rounded-xl border border-dashed border-borderSoft">Belum ada guru yang mengajar mata pelajaran ini.</div>`;
        return;
    }

    mapel.pengampu.forEach((p, index) => {
        const item = document.createElement('div');
        item.className = 'p-3.5 bg-bgSoft border border-borderSoft rounded-xl space-y-2.5 hover:border-blue-200 transition-all';
        item.innerHTML = `
            <div class="flex items-start justify-between gap-2">
                <div class="flex items-start gap-2.5">
                    <div class="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        ${index + 1}
                    </div>
                    <div>
                        <p class="text-xs font-bold text-textActive leading-tight">${p.namaGuru}</p>
                        <p class="text-[10px] font-mono text-slate-400 mt-0.5">NIP: ${p.nip}</p>
                        <p class="text-[10px] text-slate-400">${p.email}</p>
                    </div>
                </div>
                <div class="flex items-center gap-1">
                    <button onclick="editPengampu(${p.guruId})" class="p-1.5 text-slate-400 hover:text-warning hover:bg-amber-50 rounded-lg transition-colors text-xs" title="Edit Kelas">
                        <i class="fas fa-pen-to-square"></i>
                    </button>
                    <button onclick="deletePengampu(${p.guruId})" class="p-1.5 text-slate-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors text-xs" title="Hapus Guru">
                        <i class="fas fa-trash-can"></i>
                    </button>
                </div>
            </div>

            <div class="pt-2 border-t border-borderSoft/60">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Kelas yang Diajar (${p.kelas.length}):</p>
                <div class="flex flex-wrap gap-1.5">
                    ${p.kelas.map(k => `
                        <span class="px-2 py-0.5 bg-white border border-borderSoft text-slate-700 rounded-md text-[10px] font-medium shadow-xs flex items-center gap-1">
                            <i class="fas fa-door-closed text-primary text-[9px]"></i> ${k}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

function showFormPengampu(editGuruId = null) {
    const formContainer = document.getElementById('formPengampuContainer');
    const selectGuru = document.getElementById('selectGuruPengampu');
    const checkboxContainer = document.getElementById('checkboxKelasContainer');
    const formTitle = document.getElementById('formPengampuTitle');

    selectGuru.innerHTML = '<option value="">-- Pilih Guru --</option>';
    masterGuruList.forEach(g => {
        selectGuru.innerHTML += `<option value="${g.id}">${g.nama} (${g.nip})</option>`;
    });

    checkboxContainer.innerHTML = '';
    masterKelasList.forEach(k => {
        checkboxContainer.innerHTML += `
            <label class="flex items-center space-x-2 bg-white p-2 rounded-lg border border-borderSoft cursor-pointer hover:bg-slate-50">
                <input type="checkbox" name="kelasOption" value="${k}" class="rounded border-slate-300 text-primary focus:ring-primary h-3.5 w-3.5">
                <span class="text-xs text-slate-700 font-medium">${k}</span>
            </label>
        `;
    });

    if (editGuruId) {
        formTitle.textContent = 'Edit Guru Pengampu & Kelas';
        const mapel = masterMapel.find(m => m.id === activeMapelId);
        const pengampuData = mapel.pengampu.find(p => p.guruId === editGuruId);

        if (pengampuData) {
            selectGuru.value = pengampuData.guruId;
            selectGuru.disabled = true;
            document.getElementById('editPengampuGuruId').value = editGuruId;

            document.querySelectorAll('input[name="kelasOption"]').forEach(cb => {
                if (pengampuData.kelas.includes(cb.value)) cb.checked = true;
            });
        }
    } else {
        formTitle.textContent = 'Tambah Guru Pengampu Baru';
        selectGuru.disabled = false;
        document.getElementById('editPengampuGuruId').value = '';
    }

    formContainer.classList.remove('hidden');
}

function hideFormPengampu() {
    const formContainer = document.getElementById('formPengampuContainer');
    if (formContainer) formContainer.classList.add('hidden');
}

function savePengampu(e) {
    e.preventDefault();
    const mapel = masterMapel.find(m => m.id === activeMapelId);
    if (!mapel) return;

    const selectGuru = document.getElementById('selectGuruPengampu');
    const editGuruId = document.getElementById('editPengampuGuruId').value;
    const selectedGuruId = parseInt(selectGuru.value);

    const selectedKelas = Array.from(document.querySelectorAll('input[name="kelasOption"]:checked')).map(cb => cb.value);

    if (!selectedGuruId && !editGuruId) {
        showToast('Silakan pilih guru pengampu!', 'error');
        return;
    }

    if (selectedKelas.length === 0) {
        showToast('Pilih minimal 1 kelas yang diajar!', 'error');
        return;
    }

    if (editGuruId) {
        const index = mapel.pengampu.findIndex(p => p.guruId === parseInt(editGuruId));
        if (index !== -1) {
            mapel.pengampu[index].kelas = selectedKelas;
            showToast('Data pengampu berhasil diperbarui!', 'success');
        }
    } else {
        const isExist = mapel.pengampu.some(p => p.guruId === selectedGuruId);
        if (isExist) {
            showToast('Guru tersebut sudah terdaftar di mapel ini!', 'error');
            return;
        }

        const guruObj = masterGuruList.find(g => g.id === selectedGuruId);
        mapel.pengampu.push({
            guruId: guruObj.id,
            namaGuru: guruObj.nama,
            nip: guruObj.nip,
            email: guruObj.email,
            kelas: selectedKelas
        });
        showToast('Guru pengampu berhasil ditambahkan!', 'success');
    }

    renderPengampuList();
    renderGrid();
    hideFormPengampu();
}

function editPengampu(guruId) {
    showFormPengampu(guruId);
}

function deletePengampu(guruId) {
    if (confirm('Yakin mau menghapus guru pengampu ini dari mata pelajaran?')) {
        const mapel = masterMapel.find(m => m.id === activeMapelId);
        if (mapel) {
            mapel.pengampu = mapel.pengampu.filter(p => p.guruId !== guruId);
            showToast('Guru pengampu dihapus.', 'success');
            renderPengampuList();
            renderGrid();
        }
    }
}

// --- FUNGSI MAPEL (UMUM) ---
function updateStats(totalMapel, totalBeban, silabusTerisi) {
    const elTotal = document.getElementById('statTotalMapel');
    const elBeban = document.getElementById('statTotalBeban');
    const elSilabus = document.getElementById('statSilabusTerisi');
    if (elTotal) elTotal.innerHTML = `${totalMapel} <span class="text-xs text-slate-400 font-normal">Mapel</span>`;
    if (elBeban) elBeban.innerHTML = `${totalBeban} <span class="text-xs text-slate-400 font-normal">Jam</span>`;
    if (elSilabus) elSilabus.innerHTML = `${silabusTerisi} / ${totalMapel} <span class="text-xs text-slate-400 font-normal">File</span>`;
}

function editMapel(id) {
    const item = masterMapel.find(m => m.id === id);
    if (!item) return;

    document.getElementById('editRowId').value = item.id;
    document.getElementById('inputKode').value = item.kode;
    document.getElementById('inputNamaMapel').value = item.nama;
    document.getElementById('inputKelompok').value = item.kelompok;
    document.getElementById('inputBebanJam').value = item.beban;

    document.getElementById('modalTitle').textContent = 'Edit Mata Pelajaran';
    document.getElementById('mapelModal').classList.remove('hidden');
}

function deleteMapel(id) {
    if (confirm('Yakin ingin menghapus mata pelajaran ini?')) {
        masterMapel = masterMapel.filter(m => m.id !== id);
        applyFilters();
        showToast('Mata pelajaran berhasil dihapus.', 'success');
    }
}

function applyFilters() {
    const searchValue = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const kelompokValue = document.getElementById('filterKategori')?.value || 'SEMUA';

    const filtered = masterMapel.filter(item => {
        const matchSearch = (item.nama || '').toLowerCase().includes(searchValue) ||
                            (item.kode || '').toLowerCase().includes(searchValue) ||
                            (item.pengampu && item.pengampu.some(p => p.namaGuru.toLowerCase().includes(searchValue)));

        const matchKelompok = (kelompokValue === 'SEMUA') || (item.kelompok === kelompokValue);

        return matchSearch && matchKelompok;
    });

    renderGrid(filtered);
}

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    renderGrid();

    // Mapel Modal Handlers
    const mapelModal = document.getElementById('mapelModal');
    const openTambahBtn = document.getElementById('openTambahBtn');
    const closeMapelModalBtn = document.getElementById('closeMapelModalBtn');
    const cancelMapelModalBtn = document.getElementById('cancelMapelModalBtn');
    const mapelForm = document.getElementById('mapelForm');

    openTambahBtn?.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Tambah Mata Pelajaran';
        mapelForm.reset();
        document.getElementById('editRowId').value = '';
        mapelModal.classList.remove('hidden');
    });

    const closeMapelModal = () => mapelModal.classList.add('hidden');
    closeMapelModalBtn?.addEventListener('click', closeMapelModal);
    cancelMapelModalBtn?.addEventListener('click', closeMapelModal);

    mapelForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btnSimpan = document.getElementById('btnSimpanMapel');
        const editId = document.getElementById('editRowId').value;
        const fileInput = document.getElementById('inputSilabusFile');

        btnSimpan.disabled = true;
        btnSimpan.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menyimpan...`;

        setTimeout(() => {
            let uploadedSilabus = [];
            if (fileInput.files.length > 0) {
                Array.from(fileInput.files).forEach(f => {
                    uploadedSilabus.push({
                        id: 'sil-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
                        name: f.name,
                        size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
                        url: URL.createObjectURL(f)
                    });
                });
            }

            const formData = {
                kode: document.getElementById('inputKode').value,
                nama: document.getElementById('inputNamaMapel').value,
                kelompok: document.getElementById('inputKelompok').value,
                beban: document.getElementById('inputBebanJam').value
            };

            if (editId) {
                const index = masterMapel.findIndex(item => item.id == editId);
                if (index !== -1) {
                    const currentSilabus = masterMapel[index].silabus || [];
                    masterMapel[index] = {
                        ...masterMapel[index],
                        ...formData,
                        silabus: uploadedSilabus.length > 0 ? [...currentSilabus, ...uploadedSilabus] : currentSilabus
                    };
                    showToast('Mata pelajaran berhasil diperbarui!', 'success');
                }
            } else {
                const newId = masterMapel.length ? Math.max(...masterMapel.map(m => m.id)) + 1 : 1;
                masterMapel.push({
                    id: newId,
                    ...formData,
                    silabus: uploadedSilabus,
                    pengampu: []
                });
                showToast('Mata pelajaran baru berhasil ditambahkan!', 'success');
            }

            applyFilters();
            closeMapelModal();
            btnSimpan.disabled = false;
            btnSimpan.innerHTML = `<span>Simpan Data Mapel</span>`;
        }, 600);
    });

    // Modal Silabus Close Handlers
    const silabusModal = document.getElementById('silabusModal');
    document.getElementById('closeSilabusModalBtn')?.addEventListener('click', () => silabusModal.classList.add('hidden'));

    // Pengampu Modal Handlers
    document.getElementById('closeDetailModalBtn')?.addEventListener('click', () => {
        document.getElementById('detailPengampuModal').classList.add('hidden');
    });
    document.getElementById('dismissDetailModalBtn')?.addEventListener('click', () => {
        document.getElementById('detailPengampuModal').classList.add('hidden');
    });
    document.getElementById('btnShowAddPengampu')?.addEventListener('click', () => showFormPengampu());
    document.getElementById('cancelFormPengampuBtn')?.addEventListener('click', hideFormPengampu);
    document.getElementById('formPengampu')?.addEventListener('submit', savePengampu);

    // Template Download
    document.getElementById('downloadTemplateBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        const csvContent = "data:text/csv;charset=utf-8,Kode,NamaMapel,Kelompok,BebanJam\nBIN-10,Bahasa Indonesia,Wajib A,3\nMTK-10,Matematika Wajib,Wajib A,4";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Template_Mata_Pelajaran.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Template Excel berhasil diunduh!', 'success');
    });

    // Import Modal Handlers
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
            masterMapel.push({
                id: masterMapel.length + 1,
                kode: 'BIO-10',
                nama: 'Biologi Peminatan (Imported)',
                kelompok: 'Peminatan',
                beban: 3,
                silabus: [],
                pengampu: []
            });

            applyFilters();
            closeImportModal();
            showToast('Data dari Excel berhasil ditarik!', 'success');
            btnProses.disabled = false;
            btnProses.innerHTML = `<i class="fas fa-file-import"></i> Mulai Import`;
        }, 1000);
    });

    // Filter Listeners
    document.getElementById('searchInput')?.addEventListener('input', applyFilters);
    document.getElementById('filterKategori')?.addEventListener('change', applyFilters);

    // Global Functions Binding
    window.editMapel = editMapel;
    window.deleteMapel = deleteMapel;
    window.openSilabusModal = openSilabusModal;
    window.uploadNewSilabus = uploadNewSilabus;
    window.deleteSilabusFile = deleteSilabusFile;
    window.downloadSilabusFile = downloadSilabusFile;
    window.previewSingleSilabus = previewSingleSilabus;
    window.showPengampuDetail = showPengampuDetail;
    window.editPengampu = editPengampu;
    window.deletePengampu = deletePengampu;
});