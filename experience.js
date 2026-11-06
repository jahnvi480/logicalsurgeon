/* Native links are the fallback; the dialog is optional progressive enhancement. */
(() => {
    const links = Array.from(document.querySelectorAll('.js-photo-viewer'));
    if (links.length && typeof HTMLDialogElement !== 'undefined' && HTMLDialogElement.prototype.showModal) {
        const dialog = document.createElement('dialog');
        dialog.className = 'photo-dialog';
        dialog.setAttribute('aria-label', 'Photograph viewer');
        const close = document.createElement('button');
        close.type = 'button';
        close.textContent = 'Close photograph ×';
        const image = document.createElement('img');
        const caption = document.createElement('p');
        let opener;
        dialog.append(close, image, caption);
        document.body.append(dialog);
        links.forEach(link => link.addEventListener('click', event => {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            const thumbnail = link.querySelector('img');
            if (!thumbnail) return;
            image.src = link.href;
            image.alt = thumbnail.alt;
            caption.textContent = link.closest('figure')?.querySelector('figcaption')?.textContent || thumbnail.alt;
            opener = link;
            try {
                dialog.showModal();
            } catch {
                return; // If opening fails, follow the original image link.
            }
            event.preventDefault();
            close.focus();
        }));
        close.addEventListener('click', () => dialog.close());
        dialog.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                dialog.close();
            }
        });
        dialog.addEventListener('click', event => {
            if (event.target !== dialog) return;
            const rect = dialog.getBoundingClientRect();
            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
        });
        dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
    }

    // Animate only on entry; never hide content or make interaction wait for motion.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
    const animations = new Set();
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            if (reduced.matches) return;
            const animation = entry.target.animate([
                { transform: 'translateY(12px)' },
                { transform: 'translateY(0)' }
            ], { duration: 380, easing: 'ease-out' });
            animations.add(animation);
            animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.photo-card, .hero-media, .hero-grid .portrait').forEach(element => observer.observe(element));
    reduced.addEventListener('change', () => {
        if (reduced.matches) animations.forEach(animation => animation.cancel());
    });
})();