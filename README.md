# SpeakReady

**A responsive, front-end-only digital learning module that helps students build speaking confidence and oral communication skills through guided lessons, speaking practice, quizzes, and self-reflection.**

SpeakReady is designed as the proposed digital learning output for a study about the effects of language anxiety on the speaking skills of students at ACLC College of Calapan. Its learning activities are organized around the study's focus on nervousness when speaking before others, lack of self-confidence, fear of criticism, fluency, message clarity, and engaging listeners.

## Features

- Responsive homepage and student learning dashboard
- Six guided learning modules connected to the research indicators
- English and Filipino speaking prompts
- Speaking preparation and practice timers
- Optional browser microphone recording and playback
- Knowledge check with automatic quiz scoring
- Speaking self-assessment and reflection activities
- Browser-based progress tracking using `localStorage`
- Subtle page-opening animations with reduced-motion support

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage` for local progress
- Browser MediaRecorder API for optional voice recording

There is no database, backend, account system, or paid hosting requirement. The project is intended for deployment through GitHub Pages.

## Run locally

You can open `index.html` directly for most features. For microphone recording, use a secure context such as `https://` or `http://localhost` and allow microphone permission. One simple local server option is:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy using GitHub Pages

1. Create a GitHub repository and upload the contents of this folder.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select your deployment branch (for example, `main`) and the `/ (root)` folder.
5. Save and open the GitHub Pages URL after deployment completes.

Keep `index.html` in the repository root. Internal links use relative paths so the site can run from a GitHub Pages project URL.

## Data and privacy

There is no backend, database, login, or registration. Lesson completion, the latest quiz result, and practice-session notes are saved in the current browser using `localStorage`. They do not sync across devices or browsers. The optional voice recording is kept temporarily in the page for playback and is not uploaded or saved to a server.

## Educational limitations

The self-assessment rubric is reflective, not an objective speech evaluation. This version does not automatically grade pronunciation, diagnose language anxiety, or prove that the module reduces anxiety. Its quiz is a learning activity and is separate from the official research questionnaire.

## Project structure

- `index.html` — homepage
- `pages/` — dashboard, lessons, practice, assessment, progress, and resources
- `assets/css/style.css` — visual styles, responsive layouts, and page-opening animations
- `assets/js/` — navigation and interactive behavior
- `assets/data/` — lesson and activity content

## Customization

- Module content: `assets/data/modules.js`
- Visual styles: `assets/css/style.css`
- Page behavior: `assets/js/`
- Main pages: `index.html` and `pages/`
