
# 🐉 Dragon Haven

> **A cozy, gamified focus companion for ADHD brains.**  
> Raise elemental dragons, evolve them through focus sessions, and harness the power of Generative AI to visualize your progress.

---

## 📋 Product Requirements Document (PRD)

### 1. Problem Statement
**The "Wall of Awful":** Neurodivergent individuals (specifically ADHD) often struggle with task initiation and sustaining focus on unstimulating tasks. Traditional to-do lists induce anxiety, and standard Pomodoro timers lack the dopamine feedback loop required to maintain long-term engagement.

### 2. The Solution
**Gamified Externalization:** Dragon Haven turns focus into a nurturing act. By tying task completion to the health and evolution of a digital companion, we externalize the motivation. The user isn't just "writing a report"; they are "feeding Ignis the Fire Dragon" to help it evolve.

### 3. Target Audience
*   Students with ADHD/ADD.
*   Remote workers struggling with self-regulation.
*   Gamers who need productivity tools that speak their language.

### 4. Core Loops
*   **The Focus Loop:** Set Intention (Voice/Text) → Focus Timer (Visual) → Review & Reflect → Reward (XP/Evolution).
*   **The Care Loop:** Neglect leads to boredom/sleep → Attention (Focus) restores mood.
*   **The Evolution Loop:** Accumulate Focus Minutes/Streaks → Trigger AI Cinematic Evolution → Unlock new forms.

---

## ✨ Key Features & Functionalities

### 🍅 Gamified Focus System
*   **Elemental Companions:** Choose from Fire, Water, Earth, Air, or Void dragons.
*   **Visual Focus Timer:** A mesmerizing, glowing circular timer that visualizes the passage of time without inducing stress.
*   **Smart Breaking:** Define an intention, and the AI (Gemini 3 Flash) breaks it down into actionable micro-steps using the "CLEAR" framework.
*   **Voice Input:** Built-in speech-to-text for quick intention setting and reflection logging.

### 🧬 Dynamic Evolution Engine
*   **Growth Stages:** Egg → Baby → Teen → Adult → Ancient.
*   **Evolution Criteria:** Choose between **Time-based** (total minutes focused) or **Streak-based** (consistency) evolution paths for each dragon.
*   **Mood System:** Dragons react to your activity patterns. They get "Eager" when you are consistent, "Content" when just fed, and "Bored" or "Sleeping" if neglected.

### 🎨 Generative AI Magic (Google Gemini)
*   **Cinematic Evolution:** When a dragon evolves, the app generates a unique video transformation using **Google Veo**.
*   **Portrait Studio:** Generate high-fidelity 4K portraits of your unique dragon using **Gemini 3 Pro Image**.
*   **Background Removal:** Upload real photos or generated art and clean them up using **Nano Banana** models for a clean UI integration.
*   **The Oracle:** Consult your dragon's history for insights on your productivity patterns via a chat interface.

### 📜 The Chronicles
*   **History Log:** Automatically logs every session, intention, and reflection.
*   **Reflective Journaling:** Post-session prompts to capture what went well and what didn't.

---

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **AI SDK:** Google GenAI SDK (`@google/genai`)
*   **Models Used:**
    *   `gemini-3-flash-preview` (Logic, Planning, Oracle)
    *   `gemini-3-pro-image-preview` (Image Generation)
    *   `veo-3.1-fast-generate-preview` (Video Evolution)
    *   `gemini-2.5-flash-image` (Background Removal)

---

## 🚀 How to Run Locally

Follow these steps to get Dragon Haven running on your laptop.

### Prerequisites
1.  **Node.js**: Ensure you have Node installed (v18+ recommended).
2.  **Google AI Studio Key**: You need a paid/enabled API key from [Google AI Studio](https://aistudio.google.com/) that has access to the Gemini 3 and Veo models.

### Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/dragon-haven.git
    cd dragon-haven
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory.
    ```bash
    touch .env
    ```
    Add your API key to the file:
    ```env
    # NOTE: In a Vite setup, this is usually VITE_API_KEY, 
    # but the codebase logic currently looks for process.env.API_KEY.
    # Ensure your bundler defines process.env or update the code.
    API_KEY=your_google_ai_studio_key_here
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

### ⚠️ Important Note on Billing
This project uses **Gemini 3 Pro** and **Veo** models. These are powerful, high-tier models. Ensure your Google Cloud/AI Studio project has billing enabled to prevent API errors during image and video generation.

---

## 📂 Project Structure

```
dragon-haven/
├── components/         # UI Components
│   ├── DragonVisuals.tsx  # SVG/Image rendering of dragons
│   ├── FocusTimer.tsx     # The circular timer logic
│   └── VoiceInput.tsx     # Speech-to-text wrapper
├── services/
│   └── utils.ts        # Game logic, state management, XP calcs
├── types.ts            # TypeScript interfaces
├── App.tsx             # Main application controller
├── index.html          # Entry point
└── README.md           # You are here
```

---

*Built with 🔥 and Focus.*
