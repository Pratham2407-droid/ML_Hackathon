# PathSnap

The backend takes a trip ID, generates road candidates from GPS and road geometry, scores them with the trained classifier, and decodes the sequence with HMM/Viterbi. The API scores predictions against a reference route server-side. The evaluator UI is a separate project component.

## Train on Google Colab

1. Use the supplied `pathsnap-source.zip`. If you edit the source, rebuild the ZIP in PowerShell from this folder.

   ```powershell
   Compress-Archive -Path pathsnap,requirements.txt,requirements-colab.txt -DestinationPath pathsnap-source.zip -Force
   ```

2. Open `PathSnap_Colab.ipynb` in Google Colab with a CPU runtime. Upload `pathsnap-source.zip` and the original `Student folder.zip` when the notebook prompts you.
3. Run all cells. Download and extract `pathsnap-artifacts.zip` into `artifacts/` in this project. The archive includes `model.joblib`, the run results, trip inventory, comparison plots, and the student-trip map.

The full run fits five classifiers on 80 training trips, uses three trip-grouped cross-validation folds, and evaluates on the ten student-test trips. It chooses a model by mean CV candidate Macro F1, then searches its hyperparameters with a Gaussian-process surrogate and expected improvement. The exported decoder uses fixed transition settings. Results include tuned versus untuned comparisons and an evaluation with and without decoding. Because the provided route file contains a sequence of arcs, pointwise scores use labels derived by monotone GPS-to-reference-route alignment. Route continuity measures directly adjacent predicted arcs, and arc-overlap F1 is a multiset score.

## Run FastAPI on Windows

```powershell
python -m pip install -r requirements.txt
$env:PATHSNAP_PARTITION = 'student_test'
$env:PATHSNAP_DATA = 'C:\Users\Pratham S Reddy\Downloads\Student folder.zip'
$env:PATHSNAP_MODEL = 'artifacts/model.joblib'
python -m uvicorn pathsnap.api:app --host 127.0.0.1 --port 8000
```

Open `http://127.0.0.1:8000/docs` to try the endpoints. The model is a serialized Python artifact, so load only an artifact created by your team.

| Endpoint | Result |
| --- | --- |
| `GET /health` | Server readiness and trip count |
| `GET /trips` | Available eight-digit trip IDs under `trip_ids` |
| `POST /trips/{trip_id}/predict` | GPS rows, matched arc IDs, route segment coordinates, pointwise accuracy and processing time |

GPS rows have the order `[longitude, latitude, timestamp]`. Route coordinates use `[longitude, latitude]`. The route is a list of segments so the UI can draw separate lines across gaps. Accuracy is a fraction between zero and one. The server logs the trip ID and elapsed time for each successful inference.

## Two-laptop demo

Set `PATHSNAP_PARTITION=evaluator_test` and point `PATHSNAP_DATA` to the provided evaluation data. The current loader expects a folder structured as `evaluator_test/<trip_id>/<trip_id>.<extension>` inside the data root, or the same structure in a ZIP with an optional `Student folder/` prefix. Each trip needs the four documented files. The evaluator package has yet to be inspected, so its directory layout may need to be adapted once supplied.

Run Uvicorn with `--host 0.0.0.0` on the demo LAN. Use laptop 1's LAN IP and port `8000` as the UI's API base URL. Set `PATHSNAP_UI_ORIGINS` on laptop 1 to the browser page's full origin, including scheme and port. Allow inbound TCP 8000 on the demo network if Windows Firewall blocks the connection. Verify `GET /health` from laptop 2 and capture the backend logs during the evaluation.
