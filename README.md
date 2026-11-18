# PathSnap

The backend takes a trip ID, generates road candidates from GPS and road geometry, scores them with the trained classifier, and decodes the sequence with HMM/Viterbi. The API scores predictions against a reference route server-side. The evaluator UI is a separate project component.

## Repository layout

| Folder | Contents |
| --- | --- |
| [backend](backend/) | FastAPI, the shared Python package for preprocessing, model training, HMM/Viterbi and Folium, and Python dependencies |
| [frontend](frontend/) | Evaluator dashboard, Node dependencies, and frontend tests |
| [training](training/) | Google Colab notebook |
| [docs](docs/) | Training, backend setup, and frontend verification guides |
| [artifacts](artifacts/) | Final Colab model, seven-model metrics, Bayesian trials, and the model comparison chart |

## Run PathSnap

1. Use the [final Colab export](artifacts/) or [retrain in Colab](docs/training.md).
2. [Start the backend](docs/backend.md) on the Windows laptop.
3. [Start the evaluator UI](frontend/README.md) and connect it to the backend over the LAN.
