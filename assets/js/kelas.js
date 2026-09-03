// KELAS.JS - Script terpisah untuk halaman Master Data Kelas

let masterKelas = [
	{ id: 1, jenjang: 'SMA', tingkat: '11', nama: 'XI MIPA 1', jurusan: 'MIPA', tahunAjaran: '2025/2026', wali: 'Dra. Siti Aminah', kapasitas: 25 },
	{ id: 2, jenjang: 'SMA', tingkat: '11', nama: 'XI MIPA 2', jurusan: 'MIPA', tahunAjaran: '2025/2026', wali: 'Ahmad Dahlan, S.Kom', kapasitas: 25 },
	{ id: 3, jenjang: 'SMA', tingkat: '10', nama: 'X IPS 2', jurusan: 'IPS', tahunAjaran: '2025/2026', wali: 'Eko Prasetyo, M.Pd', kapasitas: 22 }
];

const daftarGuru = [
	'Dra. Siti Aminah',
	'Budi Santoso, S.Pd',
	'Ahmad Dahlan, S.Kom',
	'Eko Prasetyo, M.Pd',
	'Rina Wijaya, S.Si'
];

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

function renderTable(data = masterKelas) {
	const tbody = document.getElementById('kelasTbody');
	if (!tbody) return;

	tbody.innerHTML = '';

	if (data.length === 0) {
		tbody.innerHTML = `
			<tr>
				<td colspan="7" class="text-center py-8 text-slate-400">
					<i class="fas fa-folder-open text-2xl mb-2 block"></i>
					Data kelas tidak ditemukan.
				</td>
			</tr>
		`;
		updateStats(0, 0, 0);
		return;
	}

	let totalKapasitas = 0;

	data.forEach((item) => {
		totalKapasitas += parseInt(item.kapasitas || 0);

		const tr = document.createElement('tr');
		tr.className = 'hover:bg-slate-50/80 transition-colors';
		tr.innerHTML = `
			<td class="py-3 px-4 font-semibold text-slate-700">
				<span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 mr-1.5">${item.jenjang}</span>
				Kelas ${item.tingkat}
			</td>
			<td class="py-3 px-4 font-bold text-textActive">${item.nama}</td>
			<td class="py-3 px-4 text-slate-600">${item.jurusan || '-'}</td>
			<td class="py-3 px-4 text-slate-600 font-mono text-[11px]">
				<span class="px-2 py-1 bg-slate-100 rounded-lg text-slate-700 font-semibold">${item.tahunAjaran || '-'}</span>
			</td>
			<td class="py-3 px-4 text-slate-600">
				<div class="flex items-center gap-2">
					<div class="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">
						<i class="fas fa-user-tie"></i>
					</div>
					<span>${item.wali}</span>
				</div>
			</td>
			<td class="py-3 px-4 text-center font-mono font-bold text-slate-700">${item.kapasitas} Siswa</td>
			<td class="py-3 px-4 text-center">
				<div class="flex items-center justify-center gap-1.5">
					<button onclick="openQrModal('${item.nama}')" class="p-1.5 text-slate-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors" title="Lihat QR Code">
						<i class="fas fa-qrcode text-sm"></i>
					</button>
					<button onclick="editKelas(${item.id})" class="p-1.5 text-slate-500 hover:text-warning hover:bg-amber-50 rounded-lg transition-colors" title="Edit Data">
						<i class="fas fa-pen-to-square text-sm"></i>
					</button>
					<button onclick="deleteKelas(${item.id})" class="p-1.5 text-slate-500 hover:text-danger hover:bg-red-50 rounded-lg transition-colors" title="Hapus Data">
						<i class="fas fa-trash-can text-sm"></i>
					</button>
				</div>
			</td>
		`;
		tbody.appendChild(tr);
	});

	updateStats(masterKelas.length, totalKapasitas, masterKelas.length);
}

function updateStats(totalKelas, totalKapasitas, waliTerisi) {
	const elTotal = document.getElementById('statTotalKelas');
	const elKapasitas = document.getElementById('statTotalKapasitas');
	const elWali = document.getElementById('statWaliKelas');
	if (elTotal) elTotal.innerHTML = `${totalKelas} <span class="text-xs text-slate-400 font-normal">Kelas</span>`;
	if (elKapasitas) elKapasitas.innerHTML = `${totalKapasitas} <span class="text-xs text-slate-400 font-normal">Siswa</span>`;
	if (elWali) elWali.innerHTML = `${waliTerisi} / ${totalKelas} <span class="text-xs text-slate-400 font-normal">Terisi</span>`;
}

function initWaliKelasOptions() {
	const select = document.getElementById('inputWaliKelasSelect');
	if (!select) return;

	select.innerHTML = '<option value="">-- Pilih Wali Kelas --</option>';
	daftarGuru.forEach(guru => {
		const option = document.createElement('option');
		option.value = guru;
		option.textContent = guru;
		select.appendChild(option);
	});
}

