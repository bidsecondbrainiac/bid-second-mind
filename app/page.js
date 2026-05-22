'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

// ── Knowledge Graph Data ────────────────────────────────────
const GRAPH = {
  nodes: [
    { id: 'hcd', label: 'Human-Centred\nDesign', group: 'core', description: 'Designing solutions by deeply understanding the people who will use them. Everything starts and ends with real humans.' },
    { id: 'bi', label: 'Behavioural\nInsights', group: 'core', description: 'Using evidence about how people actually think and behave to design better policies, products, and services.' },
    { id: 'systems', label: 'Systems\nThinking', group: 'core', description: 'Seeing the big picture — understanding how different parts of a system connect and influence each other.' },
    { id: 'define', label: 'Define', group: 'process', description: 'Identify the target behaviour, target population, and why the problem matters. Write a clear problem statement with measurable outcomes.' },
    { id: 'discover', label: 'Discover', group: 'process', description: 'Map the user journey from awareness to action to repeated behaviour. Find friction points, touchpoints, decision moments.' },
    { id: 'diagnose', label: 'Diagnose', group: 'process', description: 'Work out WHY the behaviour is or isn\'t happening. Map barriers and enablers to Capability, Opportunity, Motivation.' },
    { id: 'design', label: 'Design', group: 'process', description: 'Generate, prioritise, and prototype interventions grounded in behavioural evidence.' },
    { id: 'test', label: 'Test', group: 'process', description: 'Evaluate whether your solution actually works through trials, experiments, pilots, and process evaluations.' },
    { id: 'problem_scoping', label: 'Problem\nScoping', group: 'method', description: 'Defining exactly what problem you\'re trying to solve — narrow enough to act on, broad enough to matter.' },
    { id: 'interviews', label: 'Qualitative\nInterviews', group: 'method', description: 'One-on-one conversations to understand people\'s experiences, motivations, and mental models in depth.' },
    { id: 'surveys', label: 'Surveys', group: 'method', description: 'Structured questionnaires to gather data from many people at once — measuring attitudes, knowledge, and self-reported behaviour.' },
    { id: 'ethnography', label: 'Ethnography &\nObservation', group: 'method', description: 'Watching how people actually behave in real settings, not just what they say they do.' },
    { id: 'rct', label: 'Randomised\nControlled Trials', group: 'method', description: 'The gold standard for testing: randomly assign people to treatment or control and compare outcomes.' },
    { id: 'ab_testing', label: 'A/B Testing', group: 'method', description: 'Showing two versions of something to different groups and measuring which performs better.' },
    { id: 'prototyping', label: 'Prototyping', group: 'method', description: 'Building quick, rough versions of your solution to test assumptions before investing heavily.' },
    { id: 'journey_map', label: 'Journey\nMapping', group: 'method', description: 'Mapping every step a user takes from awareness to action. Ask: how many steps? What can we remove?' },
    { id: 'nudge', label: 'Nudge\nDesign', group: 'tool', description: 'Designing subtle changes to the choice environment that steer behaviour without restricting options.' },
    { id: 'comb', label: 'COM-B\nFramework', group: 'tool', description: 'Capability, Opportunity, Motivation → Behaviour. A framework for diagnosing what drives or blocks a behaviour.' },
    { id: 'east', label: 'EAST\nFramework', group: 'tool', description: 'Make it Easy, Attractive, Social, and Timely. Four principles for designing behavioural interventions.' },
    { id: 'bcw', label: 'Behaviour\nChange Wheel', group: 'tool', description: '9 intervention functions × 7 policy categories built on COM-B. Use to systematically choose what TYPE of intervention to design.' },
    { id: 'mindspace', label: 'MINDSPACE', group: 'tool', description: 'Messenger, Incentives, Norms, Defaults, Salience, Priming, Affect, Commitments, Ego — nine forces shaping behaviour.' },
    { id: 'choice_arch', label: 'Choice\nArchitecture', group: 'tool', description: 'How you present options matters. The structure of a decision environment shapes what people choose.' },
    { id: 'cognitive_bias', label: 'Cognitive\nBiases', group: 'tool', description: 'Systematic patterns in how people think — anchoring, framing, status quo bias, loss aversion, and more.' },
    { id: 'stakeholder_map', label: 'Stakeholder\nMapping', group: 'method', description: 'Identifying who is involved, affected, or influential in a system — and understanding their interests and power.' },
    { id: 'causal_loops', label: 'Causal Loop\nDiagrams', group: 'method', description: 'Visual maps showing how variables in a system reinforce or balance each other — revealing feedback loops.' },
    { id: 'eval_methods', label: 'Evaluation\nMethods', group: 'method', description: 'Pre-post analysis, difference-in-differences, propensity score matching, process evaluation, and more.' },
    { id: 'sample_size', label: 'Sample Size\n& Power', group: 'tool', description: 'Calculating how many people you need in a trial to detect a meaningful effect.' },
    { id: 'anti_east', label: 'Anti-EAST', group: 'tool', description: 'Flip EAST: make the undesired behaviour harder, less attractive, less social, and poorly timed. A friction-adding tool.' },
    { id: 'sludge', label: 'Friction &\nSludge', group: 'tool', description: 'Small barriers that stop people from acting. Sludge audits map and remove unnecessary friction from services.' },
    { id: 'dual_process', label: 'System 1\n& System 2', group: 'tool', description: 'Fast automatic thinking (System 1) vs slow deliberate thinking (System 2). Most daily behaviour is driven by System 1.' },
  ],
  links: [
    { source: 'hcd', target: 'define' }, { source: 'hcd', target: 'discover' }, { source: 'hcd', target: 'design' },
    { source: 'hcd', target: 'journey_map' }, { source: 'hcd', target: 'prototyping' },
    { source: 'bi', target: 'nudge' }, { source: 'bi', target: 'comb' }, { source: 'bi', target: 'east' },
    { source: 'bi', target: 'bcw' }, { source: 'bi', target: 'mindspace' }, { source: 'bi', target: 'cognitive_bias' },
    { source: 'bi', target: 'choice_arch' }, { source: 'bi', target: 'dual_process' },
    { source: 'systems', target: 'causal_loops' }, { source: 'systems', target: 'stakeholder_map' },
    { source: 'systems', target: 'problem_scoping' },
    { source: 'define', target: 'problem_scoping' }, { source: 'define', target: 'stakeholder_map' },
    { source: 'discover', target: 'interviews' }, { source: 'discover', target: 'surveys' },
    { source: 'discover', target: 'ethnography' }, { source: 'discover', target: 'journey_map' },
    { source: 'diagnose', target: 'comb' }, { source: 'diagnose', target: 'cognitive_bias' },
    { source: 'diagnose', target: 'causal_loops' }, { source: 'diagnose', target: 'dual_process' },
    { source: 'design', target: 'prototyping' }, { source: 'design', target: 'nudge' },
    { source: 'design', target: 'choice_arch' }, { source: 'design', target: 'east' },
    { source: 'design', target: 'anti_east' }, { source: 'design', target: 'bcw' },
    { source: 'test', target: 'rct' }, { source: 'test', target: 'ab_testing' },
    { source: 'test', target: 'sample_size' }, { source: 'test', target: 'eval_methods' },
    { source: 'define', target: 'discover' }, { source: 'discover', target: 'diagnose' },
    { source: 'diagnose', target: 'design' }, { source: 'design', target: 'test' },
    { source: 'comb', target: 'bcw' }, { source: 'comb', target: 'nudge' },
    { source: 'east', target: 'nudge' }, { source: 'east', target: 'anti_east' },
    { source: 'east', target: 'sludge' }, { source: 'nudge', target: 'sludge' },
    { source: 'rct', target: 'sample_size' }, { source: 'rct', target: 'eval_methods' },
    { source: 'problem_scoping', target: 'diagnose' },
  ],
}

