document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    // Mobile Search Modal
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const mobileSearchModal = document.getElementById('mobileSearchModal');
    const closeSearchBtn = document.getElementById('closeSearchBtn');

    // Dropdowns
    const notifBtn = document.getElementById('notifBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    // Toggle Sidebar (Desktop Hide/Expand & Mobile Drawer)
    function toggleSidebar() {
        if (window.innerWidth >= 1024) {
            document.body.classList.toggle('sidebar-collapsed');
        } else {
            if (sidebarMenu) sidebarMenu.classList.toggle('-translate-x-full');
            if (sidebarOverlay) sidebarOverlay.classList.toggle('hidden');
        }
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

    // Mobile Search Modal Toggle
    if (mobileSearchBtn && mobileSearchModal) {
        mobileSearchBtn.addEventListener('click', () => {
            mobileSearchModal.classList.replace('hidden', 'flex');
            const searchInput = document.getElementById('mobileSearchInput');
            if (searchInput) searchInput.focus();
        });
    }

    if (closeSearchBtn && mobileSearchModal) {
        closeSearchBtn.addEventListener('click', () => {
            mobileSearchModal.classList.replace('flex', 'hidden');
        });
    }

    // Toggle Dropdown Notifikasi & Profil
    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('hidden');
            if (profileDropdown) profileDropdown.classList.add('hidden');
        });
    }

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('hidden');
            if (notifDropdown) notifDropdown.classList.add('hidden');
        });
    }

    // Tutup dropdown jika klik di luar
    window.addEventListener('click', () => {
        if (notifDropdown) notifDropdown.classList.add('hidden');
        if (profileDropdown) profileDropdown.classList.add('hidden');
    });
    // Ensure sidebar/overlay state on resize
    function setInitialLayoutState() {
        if (window.innerWidth >= 1024) {
            if (sidebarMenu) sidebarMenu.classList.remove('-translate-x-full');
            if (sidebarOverlay) sidebarOverlay.classList.add('hidden');
            document.body.classList.remove('sidebar-collapsed');
        } else {
            if (sidebarMenu) sidebarMenu.classList.add('-translate-x-full');
            if (sidebarOverlay) sidebarOverlay.classList.add('hidden');
            document.body.classList.remove('sidebar-collapsed');
        }
    }

    window.addEventListener('resize', setInitialLayoutState);

    // Close overlays/modals/dropdowns with Escape key for better mobile UX
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // close mobile search
            if (mobileSearchModal && mobileSearchModal.classList.contains('flex')) {
                mobileSearchModal.classList.replace('flex', 'hidden');
            }

            // close sidebar overlay and hide menu on small screens
            if (window.innerWidth < 1024) {
                if (sidebarMenu) sidebarMenu.classList.add('-translate-x-full');
                if (sidebarOverlay) sidebarOverlay.classList.add('hidden');
            }

            // close dropdowns
            if (notifDropdown) notifDropdown.classList.add('hidden');
            if (profileDropdown) profileDropdown.classList.add('hidden');
        }
    });

    // Run initial layout setup once on load
    setInitialLayoutState();
});