function updateFilterTahunAjaranOptions() {
	const filterSelect = document.getElementById('filterTahunAjaran');
	if (!filterSelect) return;

	const currentValue = filterSelect.value;
	const uniqueTahunAjaran = [...new Set(masterKelas.map(item => item.tahunAjaran).filter(Boolean))];
	uniqueTahunAjaran.sort();

	filterSelect.innerHTML = '<option value="SEMUA">Semua Tahun Ajaran</option>';
	uniqueTahunAjaran.forEach(ta => {
		const option = document.createElement('option');
		option.value = ta;
		option.textContent = ta;
		filterSelect.appendChild(option);
	});

	if (uniqueTahunAjaran.includes(currentValue)) {
		filterSelect.value = currentValue;
	}
}

function editKelas(id) {
	const item = masterKelas.find(k => k.id === id);
	if (!item) return;

	document.getElementById('editRowId').value = item.id;
	document.getElementById('inputJenjang').value = item.jenjang;
	document.getElementById('inputTingkat').value = item.tingkat;
	document.getElementById('inputNamaKelas').value = item.nama;
	document.getElementById('inputWaliKelasSelect').value = item.wali;
	document.getElementById('inputKapasitas').value = item.kapasitas;
	document.getElementById('inputTahunAjaran').value = item.tahunAjaran || '';

	const jurusanContainer = document.getElementById('jurusanContainer');
	if (item.jenjang === 'SMA' || item.jenjang === 'SMK') {
		jurusanContainer.classList.remove('hidden');
		document.getElementById('inputJurusanText').value = item.jurusan !== '-' ? item.jurusan : '';
	} else {
		jurusanContainer.classList.add('hidden');
	}

	document.getElementById('modalTitle').textContent = 'Edit Data Kelas';
	document.getElementById('kelasModal').classList.remove('hidden');
}

function deleteKelas(id) {
	if (confirm('Yakin ingin menghapus kelas ini?')) {
		masterKelas = masterKelas.filter(k => k.id !== id);
		updateFilterTahunAjaranOptions();
		applyFilters();
		showToast('Data kelas berhasil dihapus.', 'success');
	}
}

function openQrModal(namaKelas) {
	const qrModal = document.getElementById('qrModal');
	const qrImage = document.getElementById('qrImage');
	const qrSubTitle = document.getElementById('qrSubTitle');
	const qrCodeTextInput = document.getElementById('qrCodeText');
	const copyBtn = document.getElementById('copyQrBtn');

	const payload = `ABSENSI_KELAS_${namaKelas}`;

	if (typeof QRious !== 'undefined') {
		try {
			const qr = new QRious({ value: payload, size: 300 });
			if (qrImage) qrImage.src = qr.toDataURL();
		} catch (err) {
			if (qrImage) qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}`;
		}
	} else {
		if (qrImage) qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}`;
	}

	if (qrSubTitle) qrSubTitle.textContent = `Ruang Kelas: ${namaKelas}`;
	if (qrCodeTextInput) qrCodeTextInput.value = payload;

	if (copyBtn) {
		copyBtn.onclick = async () => {
			try {
				if (navigator.clipboard && navigator.clipboard.writeText) {
					await navigator.clipboard.writeText(payload);
					showToast('Kode berhasil disalin ke clipboard.', 'success');
				} else {
					qrCodeTextInput.select();
					document.execCommand('copy');
					showToast('Kode berhasil disalin ke clipboard.', 'success');
				}
			} catch (e) {
				showToast('Gagal menyalin kode.', 'error');
			}
		};
	}

	if (qrModal) qrModal.classList.remove('hidden');

	const closeBtn = document.getElementById('closeQrModalBtn');
	if (closeBtn) closeBtn.onclick = () => qrModal.classList.add('hidden');
}

