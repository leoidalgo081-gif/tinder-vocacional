import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import logo from './assets/images/logo.png';

const MEDALS = ['🥇', '🥈', '🥉'];
const REFRESH_INTERVAL = 12000; // 12 seconds

const formatName = (name) => {
  if (!name) return '';
  const trimmed = name.trim().split(' ')[0];
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

export default function MonitorView() {
  const [ranking, setRanking] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tick, setTick] = useState(0);

  const fetchRanking = async () => {
    setIsRefreshing(true);
    try {
      const { data } = await supabase
        .from('matches')
        .select('name, points')
        .order('points', { ascending: false })
        .limit(50);
      if (data) {
        setRanking(data);
        setLastUpdate(new Date());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRanking();
    const interval = setInterval(() => {
      fetchRanking();
      setTick(t => t + 1);
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const top3 = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  return (
    <div className="monitor-root">
      {/* Background particles */}
      <div className="monitor-bg-glow monitor-bg-glow-1" />
      <div className="monitor-bg-glow monitor-bg-glow-2" />

      {/* Header */}
      <header className="monitor-header">
        <img src={logo} alt="Shalom" className="monitor-logo" />
        <div className="monitor-header-text">
          <h1 className="monitor-title">Top Matching da Vocação Shalom!</h1>
          <p className="monitor-subtitle">Ranking do Ardor 🔥</p>
        </div>
        <div className="monitor-live">
          <span className={`monitor-live-dot ${isRefreshing ? 'refreshing' : ''}`} />
          <span>AO VIVO</span>
        </div>
      </header>

      <div className="monitor-body">

        {/* TOP 3 — Left Panel */}
        <div className="monitor-top3-panel">
          <p className="monitor-section-label">Top Matches</p>

          {top3.length === 0 && (
            <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '4rem' }}>
              Aguardando participantes...
            </p>
          )}

          {top3.length > 0 && (
            <div className="monitor-podium-stage">

              {/* 2nd place — LEFT */}
              {top3[1] ? (
                <div className="monitor-podium monitor-podium-2">
                  <div className="monitor-podium-medal">🥈</div>
                  <div className="monitor-podium-name">{top3[1] ? formatName(top3[1].name) : ''}</div>
                  <div className="monitor-podium-pts">{top3[1]?.points.toLocaleString()} <span>pts</span></div>
                  <div className="monitor-podium-bar mpb-silver" />
                  <div className="monitor-podium-num">2</div>
                </div>
              ) : <div className="monitor-podium-empty" />}

              {/* 1st place — CENTER */}
              <div className="monitor-podium monitor-podium-1">
                <div className="monitor-podium-medal monitor-podium-crown">🥇</div>
                <div className="monitor-podium-name monitor-podium-name-gold">{formatName(top3[0].name)}</div>
                <div className="monitor-podium-pts monitor-podium-pts-gold">{top3[0].points.toLocaleString()} <span>pts</span></div>
                <div className="monitor-podium-bar mpb-gold" />
                <div className="monitor-podium-num">1</div>
              </div>

              {/* 3rd place — RIGHT */}
              {top3[2] ? (
                <div className="monitor-podium monitor-podium-3">
                  <div className="monitor-podium-medal">🥉</div>
                  <div className="monitor-podium-name">{formatName(top3[2].name)}</div>
                  <div className="monitor-podium-pts">{top3[2].points.toLocaleString()} <span>pts</span></div>
                  <div className="monitor-podium-bar mpb-bronze" />
                  <div className="monitor-podium-num">3</div>
                </div>
              ) : <div className="monitor-podium-empty" />}

            </div>
          )}
        </div>

        {/* Divider */}
        <div className="monitor-divider" />

        {/* Full ranking — Right Panel */}
        <div className="monitor-ranking-panel">
          <p className="monitor-section-label">Todos os Participantes ({ranking.length})</p>
          <div className="monitor-ranking-list">
            {ranking.map((r, i) => (
              <div
                key={i}
                className={`monitor-ranking-row ${i < 3 ? 'monitor-ranking-row-top' : ''}`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <span className="monitor-ranking-pos">
                  {i < 3 ? MEDALS[i] : `#${i + 1}`}
                </span>
                <span className="monitor-ranking-name">{formatName(r.name)}</span>
                <span className="monitor-ranking-pts">{r.points.toLocaleString()} 🔥</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="monitor-footer">
        <span>Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')} &nbsp;·&nbsp; Atualiza a cada {REFRESH_INTERVAL / 1000}s</span>
      </footer>
    </div>
  );
}
