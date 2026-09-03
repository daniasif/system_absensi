document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // 1. SYSTEM INITIAL DATA & STATE
    // ==========================================
    let usersData = JSON.parse(localStorage.getItem('app_users')) || [
        { 
            id: 1, 
            name: 'Ahmad Dahlan, S.Kom', 
            username: 'ahmad_d', 
            email: 'ahmad@sekolah.sch.id', 
            role: 'Guru', 
            status: 'Aktif', 
            password: 'passwordGuru123' 
        }
    ];

    // ==========================================
    // 2. HELPER TOAST NOTIFICATION
    // ==========================================
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        let bgClass = 'bg-emerald-600';
        let iconClass = 'fa-circle-check';

        if (type === 'danger') {
            bgClass = 'bg-red-600';
            iconClass = 'fa-circle-xmark';
        } else if (type === 'warning') {
            bgClass = 'bg-amber-500';
            iconClass = 'fa-triangle-exclamation';
        }

        toast.className = `flex items-center space-x-2 text-white px-4 py-3 rounded-xl shadow-lg text-xs font-medium ${bgClass} transition-all duration-300 pointer-events-auto`;
        toast.innerHTML = `<i class="fas ${iconClass}"></i><span>${message}</span>`;

        container.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // ==========================================
    // 3. TAB MENU SWITCHING LOGIC
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');

            tabBtns.forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'shadow-md', 'shadow-blue-500/20');
                b.classList.add('bg-white', 'text-textMuted');
            });

            this.classList.remove('bg-white', 'text-textMuted');
            this.classList.add('bg-primary', 'text-white', 'shadow-md', 'shadow-blue-500/20');

            tabContents.forEach(content => {
                if (content.id === targetId || (targetId === 'sectionProfil' && content.id === 'profileForm')) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });

    // ==========================================
    // 4. TOGGLE VISIBILITY PASSWORD (EYE ICON)
    // ==========================================
    document.addEventListener('click', function (e) {
        const toggleBtn = e.target.closest('.toggle-password');
        if (toggleBtn) {
            const input = toggleBtn.parentElement.querySelector('input');
            const icon = toggleBtn.querySelector('i');
            if (input && icon) {
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            }
        }
    });

    // ==========================================
    // 5. MANAJEMEN USER & ROLE (CRUD & RENDER)
    // ==========================================
    const userTableBody = document.getElementById('userTableBody');
    const userModal = document.getElementById('userModal');
    const userForm = document.getElementById('userForm');
    const btnAddUser = document.getElementById('btnAddUser');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');

    function renderUserTable() {
        if (!userTableBody) return;
        userTableBody.innerHTML = '';

        if (usersData.length === 0) {
            userTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4 text-textMuted text-xs">Belum ada data user.</td>
                </tr>
            `;
            return;
        }

        usersData.forEach((u, i) => {
            let badgeStyle = 'bg-emerald-50 text-emerald-600 border-emerald-100';
            if (u.role === 'Staff') badgeStyle = 'bg-amber-50 text-amber-600 border-amber-100';
            if (u.role === 'Administrator') badgeStyle = 'bg-blue-50 text-blue-600 border-blue-100';

            const tr = document.createElement('tr');
            tr.className = "hover:bg-slate-50 transition-colors";
            tr.innerHTML = `
                <td class="py-3 px-3 font-semibold text-textActive">
                    ${u.name}
                    <span class="block text-[10px] text-textMuted font-normal">${u.email}</span>
                </td>
                <td class="py-3 px-3">
                    <span class="font-mono text-slate-600 text-[11px]">@${u.username || '-'}</span>
                </td>
                <td class="py-3 px-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyle}">${u.role}</span>
                </td>
                <td class="py-3 px-3">
                    <span class="text-emerald-600 font-medium">● ${u.status}</span>
                </td>
                <td class="py-3 px-3 text-right space-x-1">
                    <button onclick="viewUserPass(${i})" class="p-1.5 text-textMuted hover:text-primary transition-colors" title="Lihat Detail Password">
                        <i class="fas fa-eye text-xs"></i>
                    </button>
                    <button onclick="editUser(${i})" class="p-1.5 text-textMuted hover:text-warning transition-colors" title="Edit User">
                        <i class="fas fa-pen text-xs"></i>
                    </button>
                    <button onclick="deleteUser(${i})" class="p-1.5 text-textMuted hover:text-danger transition-colors" title="Hapus User">
                        <i class="fas fa-trash text-xs"></i>
                    </button>
                </td>
            `;
            userTableBody.appendChild(tr);
        });
    }

    renderUserTable();

    // Modal Control Handler
    if (btnAddUser) {
        btnAddUser.addEventListener('click', function () {
            document.getElementById('modalTitle').innerText = 'Tambah User & Berikan Akses';
            document.getElementById('editUserIndex').value = "-1";
            userForm.reset();
            userModal.classList.remove('hidden');
        });
    }

    const hideModal = () => userModal.classList.add('hidden');
    if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', hideModal);

    // Form Submit (Tambah & Edit User)
    if (userForm) {
        userForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const idx = parseInt(document.getElementById('editUserIndex').value);
            const name = document.getElementById('inputName').value.trim();
            const username = document.getElementById('inputUsername').value.trim().toLowerCase().replace(/\s+/g, '_');
            const email = document.getElementById('inputEmail').value.trim();
            const role = document.getElementById('inputRole').value;
            const password = document.getElementById('inputPassword').value;

            if (idx >= 0) {
                usersData[idx] = { ...usersData[idx], name, username, email, role, password };
                showToast(`Data user ${name} berhasil diperbarui!`);
            } else {
                usersData.push({ id: Date.now(), name, username, email, role, status: 'Aktif', password });
                showToast(`User baru ${name} berhasil ditambahkan!`);
            }

            localStorage.setItem('app_users', JSON.stringify(usersData));
            renderUserTable();
            hideModal();
        });
    }

    // Global Functions for Action Buttons inside Table
    window.viewUserPass = function (index) {
        const u = usersData[index];
        alert(`DETAIL AKSES USER:\n\nNama: ${u.name}\nUsername: @${u.username}\nEmail: ${u.email}\nRole: ${u.role}\nPassword: ${u.password}`);
    };

    window.editUser = function (index) {
        const u = usersData[index];
        document.getElementById('modalTitle').innerText = 'Edit User & Akses Password';
        document.getElementById('editUserIndex').value = index;
        document.getElementById('inputName').value = u.name;
        document.getElementById('inputUsername').value = u.username || '';
        document.getElementById('inputEmail').value = u.email;
        document.getElementById('inputRole').value = u.role;
        document.getElementById('inputPassword').value = u.password;
        userModal.classList.remove('hidden');
    };

    window.deleteUser = function (index) {
        const targetUser = usersData[index];
        if (confirm(`Apakah kamu yakin ingin menghapus akun ${targetUser.name}?`)) {
            usersData.splice(index, 1);
            localStorage.setItem('app_users', JSON.stringify(usersData));
            renderUserTable();
            showToast(`User ${targetUser.name} berhasil dihapus!`, 'danger');
        }
    };

    // ==========================================
    // 6. FOTO PROFIL & SIMPAN PROFIL
    // ==========================================
    const btnUploadPhoto = document.getElementById('btnUploadPhoto');
    const avatarFileInput = document.getElementById('avatarFileInput');
    const btnDeletePhoto = document.getElementById('btnDeletePhoto');
    const profileForm = document.getElementById('profileForm');

    if (btnUploadPhoto && avatarFileInput) {
        btnUploadPhoto.addEventListener('click', () => avatarFileInput.click());
        avatarFileInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (evt) {
                    const imgPreview = document.getElementById('profilePreview');
                    const topbarAvatar = document.getElementById('topbarAvatar');
                    if (imgPreview) imgPreview.src = evt.target.result;
                    if (topbarAvatar) topbarAvatar.src = evt.target.result;
                    showToast('Foto profil berhasil di-update!');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (btnDeletePhoto) {
        btnDeletePhoto.addEventListener('click', function () {
            const defaultAvatar = "https://ui-avatars.com/api/?name=Admin+Sekolah&background=2563EB&color=fff";
            const imgPreview = document.getElementById('profilePreview');
            const topbarAvatar = document.getElementById('topbarAvatar');
            if (imgPreview) imgPreview.src = defaultAvatar;
            if (topbarAvatar) topbarAvatar.src = defaultAvatar;
            showToast('Foto profil dikembalikan ke default.', 'warning');
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const updatedUsername = document.getElementById('profileUsername')?.value || '';
            showToast(`Perubahan profil (${updatedUsername}) berhasil disimpan!`);
        });
    }

});