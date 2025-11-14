// Simple rules-based Exercise Chatbot (dark theme)
// Works fully client-side; suitable for GitHub Pages

const kb = {
  exercises: {
    pushups: "Push-ups: chest, shoulders, triceps. 3 sets × 8–12 reps. Modify with knees if needed.",
    squats: "Squats: quads, glutes, hamstrings. 3–5 sets × 8–15 reps. Keep chest up, back neutral.",
    deadlifts: "Deadlifts: posterior chain. 3 sets × 4–8 reps (start light, focus on hinge).",
    pullups: "Pull-ups: lats and biceps. 3 sets × 3–8 reps. Use assistance if required.",
    planks: "Planks: core stability. 3 sets × 30–60 seconds."
  },
  muscles: {
    chest: "Chest exercises: Push-ups, Bench Press, Dumbbell Flyes, Dips. Aim 2–3 exercises per session.",
    back: "Back exercises: Pull-ups, Rows, Lat Pulldowns, Deadlifts. Include vertical and horizontal pulls.",
    legs: "Leg exercises: Squats, Lunges, Romanian Deadlifts, Leg Press. Prioritize compound lifts.",
    shoulders: "Shoulder exercises: Overhead Press, Lateral Raises, Rear Delt Flyes.",
    arms: "Arm exercises: Biceps Curls, Triceps Extensions, Hammer Curls, Dips."
  },
  splits: {
    pushpulllegs: "Push/Pull/Legs split: Push = chest/shoulders/triceps; Pull = back/biceps; Legs = lower body. Commonly 3–6 sessions/week.",
    upperlower: "Upper/Lower split: Alternate between upper body and lower body days. Good for intermediate trainees.",
    fullbody: "Full-body: Train all major muscle groups each session. Great for beginners and limited schedules."
  },
  reps: {
    strength: "Strength: 3–5 reps, 3–6 sets, longer rests (2–4 min).",
    hypertrophy: "Hypertrophy (muscle growth): 6–12 reps, 3–4 sets, 60–90 sec rest.",
    endurance: "Endurance: 12–20 reps, 2–3 sets, shorter rests."
  },
  calories: {
    maintenance: "Maintenance calories = calories you burn in a day. Track with apps or use online calculators (Mifflin-St Jeor).",
    deficit: "Calorie deficit: eat 300–500 kcal below maintenance for steady fat loss.",
    surplus: "Calorie surplus: eat 200–400 kcal above maintenance to gain muscle (with training).",
    protein: "Protein targets: ~1.6–2.2 g/kg bodyweight for muscle build. High protein foods: chicken, eggs, whey, tofu, paneer."
  }
};

// Utility: create message bubble
function addMessage(text, who='bot'){
  const chat = document.getElementById('chatWindow');
  const div = document.createElement('div');
  div.className = 'message ' + (who==='user' ? 'msg-user' : 'msg-bot');
  div.innerHTML = text;
  const meta = document.createElement('div');
  meta.className = 'meta';
  const now = new Date();
  meta.textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  div.appendChild(meta);
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// Bot logic (simple rules)
function botResponse(input){
  const msg = input.toLowerCase();

  // Direct exercise
  for(const ex in kb.exercises){
    if(msg.includes(ex) || msg.includes(ex.replace(/s$/,''))){
      return kb.exercises[ex];
    }
  }

  // muscle groups
  for(const m in kb.muscles){
    if(msg.includes(m)){
      return kb.muscles[m];
    }
  }

  // splits
  if(msg.includes('push') && msg.includes('pull') && msg.includes('leg')) return kb.splits.pushpulllegs;
  for(const s in kb.splits){
    if(msg.includes(s) || msg.includes('split')){
      return kb.splits[s] || kb.splits.pushpulllegs;
    }
  }

  // reps/goals
  for(const r in kb.reps){
    if(msg.includes(r) || msg.includes('rep') || msg.includes('set')){
      return kb.reps[r];
    }
  }

  // calories
  for(const c in kb.calories){
    if(msg.includes(c) || msg.includes('calorie')){
      return kb.calories[c];
    }
  }

  // common shortcuts
  if(msg.includes('hi')||msg.includes('hello')) return "Hello! Ask me about exercises, reps, or calories.";
  if(msg.includes('thanks')||msg.includes('thank')) return "You're welcome — stay consistent!";
  if(msg.includes('beginner')||msg.includes('start')) return "Beginner tip: Focus on movement quality, 2–3 full-body sessions/week.";
  if(msg.includes('best') && msg.includes('exercise')) return "Pick compound lifts first (squats, deadlifts, bench/presses, rows).";

  return "I can help with exercises, muscle groups, reps, splits, and calories. Try: 'best chest exercises' or 'calorie deficit'.";
}

// Wire up UI
document.getElementById('sendBtn').addEventListener('click', () => {
  const inputEl = document.getElementById('userInput');
  const val = inputEl.value.trim();
  if(!val) return;
  addMessage(escapeHtml(val), 'user');
  inputEl.value = '';
  setTimeout(() => {
    const reply = botResponse(val);
    addMessage(escapeHtml(reply), 'bot');
  }, 400);
});

// Enter key support
document.getElementById('userInput').addEventListener('keydown', (e) => {
  if(e.key === 'Enter') { e.preventDefault(); document.getElementById('sendBtn').click(); }
});

// small helper to avoid HTML injection
function escapeHtml(str){
  return str.replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}

// initial greeting
window.addEventListener('load', ()=> {
  addMessage('Hello — I am your Exercise Chatbot. Ask about exercises, reps, or calories.', 'bot');
});
