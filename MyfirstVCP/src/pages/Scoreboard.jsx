import { useEffect, useMemo, useRef, useState } from 'react'

const SPORT_PRESETS = {
  badminton: {
    name: '羽球',
    type: 'points',
    targetPoints: 21,
    winBy: 2,
    cap: 30,
    periods: 1,
    periodMinutes: 0,
  },
  basketball: {
    name: '籃球',
    type: 'timer',
    periodMinutes: 10,
    periods: 1,
    allowCustomMinutes: true,
  },
  soccer: {
    name: '足球',
    type: 'timer',
    periodMinutes: 45,
    periods: 2,
  },
  volleyball: {
    name: '排球',
    type: 'points',
    targetPoints: 25,
    winBy: 2,
    cap: 0,
    periods: 1,
    periodMinutes: 0,
  },
}

export default function Scoreboard() {
  const [sportKey, setSportKey] = useState('badminton')
  const [teamsCount, setTeamsCount] = useState(2)
  const [playersPerTeam, setPlayersPerTeam] = useState(1)
  const [teamNames, setTeamNames] = useState(['A隊', 'B隊'])
  const [scores, setScores] = useState([0, 0])
  const [period, setPeriod] = useState(1)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const timerRef = useRef(null)

  const preset = SPORT_PRESETS[sportKey]

  useEffect(() => {
    // Initialize timer based on preset
    if (preset.type === 'timer') {
      setSecondsLeft(preset.periodMinutes * 60)
    } else {
      setSecondsLeft(0)
    }
    setScores(new Array(teamsCount).fill(0))
    setTeamNames(prev => {
      const next = Array.from({ length: teamsCount }, (_, i) => prev[i] || `隊伍${i + 1}`)
      return next
    })
    setPeriod(1)
    setIsRunning(false)
    clearInterval(timerRef.current)
  }, [sportKey, teamsCount])

  function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  function adjustScore(index, delta) {
    setScores(prev => {
      const next = [...prev]
      next[index] = Math.max(0, next[index] + delta)
      return next
    })
  }

  function resetMatch() {
    setScores(new Array(teamsCount).fill(0))
    setPeriod(1)
    setIsRunning(false)
    if (preset.type === 'timer') setSecondsLeft(preset.periodMinutes * 60)
  }

  function startTimer() {
    if (preset.type !== 'timer' || isRunning) return
    setIsRunning(true)
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setIsRunning(false)
          // move to next period if any
          if (period < preset.periods) {
            setPeriod(p => p + 1)
            return preset.periodMinutes * 60
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function pauseTimer() {
    setIsRunning(false)
    clearInterval(timerRef.current)
  }

  function setCustomMinutes(min) {
    if (preset.type !== 'timer') return
    const minutes = Math.max(1, Math.min(10, Number(min) || 0))
    setSecondsLeft(minutes * 60)
  }

  const winnerText = useMemo(() => {
    if (preset.type === 'points') {
      const maxScore = Math.max(...scores)
      const leadingIndex = scores.findIndex(s => s === maxScore)
      // check win conditions
      const target = preset.targetPoints
      const winBy = preset.winBy || 0
      const cap = preset.cap || 0
      const leadOverSecond = scores.length > 1 ? maxScore - Math.max(...scores.filter((_, i) => i !== leadingIndex)) : maxScore

      if (maxScore >= target) {
        if (winBy === 0) return `${teamNames[leadingIndex]} 獲勝`
        if (leadOverSecond >= winBy) return `${teamNames[leadingIndex]} 獲勝`
        if (cap && maxScore >= cap) return `${teamNames[leadingIndex]} 獲勝`
      }
      return ''
    } else {
      if (preset.type === 'timer' && period > preset.periods && !isRunning) {
        // time-based sports: decide by higher score
        const maxScore = Math.max(...scores)
        const leadingIndex = scores.findIndex(s => s === maxScore)
        const tie = scores.filter(s => s === maxScore).length > 1
        return tie ? '比賽結束：平手' : `比賽結束：${teamNames[leadingIndex]} 獲勝`
      }
      return ''
    }
  }, [scores, preset, period, isRunning, teamNames])

  useEffect(() => {
    // auto-stop when points sport reaches a winner
    if (preset.type === 'points' && winnerText) {
      setIsRunning(false)
      clearInterval(timerRef.current)
    }
  }, [winnerText, preset])

  return (
    <div className="container">
      <h1 className="neon-text">比賽計分板</h1>
      <div className="card" style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          <label className="input">
            <span>運動項目</span>
            <select value={sportKey} onChange={e => setSportKey(e.target.value)} className="input">
              {Object.entries(SPORT_PRESETS).map(([key, p]) => (
                <option key={key} value={key}>{p.name}</option>
              ))}
            </select>
          </label>
          {preset.type === 'timer' && preset.allowCustomMinutes && (
            <label className="input">
              <span>籃球計時 (1-10 分鐘)</span>
              <input type="number" min={1} max={10} defaultValue={10} onChange={e => setCustomMinutes(e.target.value)} />
            </label>
          )}
        </div>

        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          <label className="input">
            <span>隊伍數量</span>
            <input type="number" min={2} max={8} value={teamsCount} onChange={e => setTeamsCount(Number(e.target.value))} />
          </label>
          <label className="input">
            <span>每隊人數</span>
            <input type="number" min={1} max={20} value={playersPerTeam} onChange={e => setPlayersPerTeam(Number(e.target.value))} />
          </label>
          <label className="input">
            <span>局數/半場數</span>
            <input type="number" min={1} max={5} value={preset.periods} readOnly />
          </label>
        </div>

        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: `repeat(${teamsCount}, minmax(0, 1fr))` }}>
          {teamNames.map((name, i) => (
            <label key={i} className="input">
              <span>隊名 {i + 1}</span>
              <input value={teamNames[i]} onChange={e => setTeamNames(prev => { const n = [...prev]; n[i] = e.target.value; return n })} />
            </label>
          ))}
        </div>

        {preset.type === 'timer' && (
          <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div>第 {period} / {preset.periods} 節</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{formatTime(secondsLeft)}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {!isRunning ? (
                <button className="btn primary" onClick={startTimer}>開始</button>
              ) : (
                <button className="btn" onClick={pauseTimer}>暫停</button>
              )}
              <button className="btn" onClick={resetMatch}>重置</button>
            </div>
          </div>
        )}

        <div className="card" style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: `repeat(${teamsCount}, minmax(0, 1fr))` }}>
            {teamNames.map((name, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 600 }}>{name}</div>
                <div style={{ fontSize: 36, margin: '8px 0' }}>{scores[i]}</div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button className="btn" onClick={() => adjustScore(i, -1)}>-1</button>
                  <button className="btn primary" onClick={() => adjustScore(i, +1)}>+1</button>
                  {sportKey === 'basketball' && (
                    <>
                      <button className="btn" onClick={() => adjustScore(i, +2)}>+2</button>
                      <button className="btn" onClick={() => adjustScore(i, +3)}>+3</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn" onClick={resetMatch}>清空</button>
          </div>
        </div>

        {winnerText && (
          <div className="card" style={{ borderColor: '#4caf50', fontWeight: 600 }}>
            {winnerText}
          </div>
        )}
      </div>
    </div>
  )
}


