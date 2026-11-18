# Train on Google Colab

1. Use the supplied `pathsnap-source.zip`, or build it in PowerShell from the repository root.

   ```powershell
   Compress-Archive -Path backend/pathsnap,backend/requirements.txt,backend/requirements-colab.txt -DestinationPath pathsnap-source.zip -Force
   ```

2. Open [the training notebook](../training/PathSnap_Colab.ipynb) in Google Colab with a CPU runtime. Upload `pathsnap-source.zip` and the original `Student folder.zip` when the notebook prompts you. If the runtime still has the old five-model source ZIP, remove that ZIP from Colab's Files pane before running setup. You can reuse the dataset ZIP.
3. Run all cells. Download and extract `pathsnap-artifacts.zip` into `artifacts/` in this project. The archive includes `model.joblib`, the run results, trip inventory, comparison plots, and the student-trip map.

The full run fits seven classifiers on 80 training trips and evaluates on the ten student-test trips. The comparison includes Logistic Regression, Gaussian Naive Bayes, Random Forest, Extra Trees, Histogram Gradient Boosting, a multilayer perceptron (MLP), and XGBoost. Use the same three trip-grouped cross-validation folds for every model. The workflow chooses a model by mean CV candidate Macro F1 and runs a Bayesian search over that model's hyperparameters.

The exported decoder uses fixed transition settings. Results include tuned versus untuned comparisons and an evaluation with and without decoding. The provided route file contains an ordered arc sequence, so pointwise scores use labels derived by monotone GPS-to-reference-route alignment. Route continuity measures directly adjacent predicted arcs, and arc-overlap F1 is a multiset score.
