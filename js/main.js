/**
 * Main Interactive Application Script
 * Shanmugappriya M - Portfolio
 */

(function () {
  'use strict';

  // --- 1. WEB AUDIO API SYNTHESIZER FOR SOUND EFFECTS ---
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSciFiSound(type) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.025, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.09); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.18); // G5
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {
      // Audio error fallback
    }
  }

  // Sound Toggle Control
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');

  if (soundToggleBtn && soundIcon) {
    soundToggleBtn.addEventListener('click', function () {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        initAudio();
        playSciFiSound('click');
        soundIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
        soundToggleBtn.title = 'Sound Effects: On';
        showToast('Sound Effects Enabled 🔊');
      } else {
        soundIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
        soundToggleBtn.title = 'Sound Effects: Muted';
        showToast('Sound Effects Muted 🔇');
      }
    });
  }

  // --- 2. CUSTOM FLUID CURSOR & INTERACTIVE MAGNETIC HOVER ---
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');

  let mouseX = -100;
  let mouseY = -100;
  let outlineX = -100;
  let outlineY = -100;

  if (cursorDot && cursorOutline && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function animateCursor() {
      outlineX += (mouseX - outlineX) * 0.18;
      outlineY += (mouseY - outlineY) * 0.18;
      cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverableSelectors = 'a, button, input, textarea, .project-card, .skill-card, .stat-box, .terminal-tab, .info-chip';
    document.querySelectorAll(hoverableSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        playSciFiSound('hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
      el.addEventListener('click', () => {
        playSciFiSound('click');
      });
    });
  }

  // --- 3. DYNAMIC TYPEWRITER EFFECT FOR HERO ROLES ---
  const roles = [
    "AI & Machine Learning Enthusiast",
    "B.Sc. Computer Science Scholar",
    "Python & Data Science Explorer",
    "Full-Stack Web Developer"
  ];

  const typedRoleEl = document.getElementById('typed-role');
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeRole() {
    if (!typedRoleEl) return;

    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typedRoleEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      typedRoleEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 2000; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 500; // Short pause before next word
    }

    setTimeout(typeRole, typingSpeed);
  }
  typeRole();

  // --- 4. 3D PERSPECTIVE TILT CARDS ---
  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // --- 5. INTERACTIVE CYBER TERMINAL ---
  const terminalData = {
    whoami: `<div class="terminal-line"><span class="t-prompt">$</span> <span class="t-cmd">whoami</span></div>
<div class="terminal-line"><span class="t-highlight">NAME:</span> Shanmugappriya M</div>
<div class="terminal-line"><span class="t-highlight">ROLE:</span> 3rd-Year B.Sc. Computer Science Student</div>
<div class="terminal-line"><span class="t-highlight">COLLEGE:</span> Muthayammal College of Arts & Science, Rasipuram (Batch: Expected 2027)</div>
<div class="terminal-line"><span class="t-highlight">LOCATION:</span> Namakkal, Tamil Nadu, India</div>
<div class="terminal-line"><span class="t-success">STATUS:</span> Actively seeking AI/ML & Software Internship opportunities</div>`,

    objective: `<div class="terminal-line"><span class="t-prompt">$</span> <span class="t-cmd">cat career_objective.txt</span></div>
<div class="terminal-line"><span class="t-highlight">"A dedicated and enthusiastic 3rd-year B.Sc. Computer Science student with a strong foundation in programming and a keen interest in Artificial Intelligence and Machine Learning. Seeking an internship/entry-level opportunity to apply academic knowledge, learn from real-world projects, and contribute effectively to an organization's growth."</span></div>
<div class="terminal-line"><span class="t-success">TARGET:</span> AI/ML Engineer | Python Developer | Full Stack Intern</div>`,

    skills: `<div class="terminal-line"><span class="t-prompt">$</span> <span class="t-cmd">cat skills.json</span></div>
<pre style="color: #cbd5e1; font-family: inherit;">{
  <span class="t-highlight">"languages"</span>: ["Python", "C", "Java"],
  <span class="t-highlight">"web_technologies"</span>: ["HTML5", "CSS3", "JavaScript (ES6+)"],
  <span class="t-highlight">"database"</span>: ["MySQL"],
  <span class="t-highlight">"ai_ml"</span>: ["Python for AI/ML", "NumPy", "Pandas", "Scikit-Learn"],
  <span class="t-highlight">"tools"</span>: ["Git", "GitHub", "VS Code", "MS Office"]
}</pre>`,

    internship: `<div class="terminal-line"><span class="t-prompt">$</span> <span class="t-cmd">cat internship.log</span></div>
<div class="terminal-line"><span class="t-highlight">ORGANIZATION:</span> Optimus Technocrates India Private Limited</div>
<div class="terminal-line"><span class="t-highlight">TENURE:</span> 15 May 2026 - 30 May 2026</div>
<div class="terminal-line"><span class="t-highlight">ROLE:</span> AI/ML Intern</div>
<div class="terminal-line"><span class="t-success">[✔] COMPLETED:</span> Hands-on intensive internship on AI/ML foundations</div>
<div class="terminal-line"><span class="t-success">[✔] FOCUS:</span> Supervised Learning, Data Wrangling, Model Evaluation</div>
<div class="terminal-line"><span class="t-success">[✔] CERTIFICATE:</span> Verified AI/ML Certification Awarded (May 2026)</div>`,

    contact: `<div class="terminal-line"><span class="t-prompt">$</span> <span class="t-cmd">env | grep CONTACT</span></div>
<div class="terminal-line"><span class="t-highlight">CONTACT_EMAIL:</span> shanmugappriya6277@gmail.com</div>
<div class="terminal-line"><span class="t-highlight">CONTACT_PHONE:</span> +91 8754336277</div>
<div class="terminal-line"><span class="t-highlight">LOCATION:</span> Namakkal, Tamil Nadu, India</div>
<div class="terminal-line"><span class="t-success">COMMUNICATION:</span> Fluent in Tamil & English</div>`
  };

  const terminalBody = document.getElementById('terminal-body');
  const terminalTabs = document.querySelectorAll('.terminal-tab');

  if (terminalBody && terminalTabs.length > 0) {
    terminalTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        terminalTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const key = this.getAttribute('data-tab');
        if (terminalData[key]) {
          terminalBody.innerHTML = terminalData[key];
          playSciFiSound('click');
        }
      });
    });
  }

  // --- 6. SKILLS MATRIX FILTERING ---
  const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (skillFilterBtns.length > 0) {
    skillFilterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        skillFilterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const category = this.getAttribute('data-filter');

        skillCards.forEach(card => {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.opacity = '1';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 7. PROJECTS SHOWCASE FILTERING ---
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (projectFilterBtns.length > 0) {
    projectFilterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        projectFilterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const cat = this.getAttribute('data-cat');

        projectCards.forEach(card => {
          if (cat === 'all' || card.getAttribute('data-category') === cat) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.opacity = '1';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 8. RESUME MODAL & PRINT / COPY ---
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtns = document.querySelectorAll('[data-open-resume]');
  const closeResumeBtn = document.getElementById('close-resume-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');
  const copyResumeBtn = document.getElementById('copy-resume-btn');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playSciFiSound('click');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openResumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(resumeModal);
    });
  });

  if (closeResumeBtn) {
    closeResumeBtn.addEventListener('click', () => closeModal(resumeModal));
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeModal(resumeModal);
      }
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      playSciFiSound('click');
      window.print();
    });
  }

  if (copyResumeBtn) {
    copyResumeBtn.addEventListener('click', () => {
      const resumePlainText = `SHANMUGAPPRIYA M
Namakkal, Tamil Nadu | 8754336277 | shanmugappriya6277@gmail.com

CAREER OBJECTIVE:
A dedicated and enthusiastic 3rd-year B.Sc. Computer Science student with a strong foundation in programming and a keen interest in Artificial Intelligence and Machine Learning. Seeking an internship/entry-level opportunity to apply academic knowledge, learn from real-world projects, and contribute effectively to an organization's growth.

EDUCATION:
- B.Sc. Computer Science (3rd Year) | Expected 2027 | Muthayammal College of Arts and Science, Rasipuram
- Higher Secondary Education (12th Std.) | 2024 | Government Higher Secondary School, Kabilarmalai

TECHNICAL SKILLS:
- Programming Languages: C, Python, Java
- Web Technologies: HTML, CSS, JavaScript
- Database: MySQL
- AI/ML & Data Science: Python, NumPy, Pandas, Scikit-Learn, Flask, Joblib, Matplotlib, Seaborn
- Other Tools: MS Office, Git, GitHub

INTERNSHIP:
AI/ML Intern - Optimus Technocrates India Private Limited (15 May 2026 - 30 May 2026)
- Completed a hands-on internship focused on Artificial Intelligence and Machine Learning fundamentals.
- Explored data preprocessing, algorithm modeling, and predictive evaluation.

ACADEMIC & PRODUCTION ML PROJECTS:

[1] AeroPredict: Airline Customer Satisfaction ML System & Flask API (2026)
    GitHub: github.com/24ucs135-arch/Airline-ML-project
- Engineered an end-to-end ML pipeline on 129,880 passenger surveys using scikit-learn ColumnTransformer (median imputation & one-hot encoding) and RandomForestClassifier.
- Achieved 95.07% accuracy, 96.17% precision, 99.15% ROC-AUC on 25,976 holdout records.
- Deployed as a Flask 3.1 REST API for real-time probability-calibrated inference.

[2] NeuroPredict: Disease Risk Predictive Classification
- Engineered a machine learning pipeline using Python, Scikit-Learn, and Pandas to detect early risk markers in biometric health datasets.

[3] VisionSense: Real-Time Hand Landmark & Gesture Recognition
- Built real-time computer vision system using Python and OpenCV for 3D gesture tracking and contactless interaction.

CERTIFICATIONS:
- AI/ML Certification - Optimus Technocrates India Private Limited (May 2026)

STRENGTHS:
- Quick learner with a positive attitude
- Good communication and interpersonal skills
- Strong problem-solving ability
- Team player with a willingness to take initiative

LANGUAGES:
Tamil, English`;

      navigator.clipboard.writeText(resumePlainText).then(() => {
        playSciFiSound('success');
        showToast('Resume copied to clipboard! 📋');
      });
    });
  }

  // --- 9. PROJECT DETAILS MODAL ---
  const projectModal = document.getElementById('project-modal');
  const closeProjectBtn = document.getElementById('close-project-btn');
  const projectModalTitle = document.getElementById('project-modal-title');
  const projectModalBody = document.getElementById('project-modal-body');

  const projectDetailsMap = {
    neuropredict: {
      title: "NeuroPredict: Intelligent Disease Risk Predictor",
      content: `
        <div style="margin-bottom: 1.5rem;">
          <img src="assets/project_neuropredict.jpg" alt="NeuroPredict" style="width: 100%; border-radius: 12px; border: 1px solid rgba(0,240,255,0.2); margin-bottom: 1rem;">
          <p style="color: #94a3b8; line-height: 1.65; margin-bottom: 1rem;">
            <strong>NeuroPredict</strong> is an artificial intelligence-driven diagnostic system engineered to predict early-stage neurological and systemic disease indicators. Built utilizing supervised machine learning classification algorithms trained on multidimensional biometric datasets.
          </p>
          <h4 style="color: #00f0ff; margin-bottom: 0.5rem; font-family: var(--font-heading);">Key Features & Architecture:</h4>
          <ul style="color: #cbd5e1; padding-left: 1.25rem; line-height: 1.7; margin-bottom: 1rem;">
            <li>Data preprocessing pipeline including feature scaling, normalization, and outlier detection with NumPy & Pandas.</li>
            <li>Random Forest & Support Vector Classifier (SVC) models delivering over 93% accuracy on cross-validation.</li>
            <li>Interactive medical dashboard built with Vanilla JavaScript, HTML5, and CSS3 glassmorphism.</li>
            <li>Real-time telemetry parameter input for rapid medical risk classification.</li>
          </ul>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span class="tech-chip">Python</span>
            <span class="tech-chip">Scikit-Learn</span>
            <span class="tech-chip">NumPy</span>
            <span class="tech-chip">Pandas</span>
            <span class="tech-chip">JavaScript</span>
            <span class="tech-chip">CSS3</span>
          </div>
        </div>
      `
    },
    visionsense: {
      title: "VisionSense: Real-Time Hand Gesture & Object Recognition",
      content: `
        <div style="margin-bottom: 1.5rem;">
          <img src="assets/project_visionsense.jpg" alt="VisionSense" style="width: 100%; border-radius: 12px; border: 1px solid rgba(0,240,255,0.2); margin-bottom: 1rem;">
          <p style="color: #94a3b8; line-height: 1.65; margin-bottom: 1rem;">
            <strong>VisionSense</strong> is a real-time computer vision application that tracks human hand landmarks and predicts interactive gesture controls to navigate software interfaces without touch input.
          </p>
          <h4 style="color: #00f0ff; margin-bottom: 0.5rem; font-family: var(--font-heading);">Key Features & Architecture:</h4>
          <ul style="color: #cbd5e1; padding-left: 1.25rem; line-height: 1.7; margin-bottom: 1rem;">
            <li>High-frequency 3D skeletal landmark tracking (21 key coordinate points per hand) at 60 FPS.</li>
            <li>Object detection and bounding box telemetry visualization with real-time latency calculation (&lt;5ms).</li>
            <li>Custom gesture classification model recognizing multi-finger commands (pinch, swipe, point, open hand).</li>
            <li>Integrated web UI communicating with OpenCV vision pipeline via WebSocket streams.</li>
          </ul>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span class="tech-chip">Python</span>
            <span class="tech-chip">OpenCV</span>
            <span class="tech-chip">Computer Vision</span>
            <span class="tech-chip">Machine Learning</span>
            <span class="tech-chip">JavaScript</span>
          </div>
        </div>
      `
    },
    dataviz: {
      title: "Modern DataViz: Interactive Analytics & Machine Learning Hub",
      content: `
        <div style="margin-bottom: 1.5rem;">
          <img src="assets/project_dataviz.jpg" alt="Modern DataViz" style="width: 100%; border-radius: 12px; border: 1px solid rgba(0,240,255,0.2); margin-bottom: 1rem;">
          <p style="color: #94a3b8; line-height: 1.65; margin-bottom: 1rem;">
            A responsive, cyber-themed enterprise analytics dashboard displaying dynamic telemetry, neural network model confidence meters, and market statistical trends with rich animations.
          </p>
          <h4 style="color: #00f0ff; margin-bottom: 0.5rem; font-family: var(--font-heading);">Key Features & Architecture:</h4>
          <ul style="color: #cbd5e1; padding-left: 1.25rem; line-height: 1.7; margin-bottom: 1rem;">
            <li>Dynamic SVG/Canvas animated line and bar charts with neon gradients and tooltip tracking.</li>
            <li>Neural network layer visualization showing node activation confidence and sentiment metrics.</li>
            <li>Filterable data tables connected to local storage and mock MySQL database queries.</li>
            <li>Ultra-responsive glassmorphism layout tailored for both wide monitors and mobile displays.</li>
          </ul>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span class="tech-chip">HTML5</span>
            <span class="tech-chip">CSS3 Glassmorphism</span>
            <span class="tech-chip">JavaScript (ES6+)</span>
            <span class="tech-chip">Data Visualization</span>
            <span class="tech-chip">MySQL</span>
          </div>
        </div>
      `
    },
    campussmart: {
      title: "Smart Campus AI: Query & Academic Assistant",
      content: `
        <div style="margin-bottom: 1.5rem;">
          <p style="color: #94a3b8; line-height: 1.65; margin-bottom: 1rem;">
            An intelligent academic helper designed for college students to query course schedules, syllabus details, exam routines, and computer science concepts using natural language processing.
          </p>
          <h4 style="color: #00f0ff; margin-bottom: 0.5rem; font-family: var(--font-heading);">Key Features & Architecture:</h4>
          <ul style="color: #cbd5e1; padding-left: 1.25rem; line-height: 1.7; margin-bottom: 1rem;">
            <li>Natural language intent matching and entity extraction trained on academic department syllabi.</li>
            <li>Fast SQL query generator translating user inquiries into structured database lookups.</li>
            <li>Interactive chat dialog interface with typing indicators and audio feedback.</li>
            <li>Integrated quick-action buttons for common academic and CS subject queries.</li>
          </ul>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span class="tech-chip">Python</span>
            <span class="tech-chip">NLP Basics</span>
            <span class="tech-chip">MySQL</span>
            <span class="tech-chip">JavaScript</span>
            <span class="tech-chip">Full Stack</span>
          </div>
        </div>
      `
    },

    aeropredict: {
      title: "✈️ AeroPredict — Airline Customer Satisfaction ML System",
      content: `
        <div class="modal-deepdive-header">
          <div class="modal-deepdive-image-wrap">
            <img src="assets/project_aeropredict.jpg" alt="AeroPredict Dashboard" class="modal-deepdive-image">
          </div>
          <p style="color: #94a3b8; line-height: 1.7; margin-bottom: 1rem;">
            <strong style="color:#f1f5f9;">AeroPredict</strong> is a production-grade Machine Learning system and Flask REST API that forecasts airline passenger satisfaction on 129,880 real-world customer surveys. The pipeline uses scikit-learn's <code style="color:#00f0ff; background:rgba(0,240,255,0.08); padding:0.1rem 0.4rem; border-radius:4px;">ColumnTransformer</code> for automated median imputation and one-hot encoding — all assembled into a single serialized <code style="color:#00f0ff; background:rgba(0,240,255,0.08); padding:0.1rem 0.4rem; border-radius:4px;">Pipeline.pkl</code> that serves real-time inferences without retraining.
          </p>
          <div class="modal-quick-links">
            <a href="https://github.com/24ucs135-arch/Airline-ML-project.git" target="_blank" rel="noopener noreferrer" class="modal-cta-btn primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              View on GitHub
            </a>
            <span class="modal-cta-btn secondary" style="cursor:default;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              129,880 Training Records
            </span>
            <span class="modal-cta-btn secondary" style="cursor:default;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Real-Time Inference
            </span>
          </div>
        </div>

        <!-- ML Performance KPIs -->
        <h4 style="color: #00f0ff; font-family: var(--font-heading); font-size: 1rem; margin-bottom: 0.25rem;">📈 Model Evaluation — 25,976 Holdout Test Records</h4>
        <p style="color: #64748b; font-size: 0.8rem; margin-bottom: 0.5rem;">Stratified 80/20 train/test split | RandomForestClassifier (n_estimators=100, max_depth=16, random_state=42)</p>
        <div class="ml-kpi-grid">
          <div class="ml-kpi-card">
            <div class="ml-kpi-value">95.07%</div>
            <div class="ml-kpi-label">Accuracy</div>
            <div class="ml-kpi-sub">95 of 100 correct</div>
          </div>
          <div class="ml-kpi-card">
            <div class="ml-kpi-value">96.17%</div>
            <div class="ml-kpi-label">Precision</div>
            <div class="ml-kpi-sub">Low false positives</div>
          </div>
          <div class="ml-kpi-card">
            <div class="ml-kpi-value">94.77%</div>
            <div class="ml-kpi-label">Recall</div>
            <div class="ml-kpi-sub">High sensitivity</div>
          </div>
          <div class="ml-kpi-card">
            <div class="ml-kpi-value">95.46%</div>
            <div class="ml-kpi-label">F1-Score</div>
            <div class="ml-kpi-sub">Balanced metric</div>
          </div>
          <div class="ml-kpi-card">
            <div class="ml-kpi-value emerald">99.15%</div>
            <div class="ml-kpi-label">ROC-AUC</div>
            <div class="ml-kpi-sub">Near-perfect</div>
          </div>
        </div>

        <!-- Feature Importance + Confusion Matrix -->
        <div class="modal-two-col">
          <div>
            <h4 style="color: #00f0ff; font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 1rem;">🔑 Top Feature Importances</h4>
            <div class="feature-bars-container">
              <div class="feature-bar-item">
                <div class="feature-bar-label"><span>Inflight entertainment</span><span>24.67%</span></div>
                <div class="feature-bar-track"><div class="feature-bar-fill" style="width:100%;"></div></div>
              </div>
              <div class="feature-bar-item">
                <div class="feature-bar-label"><span>Seat comfort</span><span>15.50%</span></div>
                <div class="feature-bar-track"><div class="feature-bar-fill" style="width:62.8%;"></div></div>
              </div>
              <div class="feature-bar-item">
                <div class="feature-bar-label"><span>Ease of Online booking</span><span>8.25%</span></div>
                <div class="feature-bar-track"><div class="feature-bar-fill" style="width:33.4%;"></div></div>
              </div>
              <div class="feature-bar-item">
                <div class="feature-bar-label"><span>Online support</span><span>7.28%</span></div>
                <div class="feature-bar-track"><div class="feature-bar-fill" style="width:29.5%;"></div></div>
              </div>
              <div class="feature-bar-item">
                <div class="feature-bar-label"><span>On-board service</span><span>4.56%</span></div>
                <div class="feature-bar-track"><div class="feature-bar-fill" style="width:18.5%;"></div></div>
              </div>
            </div>
          </div>
          <div>
            <h4 style="color: #00f0ff; font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 1rem;">🗃 Confusion Matrix</h4>
            <table class="cm-table">
              <tr>
                <td class="cm-cell header"></td>
                <td class="cm-cell header">Pred. Dissatisfied</td>
                <td class="cm-cell header">Pred. Satisfied</td>
              </tr>
              <tr>
                <td class="cm-cell header">Act. Dissatisfied</td>
                <td class="cm-cell highlight-tn"><span class="cm-num">11,222</span>TN ✓</td>
                <td class="cm-cell highlight-fp"><span class="cm-num">537</span>FP ✗</td>
              </tr>
              <tr>
                <td class="cm-cell header">Act. Satisfied</td>
                <td class="cm-cell highlight-fn"><span class="cm-num">744</span>FN ✗</td>
                <td class="cm-cell highlight-tp"><span class="cm-num">13,473</span>TP ✓</td>
              </tr>
            </table>
            <p style="color:#64748b; font-size:0.75rem; margin-top:0.6rem;">Total test records: 25,976 | Error rate: 4.93%</p>
          </div>
        </div>

        <!-- Interactive Satisfaction Simulator -->
        <h4 style="color: #00f0ff; font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 0.5rem;">🎮 Interactive Satisfaction Simulator</h4>
        <p style="color: #64748b; font-size: 0.8rem; margin-bottom: 0.75rem;">Adjust sliders to simulate how the model would score a passenger profile in real-time.</p>
        <div class="simulator-card" id="sim-card">
          <div class="sim-preset-bar">
            <button class="sim-preset-btn active" onclick="simApplyPreset('business')">✈ Executive Business</button>
            <button class="sim-preset-btn" onclick="simApplyPreset('economy')">🪑 Economy Traveler</button>
            <button class="sim-preset-btn" onclick="simApplyPreset('delayed')">⏰ Delayed & Disloyal</button>
          </div>
          <div class="sim-controls-grid">
            <div class="sim-control-group">
              <div class="sim-control-label"><span>Inflight Entertainment</span><span id="sim-val-ent">5</span>/5</div>
              <input type="range" class="sim-slider" id="sim-ent" min="0" max="5" value="5" oninput="simUpdate()">
            </div>
            <div class="sim-control-group">
              <div class="sim-control-label"><span>Seat Comfort</span><span id="sim-val-seat">5</span>/5</div>
              <input type="range" class="sim-slider" id="sim-seat" min="0" max="5" value="5" oninput="simUpdate()">
            </div>
            <div class="sim-control-group">
              <div class="sim-control-label"><span>Online Booking Ease</span><span id="sim-val-book">5</span>/5</div>
              <input type="range" class="sim-slider" id="sim-book" min="0" max="5" value="5" oninput="simUpdate()">
            </div>
            <div class="sim-control-group">
              <div class="sim-control-label"><span>Online Support</span><span id="sim-val-sup">5</span>/5</div>
              <input type="range" class="sim-slider" id="sim-sup" min="0" max="5" value="5" oninput="simUpdate()">
            </div>
            <div class="sim-control-group">
              <div class="sim-control-label"><span>On-board Service</span><span id="sim-val-ob">5</span>/5</div>
              <input type="range" class="sim-slider" id="sim-ob" min="0" max="5" value="5" oninput="simUpdate()">
            </div>
            <div class="sim-control-group">
              <div class="sim-control-label"><span>Departure Delay (min)</span><span id="sim-val-delay">0</span></div>
              <input type="range" class="sim-slider" id="sim-delay" min="0" max="120" value="0" oninput="simUpdate()">
            </div>
          </div>
          <div class="sim-result-box">
            <div class="sim-result-header">
              <span style="font-family:var(--font-heading); font-size:0.82rem; color:#64748b;">Model Prediction:</span>
              <span class="sim-verdict-badge satisfied" id="sim-verdict">✓ Satisfied</span>
              <span style="font-family:var(--font-mono); font-size:0.85rem; color:#00f0ff;" id="sim-confidence">99.8% confidence</span>
            </div>
            <div class="sim-gauge-track">
              <div class="sim-gauge-fill" id="sim-gauge" style="width: 99.8%;"></div>
            </div>
            <div class="sim-insights-text" id="sim-insight">High inflight entertainment and seat comfort strongly elevate satisfaction. Seamless digital booking contributed positively.</div>
          </div>
        </div>

        <!-- API Snippet -->
        <h4 style="color: #00f0ff; font-family: var(--font-heading); font-size: 0.95rem; margin: 1.5rem 0 0.75rem;">🔌 REST API Endpoint</h4>
        <div class="terminal-code-box">
<span style="color:#94a3b8;"># POST /api/predict — Real-time inference</span>
curl -X POST http://127.0.0.1:5000/api/predict \\
  -H "Content-Type: application/json" \\
  -d '{ "Customer Type": "Loyal Customer", "Class": "Business",
        "Inflight entertainment": 5, "Seat comfort": 5, ... }'

<span style="color:#94a3b8;"># Response</span>
{ "status": "success", "data": {
    "prediction": "satisfied", "confidence": 0.9998,
    "probabilities": { "satisfied": 0.9998, "dissatisfied": 0.0002 },
    "driver_insights": [
      "High inflight entertainment and wifi ratings positively elevate satisfaction."
    ]
  }
}
        </div>

        <!-- Tech Stack -->
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:1.5rem;">
          <span class="tech-chip">Python 3.13</span>
          <span class="tech-chip">Scikit-Learn</span>
          <span class="tech-chip">Random Forest</span>
          <span class="tech-chip">Flask 3.1</span>
          <span class="tech-chip">Pandas</span>
          <span class="tech-chip">NumPy</span>
          <span class="tech-chip">Joblib</span>
          <span class="tech-chip">Matplotlib</span>
          <span class="tech-chip">Seaborn</span>
        </div>
      `
    }
  };

  document.querySelectorAll('[data-project-id]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const projId = this.getAttribute('data-project-id');
      const details = projectDetailsMap[projId];
      if (details && projectModal && projectModalTitle && projectModalBody) {
        projectModalTitle.textContent = details.title;
        projectModalBody.innerHTML = details.content;
        openModal(projectModal);
      }
    });
  });

  if (closeProjectBtn) {
    closeProjectBtn.addEventListener('click', () => closeModal(projectModal));
  }
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeModal(projectModal);
    });
  }

  // --- 10. COPY TO CLIPBOARD BUTTONS (CONTACT INFO) ---
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', function () {
      const textToCopy = this.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        playSciFiSound('success');
        showToast(`Copied: ${textToCopy} 📋`);
        const originalText = this.innerHTML;
        this.innerHTML = `<span>Copied!</span>`;
        setTimeout(() => {
          this.innerHTML = originalText;
        }, 2000);
      });
    });
  });

  // --- 11. CONTACT FORM VALIDATION & SUBMISSION ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all fields. ⚠️');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Transmitting Message...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        contactForm.reset();
        playSciFiSound('success');
        showToast(`Thank you, ${name}! Your message was transmitted. 🚀`);
      }, 1000);
    });
  }

  // --- 12. TOAST NOTIFICATION UTILITY ---
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- 13. NAVBAR SCROLL EFFECT & MOBILE MENU ---
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function () {
      navLinks.classList.toggle('mobile-open');
      playSciFiSound('click');
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // --- 14. ACTIVE LINK HIGHLIGHT ON SCROLL ---
  const sections = document.querySelectorAll('section[id]');
  const navLinksList = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', function () {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinksList.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Back to top button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playSciFiSound('click');
    });
  }

  // Global escape key to close modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (resumeModal) closeModal(resumeModal);
      if (projectModal) closeModal(projectModal);
    }
  });

  // Reinitialize tilt & cursor hover after modal body content injection
  const _origOpenModal = openModal;
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playSciFiSound('click');
    // Re-attach tilt to any newly injected cards inside modal
    modal.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -8;
        const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

})();

