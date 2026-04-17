import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Flame, User, Phone, Calendar, ChevronRight, Heart, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import './index.css';
import { supabase } from './supabaseClient';

// Logo and Background imports
import logo from './assets/images/logo.png';
import bg1 from './assets/images/bg1.jpg';
import bg2 from './assets/images/bg2.jpg';
import bg3 from './assets/images/bg3.jpg';
import bg4 from './assets/images/bg4.jpg';
import bg5 from './assets/images/bg5.jpg';
import bg6 from './assets/images/bg6.jpg';
import bg7 from './assets/images/bg7.jpg';
import bg8 from './assets/images/bg8.jpg';
import bg9 from './assets/images/bg9.jpg';
import bg10 from './assets/images/bg10.jpg';
import bg11 from './assets/images/bg11.png';
import bg12 from './assets/images/bg12.png';

const QUESTIONS = [
  { id: 1, text: "Consumir a minha vida e juventude para que outros jovens encontrem a verdadeira Felicidade que é o próprio Deus.", bg: bg1 },
  { id: 2, text: "Viver a oração como um trato de amizade com Aquele que eu sei que me ama: o Ressuscitado que passou pela Cruz.", bg: bg2 },
  { id: 3, text: "Viver a 'Perfeita Alegria' de nada possuir, sabendo que a minha única e verdadeira riqueza é o Senhor.", bg: bg3 },
  { id: 4, text: "Usar a arte não para brilhar, mas para ferir o coração da humanidade com a Beleza que salva o mundo.", bg: bg4 },
  { id: 5, text: "Partir em missão, deixando para trás planos e seguranças, para ser luz onde a Igreja e a humanidade mais precisarem.", bg: bg5 },
  { id: 6, text: "Gastar tempo ouvindo e cuidando de um jovem, sendo ponte para que ele saia das trevas para a Luz.", bg: bg6 },
  { id: 7, text: "Cultivar uma 'determinação determinada' de nunca parar no caminho da oração, mergulhando no meu Castelo Interior.", bg: bg7 },
  { id: 8, text: "Zelar por cada detalhe da Liturgia e da vida, pois a beleza é o reflexo da glória de Deus entre nós.", bg: bg8 },
  { id: 9, text: "Encontrar Jesus escondido na carne daqueles que sofrem, servindo os 'leprosos' de hoje com amor e radicalidade.", bg: bg9 },
  { id: 10, text: "Desejar uma união tão profunda com Deus que a minha vida seja uma constante e total oferta de amor por Amor.", bg: bg10 },
  { id: 11, text: "Viver a vida comunitária como um transbordamento da alegria da Ressurreição, amando meus irmãos no quotidiano.", bg: bg11 },
  { id: 12, text: "Desejar, como oferta, gastar meus dias aos pés de Pedro, pela Igreja e pela humanidade, no Carisma Shalom.", bg: bg12 }
];

const BurningHeartIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path className="svg-flame-slow" d="M12 2C10 4 8 8 12 12C16 8 14 4 12 2Z" fill="#ff7b00" />
    <path className="svg-flame" d="M12 5C11 7 9 10 12 13C15 10 13 7 12 5Z" fill="#ff2a00" />
    <path className="heart-body" d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor" />
  </svg>
);

const BurningXIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path className="svg-flame" d="M18 4C18 3 19 2 18 1" stroke="#ff4444" strokeWidth="2" strokeLinecap="round"/>
    <path className="svg-flame-slow" d="M6 4C6 3 5 2 6 1" stroke="#ff4444" strokeWidth="2" strokeLinecap="round"/>
    <path className="x-body" d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TypewriterText = React.memo(({ text, speed = 45, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let isCancelled = false;
    let index = 0;
    let currentText = "";
    setDisplayedText('');
    
    const interval = setInterval(() => {
      if (isCancelled) return;
      if (index < text.length) {
        currentText += text.charAt(index);
        setDisplayedText(currentText);
        index++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);
    
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [text, speed, onComplete]);

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && <span className="typewriter-cursor" />}
    </span>
  );
});

