# logicalsurgeon
GitHub Pages deployment for Dr. Nihar Thakkar's portfolio site.

## Pages
- Home: `index.html` (`portfolio_website.html` is a synchronized alternate entry).
- Profile and credentials: `about.html`.
- Learning resources: `courses.html`.
- Journal papers and chapter: `publications.html`.
- All canonical pages appear in `sitemap.xml`.

## Inquiry flow and privacy
`inquiry.js` prepares WhatsApp and email draft links locally. It does not submit,
store, or automatically send inquiries. Visitors review and send in their app.
Editing a field invalidates earlier drafts. Direct contact links remain available
if JavaScript is unavailable. Do not collect medical records through this form.

Automatic email/WhatsApp notifications require a separately provisioned backend,
consent and retention rules, and a WhatsApp provider. No credentials belong in the
public repository. A Google Form must be created by its owner before linking it;
the supplied Google share URL was not a form.

## Clinic map
The embed is explicitly a clinic-name search, not a verified address pin. The
directions button preserves the owner's supplied Google Maps short link. Confirm
the clinic address and obtain the official embed before replacing the search.

## Deployment and remaining owner setup
GitHub Pages publishes the repository root on `main` at
https://jahnvi480.github.io/logicalsurgeon/.
Keep the two homepage files identical and validate internal links, metadata,
responsive layouts, inquiry drafts and `git diff --check` before publishing.

Search Console ownership verification and sitemap submission require the site
owner's Google account. More pages or metadata cannot guarantee search rankings.
Credentials, review quotations and publication details should be approved by
Dr. Nihar before using them as independently verified claims.

