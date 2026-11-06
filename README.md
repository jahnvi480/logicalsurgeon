# logicalsurgeon
GitHub Pages deployment for Dr. Nihar Thakkar's portfolio site.

## Pages
- Home: `index.html` (`portfolio_website.html` is a synchronized alternate entry).
- Profile and credentials: `about.html`.
- Clinic and appointment enquiries: `clinic.html` (an enquiry is not a confirmed booking).
- Learning resources: `courses.html`.
- Journal papers and chapter: `publications.html`.
- Privacy and medical-information notice: `privacy.html`.
- All six canonical pages appear in `sitemap.xml`; the duplicate homepage is excluded.

## Shared navigation
Every entry page uses the same header markup and `site-header.css`, loaded after
page-specific styles. Navigation stays visible without JavaScript at all widths.
Keep its stylesheet version in sync across pages when changing the shared header.
All pages load `site-header.css?v=2`; secondary pages load `pages.css?v=2`.
The seven primary links are Home, About, Clinic, Courses, Reviews, Publications and
Contact. Footer links include Clinic and Privacy & medical information. The home
hero gives Clinic & Appointments and Courses & Mentorship equal button styling;
their display order does not imply a hierarchy between surgery and teaching.

## Visual system
All seven entry pages load `visual-system.css?v=1` after their existing styles.
It owns the shared dark-teal/ivory/gold presentation, typographic scale, rounded
buttons, photo framing, hospital cards and responsive refinements. Keep it last
in the stylesheet order. The homepage uses a photographic editorial hero,
asymmetric gallery and a photo-led clinical section; the clinical and educational
hero actions retain equal styling. Existing content, native navigation, enquiry
logic and photograph viewer remain unchanged. Decorative effects require no new
JavaScript or dependencies; reduced-motion preferences disable transitions.
Check all pages at 320, 375, 768, 1024 and 1440 pixels before publishing visual
changes, including keyboard focus, gallery viewing and the local enquiry drafts.

## Identity and content boundaries
The owner confirms that Dr. Nihar Thakkar is co-founder of both Kalakriti
Healthsquare and LogicalSurgeonn. Clinical practice and surgical education must
receive equal emphasis, with neither presented as a secondary role. These
organization spellings are provisional pending owner confirmation of exact
branding/legal names. Their legal relationship, and the relationship between
Kalakriti Healthsquare and the existing Kalakriti Surgical Centre directions
label, await owner clarification. Do not assume naming equivalence or rename the
existing directions. Co-founder roles are user-confirmed, not independently
verified online.

The homepage teaching counters belong in the Courses section, not the hero.
Existing quotations remain explicitly student reviews and are unchanged. Patient
reviews have not been supplied or verified; do not fabricate reviews, ratings or
medical outcomes, and add no patient review cards pending an approved source.
Online clinic details could not be verified (Google challenge and unsuccessful
Maps short-link extraction). Do not invent services, addresses, hours or booking
promises. Retain original source assets and supplied academic credentials without
inflating academic titles.

## Image assets
The homepage and About portrait use responsive JPGs derived from the existing
1080 × 1350 portrait: `dr-nihar-portrait-900.jpg` (900 × 1125) and
`dr-nihar-portrait-600.jpg` (600 × 750), with `srcset` and responsive `sizes`.
These are reduced pixel dimensions, not WebP conversion; compare actual file sizes
before claiming a byte-size saving. `dr-nihar-teaching.jpg` retains the source's
725 × 710 dimensions (maximum width 725) for the course photo.
`social-preview.jpg` is the 1200 × 630 Open Graph/Twitter sharing image. The home
Person schema uses the 900-pixel portrait, not the sharing graphic. The derived
assets are committed alongside their unchanged source photographs. Regenerate
them with `scripts/build-images.ps1` on Windows with System.Drawing available.
The 600-pixel portrait is about 61% smaller than the original; the 900-pixel
portrait is about 24% smaller. The teaching image has only a small byte reduction.