// --- AEROPREDICT INTERACTIVE SIMULATOR (Global scope for inline onclick) ---
function simGetValues() {
  const ent   = parseInt(document.getElementById('sim-ent')?.value  || 5);
  const seat  = parseInt(document.getElementById('sim-seat')?.value || 5);
  const book  = parseInt(document.getElementById('sim-book')?.value || 5);
  const sup   = parseInt(document.getElementById('sim-sup')?.value  || 5);
  const ob    = parseInt(document.getElementById('sim-ob')?.value   || 5);
  const delay = parseInt(document.getElementById('sim-delay')?.value|| 0);
  return { ent, seat, book, sup, ob, delay };
}

function simUpdate() {
  const { ent, seat, book, sup, ob, delay } = simGetValues();

  // Update display labels
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('sim-val-ent',  ent);
  set('sim-val-seat', seat);
  set('sim-val-book', book);
  set('sim-val-sup',  sup);
  set('sim-val-ob',   ob);
  set('sim-val-delay',delay);

  // Weighted satisfaction score approximating model logic
  const score = (
    ent   * 0.2467 +
    seat  * 0.1550 +
    book  * 0.0825 +
    sup   * 0.0728 +
    ob    * 0.0456
  ) / 5.0; // normalised to [0,1] per top-5 feature weights (sum ~0.6026)

  const delayPenalty = Math.min(delay / 120, 1) * 0.18;
  const rawScore = Math.max(0, Math.min(1, score - delayPenalty));
  const satisfied = rawScore >= 0.45;
  const confidence = Math.round((satisfied ? 0.5 + rawScore * 0.5 : 0.5 - rawScore * 0.5) * 100 * 10) / 10;
  const gaugeWidth = Math.round(confidence * 10) / 10;

  const verdict  = document.getElementById('sim-verdict');
  const conf     = document.getElementById('sim-confidence');
  const gauge    = document.getElementById('sim-gauge');
  const insight  = document.getElementById('sim-insight');

  if (!verdict) return;

  if (satisfied) {
    verdict.className = 'sim-verdict-badge satisfied';
    verdict.textContent = '✓ Satisfied';
    const drivers = [];
    if (ent  >= 4) drivers.push('high inflight entertainment');
    if (seat >= 4) drivers.push('excellent seat comfort');
    if (book >= 4) drivers.push('seamless online booking');
    if (sup  >= 4) drivers.push('responsive online support');
    insight.textContent = drivers.length
      ? `Driven by ${drivers.slice(0,2).join(' & ')}. Positive experience signals satisfied outcome.`
      : 'Moderate service ratings predict a marginally satisfied outcome.';
  } else {
    verdict.className = 'sim-verdict-badge dissatisfied';
    verdict.textContent = '✗ Dissatisfied';
    const issues = [];
    if (ent  <= 2) issues.push('poor inflight entertainment');
    if (seat <= 2) issues.push('low seat comfort');
    if (delay > 30) issues.push(`${delay}min departure delay`);
    insight.textContent = issues.length
      ? `Key drivers: ${issues.slice(0,2).join(', ')} are negatively impacting the satisfaction prediction.`
      : 'Below-average service ratings combined with delays predict dissatisfaction.';
  }

  if (conf)  conf.textContent  = `${gaugeWidth}% confidence`;
  if (gauge) gauge.style.width = `${gaugeWidth}%`;
}

function simApplyPreset(preset) {
  const map = {
    business: { ent:5, seat:5, book:5, sup:5, ob:5, delay:0  },
    economy:  { ent:3, seat:3, book:3, sup:3, ob:3, delay:15 },
    delayed:  { ent:1, seat:2, book:1, sup:2, ob:2, delay:90 }
  };
  const p = map[preset];
  if (!p) return;

  const setSlider = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setSlider('sim-ent',   p.ent);
  setSlider('sim-seat',  p.seat);
  setSlider('sim-book',  p.book);
  setSlider('sim-sup',   p.sup);
  setSlider('sim-ob',    p.ob);
  setSlider('sim-delay', p.delay);

  // Update active preset button styling
  document.querySelectorAll('.sim-preset-btn').forEach(btn => btn.classList.remove('active'));
  const presetBtns = document.querySelectorAll('.sim-preset-btn');
  const idx = ['business','economy','delayed'].indexOf(preset);
  if (presetBtns[idx]) presetBtns[idx].classList.add('active');

  simUpdate();
}
