import { useState } from 'react'

export default function Inequality() {
  const [leftExpr, setLeftExpr] = useState('2*x + 5')
  const [operator, setOperator] = useState('<')
  const [rightExpr, setRightExpr] = useState('13')
  const [solution, setSolution] = useState('')
  const [error, setError] = useState('')

  function parseLinear(expr) {
    // Supports forms like: 3*x + 2, -x + 5, 4x-7, 2 * x - 10, numbers
    const cleaned = expr.replace(/\s+/g, '')
      .replace(/(\d)\s*x/gi, '$1*x')
      .replace(/([+-])x/g, '$11*x')
      .replace(/^x/, '1*x')

    // Normalize implicit multiplication like 4x -> 4*x
    const normalized = cleaned.replace(/(\d)(x)/gi, '$1*$2')

    // Tokenize by + and - keeping signs
    const terms = normalized.replace(/-/g, '+-').split('+').filter(Boolean)

    let a = 0 // coefficient of x
    let b = 0 // constant term

    for (const term of terms) {
      if (term.includes('x') || term.includes('X')) {
        const m = term.split('*').filter(Boolean)
        if (m.length === 1) {
          // 'x' or '-x'
          const coeff = term.startsWith('-') ? -1 : 1
          a += coeff
        } else {
          // like k * x or -k * x
          const k = Number(m[0])
          if (Number.isNaN(k)) throw new Error('Invalid coefficient in term: ' + term)
          a += k
        }
      } else {
        const k = Number(term)
        if (Number.isNaN(k)) throw new Error('Invalid number in term: ' + term)
        b += k
      }
    }

    return { a, b }
  }

  function solveLinearInequality(left, op, right) {
    // Solve a1*x + b1 [op] a2*x + b2  => (a1-a2) x [op] (b2-b1)
    const L = parseLinear(left)
    const R = parseLinear(right)
    const A = L.a - R.a
    const B = R.b - L.b

    if (op === '≤') op = '<='
    if (op === '≥') op = '>='

    if (A === 0) {
      // 0*x [op] B  => either all real numbers or none
      switch (op) {
        case '<': return B > 0 ? 'All real numbers' : (B <= 0 ? 'No solution' : 'No solution')
        case '<=': return B >= 0 ? 'All real numbers' : 'No solution'
        case '>': return B < 0 ? 'All real numbers' : (B >= 0 ? 'No solution' : 'No solution')
        case '>=': return B <= 0 ? 'All real numbers' : 'No solution'
        case '==': return B === 0 ? 'All real numbers' : 'No solution'
        case '!=': return B !== 0 ? 'All real numbers' : 'No solution'
        default: throw new Error('Unsupported operator')
      }
    }

    // A*x [op] B  -> divide by A; reverse inequality if A < 0
    let finalOp = op
    if (A < 0) {
      if (op === '<') finalOp = '>'
      else if (op === '<=') finalOp = '>='
      else if (op === '>') finalOp = '<'
      else if (op === '>=') finalOp = '<='
    }

    const value = B / A
    const rhs = Number.isInteger(value) ? value : Number(value.toFixed(6))
    return `x ${finalOp} ${rhs}`
  }

  function onSolve(e) {
    e.preventDefault()
    setError('')
    try {
      const res = solveLinearInequality(leftExpr, operator, rightExpr)
      setSolution(res)
    } catch (err) {
      setSolution('')
      setError(err.message || '解析失敗，請檢查輸入')
    }
  }

  return (
    <div className="container">
      <h1 className="neon-text">不等式計算器</h1>
      <p className="muted">支援一次不等式：a·x + b [&lt;, &lt;=, &gt;, &gt;=] c·x + d</p>
      <form className="card" onSubmit={onSolve} style={{ display: 'grid', gap: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px' }}>
          <input value={leftExpr} onChange={e => setLeftExpr(e.target.value)} placeholder="左側表達式，如 2*x + 5" className="input" />
          <select value={operator} onChange={e => setOperator(e.target.value)} className="input">
            <option value="<">{'<'}</option>
            <option value="<=">{'<='}</option>
            <option value=">">{'>'}</option>
            <option value=">=">{'>='}</option>
          </select>
          <input value={rightExpr} onChange={e => setRightExpr(e.target.value)} placeholder="右側表達式，如 13" className="input" />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" className="btn primary">計算</button>
          <button type="button" className="btn" onClick={() => { setLeftExpr('2*x + 5'); setOperator('<'); setRightExpr('13'); setSolution(''); setError('') }}>重置</button>
        </div>
      </form>
      {solution && (
        <div className="card" style={{ marginTop: 12 }}>
          <strong>解集：</strong> {solution}
        </div>
      )}
      {error && (
        <div className="card" style={{ marginTop: 12, borderColor: '#ff4d4f' }}>
          <strong>錯誤：</strong> {error}
        </div>
      )}
    </div>
  )
}


