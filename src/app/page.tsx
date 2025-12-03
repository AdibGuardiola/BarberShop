"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";
import { CartSidebar } from "@/components/CartSidebar";
import { LocationsPage } from "@/components/LocationsPage";
import { usePreferences } from "@/context/PreferencesContext";

import { auth, db, hasFirebaseConfig } from "@/lib/firebase";
import { onAuthStateChanged, type User, signOut } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type LocalizedField = {
  es: string;
  en: string;
};

export type Service = {
  id: string;
  name: LocalizedField;
  description: LocalizedField;
  duration: LocalizedField;
  price: number;
  image: string;
  ctaLabel: LocalizedField;
};

export type CartItem = {
  service: Service;
  quantity: number;
};

type Page = "services" | "locations";

type UiCopy = {
  headerTitle: string;
  subtitle: string;
  intro: string;
  services: string;
  locations: string;
  login: string;
  logout: string;
  connectedAs: string;
  firebaseWarning: string;
  ratingSaved: (rating: number) => string;
  ratingError: string;
  bookingNeedsFirebase: string;
  ratingNeedsFirebase: string;
  selectService: string;
};

const UI_COPY: Record<"es" | "en", UiCopy> = {
  es: {
    headerTitle: "BarberShop • Peluquería",
    subtitle: "Reserva tus servicios en nuestras sedes.",
    intro: "Introducción",
    services: "Servicios",
    locations: "Locales",
    login: "Iniciar sesión",
    logout: "Cerrar sesión",
    connectedAs: "Conectado como:",
    firebaseWarning:
      "Conecta las variables de entorno de Firebase para activar el login y las reservas online en producción.",
    ratingSaved: (rating) => `Has valorado con ${rating} ⭐`,
    ratingError: "Error guardando valoración.",
    bookingNeedsFirebase:
      "Configura las credenciales de Firebase para confirmar la cita.",
    ratingNeedsFirebase:
      "Configura las credenciales de Firebase para enviar tu valoración.",
    selectService: "Selecciona uno para verlo aquí.",
  },
  en: {
    headerTitle: "BarberShop • Hair Studio",
    subtitle: "Book your services at our locations.",
    intro: "Intro",
    services: "Services",
    locations: "Locations",
    login: "Log in",
    logout: "Log out",
    connectedAs: "Signed in as:",
    firebaseWarning:
      "Connect Firebase environment variables to enable login and online bookings in production.",
    ratingSaved: (rating) => `You rated ${rating} ⭐`,
    ratingError: "Error saving rating.",
    bookingNeedsFirebase: "Add Firebase credentials to confirm your appointment.",
    ratingNeedsFirebase: "Add Firebase credentials to send your rating.",
    selectService: "Pick a service to see it here.",
  },
};

