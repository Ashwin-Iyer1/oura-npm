# Interactive collection gallery

This React + TypeScript app uses the local `oura-stats-visualizer` package. Its deterministic synthetic transport replaces the network at the Fetch boundary, so the actual hook still exercises pagination, loading, cancellation, collection errors, and recovery.

From the repository root:

```powershell
npm ci
npm --prefix examples/demo-app ci
npm run build:demo
python -m http.server 4175
```

Visit `http://localhost:4175/demo/dist/`. The output at `demo/dist/` is portable to any path on a static HTTP host. There is no proxy, credential input, analytics, external font, or live API request in this gallery.

To develop, build the library once with `npm run build`, then run `npm --prefix examples/demo-app run dev`. Rebuild the library after changing its source. `src/sample.ts` is the only source of fixture values. The historical `OuraYearWrapped.tsx` example remains in source but is not imported by this gallery.
