import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Zap, BarChart3, 
  ArrowRight, Terminal, Cpu, Database
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  // --- Typewriter State ---
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // --- Typewriter Logic ---
  useEffect(() => {
    const phrases = [
      "ALGORITHMIC_PRECISION", 
      "REAL_TIME_ANALYTICS", 
      "SECURE_CLOUD_STORAGE",
      "AUTOMATED_PAYROLL"
    ];

    const handleType = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  const handleEnterSystem = () => {
    navigate('/tracker');
  };

  return (
    <div className="neo-home-container">
      {/* Background Pattern */}
      <div className="dot-grid"></div>

      <div className={`content-wrapper ${loaded ? 'loaded' : ''}`}>
        
        {/* --- HERO --- */}
        <section className="hero-section">
        

          <h1 className="main-title">
            SALARY_TRACKER_SYSTEM
            <br />
          </h1>

          {/* Retro Terminal Box */}
          <div className="terminal-box">
            <div className="terminal-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span className="terminal-title">CMD.EXE</span>
            </div>
            <div className="terminal-body">
              <span className="prompt">{'>'} OPTIMIZED_FOR:</span>
              <span className="dynamic-text">{text}</span>
              <span className="cursor">_</span>
            </div>
          </div>

          <button onClick={handleEnterSystem} className="neo-cta-btn">
            <span>LAUNCH_DASHBOARD</span>
            <ArrowRight size={20} strokeWidth={3} />
          </button>
        </section>

        {/* --- FEATURES GRID --- */}
        <section className="system-grid">
          
          {/* Card 1 */}
          <div className="neo-card yellow-accent">
            <div className="icon-box">
              <BarChart3 size={32} strokeWidth={2.5} />
            </div>
            <h3 className="card-title">VISUAL_ANALYTICS</h3>
            <p className="card-desc">
              Dynamic dashboard visualization. Instant insight into <strong>TOTAL_PAID</strong> vs <strong>PENDING</strong> metrics via hard-coded progress bars.
            </p>
          </div>

          {/* Card 2 */}
          <div className="neo-card purple-accent">
            <div className="icon-box">
              <Database size={32} strokeWidth={2.5} />
            </div>
            <h3 className="card-title">CLOUD_PERSISTENCE</h3>
            <p className="card-desc">
              Powered by <strong>MONGODB_ATLAS</strong>. Enterprise-grade security protocols ensuring zero data loss across distributed nodes.
            </p>
          </div>

          {/* Card 3 */}
          <div className="neo-card green-accent">
            <div className="icon-box">
              <Cpu size={32} strokeWidth={2.5} />
            </div>
            <h3 className="card-title">SMART_AUTOMATION</h3>
            <p className="card-desc">
              <strong>ERR_HUMAN: 0%</strong>. Automated logic computes remaining balances and constraints instantly upon data entry.
            </p>
          </div>

        </section>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap');

        :root {
          --bg: #e0e7ff;
          --surface: #ffffff;
          --black: #101010;
          --border: 3px solid var(--black);
          --shadow: 6px 6px 0px var(--black);
          
          --c-purple: #a855f7;
          --c-yellow: #facc15;
          --c-green: #4ade80;
          --c-pink: #fb7185;
          --c-blue: #60a5fa;
        }

        body { 
          margin: 0; 
          font-family: 'Archivo', sans-serif; 
          background-color: var(--bg);
          color: var(--black);
          overflow-x: hidden;
        }

        /* --- Background --- */
        .dot-grid {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;
          background-image: radial-gradient(var(--black) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.15;
        }

        .neo-home-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .content-wrapper {
          width: 100%;
          max-width: 1200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4rem;
          z-index: 2;
        }

        /* --- Hero Section --- */
        .hero-section {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .status-badge {
          background: var(--black);
          color: white;
          padding: 0.4rem 1rem;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          font-size: 0.8rem;
          margin-bottom: 1.5rem;
          display: flex; align-items: center; gap: 0.5rem;
          box-shadow: 4px 4px 0px rgba(0,0,0,0.2);
        }
        .status-dot { width: 8px; height: 8px; background: var(--c-green); border-radius: 50%; }

        .main-title {
          font-size: 4.5rem;
          font-weight: 900;
          line-height: 0.9;
          margin: 0 0 2rem 0;
          text-transform: uppercase;
          letter-spacing: -2px;
          -webkit-text-stroke: 2px var(--black);
        }
        
        .outline-text {
          color: transparent;
          -webkit-text-stroke: 2px var(--black);
          position: relative;
        }
        .outline-text::after {
          content: 'SYSTEM_V3';
          position: absolute; left: 4px; top: 4px;
          color: var(--c-blue);
          z-index: -1;
          -webkit-text-stroke: 0;
        }

        /* Terminal Typewriter */
        .terminal-box {
          background: var(--black);
          border: var(--border);
          width: 100%;
          max-width: 600px;
          margin-bottom: 3rem;
          box-shadow: var(--shadow);
        }
        
        .terminal-header {
          background: #333;
          padding: 0.5rem;
          display: flex; align-items: center; gap: 0.5rem;
          border-bottom: 2px solid #555;
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .red { background: #ff5f56; } .yellow { background: #ffbd2e; } .green { background: #27c93f; }
        .terminal-title { color: #aaa; font-family: 'Space Mono'; font-size: 0.7rem; margin-left: auto; }

        .terminal-body {
          padding: 1.5rem;
          color: var(--c-green);
          font-family: 'Space Mono', monospace;
          font-size: 1.1rem;
          text-align: left;
          min-height: 80px;
        }
        .prompt { color: var(--c-pink); margin-right: 0.5rem; }
        .cursor { display: inline-block; width: 10px; height: 1.2em; background: var(--c-green); animation: blink 1s infinite; vertical-align: bottom; margin-left: 2px; }

        /* CTA Button */
        .neo-cta-btn {
          background: var(--c-yellow);
          border: var(--border);
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 900;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          box-shadow: var(--shadow);
          transition: all 0.1s;
          font-family: 'Archivo', sans-serif;
          text-transform: uppercase;
        }
        .neo-cta-btn:hover { transform: translate(-2px, -2px); box-shadow: 8px 8px 0px var(--black); }
        .neo-cta-btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px var(--black); }

        /* --- Grid Section --- */
        .system-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          width: 100%;
          opacity: 0;
          transform: translateY(40px);
          transition: all 1s ease-out 0.3s;
        }

        .neo-card {
          background: var(--surface);
          border: var(--border);
          box-shadow: var(--shadow);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: transform 0.2s;
        }
        .neo-card:hover { transform: translate(-4px, -4px); box-shadow: 10px 10px 0px var(--black); }

        .neo-card.yellow-accent .icon-box { background: var(--c-yellow); }
        .neo-card.purple-accent .icon-box { background: var(--c-purple); color: white; }
        .neo-card.green-accent .icon-box { background: var(--c-green); }

        .icon-box {
          width: 60px; height: 60px;
          border: var(--border);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.5rem;
          box-shadow: 4px 4px 0px var(--black);
        }

        .card-title { font-size: 1.25rem; font-weight: 900; margin: 0 0 1rem 0; text-transform: uppercase; letter-spacing: -0.5px; }
        .card-desc { font-family: 'Space Mono', monospace; font-size: 0.85rem; color: #444; line-height: 1.6; margin: 0; }
        .card-desc strong { background: var(--black); color: white; padding: 0 4px; font-weight: 400; }

        /* --- Utilities --- */
        .loaded .hero-section, .loaded .system-grid { opacity: 1; transform: translateY(0); }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        @media (max-width: 1024px) {
          .system-grid { grid-template-columns: 1fr; max-width: 500px; }
          .main-title { font-size: 3rem; }
        }
        @media (max-width: 600px) {
          .main-title { font-size: 2.2rem; }
          .neo-cta-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default Home;