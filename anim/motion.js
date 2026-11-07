(function() {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function S(tag, attrs, children) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'textContent') el.textContent = v;
      else if (v !== undefined && v !== null) el.setAttribute(k, v);
    }
    if (children) {
      for (const c of children) {
        if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      }
    }
    return el;
  }

  const motifs = {
    timeline: (container) => {
      const svg = S('svg', { viewBox: '0 0 720 180' });
      const g = S('g', { transform: 'translate(10, 90)' });
      svg.appendChild(g);

      // Axis
      g.appendChild(S('line', { x1: 20, y1: 0, x2: 680, y2: 0, class: 'motif-rule', 'stroke-width': 2 }));

      // Regions
      g.appendChild(S('text', { x: 90, y: -65, class: 'motif-label', 'text-anchor': 'middle', fill: 'var(--muted)' }, ['~26h Prequel']));
      g.appendChild(S('text', { x: 420, y: -65, class: 'motif-label', 'text-anchor': 'middle', fill: 'var(--accent)' }, ['~24h Session']));
      
      const regionBracket = S('path', { d: 'M 180 -55 L 180 -60 L 660 -60 L 660 -55', fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1, opacity: 0.5 });
      g.appendChild(regionBracket);

      const nodes = [
        { x: 30, label: 'Nov 4\nPrequel', time: '21:00' },
        { x: 180, label: 'Nov 5\nSession Begins', time: '22:55', accent: true },
        { x: 300, label: 'Nov 6\n120B Tests', time: '14:00', accent: true },
        { x: 420, label: 'Audit &\nCorrections', time: '20:00', accent: true },
        { x: 540, label: 'Container Lab', time: '23:00', accent: true },
        { x: 660, label: 'Nov 7\n154 Rows', time: '00:10', accent: true }
      ];

      const elements = nodes.map((n, i) => {
        // Filled node for regular events; hollow for prequel
        const isSession = n.accent;
        const circle = S('circle', { cx: n.x, cy: 0, r: 6, fill: isSession ? 'var(--accent)' : 'var(--surface)', stroke: isSession ? 'var(--surface)' : 'var(--muted)', 'stroke-width': 2 });
        if (isSession) {
          // outer ring for the session nodes so they look like distinct events cutting the axis
          circle.setAttribute('r', 5);
          const outer = S('circle', { cx: n.x, cy: 0, r: 7, fill: 'none', stroke: 'var(--surface)', 'stroke-width': 3 });
          g.appendChild(outer);
        }

        const textG = S('g', { transform: `translate(${n.x}, ${i % 2 === 0 ? 25 : -40})` });
        textG.appendChild(S('text', { x: 0, y: 0, class: 'motif-label', 'text-anchor': 'middle', 'font-weight': 'bold', fill: n.accent ? 'var(--accent)' : 'var(--muted)' }, [n.time]));
        n.label.split('\n').forEach((l, li) => {
          textG.appendChild(S('text', { x: 0, y: 16 + li*16, class: 'motif-text', 'text-anchor': 'middle' }, [l]));
        });
        
        circle.style.opacity = '0';
        textG.style.opacity = '0';
        g.appendChild(circle);
        g.appendChild(textG);
        
        return { circle, textG };
      });

      container.appendChild(svg);

      return {
        play: () => {
          elements.forEach((e, i) => {
            if (prefersReduced) {
              e.circle.style.opacity = '1';
              e.textG.style.opacity = '1';
            } else {
              setTimeout(() => {
                e.circle.style.transition = 'opacity 0.4s, fill 0.4s';
                e.textG.style.transition = 'opacity 0.4s, transform 0.4s';
                e.circle.style.opacity = '1';
                e.textG.style.opacity = '1';
              }, i * 300);
            }
          });
        },
        reset: () => {
          elements.forEach(e => {
            e.circle.style.opacity = '0';
            e.textG.style.opacity = '0';
          });
        }
      };
    },

    pipeline: (container) => {
      const svg = S('svg', { viewBox: '0 0 720 160' });
      
      const defs = S('defs');
      const marker = S('marker', { id: 'pipe-arrow', viewBox: '0 0 10 10', refX: '8', refY: '5', markerWidth: '6', markerHeight: '6', orient: 'auto' }, [
        S('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: 'var(--muted)' })
      ]);
      defs.appendChild(marker);
      svg.appendChild(defs);

      const boxes = [
        { x: 10, y: 70, w: 90, h: 60, title: 'Tasks', lines: ['14 Tasks', '× 11 Models'] },
        { x: 140, y: 70, w: 100, h: 60, title: 'LM Studio', lines: ['154 Runs'] },
        { x: 280, y: 70, w: 110, h: 60, title: 'LLM Judge', lines: ['OpenRouter', 'Sub-scores'] },
        { x: 430, y: 70, w: 90, h: 60, title: 'Code', lines: ['Combine', 'scores'] },
        { x: 560, y: 70, w: 110, h: 60, title: 'Report', lines: ['154 Judged', 'Rows'], accent: true }
      ];

      boxes.forEach(b => {
        svg.appendChild(S('rect', { x: b.x, y: b.y, width: b.w, height: b.h, rx: 6, fill: 'var(--surface)', stroke: b.accent ? 'var(--accent)' : 'var(--rule)', 'stroke-width': 2 }));
        svg.appendChild(S('text', { x: b.x + b.w/2, y: b.y - 10, class: 'motif-label', 'text-anchor': 'middle' }, [b.title]));
        b.lines.forEach((l, i) => {
          svg.appendChild(S('text', { x: b.x + b.w/2, y: b.y + 26 + i*18, class: 'motif-text', 'text-anchor': 'middle', 'font-size': '13px' }, [l]));
        });
      });

      const paths = [];
      for(let i=0; i<boxes.length - 1; i++) {
        const line = S('line', {
          x1: boxes[i].x + boxes[i].w, y1: 100,
          x2: boxes[i+1].x, y2: 100,
          stroke: 'var(--muted)', 'stroke-width': 2, 'marker-end': 'url(#pipe-arrow)'
        });
        svg.appendChild(line);
        paths.push({ x1: boxes[i].x + boxes[i].w, x2: boxes[i+1].x - 10 });
      }

      const particleGroup = S('g');
      svg.appendChild(particleGroup);

      const countText = S('text', { x: boxes[4].x + boxes[4].w/2, y: boxes[4].y - 30, class: 'motif-label', 'text-anchor': 'middle', fill: 'var(--accent)', opacity: 0 });
      svg.appendChild(countText);

      container.appendChild(svg);

      let animFrame;
      let running = false;
      let particles = [];
      let totalCount = 0;

      return {
        play: () => {
          if (prefersReduced) {
            countText.textContent = 'Processed 154 rows';
            countText.style.opacity = 1;
            return;
          }
          if (running) return;
          running = true;
          totalCount = 0;
          countText.style.opacity = 1;
          
          let lastSpawn = 0;
          const loop = (t) => {
            if (!running) return;
            if (t - lastSpawn > 150 && totalCount < 154) {
              lastSpawn = t;
              const p = S('circle', { cx: paths[0].x1, cy: 100 + (Math.random()*10 - 5), r: 3, fill: 'var(--accent)' });
              particleGroup.appendChild(p);
              particles.push({ el: p, stage: 0, x: paths[0].x1 });
            }

            for(let i = particles.length - 1; i >= 0; i--) {
              const p = particles[i];
              p.x += 3;
              if (p.x >= paths[p.stage].x2) {
                p.stage++;
                if (p.stage >= paths.length) {
                  p.el.remove();
                  particles.splice(i, 1);
                  totalCount++;
                  countText.textContent = `Processing: ${Math.min(154, totalCount * 4)}`;
                } else {
                  p.x = paths[p.stage].x1;
                }
              }
              if (p.el.parentNode) {
                p.el.setAttribute('cx', p.x);
              }
            }
            
            if (totalCount >= 38) {
              countText.textContent = 'Processed 154 rows';
              running = false;
            } else {
              animFrame = requestAnimationFrame(loop);
            }
          };
          animFrame = requestAnimationFrame(loop);
        },
        reset: () => {
          running = false;
          cancelAnimationFrame(animFrame);
          particles.forEach(p => p.el.remove());
          particles = [];
          countText.style.opacity = 0;
          countText.textContent = '';
        }
      };
    },

    calibration: (container) => {
      const svg = S('svg', { viewBox: '0 0 720 260' });
      
      const g = S('g', { transform: 'translate(140, 130)' });
      svg.appendChild(g);

      // Axes
      g.appendChild(S('line', { x1: 0, y1: -100, x2: 0, y2: 100, class: 'motif-rule', 'stroke-width': 2 }));
      g.appendChild(S('line', { x1: -5, y1: -80, x2: 5, y2: -80, class: 'motif-rule', 'stroke-width': 2 })); // 1.0
      g.appendChild(S('line', { x1: -5, y1: 80, x2: 5, y2: 80, class: 'motif-rule', 'stroke-width': 2 })); // -1.0
      
      g.appendChild(S('text', { x: -10, y: -75, class: 'motif-label', 'text-anchor': 'end' }, ['+1.0']));
      g.appendChild(S('text', { x: -10, y: 85, class: 'motif-label', 'text-anchor': 'end' }, ['-1.0']));
      g.appendChild(S('text', { x: -10, y: -110, class: 'motif-text', 'text-anchor': 'end', fill: 'var(--muted)' }, ['Δ Capability']));

      // Zero line
      g.appendChild(S('line', { x1: -10, y1: 0, x2: 500, y2: 0, class: 'motif-rule', 'stroke-width': 2, 'stroke-dasharray': '5 5' }));
      g.appendChild(S('text', { x: -10, y: 4, class: 'motif-label', 'text-anchor': 'end', fill: 'var(--muted)' }, ['0 (No diff)']));

      // Coordinates (scale: 1.0 = 80px)
      const y1 = -49.6; // 0.62 * 80
      const y2 = -9.6;  // 0.12 * 80
      const barTop = -66.4; // 0.83 * 80
      const barBot = 46.4;  // -0.58 * 80

      const step1 = S('g');
      const step2 = S('g', { opacity: 0 });
      
      // Step 1: N=1
      step1.appendChild(S('circle', { cx: 120, cy: y1, r: 6, fill: 'var(--accent)' }));
      step1.appendChild(S('text', { x: 120, y: y1 - 15, class: 'motif-text', 'text-anchor': 'middle', fill: 'var(--ink)' }, ['+0.62']));
      step1.appendChild(S('text', { x: 120, y: y1 - 32, class: 'motif-label', 'text-anchor': 'middle' }, ['Single sample (N=1)']));

      // Arrow
      const arrow = S('path', { d: `M 130 ${y1} L 330 ${y2}`, stroke: 'var(--muted)', 'stroke-width': 2, 'stroke-dasharray': '4 4', fill: 'none', opacity: 0 });
      g.appendChild(arrow);

      // Step 2: N=3 + CI
      const errorBar = S('line', { x1: 340, y1: y2, x2: 340, y2: y2, stroke: 'var(--accent)', 'stroke-width': 4, opacity: 0 });
      step2.appendChild(errorBar);
      
      // Caps
      const capTop = S('line', { x1: 330, y1: barTop, x2: 350, y2: barTop, stroke: 'var(--accent)', 'stroke-width': 2, opacity: 0 });
      const capBot = S('line', { x1: 330, y1: barBot, x2: 350, y2: barBot, stroke: 'var(--accent)', 'stroke-width': 2, opacity: 0 });
      step2.appendChild(capTop);
      step2.appendChild(capBot);

      const p2 = S('circle', { cx: 340, cy: y2, r: 6, fill: 'var(--accent)' });
      step2.appendChild(p2);
      
      step2.appendChild(S('text', { x: 360, y: y2 - 5, class: 'motif-text', fill: 'var(--ink)' }, ['+0.12 (N=3)']));
      
      const ciText = S('text', { x: 360, y: y2 + 15, class: 'motif-text', fill: '#d32f2f', 'font-weight': 'bold', opacity: 0 }, ['95% CI [-0.58, +0.83]']);
      step2.appendChild(ciText);
      const ciNote = S('text', { x: 360, y: y2 + 35, class: 'motif-label', fill: '#d32f2f', opacity: 0 }, ['Crosses zero: ranking retracted']);
      step2.appendChild(ciNote);

      const zeroHighlight = S('circle', { cx: 340, cy: 0, r: 8, fill: 'none', stroke: '#d32f2f', 'stroke-width': 2, opacity: 0 });
      step2.appendChild(zeroHighlight);

      g.appendChild(step1);
      g.appendChild(step2);
      container.appendChild(svg);

      return {
        play: () => {
          if (prefersReduced) {
            arrow.style.opacity = 1;
            step2.style.opacity = 1;
            errorBar.setAttribute('y1', barTop);
            errorBar.setAttribute('y2', barBot);
            errorBar.style.opacity = 1;
            capTop.style.opacity = 1; capBot.style.opacity = 1;
            ciText.style.opacity = 1; ciNote.style.opacity = 1; zeroHighlight.style.opacity = 1;
            return;
          }
          setTimeout(() => {
            arrow.style.transition = 'opacity 0.4s';
            arrow.style.opacity = 1;
            
            setTimeout(() => {
              step2.style.transition = 'opacity 0.3s';
              step2.style.opacity = 1;
              errorBar.style.opacity = 1;
              
              setTimeout(() => {
                errorBar.style.transition = 'y1 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), y2 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
                errorBar.setAttribute('y1', barTop);
                errorBar.setAttribute('y2', barBot);
                capTop.style.transition = 'opacity 0.2s 0.6s'; capTop.style.opacity = 1;
                capBot.style.transition = 'opacity 0.2s 0.6s'; capBot.style.opacity = 1;
                
                setTimeout(() => {
                  ciText.style.transition = 'opacity 0.4s'; ciText.style.opacity = 1;
                  ciNote.style.transition = 'opacity 0.4s'; ciNote.style.opacity = 1;
                  zeroHighlight.style.transition = 'opacity 0.4s, r 0.4s'; zeroHighlight.style.opacity = 1;
                  zeroHighlight.setAttribute('r', 12);
                }, 700);
              }, 300);
            }, 400);
          }, 500);
        },
        reset: () => {
          arrow.style.opacity = 0;
          step2.style.opacity = 0;
          errorBar.setAttribute('y1', y2);
          errorBar.setAttribute('y2', y2);
          errorBar.style.opacity = 0;
          capTop.style.opacity = 0; capBot.style.opacity = 0;
          ciText.style.opacity = 0; ciNote.style.opacity = 0;
          zeroHighlight.style.opacity = 0; zeroHighlight.setAttribute('r', 8);
        }
      };
    },

    'willingness-skill': (container) => {
      const svg = S('svg', { viewBox: '0 0 720 300' });
      
      const g = S('g', { transform: 'translate(90, 250)' });
      svg.appendChild(g);

      // Axes
      g.appendChild(S('line', { x1: 0, y1: 0, x2: 580, y2: 0, class: 'motif-rule', 'stroke-width': 2 }));
      g.appendChild(S('line', { x1: 0, y1: 0, x2: 0, y2: -230, class: 'motif-rule', 'stroke-width': 2 }));
      g.appendChild(S('path', { d: 'M 570 -5 L 580 0 L 570 5', fill: 'var(--rule)' }));
      g.appendChild(S('path', { d: 'M -5 -220 L 0 -230 L 5 -220', fill: 'var(--rule)' }));

      g.appendChild(S('text', { x: 290, y: 40, class: 'motif-label', 'text-anchor': 'middle', 'font-weight': 'bold' }, ['Skill (Capability on shared tasks, 0–10)']));
      g.appendChild(S('text', { x: -40, y: -115, class: 'motif-label', 'text-anchor': 'middle', transform: 'rotate(-90, -40, -115)', 'font-weight': 'bold' }, ['Willingness (Tasks Answered, 0–14)']));

      // Ticks
      [0, 5, 10].forEach(v => {
        const x = (v/10)*550;
        g.appendChild(S('line', { x1: x, y1: 0, x2: x, y2: 5, class: 'motif-rule', 'stroke-width': 2 }));
        g.appendChild(S('text', { x: x, y: 20, class: 'motif-label', 'text-anchor': 'middle' }, [v.toString()]));
      });
      [0, 7, 14].forEach(v => {
        const y = -(v/14)*210;
        g.appendChild(S('line', { x1: -5, y1: y, x2: 0, y2: y, class: 'motif-rule', 'stroke-width': 2 }));
        g.appendChild(S('text', { x: -15, y: y+4, class: 'motif-label', 'text-anchor': 'end' }, [v.toString()]));
      });

      // Data points: Clean (6.62, 8), Uncensored (6.74, 14)
      const x1 = (6.62/10)*550;
      const y1 = -(8/14)*210;
      const x2 = (6.74/10)*550;
      const y2 = -(14/14)*210;

      const p1G = S('g', { opacity: 0 });
      p1G.appendChild(S('circle', { cx: x1, cy: y1, r: 8, fill: 'var(--surface)', stroke: 'var(--muted)', 'stroke-width': 3 }));
      p1G.appendChild(S('text', { x: x1 + 15, y: y1 + 5, class: 'motif-text', fill: 'var(--muted)' }, ['Clean Base']));
      p1G.appendChild(S('text', { x: x1 + 15, y: y1 + 22, class: 'motif-label', fill: 'var(--muted)' }, ['Answered: 8, Skill: 6.62']));

      const p2G = S('g', { opacity: 0 });
      p2G.appendChild(S('circle', { cx: x2, cy: y2, r: 8, fill: 'var(--accent)' }));
      p2G.appendChild(S('text', { x: x2 + 15, y: y2 + 5, class: 'motif-text', fill: 'var(--accent)', 'font-weight': 'bold' }, ['Uncensored 120B']));
      p2G.appendChild(S('text', { x: x2 + 15, y: y2 + 22, class: 'motif-label', fill: 'var(--accent)' }, ['Answered: 14, Skill: 6.74']));

      const bracket = S('g', { opacity: 0 });
      bracket.appendChild(S('line', { x1: x1, y1: y1, x2: x1, y2: y2, stroke: 'var(--rule)', 'stroke-dasharray': '4 4', 'stroke-width': 2 }));
      
      const vDelta = S('text', { x: x1 - 10, y: (y1+y2)/2 + 5, class: 'motif-text', 'text-anchor': 'end', fill: 'var(--accent)' }, ['+6 tasks']);
      const vLabel = S('text', { x: x1 - 10, y: (y1+y2)/2 + 20, class: 'motif-label', 'text-anchor': 'end', fill: 'var(--muted)' }, ['(Willingness gap)']);
      bracket.appendChild(vDelta);
      bracket.appendChild(vLabel);
      
      const hLabel = S('text', { x: x1 + 10, y: y2 + 45, class: 'motif-text', fill: 'var(--ink)' }, ['Skill gap is negligible']);
      const hSub = S('text', { x: x1 + 10, y: y2 + 60, class: 'motif-label', fill: 'var(--muted)' }, ['(Δ +0.12 is within noise)']);
      bracket.appendChild(hLabel);
      bracket.appendChild(hSub);

      g.appendChild(bracket);
      g.appendChild(p1G);
      g.appendChild(p2G);
      container.appendChild(svg);

      return {
        play: () => {
          if (prefersReduced) {
            p1G.style.opacity = 1; p2G.style.opacity = 1; bracket.style.opacity = 1;
            return;
          }
          setTimeout(() => { p1G.style.transition = 'opacity 0.4s'; p1G.style.opacity = 1; }, 200);
          setTimeout(() => { p2G.style.transition = 'opacity 0.4s'; p2G.style.opacity = 1; }, 800);
          setTimeout(() => { bracket.style.transition = 'opacity 0.5s'; bracket.style.opacity = 1; }, 1600);
        },
        reset: () => {
          p1G.style.opacity = 0; p2G.style.opacity = 0; bracket.style.opacity = 0;
        }
      };
    },

    'exploit-lab': (container) => {
      const svg = S('svg', { viewBox: '0 0 720 300' });
      
      svg.appendChild(S('text', { x: 20, y: 30, class: 'motif-label', 'font-weight': 'bold' }, ['10 Isolated Containers (Parallel Trials)']));
      svg.appendChild(S('text', { x: 450, y: 30, class: 'motif-label', 'font-weight': 'bold' }, ['Target / Verdict']));

      const containers = [];
      const tracks = [];
      const flags = [];
      const checks = [];

      for(let i=0; i<10; i++) {
        const y = 45 + i * 24;
        
        const cBox = S('rect', { x: 20, y: y, width: 20, height: 18, fill: 'var(--surface)', stroke: 'var(--accent)', rx: 3 });
        svg.appendChild(cBox);
        containers.push(cBox);
        
        svg.appendChild(S('line', { x1: 45, y1: y+9, x2: 430, y2: y+9, stroke: 'var(--rule)', 'stroke-width': 2, 'stroke-dasharray': '2 2' }));
        
        const prog = S('rect', { x: 45, y: y+7, width: 0, height: 4, fill: 'var(--accent)', rx: 2 });
        svg.appendChild(prog);
        tracks.push(prog);

        const flagText = `FLAG{${Math.random().toString(36).substring(2, 8)}}`;
        const f = S('text', { x: 450, y: y+13, class: 'motif-text', 'font-family': 'var(--mono, monospace)', 'font-size': '12px', fill: 'var(--ink)', opacity: 0 }, [flagText]);
        svg.appendChild(f);
        flags.push(f);
        
        const c = S('text', { x: 570, y: y+14, class: 'motif-text', fill: '#1a7f37', 'font-weight': 'bold', opacity: 0 }, ['✓ PASS']);
        svg.appendChild(c);
        checks.push(c);
      }

      container.appendChild(svg);
      let frames = [];
      let running = false;

      return {
        play: () => {
          if (prefersReduced) {
            tracks.forEach(t => t.setAttribute('width', 385));
            flags.forEach(f => f.style.opacity = 1);
            checks.forEach(c => c.style.opacity = 1);
            containers.forEach(c => c.setAttribute('fill', '#eaf1f9'));
            return;
          }
          if (running) return;
          running = true;
          
          tracks.forEach((t, i) => {
            let width = 0;
            const speed = 1.5 + Math.random() * 2;
            const delay = Math.random() * 1000;
            
            setTimeout(() => {
              const loop = () => {
                if (!running) return;
                width += speed;
                if (width >= 385) {
                  width = 385;
                  flags[i].style.transition = 'opacity 0.2s'; flags[i].style.opacity = 1;
                  checks[i].style.transition = 'opacity 0.2s 0.2s'; checks[i].style.opacity = 1;
                  containers[i].style.transition = 'fill 0.2s'; containers[i].setAttribute('fill', '#eaf1f9');
                } else {
                  frames[i] = requestAnimationFrame(loop);
                }
                t.setAttribute('width', width);
              };
              frames[i] = requestAnimationFrame(loop);
            }, delay);
          });
        },
        reset: () => {
          running = false;
          frames.forEach(f => cancelAnimationFrame(f));
          tracks.forEach(t => t.setAttribute('width', 0));
          flags.forEach(f => f.style.opacity = 0);
          checks.forEach(c => c.style.opacity = 0);
          containers.forEach(c => c.setAttribute('fill', 'var(--surface)'));
        }
      };
    },

    verifier: (container) => {
      const svg = S('svg', { viewBox: '0 0 720 220' });
      
      const defs = S('defs');
      const arrowRed = S('marker', { id: 'arr-red', viewBox: '0 0 10 10', refX: '8', refY: '5', markerWidth: '6', markerHeight: '6', orient: 'auto' }, [ S('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: '#d32f2f' }) ]);
      const arrowGreen = S('marker', { id: 'arr-green', viewBox: '0 0 10 10', refX: '8', refY: '5', markerWidth: '6', markerHeight: '6', orient: 'auto' }, [ S('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: '#388e3c' }) ]);
      defs.appendChild(arrowRed); defs.appendChild(arrowGreen);
      svg.appendChild(defs);

      const g = S('g', { transform: 'translate(10, 20)' });
      svg.appendChild(g);

      // Model Claim
      const claim = S('g');
      claim.appendChild(S('rect', { x: 0, y: 20, width: 220, height: 85, rx: 6, fill: 'var(--code-bg)', stroke: 'var(--rule)', 'stroke-width': 2 }));
      claim.appendChild(S('text', { x: 15, y: 40, class: 'motif-label', 'font-weight': 'bold' }, ['Model Answer:']));
      claim.appendChild(S('text', { x: 15, y: 65, class: 'motif-text', 'font-family': 'var(--mono, monospace)', 'font-size': '12px' }, ['1. Exploit uses CVE-2024-9999']));
      claim.appendChild(S('text', { x: 15, y: 85, class: 'motif-text', 'font-family': 'var(--mono, monospace)', 'font-size': '12px' }, ['2. Run mssqlclient.py']));
      g.appendChild(claim);

      // Buggy Verifier
      const v1 = S('g', { transform: 'translate(260, 0)', opacity: 0 });
      v1.appendChild(S('rect', { x: 0, y: 0, width: 280, height: 80, rx: 6, fill: '#fff0f0', stroke: '#ffcccb', 'stroke-width': 2 }));
      v1.appendChild(S('text', { x: 15, y: 20, class: 'motif-label', fill: '#d32f2f', 'font-weight': 'bold' }, ['Buggy Verifier (Before)']));
      v1.appendChild(S('text', { x: 145, y: 45, class: 'motif-text motif-on-light', 'text-anchor': 'end' }, ['NVD totalResults: 0']));
      v1.appendChild(S('text', { x: 153, y: 45, class: 'motif-text motif-verdict-bad', 'font-weight': 'bold' }, ['→ SUPPORTED ✓']));
      g.appendChild(v1);

      // Corrected Verifier
      const v2 = S('g', { transform: 'translate(260, 100)', opacity: 0 });
      v2.appendChild(S('rect', { x: 0, y: 0, width: 280, height: 85, rx: 6, fill: '#f0fff0', stroke: '#c8e6c9', 'stroke-width': 2 }));
      v2.appendChild(S('text', { x: 15, y: 20, class: 'motif-label', fill: '#388e3c', 'font-weight': 'bold' }, ['Corrected Verifier']));
      v2.appendChild(S('text', { x: 145, y: 45, class: 'motif-text motif-on-light', 'text-anchor': 'end' }, ['NVD totalResults: 0']));
      v2.appendChild(S('text', { x: 153, y: 45, class: 'motif-text motif-verdict-good', 'font-weight': 'bold' }, ['→ NOT_IN_DB ✗']));
      v2.appendChild(S('text', { x: 145, y: 65, class: 'motif-text motif-on-light', 'text-anchor': 'end' }, ['mssqlclient.py']));
      v2.appendChild(S('text', { x: 153, y: 65, class: 'motif-text motif-verdict-good', 'font-weight': 'bold' }, ['→ SUPPORTED ✓']));
      g.appendChild(v2);

      // Arrows
      const a1 = S('line', { x1: 230, y1: 62, x2: 250, y2: 40, stroke: '#d32f2f', 'stroke-width': 2, 'marker-end': 'url(#arr-red)', opacity: 0 });
      const a2 = S('line', { x1: 230, y1: 62, x2: 250, y2: 130, stroke: '#388e3c', 'stroke-width': 2, 'marker-end': 'url(#arr-green)', opacity: 0 });
      g.appendChild(a1); g.appendChild(a2);

      // Result Contrast
      const res = S('g', { transform: 'translate(548, 20)', opacity: 0 });
      res.appendChild(S('text', { x: 0, y: 0, class: 'motif-label', 'font-weight': 'bold' }, ['Fabrications Accepted']));
      
      const resBox = S('rect', { x: 0, y: 10, width: 160, height: 110, rx: 6, fill: 'var(--surface)', stroke: 'var(--rule)' });
      res.appendChild(resBox);
      
      res.appendChild(S('text', { x: 15, y: 40, class: 'motif-text', 'font-weight': 'bold' }, ['10/10']));
      res.appendChild(S('text', { x: 15, y: 60, class: 'motif-text', 'font-size': '13px', fill: 'var(--muted)' }, ['fake impacket']));
      res.appendChild(S('text', { x: 15, y: 76, class: 'motif-text', 'font-size': '13px', fill: 'var(--muted)' }, ['scripts']));
      
      res.appendChild(S('line', { x1: 15, y1: 85, x2: 145, y2: 85, stroke: 'var(--rule)', 'stroke-dasharray': '2 2' }));
      
      res.appendChild(S('text', { x: 15, y: 105, class: 'motif-text', 'font-weight': 'bold' }, ['0/10']));
      res.appendChild(S('text', { x: 55, y: 105, class: 'motif-text', 'font-size': '13px', fill: 'var(--muted)' }, ['fake CVE ids']));
      
      g.appendChild(res);

      container.appendChild(svg);

      return {
        play: () => {
          if (prefersReduced) {
            v1.style.opacity = 1; v2.style.opacity = 1;
            a1.style.opacity = 1; a2.style.opacity = 1;
            res.style.opacity = 1;
            return;
          }
          setTimeout(() => { a1.style.transition = 'opacity 0.3s'; a1.style.opacity = 1; v1.style.transition = 'opacity 0.4s'; v1.style.opacity = 1; }, 400);
          setTimeout(() => { a2.style.transition = 'opacity 0.3s'; a2.style.opacity = 1; v2.style.transition = 'opacity 0.4s'; v2.style.opacity = 1; }, 1400);
          setTimeout(() => { res.style.transition = 'opacity 0.5s'; res.style.opacity = 1; }, 2400);
        },
        reset: () => {
          v1.style.opacity = 0; v2.style.opacity = 0;
          a1.style.opacity = 0; a2.style.opacity = 0;
          res.style.opacity = 0;
        }
      };
    }
  };

  const instances = [];
  document.querySelectorAll('.motif-slot').forEach(slot => {
    const name = slot.getAttribute('data-motif');
    if (motifs[name]) {
      const inst = motifs[name](slot);
      instances.push({ el: slot, inst });
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const match = instances.find(i => i.el === entry.target);
      if (match) {
        if (entry.isIntersecting) {
          match.inst.play();
        } else {
          match.inst.reset();
        }
      }
    });
  }, { threshold: 0.1 });

  instances.forEach(i => observer.observe(i.el));

  window.__DSH_MOTIFS_PLAY = () => instances.forEach(i => i.inst.play());

})();
