# PROPL

PROPL is a two-part application that demonstrates how to create and analyze AI-generated sales conversations tailored to various user demographics. The project uses:

- **[Google GenAI (Gemini)](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/foundation-model-gtext)** for generating personalized and persuasive conversations.
- **[FastAPI](https://fastapi.tiangolo.com/)** for the backend API and concurrency management.
- **[Next.js](https://nextjs.org/)**, **[React](https://react.dev/)**, and **[Tailwind CSS](https://tailwindcss.com/)** for the frontend UI.
- **[AWS Polly](https://aws.amazon.com/polly/)** for converting text to speech.
- **[Chart.js](https://www.chartjs.org/)** for visualizing demographic data in the frontend.

This repository includes a **backend** (Python/FastAPI) and a **frontend** (Next.js/React/TypeScript).

---

## Table of Contents

- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
  - [Running the Application](#running-the-application)
  - [Testing the Conversation Flow](#testing-the-conversation-flow)
  - [Analyzing Data](#analyzing-data)
- [API Endpoints](#api-endpoints)
- [File Overview](#file-overview)
  - [Backend Files](#backend-files)
  - [Frontend Files](#frontend-files)
- [Contributing](#contributing)
- [License](#license)

---

## Project Structure

```
./
├── backend
│   ├── gemini.py          # Handles calls to Google's GenAI (Gemini) for conversation generation
│   ├── main.py            # FastAPI application entry point
│   └── util.py            # Utility functions for data analysis
└── frontend
    ├── app
    │   ├── charts
    │   │   └── page.tsx
    │   ├── components
    │   │   ├── AnalysisCharts.tsx
    │   │   ├── avatarConfig.ts
    │   │   ├── Conversation.tsx
    │   │   ├── Hero.tsx
    │   │   └── LoadingScreen.tsx
    │   ├── context
    │   │   ├── ConversationContext.tsx
    │   │   └── DemographicContext.tsx
    │   ├── DemographicContext.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── next.config.ts
    └── tailwind.config.ts
```

---

## Key Features

1. **Multi-Persona Simulation**\
   Generate multiple user personas with randomized demographic attributes and simulate conversations with an AI “seller.”

2. **AI-Driven Conversation**\
   Uses Google’s GenAI (Gemini) to produce a dialogue that attempts to sell a given product to each persona.

3. **Concurrent Conversation Execution**\
   Utilize Python’s `concurrent.futures` to run multiple persona conversations in parallel.

4. **Evaluation of Pitches**\
   The system evaluates each conversation using a second GenAI prompt, returning a JSON structure with a sentiment score and accept/reject decision.

5. **Demographic Analysis**\
   Collects demographic distributions (e.g., age, gender, religion, income) of each persona that interacted, displaying aggregated data in the frontend via Chart.js.

6. **Text-to-Speech**\
   Integrates AWS Polly to convert the best-rated conversation into audio. You can download, play, or pause the resulting WAV file from the frontend.

7. **React/Next.js Frontend**\
   Provides a UI to enter a product pitch, optionally upload a product image, visualize the best conversation, and chart persona demographics.

---

## Prerequisites

1. **Python 3.9+** (for the backend)
2. **Node.js v16+** (for the frontend)
3. **Pipenv**, **virtualenv**, or your Python environment manager of choice.
4. **Google GenAI API key** (if you intend to call Gemini):
   - [Learn more here](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/overview)
5. **AWS Credentials** (for AWS Polly TTS):
   - You will need valid `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to run the text-to-speech feature.

---

## Setup and Installation

### Backend Setup

1. **Clone the Repo**:

   ```bash
   git clone https://github.com/your-username/PROPL.git
   cd PROPL/backend
   ```

2. **Create and Activate a Virtual Environment** (optional but recommended):

   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   # or
   venv\Scripts\activate     # Windows
   ```

3. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

   *Note: Ensure you have the required Python libraries such as **`fastapi`**, **`uvicorn`**, **`boto3`**, **`pandas`**, **`dotenv`**, etc.*

4. **Set Environment Variables**:

   - Copy `.env.example` to `.env` (if provided) or create one with your own keys:
     ```bash
     GEMINI_KEY=<YOUR_GOOGLE_GENAI_API_KEY>
     AWS_ACCESS_KEY_ID=<YOUR_AWS_ACCESS_KEY_ID>
     AWS_SECRET_ACCESS_KEY=<YOUR_AWS_SECRET_ACCESS_KEY>
     ```
   - Make sure this `.env` file is in the **backend** directory or that the environment variables are set in your system environment.

5. **Run the FastAPI App**:

   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

   The backend will be accessible at `http://localhost:8000`.

### Frontend Setup

1. **Navigate to the ****`frontend`**** Folder**:

   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn
   ```

3. **Run the Frontend**:

   ```bash
   npm run dev
   ```

   Your frontend will typically run on `http://localhost:3000`.

---

## Environment Variables

You’ll need the following environment variables for a fully functional setup:

| Variable                | Description                            | Required | Default |
| ----------------------- | -------------------------------------- | -------- | ------- |
| `GEMINI_KEY`            | API key for Google GenAI (Gemini).     | Yes      | *None*  |
| `AWS_ACCESS_KEY_ID`     | AWS Access Key ID for Polly (TTS).     | Yes      | *None*  |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Access Key for Polly (TTS). | Yes      | *None*  |

Place these either in a `.env` file within `backend/` or set them directly in your environment.

---

## Usage

### Running the Application

1. **Start the Backend** in one terminal:

   ```bash
   cd backend
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

2. **Start the Frontend** in another terminal:

   ```bash
   cd frontend
   npm run dev
   ```

3. **Visit the Frontend** at `http://localhost:3000`.

### Testing the Conversation Flow

1. On the homepage, you will see a **pitch input** box.
2. Type in your **product pitch** (the text or short description about what you’re selling).
3. Optionally, upload an **image** (e.g., product image) via the `+` button below the pitch box.
4. Click the **arrow button** to submit. You’ll see loading messages while the system:
   - Creates multiple random personas.
   - Generates sales conversations using Google’s GenAI.
   - Evaluates each conversation for acceptance and sentiment.
   - Identifies the best conversation.
   - Converts the best conversation to speech with AWS Polly.
5. Once done, the page will auto-scroll to the conversation. Here you can:
   - **Play/Pause** to hear the generated audio.
   - **Download** the conversation audio (WAV file).
   - Click **Analytics** to view demographic charts in `/charts`.

### Analyzing Data

- **Charts Page** (`/charts`) shows demographic distribution across personas:
  - Race, Gender, Age, Political Affiliation, etc.
  - Bar, Pie, and Line charts generated by Chart.js.

---

## API Endpoints

All endpoints are served by **FastAPI** on `http://localhost:8000/`.

| Endpoint                              | Method | Description                                                                   |
| ------------------------------------- | ------ | ----------------------------------------------------------------------------- |
| `/conversation/start`                 | `POST` | Starts a new conversation simulation. Requires `product_info`, optional file. |
| `/conversation/get_best_conversation` | `POST` | Returns the best conversation from a list based on highest sentiment score.   |
| `/conversation/convert`               | `POST` | Converts a given conversation to speech using AWS Polly.                      |
| `/conversation/play`                  | `GET`  | Serves the generated WAV file.                                                |

---

## File Overview

### Backend Files

- **`gemini.py`**

  - Contains functions to interface with Google GenAI (Gemini).
  - Generates conversation, persona creation, conversation evaluation, concurrency logic.

- **`main.py`**

  - Main FastAPI application.
  - Defines routes (`/conversation/start`, `/conversation/get_best_conversation`, `/conversation/convert`, etc.).
  - Configures CORS, sets up background tasks, handles file uploads.

- **`util.py`**

  - Utility functions for demographic analysis and scoring.
  - `analyze_demographics_with_defaults()` aggregates persona demographic data.
  - `calculate_scores()` processes acceptance and sentiment scores for conversation evaluations.

### Frontend Files

- **`app/components/Hero.tsx`**

  - Landing page input component. Gathers the user pitch and optional file.
  - Submits the data to the backend and triggers the conversation generation flow.

- **`app/components/Conversation.tsx`**

  - Displays the selected “best” conversation.
  - Allows the user to Play/Pause the text-to-speech audio.
  - Highlights “Salesman” or “Customer” when each is speaking.

- **`app/components/AnalysisCharts.tsx`**** & ****`app/charts/page.tsx`**

  - Shows a series of bar, pie, and line charts using Chart.js to visualize demographics.

- **`app/context/ConversationContext.tsx`**** & ****`app/context/DemographicContext.tsx`**

  - React Context providers to store conversation data, evaluation results, and demographics across components.

- **`globals.css`**** / ****`tailwind.config.ts`**

  - Global styling and Tailwind configuration.

---

## Contributing

1. **Fork** this repository.
2. Create a **feature branch** (`git checkout -b feature/my-new-feature`).
3. **Commit** your changes (`git commit -m 'Add some feature'`).
4. **Push** to the branch (`git push origin feature/my-new-feature`).
5. Create a new **Pull Request**.

We welcome contributions to improve the project, fix bugs, add features, or refine documentation.

---

## License

This project is not licensed under any specific open-source license by default. If you wish to use or distribute it, please include your own licensing or check with the repository owner.
