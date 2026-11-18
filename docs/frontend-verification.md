# Verification — 18 November 2026

- Read original README.md, pathsnap/api.py and route_geometry before integration.
- Backend and model files preserved byte-for-byte; frontend added in its own folder.
- Production Vite 6.4.4 build passed under Node 24.14.1.
- Network DNS was unavailable for npm downloads. Build dependencies were recovered
  from the existing local npm tarball cache. A normal npm install is documented
  for machines with network access.
- No API was listening at http://127.0.0.1:8000/health. No backend LAN address was
  supplied. Python in this workspace lacks FastAPI. The original student dataset
  exists on this laptop, but live inference has not been run.
- Browser test could not execute: starting Vite on 127.0.0.1:5173 failed
  with listen EPERM due to workspace restrictions. No browser test passed.
  The supplied test uses controlled contract-shaped API responses plus a Leaflet
  method spy. It checks string IDs, bodyless POST, loading/duplicate prevention,
  metric formatting, coordinate inversion, separate segments, cleared results,
  switching trips and bounds, failed prediction/retry, and a refused API connection.
  This does not establish real Leaflet rendering or live model correctness.

## Checks still requiring the two laptops

1. Start the unchanged backend with the student partition, correct dataset/model,
   LAN binding 0.0.0.0, allowed UI origin, and Windows firewall access.
2. From the UI laptop use the backend LAN IP; confirm browser GET /health and
   /trips succeed with CORS and all returned IDs appear with leading zeros.
3. Run a real prediction; inspect API logs for one bodyless POST, verify displayed
   accuracy, seconds and count against its response.
4. With internet access, verify real Leaflet route/GPS layers, gaps, coordinate
   location, fit bounds and both layer toggles.
5. Switch to another live trip; verify the prior geometry and metrics clear,
   new metrics and bounds update, then switch back.
6. Stop the backend or use a closed port; verify clear connection failure,
   restore it, reconnect and retry a prediction.
7. On demo day repeat against evaluator_test with the full model and reserved
   data. There is no frontend ID restriction or partition-dependent behavior.
8. After these pass, capture the completed **live** results screen for the report.
   No live-results screenshot has been produced.