const SERVICES: Service[] = [
  {
    id: "haircut",
    name: { es: "Corte y peinado", en: "Haircut & styling" },
    description: {
      es: "Corte profesional personalizado según el estilo que buscas. Incluye lavado, secado y peinado final.",
      en: "Personalized professional cut for your style. Includes wash, dry, and final styling.",
    },
    duration: { es: "45–60 min", en: "45–60 min" },
    price: 25,
    image:
      "https://images.pexels.com/photos/3992875/pexels-photo-3992875.jpeg?auto=compress&cs=tinysrgb&w=600",
    ctaLabel: { es: "Reservar corte y peinado", en: "Book haircut & styling" },
  },
  {
    id: "dye",
    name: { es: "Coloración completa", en: "Full color" },
    description: {
      es: "Tinte completo con asesoría personalizada y tratamiento de brillo.",
      en: "Full color with personalized advice and shine treatment.",
    },
    duration: { es: "90–120 min", en: "90–120 min" },
    price: 45,
    image: "https://images.pexels.com/photos/973401/pexels-photo-973401.jpeg",
    ctaLabel: { es: "Reservar coloración", en: "Book color" },
  },
  {
    id: "highlights",
    name: { es: "Mechas / Balayage", en: "Highlights / Balayage" },
    description: {
      es: "Aclara tu cabello con efecto natural y degradado. Incluye matiz y styling.",
      en: "Natural, blended lightening with toner and styling included.",
    },
    duration: { es: "120–180 min", en: "120–180 min" },
    price: 85,
    image: "https://images.pexels.com/photos/3993461/pexels-photo-3993461.jpeg",
    ctaLabel: { es: "Reservar mechas o balayage", en: "Book highlights/balayage" },
  },
  {
    id: "keratin",
    name: { es: "Alisado de keratina", en: "Keratin straightening" },
    description: {
      es: "Tratamiento anti-frizz de larga duración que aporta suavidad y brillo.",
      en: "Long-lasting anti-frizz treatment that adds softness and shine.",
    },
    duration: { es: "120–180 min", en: "120–180 min" },
    price: 120,
    image:
      "https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg?auto=compress&cs=tinysrgb&w=600",
    ctaLabel: { es: "Reservar alisado de keratina", en: "Book keratin treatment" },
  },
  {
    id: "barber",
    name: { es: "Corte masculino + barba", en: "Men's cut + beard" },
    description: {
      es: "Corte moderno y arreglo de barba con navaja. Acabado con aceites.",
      en: "Modern cut and razor beard trim, finished with oils.",
    },
    duration: { es: "30–50 min", en: "30–50 min" },
    price: 20,
    image: "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg",
    ctaLabel: { es: "Reservar corte + barba", en: "Book cut + beard" },
  },
  {
    id: "extensions",
    name: { es: "Extensiones", en: "Extensions" },
    description: {
      es: "Extensiones naturales o sintéticas para volumen o longitud.",
      en: "Natural or synthetic extensions for volume or length.",
    },
    duration: { es: "120–240 min", en: "120–240 min" },
    price: 150,
    image: "https://images.pexels.com/photos/3993469/pexels-photo-3993469.jpeg",
    ctaLabel: { es: "Reservar extensiones", en: "Book extensions" },
  },
];

