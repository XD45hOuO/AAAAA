import { useMemo, useState } from 'react'

// Implements piecewise R-value increases based on score thresholds
// Inputs: chartConstant (譜面定數), score (0-1010000)
// Output: rating (R 值)

function clampScore(s) {
  const n = Math.max(0, Math.min(1010000, Math.floor(Number(s) || 0)))
  return n
}

function computeIncrementFromScore(score) {
  // Based on provided table
  if (score >= 1009000) {
    // SSS+: fixed +2.15, no further increase beyond 1009000
    return 2.15
  }
  if (score >= 1007500) {
    // SSS: baseline +2.00 at 1007500, then every 100 pts +0.01 up to 1008999
    const steps = Math.floor((score - 1007500) / 100)
    return 2.0 + steps * 0.01
  }
  if (score >= 1005000) {
    // SS+: every 50 pts +0.01 from 1005000..1007499
    const steps = Math.floor((score - 1005000) / 50)
    return 1.5 + steps * 0.01
  }
  if (score >= 1000000) {
    // SS: every 100 pts +0.01 from 1000000..1004999
    const steps = Math.floor((score - 1000000) / 100)
    return 1.0 + steps * 0.01
  }
  if (score >= 990000) {
    // S+: every 250 pts +0.01 from 990000..999999
    const steps = Math.floor((score - 990000) / 250)
    return 0.6 + steps * 0.01
  }
  if (score >= 975000) {
    // S: every 250 pts +0.01 from 975000..989999, starting from +0.0 at 975000
    const steps = Math.floor((score - 975000) / 250)
    return 0.0 + steps * 0.01
  }
  if (score >= 925000) return -3.0
  if (score >= 900000) return -5.0
  if (score >= 800000) return -2.5 // (定數-5.0)/2  => 增量為 -2.5
  if (score >= 500000) return 0.0
  return 0.0
}

function computeRating(chartConstant, score) {
  const s = clampScore(score)
  const inc = computeIncrementFromScore(s)
  return Number((chartConstant + inc).toFixed(2))
}

function computeScoreForTargetRating(chartConstant, targetRating) {
  const incNeeded = Number(targetRating) - Number(chartConstant)
  // If non-positive increment needed, any score works; choose minimal 0
  if (incNeeded <= 0) return 0

  // S band: 975000..989999 => inc 0.00..0.59 step 0.01 per 250
  if (incNeeded <= 0.59 + 1e-9) {
    const steps = Math.max(0, Math.ceil((incNeeded - 0.0) / 0.01))
    const score = 975000 + steps * 250
    return Math.min(score, 989999)
  }

  // S+ band: 990000..999999 => inc 0.60..0.99 step 0.01 per 250
  if (incNeeded <= 0.99 + 1e-9) {
    const base = 0.6
    const steps = Math.max(0, Math.ceil((incNeeded - base) / 0.01))
    const score = 990000 + steps * 250
    return Math.min(score, 999999)
  }

  // SS band: 1000000..1004999 => inc 1.00..1.04 step 0.01 per 100
  if (incNeeded <= 1.04 + 1e-9) {
    const base = 1.0
    const steps = Math.max(0, Math.ceil((incNeeded - base) / 0.01))
    const score = 1000000 + steps * 100
    return Math.min(score, 1004999)
  }

  // SS+ band: 1005000..1007499 => inc 1.50..1.99 step 0.01 per 50
  if (incNeeded <= 1.99 + 1e-9) {
    const base = 1.5
    const steps = Math.max(0, Math.ceil((incNeeded - base) / 0.01))
    const score = 1005000 + steps * 50
    return Math.min(score, 1007499)
  }

  // SSS band: 1007500..1008999 => inc 2.00..2.14 step 0.01 per 100
  if (incNeeded <= 2.14 + 1e-9) {
    const base = 2.0
    const steps = Math.max(0, Math.ceil((incNeeded - base) / 0.01))
    const score = 1007500 + steps * 100
    return Math.min(score, 1008999)
  }

  // SSS+: >=1009000 => fixed 2.15
  if (incNeeded <= 2.15 + 1e-9) {
    return 1009000
  }

  // Beyond maximum attainable increment
  return null
}

export default function Rating() {
  const [chartConst, setChartConst] = useState('12.0')
  const [score, setScore] = useState('1000000')
  const [targetR, setTargetR] = useState('14.00')

  const rating = useMemo(() => computeRating(Number(chartConst), Number(score)), [chartConst, score])
  const requiredScore = useMemo(() => computeScoreForTargetRating(Number(chartConst), Number(targetR)), [chartConst, targetR])

  return (
    <div className="container">
      <h1 className="neon-text">音遊分數查詢器</h1>
      <div className="card" style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          <label className="input">
            <span>譜面定數</span>
            <input type="number" step="0.01" value={chartConst} onChange={e => setChartConst(e.target.value)} />
          </label>
          <label className="input">
            <span>分數 (0 ~ 1010000)</span>
            <input type="number" min={0} max={1010000} value={score} onChange={e => setScore(e.target.value)} />
          </label>
            <label className="input">
              <span>目標 R 值</span>
              <input type="number" step="0.01" value={targetR} onChange={e => setTargetR(e.target.value)} />
            </label>
        </div>
        <div className="card">
          <div>R 值：</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{rating.toFixed(2)}</div>
        </div>
        <div className="card">
          <div>達成目標 R 所需分數：</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>
            {requiredScore === null ? '無法達成（超過最大增量 2.15）' : requiredScore}
          </div>
        </div>
        <div className="card">
          <div style={{ fontWeight: 600 }}>規則摘要</div>
          <ul style={{ margin: 0 }}>
            <li>SSS+ ≥ 1009000：定數 + 2.15（不再增加）</li>
            <li>SSS 1007500~1008999：每 100 分 +0.01（1007500 對應 +2.00）</li>
            <li>SS+ 1005000~1007499：每 50 分 +0.01（起點 +1.5）</li>
            <li>SS 1000000~1004999：每 100 分 +0.01（起點 +1.0）</li>
            <li>S+ 990000~999999：每 250 分 +0.01（起點 +0.6）</li>
            <li>S 975000~989999：每 250 分 +0.01（起點 +0.0）</li>
            <li>AA 925000：定數 -3.0；A 900000：定數 -5.0</li>
            <li>BBB 800000：(定數 -5.0)/2 → 增量 -2.5；C 500000：0</li>
          </ul>
        </div>
      </div>
    </div>
  )
}


