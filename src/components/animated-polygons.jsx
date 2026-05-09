import { useEffect, useRef, useCallback } from "react";

export default function AnimatedPolygons() {
  const canvasRef = useRef(null);
  const polygonsRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef(null);

  const createPolygon = useCallback((width, height) => {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      sides: Math.floor(Math.random() * 4) + 3,
      radius: Math.random() * 30 + 15,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      opacity: Math.random() * 0.3 + 0.1,
    };
  }, []);

  const drawPolygon = useCallback((ctx, polygon) => {
    ctx.save();

    ctx.translate(polygon.x, polygon.y);
    ctx.rotate(polygon.rotation);

    ctx.beginPath();

    for (let i = 0; i < polygon.sides; i++) {
      const angle = (i * 2 * Math.PI) / polygon.sides;

      const x = polygon.radius * Math.cos(angle);
      const y = polygon.radius * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();

    ctx.strokeStyle = `rgba(0, 219, 255, ${polygon.opacity})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }, []);

  const drawConnections = useCallback((ctx, polygons) => {
    const maxDistance = 150;

    for (let i = 0; i < polygons.length; i++) {
      for (let j = i + 1; j < polygons.length; j++) {
        const dx = polygons[i].x - polygons[j].x;
        const dy = polygons[i].y - polygons[j].y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.15;

          ctx.beginPath();

          ctx.moveTo(polygons[i].x, polygons[i].y);
          ctx.lineTo(polygons[j].x, polygons[j].y);

          ctx.strokeStyle = `rgba(0, 219, 255, ${opacity})`;
          ctx.lineWidth = 1;

          ctx.stroke();
        }
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();

      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resizeCanvas();

    const polygonCount = 15;

    polygonsRef.current = Array.from({ length: polygonCount }, () =>
      createPolygon(canvas.width, canvas.height),
    );

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const polygons = polygonsRef.current;
      const mouse = mouseRef.current;

      polygons.forEach((polygon) => {
        const dx = polygon.x - mouse.x;
        const dy = polygon.y - mouse.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const interactionRadius = 120;

        if (distance < interactionRadius && distance > 0) {
          const force = (interactionRadius - distance) / interactionRadius;

          polygon.vx += (dx / distance) * force * 0.3;
          polygon.vy += (dy / distance) * force * 0.3;
        }

        polygon.x += polygon.vx;
        polygon.y += polygon.vy;

        polygon.vx *= 0.99;
        polygon.vy *= 0.99;

        polygon.rotation += polygon.rotationSpeed;

        if (
          polygon.x < polygon.radius ||
          polygon.x > canvas.width - polygon.radius
        ) {
          polygon.vx *= -1;

          polygon.x = Math.max(
            polygon.radius,
            Math.min(canvas.width - polygon.radius, polygon.x),
          );
        }

        if (
          polygon.y < polygon.radius ||
          polygon.y > canvas.height - polygon.radius
        ) {
          polygon.vy *= -1;

          polygon.y = Math.max(
            polygon.radius,
            Math.min(canvas.height - polygon.radius, polygon.y),
          );
        }

        drawPolygon(ctx, polygon);
      });

      drawConnections(ctx, polygons);

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();

      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = {
        x: -1000,
        y: -1000,
      };
    };

    window.addEventListener("resize", resizeCanvas);

    canvas.addEventListener("mousemove", handleMouseMove);

    canvas.addEventListener("mouseleave", handleMouseLeave);

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);

      canvas.removeEventListener("mousemove", handleMouseMove);

      canvas.removeEventListener("mouseleave", handleMouseLeave);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createPolygon, drawPolygon, drawConnections]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ background: "transparent" }}
    />
  );
}
