/* One contact controller for desktop and the coordinated mobile action bar. */
(() => {
    const panel = document.getElementById('socialPanel');
    const triggers = Array.from(document.querySelectorAll('[aria-controls="socialPanel"]'));
    let opener;

    function setOpen(open, restoreFocus = false) {
        panel.hidden = !open;
        panel.classList.toggle('active', open);
        triggers.forEach(button => button.setAttribute('aria-expanded', String(open)));
        if (open) panel.querySelector('.social-widget-close').focus();
        else if (restoreFocus && opener && opener.getClientRects().length) opener.focus();
    }

    triggers.forEach(button => button.addEventListener('click', () => {
        opener = button;
        setOpen(panel.hidden);
    }));
    panel.querySelector('.social-widget-close').addEventListener('click', () => setOpen(false, true));
    document.addEventListener('click', event => {
        if (!panel.hidden && !panel.contains(event.target) && !triggers.some(button => button.contains(event.target))) {
            setOpen(false);
        }
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            if (!panel.hidden) setOpen(false, true);
        }
    });

    const carousel = document.getElementById('testimonialCarousel');
    carousel.setAttribute('aria-label', 'Student feedback');
    carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
    carousel.addEventListener('focusin', () => clearInterval(autoTimer));
    carousel.addEventListener('mouseleave', () => startAutoplay());
    carousel.addEventListener('focusout', event => {
        if (!carousel.contains(event.relatedTarget)) startAutoplay();
    });
})();