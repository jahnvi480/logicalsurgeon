import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://jahnvi480.github.io/logicalsurgeon/';
const pages = ['index.html', 'about.html', 'clinic.html', 'courses.html', 'publications.html', 'privacy.html'];
const read = name => readFileSync(resolve(root, name), 'utf8');
assert.equal(read('index.html'), read('portfolio_website.html'), 'Homepage copies differ');
const home = read('index.html');
assert.equal([...home.matchAll(/class="js-photo-viewer"/g)].length, 4, 'Four approved gallery photographs');
for (const name of ['index.html', 'portfolio_website.html', 'about.html', 'clinic.html', 'courses.html']) {
    assert.ok(read(name).includes('experience.css?v=1'), `${name}: enhancement CSS`);
    assert.ok(read(name).includes('experience.js?v=1'), `${name}: enhancement JS`);
}
const sitemap = read('sitemap.xml');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(locations.length, pages.length, 'Sitemap must contain six canonical pages');
let navBaseline;
for (const name of [...pages, 'portfolio_website.html']) {
    const html = read(name);
    const canonical = name === 'index.html' || name === 'portfolio_website.html' ? origin : origin + name;
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}">`), `${name}: canonical`);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${name}: one h1`);
    assert.equal([...html.matchAll(/property="og:image"/g)].length, 1, `${name}: one social image`);
    assert.ok(html.includes(`${origin}social-preview.jpg`), `${name}: branded image`);
    assert.ok(html.includes('site-header.css?v=2'), `${name}: shared header version`);
    const nav = html.match(/<nav class="primary-nav"[\s\S]*?<\/nav>/)?.[0];
    assert.ok(nav, `${name}: primary navigation`);
    const normalNav = nav.replace(/ aria-current="page"/g, '');
    navBaseline ??= normalNav;
    assert.equal(normalNav, navBaseline, `${name}: consistent navigation`);
    assert.equal([...nav.matchAll(/<a\b/g)].length, 7, `${name}: seven menu links`);
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        JSON.parse(match[1]);
    }
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
        const href = match[1].replaceAll('&amp;', '&');
        if (/^(?:https?:|mailto:|tel:|data:)/.test(href)) continue;
        const url = new URL(href, origin + name);
        const relative = decodeURIComponent(url.pathname.slice(new URL(origin).pathname.length)) || 'index.html';
        assert.ok(existsSync(resolve(root, relative)), `${name}: missing ${relative}`);
        if (url.hash && relative.endsWith('.html')) {
            assert.ok(read(relative).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${name}: missing anchor ${href}`);
        }
    }
    assert.ok(html.includes('href="privacy.html"'), `${name}: privacy link`);
    if (name !== 'portfolio_website.html') assert.ok(locations.includes(canonical), `${name}: sitemap entry`);
}
console.log('PASS: seven entries, six canonical URLs, shared navigation, metadata, JSON-LD, local links/anchors, homepage parity.');