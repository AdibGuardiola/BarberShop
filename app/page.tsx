"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";
import { CartSidebar } from "@/components/CartSidebar";
import { LocationsPage } from "@/components/LocationsPage";

export type Service = {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  ctaLabel: string;
};

export type CartItem = {
  service: Service;
  quantity: number;
};

type Page = "services" | "locations";

const SERVICES: Service[] = [
  {
    id: "screen",
    name: "Cambio de pantalla",
    description:
      "Sustitución de pantalla rota, rayada o con manchas. Piezas compatibles de alta calidad y acabado como nuevo.",
    duration: "60–90 min",
    price: 79,
    image:
      "https://images.pexels.com/photos/6078127/pexels-photo-6078127.jpeg?auto=compress&cs=tinysrgb&w=600",
    ctaLabel: "Reservar cambio de pantalla",
  },
  {
    id: "battery",
    name: "Cambio de batería",
    description:
      "¿Tu móvil se apaga solo o dura muy poco? Cambiamos la batería para recuperar su autonomía y rendimiento.",
    duration: "30–45 min",
    price: 39,
    image:
      "https://images.pexels.com/photos/719399/pexels-photo-719399.jpeg?auto=compress&cs=tinysrgb&w=600",
    ctaLabel: "Reservar cambio de batería",
  },
  {
    id: "charging-port",
    name: "Reparación conector de carga",
    description:
      "Reparamos o sustituimos el puerto de carga cuando el móvil no reconoce el cable o carga de forma intermitente.",
    duration: "45–60 min",
    price: 49,
    image:
      "https://images.pexels.com/photos/6755091/pexels-photo-6755091.jpeg?auto=compress&cs=tinysrgb&w=600",
    ctaLabel: "Reservar reparación de carga",
  },
  {
    id: "diagnostic",
    name: "Diagnóstico & software",
    description:
      "Análisis completo del dispositivo: rendimiento, apps, virus, bloqueos y errores del sistema. Formateo y reinstalación si es necesario.",
    duration: "30–60 min",
    price: 25,
    image:
      "https://images.pexels.com/photos/6755129/pexels-photo-6755129.jpeg?auto=compress&cs=tinysrgb&w=600",
    ctaLabel: "Pedir diagnóstico",
  },
  {
    id: "protection-pack",
    name: "Pack protección total",
    description:
      "Cristal templado + funda antigolpes + revisión rápida del dispositivo. Ideal para estrenar móvil con seguridad.",
    duration: "15–20 min",
    price: 29,
    image:
      "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600",
    ctaLabel: "Reservar pack protección",
  },
  {
    id: "data-recovery",
    name: "Recuperación de datos",
    description:
      "Intento de recuperación de fotos, contactos y archivos desde dispositivos dañados o formateados (según caso).",
    duration: "Tiempo variable",
    price: 40,
    image:
      "https://images.pexels.com/photos/6755137/pexels-photo-6755137.jpeg?auto=compress&cs=tinysrgb&w=600",
    ctaLabel: "Reservar servicio",
  },
];

const CART_STORAGE_KEY = "techfix-cart";

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [page, setPage] = useState<Page>("services");

  // cargar carrito desde localStorage
  useEffect(() => {
    const saved = typeof window !== "undefined"
      ? localStorage.getItem(CART_STORAGE_KEY)
      : null;

    if (saved) {
      try {
        const parsed: CartItem[] = JSON.parse(saved);
        setCart(parsed);
      } catch (e) {
        console.error("Error leyendo carrito de localStorage", e);
      }
    }
  }, []);

  // guardar carrito cuando cambie
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.service.id === service.id);
      if (existing) {
        return prev.map((item) =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { service, quantity: 1 }];
    });
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0
  );

  return (
    <div className="min-h-full bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              TechFix • Reparación de Móviles
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Reparamos tu smartphone y te ayudamos en nuestras sedes repartidas
              por la ciudad.
            </p>
          </div>

          <nav className="mt-2 flex justify-center gap-2 text-sm md:mt-0">
            <button
              onClick={() => setPage("services")}
              className={`rounded-full px-4 py-1.5 transition ${
                page === "services"
                  ? "bg-cyan-500 text-slate-900 font-semibold"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              Servicios
            </button>
            <button
              onClick={() => setPage("locations")}
              className={`rounded-full px-4 py-1.5 transition ${
                page === "locations"
                  ? "bg-cyan-500 text-slate-900 font-semibold"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              Locales / Sedes
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        {page === "services" ? (
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <Card
                key={service.id}
                className="overflow-hidden bg-slate-800/70 shadow-lg shadow-black/30"
              >
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-slate-300">{service.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-300">
                      {service.duration}
                    </span>
                    <span className="text-lg font-semibold text-cyan-400">
                      {service.price > 0 ? `${service.price} €` : "Presupuesto"}
                    </span>
                  </div>
                  <Button
                    className="mt-1 w-full"
                    onClick={() => addToCart(service)}
                  >
                    {service.ctaLabel}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </section>
        ) : (
          <LocationsPage />
        )}
      </main>

      <CartSidebar cart={cart} total={total} onClear={clearCart} />
    </div>
  );
}

