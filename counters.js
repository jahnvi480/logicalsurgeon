(() => {
    "use strict";

    const groups = Array.from(document.querySelectorAll(".counters"), (element) => ({
        element,
        counters: Array.from(element.querySelectorAll(".counter-number"), (number) => ({
            number,
            target: Number(number.dataset.target),
            suffix: number.dataset.suffix || "",
            finalText: number.textContent
        })),
        started: false,
        frame: null
    }));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;

    function complete(group) {
        if (group.frame !== null) cancelAnimationFrame(group.frame);
        group.frame = null;
        group.started = true;
        group.counters.forEach(({ number, finalText }) => {
            number.textContent = finalText;
        });
    }

    function completeAll() {
        if (observer) observer.disconnect();
        groups.forEach(complete);
    }

    if (motion.matches || !("IntersectionObserver" in window)) {
        completeAll();
        return;
    }

    function animate(group) {
        if (group.started) return;
        group.started = true;
        observer.unobserve(group.element);
        const start = performance.now();

        function update(now) {
            group.frame = null;
            if (motion.matches) {
                completeAll();
                return;
            }
            const progress = Math.min(Math.max((now - start) / 1000, 0), 1);
            if (progress === 1) {
                complete(group);
                return;
            }
            const eased = 1 - Math.pow(1 - progress, 3);
            group.counters.forEach(({ number, target, suffix }) => {
                if (Number.isFinite(target) && target >= 0) {
                    number.textContent = Math.floor(eased * target) + suffix;
                }
            });
            group.frame = requestAnimationFrame(update);
        }

        group.frame = requestAnimationFrame(update);
    }

    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting || motion.matches) return;
            const group = groups.find(({ element }) => element === entry.target);
            if (group) animate(group);
        });
    }, { threshold: 0.2 });

    function onMotionChange(event) {
        if (event.matches) completeAll();
    }

    if (motion.addEventListener) {
        motion.addEventListener("change", onMotionChange);
    } else if (motion.addListener) {
        motion.addListener(onMotionChange);
    }
    groups.forEach(({ element }) => observer.observe(element));
})();