/* Navigation stays visible unless this controller has initialized. */
(() => {
    const header = document.querySelector('.site-header');
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('primary-nav');
    if (!header || !toggle || !nav) return;

    const compact = window.matchMedia('(max-width: 1100px)');
    function setOpen(open, restoreFocus = false) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.textContent = open ? 'Close menu' : 'Menu';
        if (restoreFocus && compact.matches) toggle.focus();
    }

    toggle.addEventListener('click', () => {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    header.addEventListener('keydown', event => {
        if (event.key === 'Escape' && compact.matches && toggle.getAttribute('aria-expanded') === 'true') {
            setOpen(false, true);
        }
    });
    nav.addEventListener('click', event => {
        if (event.target.closest('a')) setOpen(false, nav.contains(document.activeElement));
    });
    document.addEventListener('click', event => {
        if (!header.contains(event.target)) setOpen(false, nav.contains(document.activeElement));
    });
    compact.addEventListener('change', () => setOpen(false, nav.contains(document.activeElement)));

    setOpen(false);
    toggle.hidden = false;
    header.classList.add('menu-ready');
})();