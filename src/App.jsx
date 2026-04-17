import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Map, Flame, User, Phone, Calendar, Gift, Quote, ChevronRight } from 'lucide-react';
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
  { id: 11, text: "Anunciar o Gospel com parresia (ousadia), usando novos métodos, criatividade e um novo ardor missionário.", bg: bg11 },
  { id: 12, text: "Amar a Igreja e o Papa com amor filial, dando a vida em unidade com meus pastores e irmãos de comunidade.", bg: bg12 }
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

const ParticleBackground = React.memo(() => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${15 + Math.random() * 15}s`,
      size: `${1 + Math.random() * 2}px`
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="particles">
      {particles.map(p => (
        <div 
          key={p.id} 
          className="particle" 
          style={{ 
            left: p.left, 
            animationDelay: p.delay, 
            animationDuration: p.duration,
            width: p.size,
            height: p.size
          }} 
        />
      ))}
    </div>
  );
});

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Drag State
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  // Animated Points State
  const [displayedPoints, setDisplayedPoints] = useState(0);
  const [finalFictitiousPoints, setFinalFictitiousPoints] = useState(0);

  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    age: ''
  });

  const fetchRanking = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('name, points')
        .order('points', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRanking(data || []);
    } catch (err) {
      console.error("Erro ao buscar ranking:", err.message);
    }
  };

  const triggerCelebration = () => {
    const scalar = 2;
    const gold_path = confetti.shapeFromPath({ path: 'M0 10 L5 0 L10 10 Z' });

    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#FFD700', '#FF2A00', '#FFFFFF'],
      shapes: [gold_path, 'circle'],
      scalar
    });
  };

  const handleSwipe = useCallback((direction) => {
    if (swipeDirection) return;
    setSwipeDirection(direction);
    
    if (direction === 'right') {
      triggerCelebration();
      setScore(p => p + 1);
    }

    setTimeout(() => {
      if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex(p => p + 1);
        setSwipeDirection(null);
        setDragX(0); // Reset drag
      } else {
        setScreen('calculating');
      }
    }, 500);
  }, [currentIndex, swipeDirection]);

  // Touch/Mouse Handlers
  const onDragStart = (e) => {
    if (swipeDirection) return;
    setIsDragging(true);
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;
  };

  const onDragMove = (e) => {
    if (!isDragging || swipeDirection) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const offset = clientX - startXRef.current;
    setDragX(offset);
  };

  const onDragEnd = () => {
    if (!isDragging || swipeDirection) return;
    setIsDragging(false);

    const threshold = 120; // threshold for swipe
    if (dragX > threshold) {
      handleSwipe('right');
    } else if (dragX < -threshold) {
      handleSwipe('left');
    } else {
      setDragX(0); // Snap back to center
    }
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

  // Points counting effect
  useEffect(() => {
    if (screen === 'result') {
      setDisplayedPoints(0); // Start from zero
      const duration = 2000;
      const start = Date.now();
      
      let frameId;
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);
        const currentScore = Math.floor(progress * finalFictitiousPoints);
        
        setDisplayedPoints(currentScore);
        
        if (progress < 1) {
          frameId = requestAnimationFrame(animate);
        }
      };
      
      frameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frameId);
    }
  }, [screen, finalFictitiousPoints]);

  const currentProgress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (!userData.name || !userData.phone || !userData.age) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase.from('matches').insert([
        { 
          name: userData.name.trim(), 
          phone: userData.phone, 
          age: parseInt(userData.age), 
          points: finalFictitiousPoints 
        }
      ]);

      if (error) throw error;
      setScreen('result');
    } catch (err) {
      console.error("Erro ao salvar:", err.message);
      alert("Houve um erro ao salvar seus dados. Tente novamente!");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (screen === 'mission') {
      fetchRanking();
    }
  }, [screen]);

  // Card transform during drag
  const cardStyle = {
    backgroundImage: `url(${QUESTIONS[currentIndex].bg})`,
    transform: swipeDirection 
      ? undefined // hand over to CSS classes
      : `translateX(${dragX}px) rotate(${dragX / 15}deg)`,
    transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.2), opacity 0.4s ease'
  };

  const firstName = userData.name.trim().split(' ')[0];

  return (
    <div className="app-container">
      <ParticleBackground />
      
      {screen === 'welcome' && (
        <div className="screen welcome-screen">
          <div className="logo-wrapper">
             <div className="logo-aura"></div>
             <div className="logo-beams"></div>
             {[...Array(6)].map((_, i) => (
               <div 
                 key={i} 
                 className="floating-spark" 
                 style={{ 
                   left: `${Math.random() * 100 - 50}%`, 
                   top: `${Math.random() * 100 - 50}%`,
                   animationDelay: `${Math.random() * 3}s` 
                 }}
               ></div>
             ))}
             <img src={logo} alt="Shalom Logo" className="welcome-logo" />
          </div>
          
          <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Será que sinto atração pelo Carisma Shalom?</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', marginBottom: '2.5rem', fontWeight: 600, lineHeight: 1.5 }}>
            Faça o teste: clique no coração se seu coração arder! ❤️🔥
          </p>
          <button className="btn-primary btn-small" onClick={() => setScreen('swipe')}>Começar a Jornada</button>
        </div>
      )}

      {screen === 'swipe' && (
        <div className="screen" style={{ padding: '0', justifyContent: 'flex-start' }}>
          <div style={{ padding: '1.5rem 2rem 0' }}>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${currentProgress}%` }}></div>
            </div>
            <div className="swipe-header">
              <span>JORNADA VOCACIONAL</span>
              <span>{currentIndex + 1} / {QUESTIONS.length}</span>
            </div>
          </div>

          <div 
            className="swipe-container"
            onMouseDown={onDragStart}
            onMouseMove={onDragMove}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
            onTouchStart={onDragStart}
            onTouchMove={onDragMove}
            onTouchEnd={onDragEnd}
          >
             <div 
               className={`swipe-card ${swipeDirection ? `swipe-${swipeDirection}` : ''}`}
               style={cardStyle}
             >
               <div className="card-inner-border"></div>
               <div className="swipe-stamp stamp-like" style={{ opacity: dragX > 50 ? (dragX-50)/70 : 0 }}>LIKE</div>
               <div className="swipe-stamp stamp-nope" style={{ opacity: dragX < -50 ? (Math.abs(dragX)-50)/70 : 0 }}>NOPE</div>
               <Sparkles size={24} color="rgba(212, 175, 55, 0.4)" style={{ marginBottom: '2rem', zIndex: 2 }} />
               <p className="card-text">{QUESTIONS[currentIndex].text}</p>
               <div className="card-divider" style={{ zIndex: 2 }}></div>
             </div>
          </div>

          <div className="action-buttons">
            <div className="action-btn-wrapper dislike" onClick={() => handleSwipe('left')}>
              <div className="btn-dislike"><BurningXIcon size={46} /></div>
              <span>Não é pra mim</span>
            </div>
            <div className="action-btn-wrapper like" onClick={() => handleSwipe('right')}>
              <div className="btn-like"><BurningHeartIcon size={52} /></div>
              <span>Meu coração arde</span>
            </div>
          </div>
        </div>
      )}

      {screen === 'calculating' && (
        <div className="screen" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div className="loading-circle"></div>
          <p className="calculating-text">Vamos ver se você tem match com o carisma...</p>
        </div>
      )}

      {screen === 'registration' && (
        <div className="screen" style={{ justifyContent: 'center', textAlign: 'left', padding: '2rem 2.5rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
             <h2 style={{ marginBottom: '0.8rem', fontSize: '2.2rem', color: '#fff' }}>Só mais um passo...</h2>
             <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.5 }}>
               Registre seus dados para mergulhar no seu resultado e ver quem mais deu match!
             </p>
          </div>
          
          <form onSubmit={handleRegistrationSubmit}>
            <div className="form-group">
              <label className="input-label"><User size={16}/> Como você se chama? (Só o primeiro nome)</label>
              <input 
                className="input-field" 
                type="text" 
                placeholder="Seu nome" 
                required 
                value={userData.name} 
                onChange={e => setUserData({...userData, name: e.target.value})} 
              />
            </div>

            <div className="input-group">
              <div style={{ flex: 1.8 }}>
                <label className="input-label"><Phone size={16}/> Telefone/WA</label>
                <input 
                  className="input-field" 
                  type="tel" 
                  placeholder="(00) 00000-0000" 
                  required 
                  value={userData.phone} 
                  onChange={e => setUserData({...userData, phone: e.target.value})} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="input-label"><Calendar size={16}/> Idade</label>
                <input 
                  className="input-field" 
                  type="number" 
                  placeholder="00" 
                  required 
                  value={userData.age} 
                  onChange={e => setUserData({...userData, age: e.target.value})} 
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} disabled={isSaving}>
              {isSaving ? "Salvando Ardor..." : "Ver meu Match"}
            </button>
          </form>
        </div>
      )}

      {screen === 'result' && (
        <div className="screen" style={{ justifyContent: 'center' }}>
          <div className="fire-wrapper">
             <div className="fire-bg-glow"></div>
             <Flame className="fire-icon" size={110} strokeWidth={2} fill="#ff5e00" />
          </div>
          <div className="result-card">
            <div className="result-badge">Calculando Ardor...</div>
            <div className="result-score" style={{ variantNumeric: 'tabular-nums' }}>
              {displayedPoints.toLocaleString()} <span style={{ fontSize: '1.2rem', color: 'var(--gold)' }}>pts</span>
            </div>
            <p className="result-desc">
              {score >= 10 
                ? `${firstName}, seu coração está verdadeiramente inflamado! O Espírito Santo sopra onde quer, e hoje Ele sopra em sua alma.`
                : `${firstName}, seu coração começa a arder pela paz. Existe uma semente plantada em você!`}
            </p>
          </div>
          <button 
            className="btn-primary" 
            style={{ marginTop: '2.5rem', opacity: displayedPoints === finalFictitiousPoints ? 1 : 0.5 }} 
            onClick={() => displayedPoints === finalFictitiousPoints && setScreen('mission')}
          >
            Continuar para o Mural
          </button>
        </div>
      )}

      {screen === 'mission' && (
        <div className="screen" style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '3.5rem 2rem', overflowY: 'auto' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--gold)' }}>Mural Vocacional</h2>
          
          <div className="ranking-container">
            {ranking.map((user, idx) => (
              <div key={idx} className={`ranking-item ${user.name === userData.name.trim().split(' ')[0] ? 'current' : ''}`}>
                <span>{user.name}</span>
                <span style={{color: user.points >= 12000 ? 'var(--gold)' : '#666'}}>
                  {user.points.toLocaleString()} {user.points >= 12000 ? '🔥' : 'pts'}
                </span>
              </div>
            ))}
            
            {ranking.length === 0 && (
              <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>Carregando ranking global...</p>
            )}
          </div>

          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '2rem' }}>
            Você faz parte de uma multidão que também deu match com o carisma!
          </p>

          <button className="btn-primary" style={{ width: '100%', marginBottom: '2rem' }} onClick={() => setScreen('moyses')}>
            O que fazer agora? 🤔
          </button>
        </div>
      )}

      {screen === 'moyses' && (
        <div className="screen" style={{ justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
           <p style={{ fontSize: '1.9rem', fontFamily: 'Playfair Display', fontStyle: 'italic', lineHeight: 1.4, color: '#fff', marginBottom: '2rem' }}>
             "Tudo o que temos e somos, em nossa pobreza, queremos colocar aos pés de Pedro como prova do nosso amor a Cristo e à Igreja."
           </p>
           <p style={{ color: 'var(--gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.85rem' }}>
             O Cerne da Vocação Shalom
           </p>
           <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '1rem', letterSpacing: '1px' }}>
             — Moysés Azevedo
           </p>
           
           <button className="btn-primary btn-small" style={{ marginTop: '4rem' }} onClick={() => setScreen('final')}>
             Continuar <ChevronRight size={18} />
           </button>
        </div>
      )}

      {screen === 'final' && (
        <div className="screen" style={{ justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
          <div className="mission-box" style={{ background: 'transparent', border: 'none', padding: 0 }}>
            <h2 style={{ color: 'var(--gold)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>O que você oferece hoje?</h2>
            <p style={{ color: '#ccc', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '3rem' }}>
              O Carisma Shalom nasceu aos pés de Pedro. Hoje, Deus pergunta ao seu coração:
            </p>
            
            <div style={{ background: 'rgba(255, 42, 0, 0.05)', padding: '3rem 2rem', borderRadius: '32px', border: '1px solid var(--red-bright)', marginBottom: '3rem', backdropFilter: 'blur(20px)', boxShadow: '0 0 40px rgba(255, 42, 0, 0.2)' }}>
              <p style={{ color: '#fff', fontSize: '1.6rem', lineHeight: 1.3, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {firstName}, se você tivesse que dar um presente para o Papa hoje, o que você daria?
              </p>
            </div>

            <p style={{ color: 'var(--gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2rem' }}>
               Vá ao stand e converse com um dos vocacionados! 🏃‍♂️💬
            </p>
          </div>

          <button className="btn-primary btn-small" style={{ width: '100%' }} onClick={() => window.location.reload()}>
            Recomeçar Jornada
          </button>
        </div>
      )}
    </div>
  );
}