const CART_STORAGE_KEY = "barbershop-cart";

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as CartItem[]) : [];
  });
  const [page, setPage] = useState<Page>("services");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { theme, language, toggleLanguage, toggleTheme } = usePreferences();

  const firebaseReady = Boolean(auth && db);
  const isDark = theme === "dark";
  const t = UI_COPY[language];

  useEffect(() => {
    if (!auth) return undefined;

    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.service.id === service.id);
      if (existing) {
        return prev.map((i) =>
          i.service.id === service.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { service, quantity: 1 }];
    });
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0,
  );

  const handleConfirmOrder = async (booking: {
    name: string;
    date: string;
    time: string;
  }) => {
    if (!firebaseReady) {
      alert(t.bookingNeedsFirebase);
      return;
    }

    if (!user) return router.push("/login");

    if (cart.length === 0) return;

    try {
      await addDoc(collection(db!, "orders"), {
        userId: user.uid,
        userEmail: user.email,
        cart,
        total,
        createdAt: serverTimestamp(),
        bookingName: booking.name,
        bookingDate: booking.date,
        bookingTime: booking.time,
      });

      setCart([]);
      alert(language === "es" ? "¡Cita confirmada en Firebase! ✅" : "Appointment confirmed in Firebase! ✅");
    } catch (err) {
      console.error(err);
      alert(language === "es" ? "Error al guardar la cita." : "Error saving appointment.");
    }
  };

  const handleRateService = async (serviceId: string, rating: number) => {
    if (!firebaseReady) {
      alert(t.ratingNeedsFirebase);
      return;
    }

    if (!user) return router.push("/login");

    try {
      await addDoc(collection(db!, "ratings"), {
        userId: user.uid,
        userEmail: user.email,
        serviceId,
        rating,
        createdAt: serverTimestamp(),
      });

      alert(t.ratingSaved(rating));
    } catch (err) {
      console.error(err);
      alert(t.ratingError);
    }
  };

  const goToIntro = () => {
    window.location.assign("/intro");
  };

  const containerBg = isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900";
  const bannerClass = isDark
    ? "bg-amber-200/10 text-amber-200 border-amber-400/40"
    : "bg-amber-100 text-amber-800 border-amber-300";
  const headerClass = isDark
    ? "border-slate-800 bg-slate-900/80"
    : "border-slate-200 bg-white/80 backdrop-blur";

  const navButtonClasses = (active: boolean) => {
    if (active) {
      return isDark
        ? "bg-cyan-500 text-slate-900 font-semibold"
        : "bg-cyan-600 text-white font-semibold";
    }
    return isDark
      ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
      : "bg-slate-200 text-slate-900 hover:bg-slate-300";
  };

  const mutedText = isDark ? "text-slate-300" : "text-slate-700";
  const subtleText = isDark ? "text-slate-400" : "text-slate-600";

  return (
    <div className={`min-h-full ${containerBg}`}>
      {!hasFirebaseConfig && (
        <div className={`border-b px-4 py-3 text-sm ${bannerClass}`}>
          {t.firebaseWarning}
        </div>
      )}
      <header className={`border-b px-6 py-4 ${headerClass}`}>
        <div className="mx-auto max-w-6xl flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{t.headerTitle}</h1>
            <p className={subtleText}>{t.subtitle}</p>
          </div>

          <nav className="flex flex-col items-end gap-2 text-sm">
            <div className="flex flex-wrap justify-end gap-2">
              <button
                onClick={goToIntro}
                className={`rounded-full px-4 py-1.5 ${navButtonClasses(false)}`}
              >
                {t.intro}
              </button>

              <button
                onClick={() => setPage("services")}
                className={`rounded-full px-4 py-1.5 ${navButtonClasses(
                  page === "services",
                )}`}
              >
                {t.services}
              </button>

              <button
                onClick={() => setPage("locations")}
                className={`rounded-full px-4 py-1.5 ${navButtonClasses(
                  page === "locations",
                )}`}
              >
                {t.locations}
              </button>

              <button
                onClick={toggleLanguage}
                className={`rounded-full px-4 py-1.5 ${navButtonClasses(false)}`}
              >
                {language === "es" ? "ES / EN" : "EN / ES"}
              </button>

              <button
                onClick={toggleTheme}
                className={`rounded-full px-4 py-1.5 ${navButtonClasses(false)}`}
              >
                {isDark ? "🌙 / ☀️" : "☀️ / 🌙"}
              </button>

              {user ? (
                <button
                  onClick={async () => {
                    if (!firebaseReady) {
                      alert(
                        language === "es"
                          ? "Conecta Firebase para cerrar sesión correctamente."
                          : "Connect Firebase to sign out correctly.",
                      );
                      return;
                    }

                    await signOut(auth!);
                    setUser(null);
                    router.push("/");
                  }}
                  className="rounded-full px-4 py-1.5 bg-red-500 text-slate-900 font-semibold hover:bg-red-400"
                >
                  {t.logout}
                </button>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="rounded-full px-4 py-1.5 bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400"
                >
                  {t.login}
                </button>
              )}
            </div>

            {user && (
              <p className={`text-xs ${subtleText}`}>
                {t.connectedAs} <span className="font-semibold">{user.email}</span>
              </p>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        {page === "services" ? (
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <Card
                key={service.id}
                className={isDark ? "shadow-black/30" : "shadow-slate-200/60"}
              >
                <img
                  src={service.image}
                  alt={service.name[language]}
                  className="h-40 w-full object-cover"
                />

                <CardHeader>
                  <CardTitle>{service.name[language]}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-2 text-sm">
                  <p className={mutedText}>{service.description[language]}</p>

                  <div className="flex justify-between text-xs">
                    <span className="text-cyan-500">{service.duration[language]}</span>
                    <span className="text-cyan-500 font-bold">
                      {service.price} €
                    </span>
                  </div>

                  <Button
                    onClick={() => addToCart(service)}
                    className="w-full mt-2"
                  >
                    {service.ctaLabel[language]}
                  </Button>

                  <div className={`flex gap-1 text-yellow-400 mt-2`}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleRateService(service.id, s)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
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