const ParticleBackground = React.memo(() => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${10 + Math.random() * 15}s`,
      size: `${1 + Math.random() * 2.5}px`
    }));
    setParticles(newParticles);
  }, []);
  return (
    <div className="particles">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, width: p.size, height: p.size }} />
      ))}
    </div>
  );
});

const formatName = (name) => {
  if (!name) return "";
  const trimmed = name.trim().split(' ')[0];
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [userData, setUserData] = useState({ name: '', phone: '', age: '' });
  const [displayedPoints, setDisplayedPoints] = useState(0);
  const [finalFictitiousPoints, setFinalFictitiousPoints] = useState(0);

  const handleTypingComplete = useCallback(() => setIsTyping(false), []);

  const triggerCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#FF3C00', '#FFFFFF'],
    });
  };

  const handleSwipe = useCallback((direction) => {
    if (swipeDirection || isTyping) return;
    setSwipeDirection(direction);
    if (direction === 'right') {
      triggerCelebration();
      setScore(s => s + 1);
    }
    setTimeout(() => {
      if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex(i => i + 1);
        setSwipeDirection(null);
        setIsTyping(true);
      } else {
        setScreen('calculating');
      }
    }, 500);
  }, [currentIndex, swipeDirection, isTyping]);

  const startJourney = () => {
    setScreen('swipe');
    setIsTyping(true);
  };

  useEffect(() => {
    if (screen === 'calculating') {
      const timer = setTimeout(() => {
        const base = score * 1000;
        const randomBonus = score > 0 ? Math.floor(Math.random() * 500) : 0;
        setFinalFictitiousPoints(base + randomBonus);
        setScreen('registration');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screen, score]);

  useEffect(() => {
    if (screen === 'result') {
      let start = null;
      const duration = 2000;
      const animate = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        setDisplayedPoints(Math.floor(progress * finalFictitiousPoints));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [screen, finalFictitiousPoints]);

  const pushToSupabase = async () => {
    if (!userData.name || !userData.phone || !userData.age) return;
    setIsSaving(true);
    try {
      await supabase.from('matches').insert([{
        name: formatName(userData.name),
        phone: userData.phone,
        age: parseInt(userData.age),
        points: finalFictitiousPoints
      }]);
      // After saving, we show the result screen (points)
      setScreen('result');
    } catch (err) {
      console.error(err);
      setScreen('result'); 
    } finally {
      setIsSaving(false);
    }
  };

  const goToMural = async () => {
    try {
      const { data } = await supabase.from('matches')
        .select('name, points')
        .order('points', { ascending: false })
        .limit(10);
      setRanking(data || []);
      setScreen('mural');
    } catch (err) {
      console.error(err);
      setScreen('mural');
    }
  };

  const firstName = formatName(userData.name);

  return (
    <div className="app-container">
      <ParticleBackground />

      {screen === 'welcome' && (
        <div className="screen welcome-screen" style={{ justifyContent: 'center', paddingBottom: '4rem' }}>
          
          {/* Tinder Vocacional label */}
          <p style={{ color: 'var(--gold)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem', marginBottom: '2rem', opacity: 0.9 }}>
            Tinder Vocacional
          </p>

          <div className="welcome-logo-card">
            <img src={logo} alt="Shalom" className="welcome-logo-img" />
          </div>

          <h1 className="welcome-title">
            Será que sinto<br/>
            atração pelo<br/>
            <span style={{ color: 'var(--gold)' }}>Carisma Shalom?</span>
          </h1>

          <p className="welcome-subtitle">
            Faça o teste pra ver se você tem<br/>
            match com o Carisma Shalom! 🔥
          </p>

          <div style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }}>
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => setScreen('swipe')}>
              COMEÇAR A JORNADA
            </button>
          </div>
        </div>
      )}

      {screen === 'registration' && (
        <div className="screen" style={{textAlign: 'left'}}>
          <h2 style={{color: '#fff', fontSize: '2.4rem', marginBottom: '1.5rem'}}>Só mais um passo...</h2>
          
          <div className="form-group">
            <label className="input-label"><User size={14}/> Como se chama?</label>
            <input className="input-field" type="text" placeholder="Seu nome" value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="input-label"><Phone size={14}/> Whatsapp</label>
            <input className="input-field" type="tel" placeholder="(00) 00000-0000" value={userData.phone} onChange={e => setUserData({...userData, phone: e.target.value})} />
          </div>
          
          <div className="form-group">
            <label className="input-label"><Calendar size={14}/> Idade</label>
            <input className="input-field" type="number" placeholder="Sua idade" value={userData.age} onChange={e => setUserData({...userData, age: e.target.value})} />
          </div>

          <button className="btn-primary" style={{width: '100%', marginTop: '1rem'}} onClick={pushToSupabase} disabled={isSaving}>
            {isSaving ? "Eternizando..." : "Ver meu Match 🔥"}
          </button>
        </div>
      )}

      {screen === 'swipe' && (
        <div className="screen" style={{padding: '0'}}>
          <div style={{padding: '1.5rem 2rem 0.5rem'}}>
             <div className="progress-container"><div className="progress-bar" style={{width: `${((currentIndex+1)/QUESTIONS.length)*100}%`}}></div></div>
             <p style={{color: 'var(--gold)', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '2px', textAlign: 'left'}}>QUESTÃO {currentIndex+1}/{QUESTIONS.length}</p>
          </div>

          <div className="swipe-container">
            <div className={`swipe-card ${swipeDirection ? `swipe-${swipeDirection}` : ''}`} style={{backgroundImage: `url(${QUESTIONS[currentIndex].bg})`}}>
              <div className="card-inner-border" />
              <div className="swipe-stamp stamp-like">ARDEU!</div>
              <div className="swipe-stamp stamp-nope">AINDA NÃO</div>
              <p className="card-text">
                <TypewriterText text={QUESTIONS[currentIndex].text} onComplete={handleTypingComplete} />
              </p>
            </div>
          </div>

          <div className={`action-buttons ${isTyping ? 'locked' : ''}`}>
            <div className="action-btn-wrapper dislike" onClick={() => handleSwipe('left')}>
              <div className="btn-dislike"><BurningXIcon size={46} /></div>
              <span>Não é pra mim...</span>
            </div>
            <div className="action-btn-wrapper like" onClick={() => handleSwipe('right')}>
              <div className="btn-like"><BurningHeartIcon size={52} /></div>
              <span>Meu coração arde!</span>
            </div>
          </div>
        </div>
      )}

      {screen === 'calculating' && (
        <div className="screen" style={{alignItems: 'center', paddingTop: '30%'}}>
          <div className="loading-circle"></div>
          <h2 className="calculating-text">Vamos ver se você tem match com o carisma...</h2>
        </div>
      )}

      {screen === 'result' && (
        <div className="screen">
          <div className="fire-wrapper">
             <div className="fire-bg-glow" />
             <Flame className="fire-icon" size={110} fill="#ff3c00" strokeWidth={1} />
          </div>
          <div className="result-card">
            <div className="result-score">{displayedPoints.toLocaleString()}<span style={{fontSize: '1.2rem'}}> pts</span></div>
            <p className="result-desc" style={{marginTop: '1.5rem'}}>
              {score >= 10 
                ? `${firstName}, seu espírito está em chamas! O Carisma Shalom pulsa em você.` 
                : `${firstName}, existe uma semente de eternidade brotando no seu coração.`}
            </p>
          </div>
          <button className="btn-primary" style={{marginTop: '3rem', width: '100%'}} onClick={goToMural}>
            Ver Mural do Ardor
          </button>
        </div>
      )}

      {screen === 'mural' && (
        <div className="screen">
          <h2 style={{fontSize: '2.4rem', color: 'var(--gold)', marginBottom: '2rem'}}>Mural Vocacional</h2>
          <div className="ranking-container">
            {ranking.map((r, i) => (
              <div key={i} className="ranking-item">
                <span style={{color: '#fff'}}>#{i+1} {r.name}</span>
                <span style={{color: 'var(--gold)'}}>{r.points.toLocaleString()} 🔥</span>
              </div>
            ))}
          </div>
          <button className="btn-primary" style={{width: '100%', marginTop: 'auto'}} onClick={() => setScreen('missao')}>
            O que Deus me diz agora?
          </button>
        </div>
      )}

      {screen === 'missao' && (
        <div className="screen" style={{justifyContent: 'center'}}>
          <div className="mission-box">
            <p className="mission-text">
              "Tudo o que temos e somos, em nossa pobreza, queremos colocar aos pés de Pedro como prova do nosso amor a Cristo e à Igreja."
            </p>
            <p className="mission-author">— Moysés Azevedo</p>
          </div>
          
          <button className="btn-primary" style={{marginTop: '3rem', width: '100%'}} onClick={() => setScreen('missao-final')}>
            CONTINUAR <ChevronRight size={18} />
          </button>
        </div>
      )}

      {screen === 'missao-final' && (
        <div className="screen" style={{justifyContent: 'center'}}>
          <div style={{marginTop: '2rem', padding: '2.5rem 2rem', background: 'rgba(255, 60, 0, 0.1)', borderRadius: '32px', border: '1px solid var(--red-bright)', boxShadow: '0 0 40px rgba(255, 60, 0, 0.2)'}}>
            <h3 style={{fontSize: '1.8rem', lineHeight: 1.3, color: '#fff', fontWeight: 900, textTransform: 'uppercase'}}>
              {firstName}, se você tivesse que dar um presente para o Papa hoje, o que você daria?
            </h3>
            <div className="card-divider" style={{margin: '2rem auto', width: '40px'}}></div>
            <p style={{color: 'var(--gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem'}}>
               Vá ao stand e converse com um dos vocacionados! 🏃‍♂️💬
            </p>
          </div>

          <button className="btn-primary btn-small" style={{marginTop: '3rem', width: '100%'}} onClick={() => window.location.reload()}>
            RECOMEÇAR JORNADA
          </button>
        </div>
      )}
    </div>
  );
}
