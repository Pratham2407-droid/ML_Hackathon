# Train on Google Colab

1. Use the supplied `pathsnap-source.zip`, or build it in PowerShell from the repository root.

   ```powershell
   Compress-Archive -Path backend/pathsnap,backend/requirements.txt,backend/requirements-colab.txt -DestinationPath pathsnap-source.zip -Force
   ```

2. Open [the training notebook](../training/PathSnap_Colab.ipynb) in Google Colab with a CPU runtime. Upload `pathsnap-source.zip` and the original `Student folder.zip` when the notebook prompts you.
3. Run all cells. Download and extract `pathsnap-artifacts.zip` into `artifacts/` in this project. The archive includes `model.joblib`, the run results, trip inventory, comparison plots, and the student-trip map.

The full run fits five classifiers on 80 training trips, uses three trip-grouped cross-validation folds, and evaluates on the ten student-test trips. It chooses a model by mean CV candidate Macro F1, then searches its hyperparameters with a Gaussian-process surrogate and expected improvement. The exported decoder uses fixed transition settings. Results include tuned versus untuned comparisons and an evaluation with and without decoding. Because the provided route file contains a sequence of arcs, pointwise scores use labels derived by monotone GPS-to-reference-route alignment. Route continuity measures directly adjacent predicted arcs, and arc-overlap F1 is a multiset score.