## Validation
Surgical profile supplied by the owner on 6 November 2026: Consultant General
Surgeon; MBBS, MS General Surgery, CCrISP (Royal College of Surgeons, England);
over a decade of experience; Assistant Professor at HBT Medical College & RN
Cooper Hospital. Owner-supplied specialties: laparoscopic surgery, anorectal
surgery, diabetic foot management, emergency surgical procedures and trauma
surgery. These are owner-provided claims, not independently certified by this
repository. No round-the-clock availability, outcome guarantee or emergency
booking service is implied.
The subsequent owner-supplied profile screenshot clarifies the experience as
nearly 12 years of surgical training and hospital service, not 12 years of
independent consultant practice. It supplies Sir J.J. Group of Hospitals,
Government Medical College Aurangabad, Bharatratna Dr. Babasaheb Ambedkar Hospital,
Dr. R. N. Cooper Hospital and practice at Aashirwad Hospital. It describes the
Assistant Professor role in the past tense, unlike the earlier text; published
copy therefore uses non-current-specific academic experience wording. The owner
asked to include all information but has not resolved that current-role timing.
No hospital addresses, dates, fees or availability are inferred from the image.

On 6 November 2026 the owner confirmed associations with six hospital locations.
The supplied Google share links were resolved in a browser to identify names and
branches; those listings identify locations, not independent proof of affiliation:
- Infinity Multispeciality Hospital, Goregaon West: https://share.google/kpPGA3wZObO05J6dJ
- Aashirwad Hospital, Andheri West: https://share.google/Y96KheowVaSS5KaeP
- CritiCare Asia Multispeciality Hospital, Andheri West: https://share.google/se2UJksTKDN4U3TlH
- CritiCare Asia Multispeciality Hospital, Malad West: https://share.google/Maf2LV2pU4E5d3YvX
- Mandapeshwar Nursing Home, Borivali West: https://share.google/RUZygmEiyBWt56mPW
- Oscar Superspeciality Hospital, Goregaon West: https://share.google/2qH6JvzhkU1OpfMiO

Keep the two CritiCare branches separate. These associations are separate from
training/service history and do not imply employment titles, admitting privileges,
fixed consulting hours or guaranteed availability. The Clinic page retains the
owner-supplied listing links and asks visitors to confirm appointment details.
Hospital-wide ratings/reviews must not be presented as reviews of Dr. Thakkar.

Owner confirmed on 6 November 2026 that all supplied photographs are approved
for public use, including the group-session image. Gallery captions do not
identify participants or imply patient outcomes. New scrubs, speaking, workshop
and group-session derivatives are generated by `scripts/build-images.ps1`.
`experience.js` progressively enhances native image links with a keyboard-friendly
dialog; photographs remain accessible without JavaScript. Entrance animations
never hide content and respect reduced-motion preferences.

Run `node scripts/validate-site.mjs` for canonical URLs, sitemap membership,
shared navigation, social metadata, JSON-LD, local links/anchors and homepage
parity. Also check layouts in a real browser and run `git diff --check`.

## Inquiry flow and privacy
`inquiry.js` prepares WhatsApp and email draft links locally. It does not submit,
store, or automatically send inquiries. Visitors review and send in their app.
Editing a field invalidates earlier drafts. Direct contact links remain available
if JavaScript is unavailable. Do not collect medical records through this form.
The form includes Clinic Appointment Inquiry and a persistent privacy-notice link
outside its changing status message, with an emergency/medical-records warning.
Courses and mentorship are educational, not medical consultation. The Clinic page
asks visitors to confirm appointment details directly; the Privacy page explains
draft handling, third-party services and medical-information limits. These notices
do not establish a clinical advice or emergency service.

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
The owner must verify the full clinic address, hours, medical registration details
and actual services before publishing them as confirmed information. Google Business
Profile ownership, listing details and any changes also require owner verification;
do not invent address, service, registration or availability claims.
Credentials, review quotations and publication details should be approved by
Dr. Nihar before using them as independently verified claims.

No `robots.txt` is added: crawlers read it at the host root
(`https://jahnvi480.github.io/robots.txt`), not this project's `/logicalsurgeon/`
subpath. Host-root robots configuration requires control of the host-root site.

