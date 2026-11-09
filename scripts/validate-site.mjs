import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://logicalsurgeon.com/';
const pages = ['index.html', 'about.html', 'clinic.html', 'courses.html', 'publications.html', 'privacy.html'];
const read = name => readFileSync(resolve(root, name), 'utf8');
for (const name of [...readdirSync(root).filter(name => name.endsWith('.html')), 'sitemap.xml']) {
    assert.ok(!/jahnvi480\.github\.io/i.test(read(name)), `${name}: old GitHub origin must not appear in rendered HTML or sitemap`);
}
assert.equal(read('CNAME').replace(/\r?\n$/, ''), new URL(origin).hostname, 'CNAME: exact custom domain');
assert.equal(read('robots.txt').replaceAll('\r\n', '\n'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}sitemap.xml\n`, 'Robots: allow crawling and advertise the custom-domain sitemap');
assert.ok(readFileSync(resolve(root, 'index.html')).equals(readFileSync(resolve(root, 'portfolio_website.html'))), 'Homepage copies differ byte-for-byte');
const home = read('index.html');
const clinic = read('clinic.html');
const reviewSource = 'https://www.google.com/search?kgmid=/g/11yqk73vdz&hl=en-IN&q=Kalakriti+Surgical+Centre+Dr.+Nihar+Thakkar#lrd=0x3be7b74fc33d230f:0x4a5c242502f9193d,1,,,,';
const reviewExcerpts = [
    ['Shingre Akshata', 'Dr. Nihar was very patient while listening to the issue.'],
    ['Gunja Karia', 'Dr. Nihar Thakkar is very kind and helpful.'],
    ['rudra dave', 'Takes the time to listen and explain complex medical concepts simply.']
];
const reviewNote = 'Selected excerpts from public Google reviews of Kalakriti Surgical Centre. Individual experiences are not a guarantee of treatment outcomes.';
for (const name of ['index.html', 'portfolio_website.html']) {
    const html = read(name);
    assert.equal([...html.matchAll(/id="google-reviews"/g)].length, 1, `${name}: one Google review section`);
    const section = html.match(/<section\b[^>]*id="google-reviews"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(section, `${name}: Google review excerpts`);
    assert.ok(html.indexOf('id="google-reviews"') < html.indexOf('id="testimonials"'), `${name}: excerpts before student testimonials`);
    assert.ok(section.includes('<p class="eyebrow">Google review excerpts</p>'), `${name}: attribution label`);
    assert.ok(section.includes('<h2 class="section-title" id="google-reviews-title">Listening. Clarity. Care.</h2>'), `${name}: review heading`);
    assert.ok(section.includes(`<p class="section-subtitle">${reviewNote}</p>`), `${name}: source and outcome notice`);
    const cards = [...section.matchAll(/<figure class="google-review-card">([\s\S]*?)<\/figure>/g)].map(match => match[1]);
    assert.equal([...section.matchAll(/<figure\b/g)].length, 3, `${name}: exactly three figures`);
    assert.equal([...section.matchAll(/<blockquote\b/g)].length, 3, `${name}: exactly three quotes`);
    assert.equal([...section.matchAll(/<a\b/g)].length, 3, `${name}: exactly three source links`);
    assert.equal(cards.length, reviewExcerpts.length, `${name}: three static review cards`);
    for (const [index, [reviewer, excerpt]] of reviewExcerpts.entries()) {
        const expected = `<blockquote><p>${excerpt}</p></blockquote>\n                        <figcaption>\n                            <strong>${reviewer}</strong>\n                            <span>Google reviewer</span>\n                            <a href="${reviewSource.replaceAll('&', '&amp;')}">Read on Google</a>\n                        </figcaption>`;
        assert.equal(cards[index].trim().replaceAll('\r\n', '\n'), expected, `${name}: exact excerpt, displayed name and escaped source ${index + 1}`);
    }
    assert.ok(!/★|\bstars?\b|rating|<script\b|schema\.org/i.test(section), `${name}: no rating, schema or dynamic review content`);
    const styles = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(match => match[1]);
    assert.equal(styles.filter(href => href === 'google-reviews.css?v=1').length, 1, `${name}: one review stylesheet`);
    assert.ok(styles.indexOf('google-reviews.css?v=1') < styles.indexOf('visual-system.css?v=1'), `${name}: review styles before final visual layer`);
}
assert.ok(clinic.includes('href="./#google-reviews"'), 'Clinic: public review excerpts link');
for (const specialty of ['Laparoscopic Surgery', 'Anorectal Surgery', 'Diabetic Foot Management', 'Emergency Surgical Procedures', 'Trauma Surgery']) {
    assert.ok(clinic.includes(`<li>${specialty}</li>`), `Clinic: missing specialty ${specialty}`);
}
assert.ok(clinic.includes('HBT Medical College &amp; RN Cooper Hospital'), 'Clinic: supplied academic affiliation');
assert.ok(clinic.includes('Nearly 12 years of surgical training and hospital service'), 'Clinic: distinguish training and service from independent practice');
assert.ok(clinic.includes('Aashirwad Hospital'), 'Clinic: supplied hospital practice');
assert.ok(clinic.includes('not emergency services'), 'Clinic: emergency enquiry warning');
const associations = clinic.match(/<section[^>]*id="hospital-associations"[\s\S]*?<\/section>/)?.[0];
assert.ok(associations, 'Clinic: dedicated hospital associations section');
const hospitals = [
    ['Infinity Multispeciality Hospital', 'Goregaon West', 'kpPGA3wZObO05J6dJ'],
    ['Aashirwad Hospital', 'Andheri West', 'Y96KheowVaSS5KaeP'],
    ['CritiCare Asia Multispeciality Hospital', 'Andheri West', 'se2UJksTKDN4U3TlH'],
    ['CritiCare Asia Multispeciality Hospital', 'Malad West', 'Maf2LV2pU4E5d3YvX'],
    ['Mandapeshwar Nursing Home', 'Borivali West', 'RUZygmEiyBWt56mPW'],
    ['Oscar Superspeciality Hospital', 'Goregaon West', '2qH6JvzhkU1OpfMiO']
];
const hospitalCards = [...associations.matchAll(/<article class="card">([\s\S]*?)<\/article>/g)].map(match => match[1]);
assert.equal(hospitalCards.length, hospitals.length, 'Clinic: six hospital locations');
for (const [index, [name, area, shareId]] of hospitals.entries()) {
    const card = hospitalCards[index];
    assert.ok(card.includes(`<h3>${name}</h3>`), `Hospital ${index + 1}: name`);
    assert.ok(card.includes(`<p>${area}, Mumbai</p>`), `Hospital ${index + 1}: branch`);
    assert.ok(card.includes(`href="https://share.google/${shareId}"`), `Hospital ${index + 1}: supplied listing link`);
}
assert.ok(associations.includes('Confirm the hospital, appointment time and availability before travelling.'), 'Hospital appointment confirmation notice');
assert.ok(read('about.html').includes('href="clinic.html#hospital-associations"'), 'About: hospital associations link');
assert.ok(home.includes('class="container clinical-layout"'), 'Homepage: photo-led clinical feature');
assert.ok(home.includes('class="clinical-photo"'), 'Homepage: clinical portrait');
const clinicalCounters = home.match(/<div class="counters clinical-counters"[\s\S]*?<\/div>\s*<p class="small">/)?.[0];
assert.ok(clinicalCounters, 'Homepage: clinical counters');
assert.deepEqual([...clinicalCounters.matchAll(/data-target="(\d+)"/g)].map(match => Number(match[1])), [100, 50, 30, 20], 'Clinical counter display order');
for (const [value, label] of [[100, 'Patients Treated'], [30, 'Laparoscopic Surgeries'], [50, 'Open Surgeries'], [20, 'Upper GI Endoscopies (OGD)']]) {
    assert.ok(clinicalCounters.includes(`aria-label="${value}+ ${label}"`), `Clinical counter: ${label}`);
    assert.ok(clinicalCounters.includes(`data-target="${value}" data-suffix="+" aria-hidden="true">${value}+</div>`), `Clinical counter final fallback: ${value}`);
}
assert.ok(!home.includes('let countersStarted'), 'No shared global counter-start lock');
assert.ok(home.includes('counters.js?v=1'), 'Progressive counter script');
assert.ok(!read('courses.html').includes('Browse learning links'), 'Remove redundant learning-links button');
assert.ok(read('courses.html').includes('href="https://infusionbatch.lovable.app/">Explore Infusion Batch'), 'Dedicated Infusion Batch link');
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
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
        if (match[2].includes('Explore Courses')) {
            assert.equal(match[1], 'https://beacons.ai/niharthakkar', `${name}: temporary course resource hub`);
        }
    }
    const styles = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(match => match[1]);
    assert.equal(styles.filter(href => href === 'visual-system.css?v=1').length, 1, `${name}: one shared visual layer`);
    assert.equal(styles.at(-1), 'visual-system.css?v=1', `${name}: visual layer loads last`);
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
console.log('PASS: custom-domain origin, CNAME, robots sitemap, no old GitHub origin, seven entries, six canonical URLs, shared navigation, metadata, JSON-LD, local links/anchors, homepage byte parity.');