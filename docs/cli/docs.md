---
summary: "CLI reference for `opnex docs` (search the live docs index)"
read_when:
  - You want to search the live OPNEX docs from the terminal
title: "Docs"
---

# `opnex docs`

Search the live docs index.

Arguments:

- `[query...]`: search terms to send to the live docs index

Examples:

```bash
opnex docs
opnex docs browser existing-session
opnex docs sandbox allowHostControl
opnex docs gateway token secretref
```

Notes:

- With no query, `opnex docs` opens the live docs search entrypoint.
- Multi-word queries are passed through as one search request.

## Related

- [CLI reference](/cli)
