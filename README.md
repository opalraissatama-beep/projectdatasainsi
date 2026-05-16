# AI WAF Website

Next.js 15 + FastAPI full-stack simulation for an AI-powered web application firewall.

## Structure

- `backend/` FastAPI, SQLite logging, AI detector wrapper
- `frontend/` Next.js App Router UI

## Backend

1. Create a Python environment.
2. Install dependencies from `backend/requirements.txt`.
3. Place your trained model at `backend/app/ai_engine/sentinel_ai_engine_v2.pkl`.
	- If you keep `sentinel_ai_engine_v2.pkl` in the workspace root, the backend will also pick it up from there.
4. The analysis images `confusion_matrix.png` and `shap_sqli.png` are exposed by the backend at `/artifacts/confusion-matrix` and `/artifacts/shap-sqli`.
5. Run the app from the `backend` folder:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

If the model file is missing, the backend falls back to a deterministic heuristic so the demo still works.

## Frontend

1. Install dependencies in `frontend/`.
2. Start the dev server:

```bash
npm run dev
```

Set `NEXT_PUBLIC_API_BASE_URL` to your backend URL when deploying.

## Deployment

- Backend: Railway
- Frontend: Vercel

### Vercel frontend setup

1. Import the GitHub repository into Vercel.
2. Set the root directory to `frontend`.
3. Add the environment variable `NEXT_PUBLIC_API_BASE_URL` with your Railway backend URL.
4. Leave the build command as `npm run build`.
5. Leave the output directory handled by Next.js default settings.

## API

- `POST /predict`
- `POST /vulnerable`
- `GET /logs`
- `GET /stats`
