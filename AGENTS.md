# AGENTS.md

## Cursor Cloud specific instructions

### Repository overview

This repository (`testSampleJs`) is a scratch/sample repo. It currently contains a
single file, `Sample`, which is a saved static HTML page (originally from
`filesamples.com`). The file has no extension but is HTML content (mostly embedded
third-party Ezoic / Google DoubleClick ad and consent scripts, plus a small amount of
tutorial HTML markup).

There is **no application code, package manager, build system, test suite, lint config,
database, or backing service** in this repo. There is nothing to install, build, lint,
or test. The update script is intentionally a no-op.

### Running / viewing the "app"

The only runnable artifact is the static `Sample` HTML page. To view it rendered in a
browser, serve it with any static file server. Because the file is named `Sample`
(no `.html` extension), copy it to an `index.html` in a temp directory first so the
browser renders it as HTML instead of downloading it:

```bash
mkdir -p /tmp/sample-serve
cp Sample /tmp/sample-serve/index.html
cd /tmp/sample-serve && python3 -m http.server 8000
# open http://localhost:8000/
```

Do not add a serving copy inside the repo unless the task calls for it — keep the
working tree clean.
