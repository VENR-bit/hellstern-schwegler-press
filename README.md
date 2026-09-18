# Hellstern Schwegler Press — website

Three static pages. No build step, no dependencies. Open `index.html` in a
browser, or upload the whole folder to any host (Netlify, Cloudflare Pages,
GitHub Pages, or plain shared hosting).

```
index.html               The press
rising-and-falling.html  Coming soon page for the book
excerpt.html             "The Door That Is Already Open" — the longer excerpt
assets/css/site.css      One stylesheet for all three pages
assets/js/config.js      The only file you need to edit to go live
assets/js/signup.js      Email signup behaviour
assets/img/              Logo, handwritten title
```

## Before you publish

**1. Set the contact address and the signup endpoint.**
Everything configurable lives in `assets/js/config.js`:

```js
window.HSP = {
  signupEndpoint: "",                                  // see below
  contactEmail: "caecilia@schwegler.ch"                // until hello@ exists
};
```

Until `signupEndpoint` is set, the form still works: it opens the reader's mail
app addressed to `contactEmail`. That address must be a real, monitored inbox,
or those messages go nowhere.

`contactEmail` currently points at an existing personal inbox, because no
mailbox exists on the domain yet. Infomaniak includes one free address with the
domain — once `hello@hellsternpress.com` is created, change this one line and
widen the SPF record, which today reads `v=spf1 -all` (the domain declares it
sends no mail at all).

**2. Author photograph — done.**
`assets/img/author.jpg`, cropped to 4:5 and stripped of EXIF. It is shown in
full colour deliberately: the page is otherwise near-monochrome, so the robe is
the one warm element on the site. To replace it, drop in another 4:5 image at
the same path. If the file is ever missing, a "Portrait forthcoming" placeholder
takes its place automatically.

**3. Confirm the press name.**
The brief said *Hellstern Press*; the logo says *Hellstern Schwegler Press*. The
site uses the logo's full name. To change it:

```bash
grep -rl "Hellstern Schwegler Press" . | xargs sed -i '' 's/Hellstern Schwegler Press/Hellstern Press/g'
```

**4. Fill in publication details when confirmed.**
ISBN, format, extent, date and price go in the `<dl class="coldata">` block in
`rising-and-falling.html`. A line already tells readers these are coming.

## Connecting the signup form

The form posts to any endpoint that accepts a form-encoded POST. A Google Sheet
is the simplest option:

1. Create a sheet with headers `Timestamp | Email | Source | Page` in row 1.
2. **Extensions → Apps Script**, replace the contents with:

```js
function doPost(e) {
  var params = new URLSearchParams(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet.appendRow([
    new Date(),
    params.get('email'),
    params.get('source'),
    params.get('page')
  ]);
  return ContentService.createTextOutput('ok');
}
```

3. **Deploy → New deployment → Web app**, with
   *Execute as:* **Me** and *Who has access:* **Anyone**.
4. Copy the `/exec` URL into `signupEndpoint` in `config.js`.

Keep `doPost` at the top level of the script — nesting it inside another
function is the usual reason a deployment returns 404.

Mailchimp, Buttondown, Formspark and Formspree also work: paste their form
action URL into `signupEndpoint` instead.

## Design notes

- **The cover is drawn in CSS, at the real trim.** The 2:3 proportion is the
  6 × 9 inch page size of the printed edition, taken from the master proof. Its
  text is sized in container units, so the same markup holds up at hero size on
  the book page and at catalogue size on the press page. Replace it with a photo
  of the finished jacket when there is one — swap the `.book__cover` contents for
  a single `<img>`.
- **The title is Bhante's own handwriting.** `assets/img/title-handwritten.png`
  was lifted from page 1 of *Hand written illustrtions of the rising & falling
  book.pdf*, background removed, ink left untouched. It is a transparent PNG, so
  it inverts to white in dark mode.
- **The accent colour is his pen.** `#333C56` is sampled from the blue-black
  ballpoint in those same notebook scans — it is not a stock palette choice.
- **Two typefaces, two halves of the book.** Spectral, a literary serif, for
  everything read; Archivo, a Swiss grotesque, for labels and buttons.
- **One moving element.** The hairline under the title rises and falls on a slow
  breath cycle — four seconds in, five and a half out. It stops entirely under
  `prefers-reduced-motion`.
- **Light and dark are both fully designed**, and the reader can choose. The
  half-disc button in the masthead flips the theme and turns over to show its
  other half; the choice is kept in `localStorage` under `hsp-theme`. With no
  stored choice the page follows the reader's system setting and keeps tracking
  it live. A tiny inline script in each `<head>` stamps the stored choice before
  first paint, so there is no flash of the wrong theme — keep it inline and keep
  it first, or the flash comes back.

## Local preview

```bash
python3 -m http.server 8777 --directory press-site
```

Then open http://localhost:8777.

## Domain

The site is served from GitHub Pages at **hellsternpress.com**, set by the
`CNAME` file at the repo root. Do not delete or rename that file — Pages reads
it on every build, and removing it drops the custom domain.

DNS lives at Infomaniak. The apex needs GitHub's four A and four AAAA records,
and `www` a CNAME to `venr-bit.github.io.`; `hellsternpress.ch` is set up there
as a redirect to the `.com`.

## Rights

The website design and code in this repository may be reused freely.

The text of *Rising and Falling*, including the excerpt reproduced on these
pages, is © Bhante Homagama Rewatha and is published here by permission of the
author. It is not covered by any open-source licence and may not be reproduced
elsewhere without written permission. The Hellstern Schwegler Press mark is a
trademark of the press.
