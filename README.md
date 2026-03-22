
# 🥗 FitBuddy AI - Your Personal Fitness Companion

FitBuddy is a sleek, AI-powered chat interface designed to help users "level up" their fitness journey. Whether you need a workout split, a meal plan, or just a quick nutrition tip, FitBuddy provides instant, intelligent guidance.

## ✨ Features

* **Intelligent Chat:** Real-time AI responses tailored to fitness, health, and diet.
* **Natural UX:** Includes a "thinking" state and typewriter effect to simulate a human-like conversation.
* **Responsive Design:** Fully optimized for mobile and desktop with a modern "Dark Mode" aesthetic.
* **Robust Error Handling:** Built-in API failure states for a seamless user experience.
* **Dynamic UI:** Auto-expanding text area and smooth "scroll-to-bottom" functionality.
## 🛠️ Tech Stack

### Frontend
- **React & Vite:** Fast, modern UI development.
- **Tailwind CSS:** Custom-designed "Cyber-Teal" dark interface.
- **Framer Motion / CSS Keyframes:** Smooth message transitions and loading states.
- **Axios:** Robust API communication.

### Backend & Database
- **Node.js/Express:** Secure API routing and request handling
- **MongoDB:** For Storing messages and reply.

### AI
- **AI Model:** Trained using Logistic Regression and TFIDF.
## 🗂 Database Schema

**Chat**
```
message
reply
```

## Installation

1️⃣ Clone the Repository

```bash
  git clone https://github.com/yourusername/FitBuddyAI.git
  cd FitBuddyAI
```

2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

3️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```
4️⃣ Install AI Requirements

```bash
cd AI
pip install -r requirements.txt
```

5️⃣ Run the Application

Start backend
```bash
npm run dev
```
Start frontend
```bash
npm start
```
Start AI
```bash
python predict.py
```



    
## 🎯Objectives
* Expert Specialization: To replace generic AI advice with a custom model trained specifically on biomechanics and clinical nutrition.

* Information Filtering: To solve "choice paralysis" by providing a single, scientifically-backed truth amidst internet misinformation.

* Data Complexity: To challenge the AI's ability to process dynamic variables like metabolic rates, injuries, and equipment limits.

* Behavioral Engagement: To use interactive UX elements that simulate a human coach, increasing user adherence to health goals.

* Knowledge Democratization: To provide high-level personal coaching for free to users who cannot afford professional trainers.

