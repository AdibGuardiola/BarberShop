"use client";

import React, { useEffect, useRef } from "react";

const IntroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ctx: any;

    const initGsap = async () => {
      if (typeof window === "undefined") return;

      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");

      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
        // Parallax para las imágenes
        gsap.utils.toArray<HTMLImageElement>("[data-speed]").forEach((img) => {
          const speed = Number(img.dataset.speed || 0.5);

          gsap.to(img, {
            y: () => ScrollTrigger.maxScroll(window) * speed * -0.15,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        // Entrada de los títulos
        gsap.from(".intro-title-line", {
          yPercent: 100,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
        });

        // Fase 2
        gsap.from(".phase-two-card", {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".phase-two",
            start: "top 75%",
          },
        });

        // Fase 3
        gsap.from(".phase-three-image", {
          scale: 0.9,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".phase-three",
            start: "top 75%",
          },
        });
      }, containerRef);

      ctx = context;
    };

    initGsap();

    return () => {
      ctx?.revert?.();
    };
  }, []);

  // ⚠️ Estas rutas apuntan a /public/images/...
  const photos = [
    { src: "/images/1.1.jpg", alt: "Foto 1" },
    { src: "/images/1.2.jpg", alt: "Foto 2" },
    { src: "/images/1.3.jpg", alt: "Foto 3" },
    { src: "/images/1.4.jpg", alt: "Foto 4" },
    { src: "/images/1.5.jpg", alt: "Foto 5" },
  ];

  return (
    <div ref={containerRef} className="intro-section">
      {/* FASE 1 */}
      <section className="phase phase-one" id="phase-one">
        <div className="phase-one-title">
          <h1 className="intro-title">
            <span className="intro-title-line">Barber</span>
            <span className="intro-title-line">Scrolly</span>
          </h1>
          <p className="intro-subtitle">
            Página de presentación con scroll suave y una pequeña galería de
            fotos de la barbería antes de ver los servicios.
          </p>
          <div className="intro-indicator">Desplaza para continuar ↓</div>
        </div>

        <div className="photo-grid">
          {photos.map((photo, i) => (
            <figure
              key={photo.src}
              className={`photo-item photo-item-${i + 1}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                data-speed={0.7 + i * 0.1}
              />
            </figure>
          ))}
        </div>
      </section>

      {/* FASE 2 */}
      <section className="phase phase-two" id="phase-two">
        <div className="phase-two-card">
          <h2>Tu barbería de confianza en el barrio</h2>
          <p>
            Esta primera parte es una página introductoria: sirve para dar
            contexto, mostrar algunas fotos y preparar al usuario antes de
            llegar a la parte de reserva de servicios.
          </p>
          <p>
            Debajo de esta intro sigues teniendo tu navegación con{" "}
            <strong>Servicios</strong> y <strong>Locales</strong>.
          </p>
        </div>
      </section>

      {/* FASE 3 */}
      <section className="phase phase-three" id="phase-three">
        <div className="phase-three-inner">
          <div className="phase-three-text">
            <h2>Listo para reservar tu cita</h2>
            <p>
              Al seguir haciendo scroll llegarás a la parte funcional de la web
              donde podrás ver los servicios, elegir local y confirmar tu cita.
            </p>
          </div>
          <div className="phase-three-images">
            {photos.slice(0, 3).map((photo) => (
              <div className="phase-three-image" key={photo.src}>
                <img src={photo.src} alt={photo.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntroSection;
