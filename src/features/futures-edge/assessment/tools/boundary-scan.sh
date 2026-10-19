#!/usr/bin/env bash
# EDGE-09 boundary scan: the architecture.md §6 greps (plus EDGE-09 extras), scoped to EDGE-09's own tree
# src/features/futures-edge/assessment. Run from anywhere: bash src/features/futures-edge/assessment/tools/boundary-scan.sh
# Patterns use a [x] character class so this file never matches its own patterns (and never trips the repo-wide
# architecture §6 greps run by EDGE-10/EDGE-11). Exit 0 = no forbidden hits.
# localStorage is EXPECTED in progress/storage.ts (the local-only demo adapter) and is reported, not failed.
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fail=0
scan() { # title, rg args...
  local title="$1"; shift
  echo "== $title"
  if rg -n "$@" "$ROOT"; then fail=1; else echo "   no hits"; fi
}
scan "1. Exchange / Binance endpoints (architecture §6)" -i -e 'binance\.co[m]' -e 'binance\.(us|visio[n])' -e 'fap[i]\.' -e 'stream\.binanc[e]'
scan "2. Network primitives (architecture §6)" -e '\bfetc[h]\(' -e 'XMLHttpReques[t]' -e 'new WebSocke[t]' -e 'EventSourc[e]' -e 'axio[s]' -e 'sendBeaco[n]'
scan "3. Order / exchange / trading-DB clients" -i -e 'ccx[t]' -e 'binance-ap[i]' -e 'placeOrde[r]' -e 'createOrde[r]' -e 'newOrde[r]' -e 'supabas[e]' -e 'firebas[e]' -e "from ['\"](p[g]|mysql2?|mongod[b]|prism[a])['\"]"
scan "4. Live URLs (runtime code)" -e 'https?:/[/]' --glob '!**/__tests__/**' --glob '!**/*.md'
scan "5. Contracts only via the package root (no deep imports into the contracts src folder)" -e "contracts/sr[c]" --glob '!**/*.md'
scan "6. Trading-permission language" -i -e 'authorizesLiveTrading:\s*tru[e]' -e 'you are now ready to trad[e]' -e 'you can now trad[e]' --glob '!**/__tests__/**'
scan "7. Runtime code must not import tools/ or __tests__/" -e "from ['\"][^'\"]*(/tool[s]/|/__test[s]__/)" -e "from ['\"]\.\.?/tool[s]" --glob '!**/__tests__/**' --glob '!tools/**'
echo "== info: localStorage in .ts/.tsx (expected: progress/storage.ts code + comments/messages)"
rg -n 'localStorag[e]' "$ROOT" -g '*.ts' -g '*.tsx' --glob '!**/__tests__/**' || true
echo "== info: import.meta.env in code (expected: comment in flag.ts only; the host passes the flag in)"
rg -n 'import\.meta\.en[v]' "$ROOT" -g '*.ts' -g '*.tsx' || echo "   none"
[ $fail -eq 0 ] && echo "BOUNDARY SCAN: PASS" || echo "BOUNDARY SCAN: FAIL"
exit $fail
