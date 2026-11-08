import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../counters.js', import.meta.url), 'utf8');
function setup({ reduced = false, supported = true } = {}) {
    const numbers = [100, 400].map(target => ({ dataset: { target: String(target), suffix: '+' }, textContent: `${target}+` }));
    const groups = numbers.map(number => ({ querySelectorAll: () => [number] }));
    const frames = new Map();
    let next = 0;
    let callback;
    let change;
    let disconnected = false;
    const observed = new Set();
    const motion = { matches: reduced, addEventListener: (_, listener) => { change = listener; } };
    const window = { matchMedia: () => motion };
    class Observer {
        constructor(listener) { callback = listener; }
        observe(group) { observed.add(group); }
        unobserve(group) { observed.delete(group); }
        disconnect() { disconnected = true; observed.clear(); }
    }
    if (supported) window.IntersectionObserver = Observer;
    runInNewContext(source, {
        window, document: { querySelectorAll: () => groups }, IntersectionObserver: Observer,
        performance: { now: () => 0 },
        requestAnimationFrame: fn => { const id = ++next; frames.set(id, fn); return id; },
        cancelAnimationFrame: id => frames.delete(id)
    });
    return {
        numbers, frames, observed,
        enter: index => callback([{ target: groups[index], isIntersecting: true }]),
        tick: time => { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(time)); },
        reduce: () => { motion.matches = true; change({ matches: true }); },
        disconnected: () => disconnected
    };
}
const independent = setup();
independent.enter(0);
independent.tick(500);
assert.equal(independent.numbers[0].textContent, '87+');
assert.equal(independent.numbers[1].textContent, '400+', 'Teaching does not animate with clinical group');
independent.tick(1000);
assert.equal(independent.numbers[0].textContent, '100+');
independent.enter(1);
independent.tick(500);
assert.equal(independent.numbers[1].textContent, '350+');
independent.tick(1000);
assert.equal(independent.numbers[1].textContent, '400+');
independent.enter(0);
assert.equal(independent.frames.size, 0, 'Completed groups never restart');
const cancel = setup();
cancel.enter(0);
cancel.enter(1);
cancel.tick(200);
cancel.reduce();
assert.equal(cancel.frames.size, 0);
assert.ok(cancel.disconnected());
assert.deepEqual(cancel.numbers.map(number => number.textContent), ['100+', '400+']);
for (const options of [{ reduced: true }, { supported: false }]) {
    const fallback = setup(options);
    assert.equal(fallback.frames.size, 0);
    assert.deepEqual(fallback.numbers.map(number => number.textContent), ['100+', '400+']);
}
console.log('PASS: independent counter entry, completion, one-shot behavior, reduced-motion cancellation and static fallback.');