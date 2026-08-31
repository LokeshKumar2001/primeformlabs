import React, { useRef, useEffect } from 'react';

export function MillingCanvas({ 
  isRunning, 
  currentToolIndex = 0, 
  cycleProgress = 0, // 0.0 to 1.0
  activeGCodeLine = "",
  coolantActive = false
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const chipsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let angle = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Sinumerik Background Grid
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const cx = width / 2;
      const cy = height / 2;

      // Kurt Vise Jaws Frame
      const viseW = 340;
      const viseH = 220;
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.fillRect(cx - viseW / 2, cy - viseH / 2, viseW, viseH);
      ctx.strokeRect(cx - viseW / 2, cy - viseH / 2, viseW, viseH);

      // Fixed Jaw
      ctx.fillStyle = '#334155';
      ctx.fillRect(cx - viseW / 2, cy - viseH / 2, viseW, 26);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 9px Arial, sans-serif';
      ctx.fillText('KURT DX6 - FIXED JAW (Y+)', cx - viseW / 2 + 10, cy - viseH / 2 + 17);

      // Movable Jaw
      ctx.fillStyle = '#334155';
      ctx.fillRect(cx - viseW / 2, cy + viseH / 2 - 26, viseW, 26);
      ctx.fillText('CLAMPED (45 N·m)', cx - viseW / 2 + 10, cy + viseH / 2 - 9);

      // Billet
      const partW = 240;
      const partH = 150;
      const partX = cx - partW / 2;
      const partY = cy - partH / 2;

      // Raw Billet
      ctx.fillStyle = '#475569';
      ctx.strokeStyle = '#00cad5';
      ctx.lineWidth = 1.5;
      ctx.fillRect(partX, partY, partW, partH);
      ctx.strokeRect(partX, partY, partW, partH);

      // Facing Shading
      if (cycleProgress > 0.05) {
        const faceProgress = Math.min(1, cycleProgress / 0.25);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(partX, partY, partW * faceProgress, partH);

        // Toolpath sweep hatch
        ctx.strokeStyle = 'rgba(0, 100, 110, 0.4)';
        ctx.lineWidth = 1;
        for (let fx = partX; fx < partX + partW * faceProgress; fx += 16) {
          ctx.beginPath();
          ctx.moveTo(fx, partY);
          ctx.lineTo(fx, partY + partH);
          ctx.stroke();
        }
      }

      // Pocket Milling
      if (cycleProgress > 0.25) {
        const pocketProgress = Math.min(1, (cycleProgress - 0.25) / 0.35);
        const pkW = 130 * pocketProgress;
        const pkH = 75 * pocketProgress;
        
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - pkW / 2, cy - pkH / 2, pkW, pkH);
        ctx.strokeStyle = '#00cad5';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx - pkW / 2, cy - pkH / 2, pkW, pkH);

        // Inner circle
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.arc(cx, cy, 26 * pocketProgress, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 202, 213, 0.8)';
        ctx.stroke();
      }

      // 4 Holes
      const holePositions = [
        { x: cx - 80, y: cy - 45 },
        { x: cx + 80, y: cy - 45 },
        { x: cx + 80, y: cy + 45 },
        { x: cx - 80, y: cy + 45 }
      ];

      holePositions.forEach((h, idx) => {
        const holeThreshold = 0.60 + (idx * 0.05);
        if (cycleProgress > holeThreshold) {
          ctx.fillStyle = '#020617';
          ctx.beginPath();
          ctx.arc(h.x, h.y, 8, 0, Math.PI * 2);
          ctx.fill();

          if (cycleProgress > 0.80) {
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(h.x, h.y, 9.5, 0, Math.PI * 2);
            ctx.stroke();
          }

          if (cycleProgress > 0.90) {
            ctx.strokeStyle = '#16a34a';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(h.x, h.y, 11, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      });

      // Outer Chamfer
      if (cycleProgress > 0.92) {
        ctx.strokeStyle = '#16a34a';
        ctx.lineWidth = 2;
        ctx.strokeRect(partX + 3, partY + 3, partW - 6, partH - 6);
      }

      // G54 Datum Marker
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(partX, partY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 10px Arial, sans-serif';
      ctx.fillText('G54 X0 Y0', partX - 10, partY - 7);

      // Tool Spindle Head Position
      let toolX = cx;
      let toolY = cy;
      let toolRadius = 14;

      if (isRunning) {
        angle += 0.15;
        if (cycleProgress < 0.25) {
          toolRadius = 22;
          const sweepX = (cycleProgress / 0.25) * partW;
          toolX = partX + sweepX;
          toolY = cy + Math.sin(angle * 2) * 40;
        } else if (cycleProgress < 0.60) {
          toolRadius = 12;
          const r = 40 * Math.sin(cycleProgress * 15);
          toolX = cx + Math.cos(angle * 3) * r;
          toolY = cy + Math.sin(angle * 3) * (r * 0.6);
        } else if (cycleProgress < 0.80) {
          toolRadius = 7;
          const hIdx = Math.floor(((cycleProgress - 0.60) / 0.20) * 4) % 4;
          const targetH = holePositions[hIdx];
          toolX = targetH.x;
          toolY = targetH.y;
        } else if (cycleProgress < 0.90) {
          toolRadius = 8;
          const hIdx = Math.floor(((cycleProgress - 0.80) / 0.10) * 4) % 4;
          const targetH = holePositions[hIdx];
          toolX = targetH.x;
          toolY = targetH.y;
        } else {
          toolRadius = 10;
          const tNorm = (cycleProgress - 0.90) / 0.10;
          toolX = partX + (tNorm * partW);
          toolY = partY;
        }

        // Coolant Spray
        if (coolantActive) {
          ctx.strokeStyle = 'rgba(0, 202, 213, 0.5)';
          ctx.lineWidth = 1.5;
          for (let s = 0; s < 4; s++) {
            ctx.beginPath();
            ctx.moveTo(toolX - 25, toolY - 30);
            ctx.lineTo(toolX + (Math.random() * 10 - 5), toolY + (Math.random() * 10 - 5));
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(toolX + 25, toolY - 30);
            ctx.lineTo(toolX + (Math.random() * 10 - 5), toolY + (Math.random() * 10 - 5));
            ctx.stroke();
          }
        }

        // Chip particles
        if (Math.random() < 0.6) {
          chipsRef.current.push({
            x: toolX,
            y: toolY,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 1.0,
            color: Math.random() > 0.5 ? '#f1f5f9' : '#00cad5'
          });
        }
      }

      chipsRef.current.forEach((chip) => {
        chip.x += chip.vx;
        chip.y += chip.vy;
        chip.life -= 0.04;
        ctx.fillStyle = chip.color;
        ctx.globalAlpha = Math.max(0, chip.life);
        ctx.fillRect(chip.x, chip.y, 2.5, 2.5);
      });
      chipsRef.current = chipsRef.current.filter(c => c.life > 0);
      ctx.globalAlpha = 1.0;

      // Spindle Head
      ctx.save();
      ctx.translate(toolX, toolY);

      ctx.fillStyle = isRunning ? 'rgba(0, 202, 213, 0.2)' : 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.arc(0, 0, toolRadius + 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isRunning ? '#00cad5' : '#64748b';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, toolRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (isRunning) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        for (let b = 0; b < 4; b++) {
          const fluteAngle = angle + (b * Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(fluteAngle) * toolRadius, Math.sin(fluteAngle) * toolRadius);
          ctx.stroke();
        }
      }

      ctx.restore();

      // Siemens ACT VAL Coordinates HUD
      ctx.fillStyle = '#004850';
      ctx.strokeStyle = '#00cad5';
      ctx.lineWidth = 1;
      ctx.fillRect(10, 10, 185, 46);
      ctx.strokeRect(10, 10, 185, 46);

      const relX = ((toolX - partX) * 0.625).toFixed(3);
      const relY = ((partY + partH - toolY) * 0.666).toFixed(3);
      const relZ = isRunning ? (cycleProgress < 0.25 ? "0.000" : (cycleProgress < 0.60 ? "-10.000" : "-22.000")) : "+25.000";

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Arial, sans-serif';
      ctx.fillText(`X: ${relX} mm`, 18, 26);
      ctx.fillText(`Y: ${relY} mm`, 100, 26);
      ctx.fillStyle = '#4ade80';
      ctx.fillText(`Z: ${relZ} mm`, 18, 43);
      ctx.fillStyle = '#00cad5';
      ctx.fillText(`F: ${isRunning ? '1400' : '0'} mm/min`, 100, 43);

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isRunning, currentToolIndex, cycleProgress, coolantActive]);

  return (
    <div className="canvas-panel-container">
      <div className="canvas-header-bar">
        <span className="canvas-title">SIEMENS 3D/2D KINEMATICS & WORKPIECE SIMULATION</span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span className="canvas-stage-badge">KURT DX6</span>
          <span className="canvas-stage-badge">G54</span>
          {coolantActive && (
            <span className="canvas-stage-badge" style={{ color: '#00cad5', borderColor: '#00cad5' }}>
              M08 COOLANT ON
            </span>
          )}
        </div>
      </div>

      <div className="milling-canvas-wrapper">
        <canvas ref={canvasRef} width={680} height={425} />
      </div>
    </div>
  );
}
