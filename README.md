# Khatt website

Static site for https://khatt-inc.github.io/ (GitHub Pages, org site).

- `/` Khatt home
- `/wasel/` Wasel product page
- `/wasel/privacy/` **Wasel privacy policy** (this URL is the one entered in Google Play Console and linked from the app: `kPrivacyPolicyUrl`)

No build step, no third-party requests, no analytics. Fonts (Figtree, Readex Pro) are self-hosted under the SIL OFL.

## Preview

    python3 -m http.server 8080   # then open http://localhost:8080

## Changing the privacy policy

Keep `wasel/privacy/index.html` identical in substance to the app's behavior (`distribution/playstore/policy/DATA_SAFETY.md` in the app repo) and bump the effective date.
