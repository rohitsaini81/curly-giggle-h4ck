# Freelancer project browser

This tool opens Freelancer in Chrome using a dedicated persistent browser
profile. Log in manually once; the browser then keeps the cookies and local
storage in `browser-profile/` for later runs.

## Setup

Python 3.10+ and Firefox, Google Chrome, or Chromium are required. The tool
automatically uses an installed browser (Chrome/Chromium first, then Firefox).

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Use

Open the default project page, fetch its data, and keep the browser open:

```bash
python browser.py
```

First login (complete any CAPTCHA or two-factor prompt yourself):

```bash
python browser.py login
```

Fetch the configured project and save its information to a JSON filename based
on the fetched title, for example
`project-data/software-project-sourcing-specialist.json`:

```bash
python browser.py fetch
```

Keep the browser open after fetching:

```bash
python browser.py browse
```

After a successful login, unattended mode may work:

```bash
python browser.py fetch --headless
```

Use another page or choose an exact output filename with `--url URL` and
`--output FILE`.

The profile directory contains an authenticated session. Keep it private, do
not commit it, and delete it to sign this tool out. Automated access must comply
with Freelancer's terms and rate limits.
