"use client";

import { useEffect, useRef } from "react";
import styles from "./RoseThreeSpinner.module.css";

const SVG_NS = "http://www.w3.org/2000/svg";

export default function RoseThreeSpinner() {
  const groupRef = useRef(null);
  const pathRef = useRef(null);
  const formulaRef = useRef(null);

  useEffect(() => {
    const config = {
      particleCount: 76,
      trailSpan: 0.31,
      durationMs: 5300,
      rotationDurationMs: 28000,
      pulseDurationMs: 4400,
      strokeWidth: 4.6,
      roseA: 9.2,
      roseABoost: 0.6,
      roseBreathBase: 0.72,
      roseBreathBoost: 0.28,
      roseScale: 3.25,

      formula(config) {
        return [
          `r(t) = (${config.roseA.toFixed(1)} + ${config.roseABoost.toFixed(
            2,
          )}s)(${config.roseBreathBase.toFixed(
            2,
          )} + ${config.roseBreathBoost.toFixed(2)}s) cos(3t)`,
          `x(t) = 50 + cos t · r(t) · ${config.roseScale.toFixed(2)}`,
          `y(t) = 50 + sin t · r(t) · ${config.roseScale.toFixed(2)}`,
        ].join("\n");
      },

      point(progress, detailScale) {
        const t = progress * Math.PI * 2;
        const a = this.roseA + detailScale * this.roseABoost;
        const r =
          a *
          (this.roseBreathBase + detailScale * this.roseBreathBoost) *
          Math.cos(3 * t);

        return {
          x: 50 + Math.cos(t) * r * this.roseScale,
          y: 50 + Math.sin(t) * r * this.roseScale,
        };
      },
    };

    const group = groupRef.current;
    const path = pathRef.current;
    const formula = formulaRef.current;

    path.setAttribute("stroke-width", config.strokeWidth);
    formula.textContent = config.formula(config);

    const particles = Array.from({ length: config.particleCount }, () => {
      const circle = document.createElementNS(SVG_NS, "circle");
      circle.setAttribute("fill", "currentColor");
      group.appendChild(circle);
      return circle;
    });

    function normalizeProgress(progress) {
      return ((progress % 1) + 1) % 1;
    }

    function getDetailScale(time) {
      const p = (time % config.pulseDurationMs) / config.pulseDurationMs;
      return 0.52 + ((Math.sin(p * Math.PI * 2 + 0.55) + 1) / 2) * 0.48;
    }

    function getRotation(time) {
      return (
        -((time % config.rotationDurationMs) / config.rotationDurationMs) * 360
      );
    }

    function buildPath(detailScale, steps = 480) {
      return Array.from({ length: steps + 1 }, (_, i) => {
        const p = config.point(i / steps, detailScale);
        return `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
      }).join(" ");
    }

    function getParticle(index, progress, detailScale) {
      const tailOffset = index / (config.particleCount - 1);
      const p = config.point(
        normalizeProgress(progress - tailOffset * config.trailSpan),
        detailScale,
      );
      const fade = Math.pow(1 - tailOffset, 0.56);

      return {
        x: p.x,
        y: p.y,
        r: 0.9 + fade * 2.7,
        o: 0.04 + fade * 0.96,
      };
    }

    const start = performance.now();

    function render(now) {
      const time = now - start;
      const progress = (time % config.durationMs) / config.durationMs;
      const detailScale = getDetailScale(time);

      group.setAttribute("transform", `rotate(${getRotation(time)} 50 50)`);
      path.setAttribute("d", buildPath(detailScale));

      particles.forEach((node, i) => {
        const p = getParticle(i, progress, detailScale);
        node.setAttribute("cx", p.x);
        node.setAttribute("cy", p.y);
        node.setAttribute("r", p.r);
        node.setAttribute("opacity", p.o);
      });

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }, []);

  return (
    <div className={styles.demo}>
      <div className={styles.frame}>
        <svg viewBox="0 0 100 100">
          <g ref={groupRef}>
            <path ref={pathRef} className={styles.path}></path>
          </g>
        </svg>
      </div>

      <div className={styles.meta}>
        <div className={styles.title}>Rose Three</div>
        <div className={styles.tag}>r = a cos(3θ)</div>
      </div>

      <pre ref={formulaRef} className={styles.formula}></pre>
    </div>
  );
}