const COLORS = {
  core:    { bg: '#FF6B35', border: '#E85D2A', text: '#fff' },
  process: { bg: '#2EC4B6', border: '#25A99D', text: '#fff' },
  method:  { bg: '#7B68EE', border: '#6A5ACD', text: '#fff' },
  tool:    { bg: '#E84393', border: '#D63384', text: '#fff' },
}

const LABELS = { core: 'Core Pillar', process: 'Process Phase', method: 'Method', tool: 'Framework / Tool' }

const QUICK_PROMPTS = [
  'How do I scope a new problem?',
  'Explain COM-B vs EAST',
  "What's our 5D process?",
  'How do we run an RCT?',
  'What is anti-EAST?',
  'How does systems thinking help?',
]

// ── Main App ────────────────────────────────────────────────
export default function Home() {
  const [tab, setTab] = useState('graph')
  const [selectedNode, setSelectedNode] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [graphFilter, setGraphFilter] = useState('all')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Welcome to the BID Second Brain! I can answer questions using our team's knowledge base on behavioural insights, design thinking, systems thinking, research methods, and evaluation.\n\nTry asking me anything, or tap a suggestion below." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const svgRef = useRef(null)
  const chatEndRef = useRef(null)

  // ── Chat ──────────────────────────────────────────────────
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSend = useCallback(async (text) => {
    const content = text || input.trim()
    if (!content || loading) return
    const userMsg = { role: 'user', content }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].slice(-10) }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    }
    setLoading(false)
  }, [input, loading, messages])

  const askAboutNode = (node) => {
    const q = 'Tell me about ' + node.label.replace(/\n/g, ' ') + ' and how it connects to other concepts in our knowledge base.'
    setTab('chat')
    setTimeout(() => { handleSend(q) }, 100)
  }

  // ── Graph ─────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    if (graphFilter === 'all') return GRAPH
    const ids = new Set(GRAPH.nodes.filter(n => n.group === graphFilter).map(n => n.id))
    GRAPH.nodes.forEach(n => {
      if (ids.has(n.id)) return
      const hasLink = GRAPH.links.some(l =>
        (ids.has(l.source?.id || l.source) && (l.target?.id || l.target) === n.id) ||
        (ids.has(l.target?.id || l.target) && (l.source?.id || l.source) === n.id)
      )
      if (hasLink) ids.add(n.id)
    })
    return {
      nodes: GRAPH.nodes.filter(n => ids.has(n.id)),
      links: GRAPH.links.filter(l => ids.has(l.source?.id || l.source) && ids.has(l.target?.id || l.target)),
    }
  }, [graphFilter])

  useEffect(() => {
    if (!svgRef.current || tab !== 'graph') return
    let d3
    import('d3').then(mod => {
      d3 = mod
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove()
      const rect = svgRef.current.getBoundingClientRect()
      const W = rect.width || 800, H = rect.height || 500

      const defs = svg.append('defs')
      defs.append('marker').attr('id', 'arrow').attr('viewBox', '0 -5 10 10')
        .attr('refX', 28).attr('refY', 0).attr('markerWidth', 5).attr('markerHeight', 5)
        .attr('orient', 'auto').append('path').attr('d', 'M0,-4L8,0L0,4').attr('fill', '#555')

      const g = svg.append('g')
      svg.call(d3.zoom().scaleExtent([0.25, 3]).on('zoom', e => g.attr('transform', e.transform)))

      const nodes = filteredData.nodes.map(d => ({ ...d }))
      const links = filteredData.links.map(d => ({ ...d }))

      const sim = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(110).strength(0.35))
        .force('charge', d3.forceManyBody().strength(-350))
        .force('center', d3.forceCenter(W / 2, H / 2))
        .force('collision', d3.forceCollide().radius(45))
        .force('x', d3.forceX(W / 2).strength(0.04))
        .force('y', d3.forceY(H / 2).strength(0.04))

      const link = g.append('g').selectAll('line').data(links).join('line')
        .attr('stroke', '#444').attr('stroke-width', 1.2).attr('stroke-opacity', 0.35)
        .attr('marker-end', 'url(#arrow)')

      const ng = g.append('g').selectAll('g').data(nodes).join('g').attr('cursor', 'pointer')

      ng.append('circle')
        .attr('r', d => d.group === 'core' ? 30 : 22)
        .attr('fill', d => COLORS[d.group].bg)
        .attr('stroke', d => COLORS[d.group].border)
        .attr('stroke-width', 2.5).attr('opacity', 0.9)

      ng.append('text').attr('text-anchor', 'middle').attr('fill', '#fff')
        .attr('font-size', d => d.group === 'core' ? '7.5px' : '6.5px')
        .attr('font-weight', 600).attr('pointer-events', 'none')
        .attr('font-family', "'DM Sans', system-ui, sans-serif")
        .each(function (d) {
          const lines = d.label.split('\n')
          const el = d3.select(this)
          lines.forEach((line, i) => {
            el.append('tspan').attr('x', 0)
              .attr('dy', i === 0 ? (-(lines.length - 1) * 0.5) + 'em' : '1.1em')
              .text(line)
          })
        })

      ng.on('mouseover', function (_, d) {
        setHoveredNode(d)
        d3.select(this).select('circle').transition().duration(150)
          .attr('r', d.group === 'core' ? 36 : 28).attr('opacity', 1)
        link.attr('stroke-opacity', l => (l.source.id === d.id || l.target.id === d.id) ? 0.85 : 0.08)
          .attr('stroke', l => (l.source.id === d.id || l.target.id === d.id) ? COLORS[d.group].bg : '#444')
          .attr('stroke-width', l => (l.source.id === d.id || l.target.id === d.id) ? 2.5 : 1)
        ng.select('circle').attr('opacity', n =>
          n.id === d.id || links.some(l =>
            (l.source.id === d.id && l.target.id === n.id) || (l.target.id === d.id && l.source.id === n.id)
          ) ? 1 : 0.15)
      }).on('mouseout', function () {
        setHoveredNode(null)
        ng.select('circle').transition().duration(150)
          .attr('r', d => d.group === 'core' ? 30 : 22).attr('opacity', 0.9)
        link.attr('stroke-opacity', 0.35).attr('stroke', '#444').attr('stroke-width', 1.2)
      }).on('click', (_, d) => setSelectedNode(d))

      ng.call(d3.drag()
        .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
        .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y })
        .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null }))

      sim.on('tick', () => {
        link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
        ng.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
      })
      return () => sim.stop()
    })
  }, [filteredData, tab])

  // ── Styles ────────────────────────────────────────────────
  const font = "'DM Sans', system-ui, sans-serif"
  const serif = "'DM Serif Display', serif"

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0D0F11', color: '#E8E6E1', fontFamily: font, overflow: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{ padding: '12px 20px', borderBottom: '1px solid #1E2228', background: 'linear-gradient(180deg,#12151A,#0D0F11)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#FF6B35,#E84393)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700 }}>⚡</div>
          <div>
            <div style={{ fontFamily: serif, fontSize: 17, color: '#F5F3EE', letterSpacing: '-0.02em' }}>Second Brain</div>
            <div style={{ fontSize: 10, color: '#6B7280', marginTop: 1 }}>Behavioural Insights & Design Thinking</div>
          </div>
        </div>
        <div style={{ display: 'flex', background: '#1A1D23', borderRadius: 9, padding: 3, gap: 2 }}>
          {[{ key: 'graph', icon: '◉', label: 'Knowledge Graph' }, { key: 'chat', icon: '◈', label: 'Ask the Brain' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '7px 16px', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: tab === t.key ? 'linear-gradient(135deg,#FF6B35,#E84393)' : 'transparent',
              color: tab === t.key ? '#fff' : '#6B7280', fontSize: 11, fontWeight: 600, fontFamily: font,
              display: 'flex', alignItems: 'center', gap: 5, transition: 'all .2s',
            }}><span style={{ fontSize: 13 }}>{t.icon}</span>{t.label}</button>
          ))}
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* ═══ GRAPH TAB ═══ */}
        {tab === 'graph' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Filter bar */}
            <div style={{ padding: '8px 18px', display: 'flex', gap: 6, alignItems: 'center', borderBottom: '1px solid #1E2228', flexShrink: 0, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, color: '#6B7280', marginRight: 2 }}>Filter:</span>
              {[{ key: 'all', label: 'All' }, { key: 'core', label: 'Pillars' }, { key: 'process', label: 'Process' }, { key: 'method', label: 'Methods' }, { key: 'tool', label: 'Frameworks' }].map(f => (
                <button key={f.key} onClick={() => setGraphFilter(f.key)} style={{
                  padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 500, cursor: 'pointer', fontFamily: font,
                  border: '1px solid ' + (graphFilter === f.key ? (COLORS[f.key]?.border || '#555') : '#2A2D35'),
                  background: graphFilter === f.key ? (COLORS[f.key]?.bg + '22' || '#2A2D35') : 'transparent',
                  color: graphFilter === f.key ? '#F5F3EE' : '#6B7280', transition: 'all .2s',
                }}>
                  {f.key !== 'all' && <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: COLORS[f.key]?.bg, marginRight: 5, verticalAlign: 'middle' }} />}
                  {f.label}
                </button>
              ))}
            </div>

            {/* SVG canvas */}
            <div style={{ flex: 1, position: 'relative' }}>
              <svg ref={svgRef} width="100%" height="100%" style={{ display: 'block' }} />

              {/* Legend */}
              <div style={{ position: 'absolute', bottom: 14, left: 14, background: '#12151Acc', backdropFilter: 'blur(8px)', borderRadius: 9, padding: '8px 12px', border: '1px solid #1E2228', fontSize: 9 }}>
                {Object.entries(LABELS).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: COLORS[k].bg, flexShrink: 0 }} />
                    <span style={{ color: '#9CA3AF' }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 5, color: '#555', fontSize: 8 }}>Scroll to zoom · Drag to pan · Click a node</div>
              </div>

              {/* Hover tooltip */}
              {hoveredNode && (
                <div style={{ position: 'absolute', top: 14, right: 14, width: 240, background: '#12151Ae6', backdropFilter: 'blur(12px)', borderRadius: 11, padding: 14, border: '1px solid #1E2228' }}>
                  <div style={{ fontSize: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: COLORS[hoveredNode.group].bg, marginBottom: 5 }}>{LABELS[hoveredNode.group]}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F3EE', marginBottom: 7, fontFamily: serif }}>{hoveredNode.label.replace(/\n/g, ' ')}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.5 }}>{hoveredNode.description}</div>
                </div>
              )}
            </div>

            {/* Detail panel */}
            {selectedNode && (
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 320, background: '#12151Af0', backdropFilter: 'blur(16px)', borderLeft: '1px solid #1E2228', padding: 22, display: 'flex', flexDirection: 'column', zIndex: 10, animation: 'slideIn .2s ease' }}>
                <style>{'@keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}'}</style>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                  <div style={{ padding: '3px 9px', borderRadius: 5, fontSize: 9, fontWeight: 600, background: COLORS[selectedNode.group].bg + '22', color: COLORS[selectedNode.group].bg, border: '1px solid ' + COLORS[selectedNode.group].bg + '44', textTransform: 'uppercase', letterSpacing: '.06em' }}>{LABELS[selectedNode.group]}</div>
                  <button onClick={() => setSelectedNode(null)} style={{ background: '#2A2D35', border: 'none', color: '#9CA3AF', width: 26, height: 26, borderRadius: 6, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>
                <div style={{ fontFamily: serif, fontSize: 20, color: '#F5F3EE', marginBottom: 10, lineHeight: 1.2 }}>{selectedNode.label.replace(/\n/g, ' ')}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.6, marginBottom: 20 }}>{selectedNode.description}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Connected To</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 20, overflowY: 'auto', flex: 1 }}>
                  {GRAPH.links
                    .filter(l => (l.source?.id || l.source) === selectedNode.id || (l.target?.id || l.target) === selectedNode.id)
                    .map(l => { const oid = (l.source?.id || l.source) === selectedNode.id ? (l.target?.id || l.target) : (l.source?.id || l.source); return GRAPH.nodes.find(n => n.id === oid) })
                    .filter(Boolean)
                    .map(n => (
                      <button key={n.id} onClick={() => setSelectedNode(n)} style={{
                        padding: '3px 9px', borderRadius: 5, fontSize: 10, fontWeight: 500,
                        background: COLORS[n.group].bg + '18', color: COLORS[n.group].bg,
                        border: '1px solid ' + COLORS[n.group].bg + '33', cursor: 'pointer', fontFamily: font,
                      }}>{n.label.replace(/\n/g, ' ')}</button>
                    ))}
                </div>
                <button onClick={() => askAboutNode(selectedNode)} style={{
                  padding: '11px 18px', borderRadius: 9, background: 'linear-gradient(135deg,#FF6B35,#E84393)',
                  border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: font,
                }}>◈ Ask the Brain about this</button>
              </div>
            )}
          </div>
        )}

        {/* ═══ CHAT TAB ═══ */}
        {tab === 'chat' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '78%', padding: '13px 17px', borderRadius: 13,
                    background: msg.role === 'user' ? 'linear-gradient(135deg,#FF6B35,#E84393)' : '#1A1D23',
                    color: msg.role === 'user' ? '#fff' : '#D1D5DB', fontSize: 13, lineHeight: 1.65, whiteSpace: 'pre-wrap',
                    borderBottomRightRadius: msg.role === 'user' ? 4 : 13,
                    borderBottomLeftRadius: msg.role === 'user' ? 13 : 4,
                  }}>
                    {msg.role === 'assistant' && <div style={{ fontSize: 8, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 7 }}>Second Brain</div>}
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '13px 17px', borderRadius: 13, borderBottomLeftRadius: 4, background: '#1A1D23', color: '#6B7280', fontSize: 13 }}>
                    <span style={{ animation: 'pulse 1.5s infinite' }}>Thinking...</span>
                    <style>{'@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}'}</style>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick prompts */}
            {messages.length <= 1 && (
              <div style={{ padding: '6px 22px 2px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {QUICK_PROMPTS.map(q => (
                  <button key={q} onClick={() => handleSend(q)} style={{
                    padding: '6px 12px', borderRadius: 8, fontSize: 11, background: '#1A1D23',
                    border: '1px solid #2A2D35', color: '#9CA3AF', cursor: 'pointer', fontFamily: font, transition: 'all .15s',
                  }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = '#FF6B35'; e.currentTarget.style.color = '#F5F3EE' }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = '#2A2D35'; e.currentTarget.style.color = '#9CA3AF' }}
                  >{q}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding: '10px 22px 14px', borderTop: '1px solid #1E2228', display: 'flex', gap: 9, alignItems: 'flex-end' }}>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                placeholder="Ask anything about our methods, frameworks, or processes..."
                rows={1}
                style={{ flex: 1, padding: '11px 15px', borderRadius: 11, background: '#1A1D23', border: '1px solid #2A2D35', color: '#E8E6E1', fontSize: 13, fontFamily: font, resize: 'none', outline: 'none', lineHeight: 1.5 }}
                onFocus={e => e.target.style.borderColor = '#FF6B35'}
                onBlur={e => e.target.style.borderColor = '#2A2D35'}
              />
              <button onClick={() => handleSend()} disabled={loading || !input.trim()} style={{
                padding: '11px 18px', borderRadius: 11,
                background: input.trim() ? 'linear-gradient(135deg,#FF6B35,#E84393)' : '#2A2D35',
                border: 'none', color: input.trim() ? '#fff' : '#555',
                fontSize: 13, fontWeight: 600, cursor: input.trim() ? 'pointer' : 'default', fontFamily: font, flexShrink: 0,
              }}>Send ↗</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
