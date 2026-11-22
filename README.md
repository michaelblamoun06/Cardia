# Cardia Anatomy Atlas

Cardia is a static web app for exploring cardiopulmonary anatomy and physiology.

## Run locally

From the extracted project folder, run `python3 -m http.server 8000 --directory dist` and open http://cardia.localhost:8000/#explorer. Serving the files over HTTP lets the app load its 3D models and scan assets.

## Transfer to GitHub

Extract this archive, then commit the contents of the extracted folder to your GitHub repository. The archive includes the app in `dist/` and the model preparation script in `scripts/`. For static hosting, publish the contents of `dist/`. GitHub Pages can serve this directory through a deployment workflow.

## Attributions

See **Model notes & references** in Cardia for anatomy dataset credits. Clinical image credits and licenses are listed in **Clinical imaging**. Preserve the applicable credits, licenses, and vendor notices when redistributing the assets.
