"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { CartSidebar } from "../components/CartSidebar";
import { LocationsPage } from "../components/LocationsPage";

import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
  id: "haircut",
  name: "Corte y peinado",
  description:
    "Corte profesional personalizado según el estilo que buscas. Incluye lavado, secado y peinado final para un acabado perfecto.",
  duration: "45–60 min",
  price: 25,
  image:
    "https://images.pexels.com/photos/3992875/pexels-photo-3992875.jpeg?auto=compress&cs=tinysrgb&w=600",
  ctaLabel: "Reservar corte y peinado",
},
{
  id: "dye",
  name: "Coloración completa",
  description:
    "Servicio de tinte para renovar o cambiar el tono de tu cabello. Incluye asesoría de color según tu piel y mantenimiento del brillo.",
  duration: "90–120 min",
  price: 45,
  image:
    "https://images.pexels.com/photos/973401/pexels-photo-973401.jpeg",
  ctaLabel: "Reservar coloración",
},
{
  id: "highlights",
  name: "Mechas / Balayage",
  description:
    "Aclara tu cabello con un acabado natural y degradado. Ideal para dar luz y volumen visual. Incluye matiz y styling final.",
  duration: "120–180 min",
  price: 85,
  image:
    "https://images.pexels.com/photos/3993461/pexels-photo-3993461.jpeg",
  ctaLabel: "Reservar mechas o balayage",
},
{
  id: "keratin",
  name: "Alisado de keratina",
  description:
    "Tratamiento que elimina el frizz, aporta suavidad extrema y mejora la manejabilidad del cabello por semanas.",
  duration: "120–180 min",
  price: 120,
  image:
    "https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg?auto=compress&cs=tinysrgb&w=600",
  ctaLabel: "Reservar alisado de keratina",
},
{
  id: "barber",
  name: "Corte masculino + barba",
  description:
    "Corte de cabello masculino con técnica moderna y arreglo de barba con navaja. Incluye definición y acabado con aceites.",
  duration: "30–50 min",
  price: 20,
  image:
    "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg",
  ctaLabel: "Reservar corte + barba",
},
{
  id: "extensions",
  name: "Colocación de extensiones",
  description:
    "Extensiones naturales o sintéticas para aumentar volumen o longitud. Asesoría personalizada para elegir textura y color adecuado.",
  duration: "120–240 min",
  price: 150,
  image:
    "https://images.pexels.com/photos/3993469/pexels-photo-3993469.jpeg",
  ctaLabel: "Reservar extensiones",
},

  // 👉 aquí el resto de servicios exactamente como los tenías
];

const CART_STORAGE_KEY = "techfix-cart";

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [page, setPage] = useState<Page>("services");
  const [user, setUser] = useState<User | null>(null);

  // ⭐ rating local para que las estrellas se queden marcadas
  const [selectedRatings, setSelectedRatings] = useState<Record<string, number>>(
    {}
  );

  const router = useRouter();

  // escuchar cambios de login/logout
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // cargar carrito desde localStorage
  useEffect(() => {
    const saved =
      typeof window !== "undefined"
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

  // ✅ Confirmar compra -> guardar en Firestore (orders)
  const handleConfirmOrder = async () => {
    // Este alert confirma que el botón funciona
    alert("Has pulsado Confirmar cita");

    console.log("👉 handleConfirmOrder llamado");
    console.log("Usuario actual:", user);
    console.log("Carrito actual:", cart);

    if (!user) {
      console.log("No hay usuario, redirigiendo a /login");
      router.push("/login");
      return;
    }

    if (cart.length === 0) {
      console.log("Carrito vacío, no hago nada");
      return;
    }

    try {
      const ref = await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userEmail: user.email || null,
        cart,
        total,
        createdAt: serverTimestamp(),
      });

      console.log("✅ Pedido guardado con ID:", ref.id);

      setCart([]); // vaciar carrito
      alert("¡Cita confirmada y guardada en Firebase! ✅");
    } catch (e: any) {
      console.error("❌ Error al guardar la cita en Firestore:", e);
      alert(
        "Error al guardar la cita en Firestore.\n\nMensaje técnico:\n" +
          (e?.message ?? "Sin mensaje")
      );
    }
  };

  // ⭐ Valorar servicio -> guardar en Firestore (ratings)
  const handleRateService = async (serviceId: string, rating: number) => {
    console.log("👉 handleRateService", { serviceId, rating, user });

    if (!user) {
      console.log("No hay usuario, redirigiendo a /login");
      router.push("/login");
      return;
    }

    try {
      const ref = await addDoc(collection(db, "ratings"), {
        userId: user.uid,
        userEmail: user.email || null,
        serviceId,
        rating,
        createdAt: serverTimestamp(),
      });
      console.log("✅ Rating guardado con ID:", ref.id);

      setSelectedRatings((prev) => ({
        ...prev,
        [serviceId]: rating,
      }));

      alert(`Has valorado el servicio con ${rating} ⭐`);
    } catch (e: any) {
      console.error("❌ Error rating en Firestore:", e);
      alert(
        "Error al guardar la valoración en Firestore.\n\nMensaje técnico:\n" +
          (e?.message ?? "Sin mensaje")
      );
    }
  };

  return (
    <div className="min-h-full bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              FutureBarberStyle
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Los mejores arreglos y cortes de pelo ,trabajamos a domicilio.
            </p>
          </div>

          <div className="flex flex-col items-center gap-1 md:items-end">
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

            {/* info login */}
            <button
              className="mt-1 text-[11px] text-cyan-400 hover:underline"
              onClick={() => router.push("/login")}
            >
              {user ? `Conectado como ${user.email}` : "Acceder / Registrarse"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        {page === "services" ? (
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const currentRating = selectedRatings[service.id] ?? 0;

              return (
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

                    {/* ⭐ Estrellas vacías al principio, se rellenan al valorar */}
                    <div className="mt-2 flex items-center gap-1 text-yellow-400 text-sm">
                      <span className="text-xs text-slate-300 mr-2">
                        Valorar:
                      </span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRateService(service.id, star)}
                          className="hover:scale-110 transition-transform"
                          disabled={currentRating > 0}
                        >
                          {star <= currentRating ? "★" : "☆"}
                        </button>
                      ))}
                    </div>

                    {currentRating > 0 && (
                      <p className="text-[11px] text-slate-400">
                        Has valorado este servicio con {currentRating} / 5.
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </section>
        ) : (
          <LocationsPage />
        )}
      </main>

      <CartSidebar
        cart={cart}
        total={total}
        onClear={clearCart}
        onConfirm={handleConfirmOrder}
      />
    </div>
  );
}