function applyFilters() {
	const searchValue = (document.getElementById('searchInput')?.value || '').toLowerCase();
	const tingkatValue = document.getElementById('filterTingkat')?.value || 'SEMUA';
	const tahunAjaranValue = document.getElementById('filterTahunAjaran')?.value || 'SEMUA';

	const filtered = masterKelas.filter(item => {
		const matchSearch = (item.nama || '').toLowerCase().includes(searchValue) || (item.wali || '').toLowerCase().includes(searchValue);

		let matchTingkat = false;
		const itemTingkatStr = String(item.tingkat).toUpperCase();

		if (tingkatValue === 'SEMUA') {
			matchTingkat = true;
		} else if (tingkatValue === '10' && (itemTingkatStr === '10' || itemTingkatStr === 'X')) {
			matchTingkat = true;
		} else if (tingkatValue === '11' && (itemTingkatStr === '11' || itemTingkatStr === 'XI')) {
			matchTingkat = true;
		} else if (tingkatValue === '12' && (itemTingkatStr === '12' || itemTingkatStr === 'XII')) {
			matchTingkat = true;
		} else if (itemTingkatStr === tingkatValue) {
			matchTingkat = true;
		}

		let matchTahunAjaran = (tahunAjaranValue === 'SEMUA' || item.tahunAjaran === tahunAjaranValue);

		return matchSearch && matchTingkat && matchTahunAjaran;
	});

	renderTable(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
	updateFilterTahunAjaranOptions();
	renderTable();
	initWaliKelasOptions();

	const kelasModal = document.getElementById('kelasModal');
	const openTambahBtn = document.getElementById('openTambahBtn');
	const closeKelasModalBtn = document.getElementById('closeKelasModalBtn');
	const cancelKelasModalBtn = document.getElementById('cancelKelasModalBtn');
	const kelasForm = document.getElementById('kelasForm');
	const inputJenjang = document.getElementById('inputJenjang');
	const jurusanContainer = document.getElementById('jurusanContainer');

	openTambahBtn?.addEventListener('click', () => {
		document.getElementById('modalTitle').textContent = 'Tambah Data Kelas Baru';
		kelasForm.reset();
		document.getElementById('editRowId').value = '';
		jurusanContainer.classList.add('hidden');
		kelasModal.classList.remove('hidden');
	});

	const closeKelasModal = () => kelasModal.classList.add('hidden');
	closeKelasModalBtn?.addEventListener('click', closeKelasModal);
	cancelKelasModalBtn?.addEventListener('click', closeKelasModal);

	inputJenjang?.addEventListener('change', (e) => {
		const val = e.target.value;
		if (val === 'SMA' || val === 'SMK') {
			jurusanContainer.classList.remove('hidden');
		} else {
			jurusanContainer.classList.add('hidden');
			document.getElementById('inputJurusanText').value = '';
		}
	});

	kelasForm?.addEventListener('submit', (e) => {
		e.preventDefault();
		const btnSimpan = document.getElementById('btnSimpanKelas');
		const editId = document.getElementById('editRowId').value;

		btnSimpan.disabled = true;
		btnSimpan.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menyimpan...`;

		setTimeout(() => {
			const formData = {
				jenjang: document.getElementById('inputJenjang').value,
				tingkat: document.getElementById('inputTingkat').value,
				nama: document.getElementById('inputNamaKelas').value,
				jurusan: document.getElementById('inputJurusanText').value || '-',
				tahunAjaran: document.getElementById('inputTahunAjaran').value.trim(),
				wali: document.getElementById('inputWaliKelasSelect').value,
				kapasitas: document.getElementById('inputKapasitas').value
			};

			if (editId) {
				const index = masterKelas.findIndex(item => item.id == editId);
				if (index !== -1) {
					masterKelas[index] = { id: parseInt(editId), ...formData };
					showToast('Data kelas berhasil diperbarui!', 'success');
				}
			} else {
				const newId = masterKelas.length ? Math.max(...masterKelas.map(m => m.id)) + 1 : 1;
				masterKelas.push({ id: newId, ...formData });
				showToast('Kelas baru berhasil ditambahkan!', 'success');
			}

			updateFilterTahunAjaranOptions();
			applyFilters();
			closeKelasModal();

			btnSimpan.disabled = false;
			btnSimpan.innerHTML = `<span>Simpan Data Kelas</span>`;
		}, 800);
	});

	document.getElementById('downloadTemplateBtn')?.addEventListener('click', (e) => {
		e.preventDefault();
		const csvContent = "data:text/csv;charset=utf-8,Jenjang,Kelas,NamaKelas,Jurusan,TahunAjaran,Kapasitas\nSMA,11,XI MIPA 1,MIPA,2025/2026,36\nSMP,8,8A,-,2025/2026,32";
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "Template_Data_Kelas.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		showToast('Template Excel berhasil diunduh!', 'success');
	});

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
			masterKelas.push({
				id: masterKelas.length + 1,
				jenjang: 'SMA',
				tingkat: '10',
				nama: 'X MIPA 3 (Imported)',
				jurusan: 'MIPA',
				tahunAjaran: '2025/2026',
				wali: 'Eko Prasetyo, M.Pd',
				kapasitas: 36
			});

			updateFilterTahunAjaranOptions();
			applyFilters();
			closeImportModal();
			showToast('Data dari Excel berhasil ditarik!', 'success');

			btnProses.disabled = false;
			btnProses.innerHTML = `<i class="fas fa-file-import"></i> Mulai Import`;
		}, 1200);
	});

	document.getElementById('searchInput')?.addEventListener('input', applyFilters);
	document.getElementById('filterTingkat')?.addEventListener('change', applyFilters);
	document.getElementById('filterTahunAjaran')?.addEventListener('change', applyFilters);

	window.editKelas = editKelas;
	window.deleteKelas = deleteKelas;
	window.openQrModal = openQrModal;
});