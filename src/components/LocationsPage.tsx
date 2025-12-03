"use client";

import { usePreferences } from "@/context/PreferencesContext";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

type Copy = {
  name: string;
  address: string;
  schedule: string;
  phone: string;
  note: string;
};

type LocalizedLocation = {
  id: string;
  es: Copy;
  en: Copy;
};

const LOCATIONS: LocalizedLocation[] = [
  {
    id: "triana",
    es: {
      name: "Sede Triana",
      address: "Calle Mayor de Triana 45 • 35002 • Las Palmas de Gran Canaria",
      schedule: "Lunes a viernes: 10:00–14:00 / 16:30–20:30\nSábados: 10:00–14:00",
      phone: "Teléfono: +34 828 001 122",
      note: "En pleno corazón comercial de Triana. Reparaciones rápidas en el día.",
    },
    en: {
      name: "Triana Location",
      address: "Calle Mayor de Triana 45 • 35002 • Las Palmas de Gran Canaria",
      schedule: "Mon–Fri: 10:00–14:00 / 16:30–20:30\nSaturday: 10:00–14:00",
      phone: "Phone: +34 828 001 122",
      note: "Right in Triana's shopping area. Same-day repairs available.",
    },
  },
  {
    id: "mesa",
    es: {
      name: "Sede Mesa y López",
      address: "Avenida José Mesa y López 82 • 35010 • Las Palmas de G.C.",
      schedule: "Lunes a viernes: 9:30–14:00 / 17:00–21:00",
      phone: "Teléfono: +34 828 333 444",
      note: "Zona comercial por excelencia. Servicio express de cambio de pantalla.",
    },
    en: {
      name: "Mesa y López Location",
      address: "Avenida José Mesa y López 82 • 35010 • Las Palmas de G.C.",
      schedule: "Mon–Fri: 9:30–14:00 / 17:00–21:00",
      phone: "Phone: +34 828 333 444",
      note: "Prime shopping street. Express screen replacements available.",
    },
  },
  {
    id: "siete",
    es: {
      name: "Sede Siete Palmas",
      address: "Centro Comercial 7 Palmas • Planta 1 • 35012 • Las Palmas de G.C.",
      schedule: "Lunes a domingo: 10:00–22:00",
      phone: "Teléfono: +34 828 555 666",
      note: "Perfecto para dejar tu móvil mientras haces compras o deporte.",
    },
    en: {
      name: "Siete Palmas Location",
      address: "Centro Comercial 7 Palmas • Floor 1 • 35012 • Las Palmas de G.C.",
      schedule: "Monday to Sunday: 10:00–22:00",
      phone: "Phone: +34 828 555 666",
      note: "Ideal to leave your phone while you shop or work out.",
    },
  },
];

const ABOUT_COPY = {
  es: {
    title: "Sobre mí",
    intro:
      "¡Hola! Soy Adib Guardiola, fundador de esta BarberShop cerca de la playa de Las Canteras. Siempre he vivido entre el mar, el trato humano y el cuidado personal.",
    middle:
      "Con años de experiencia en peluquería y barbería, decidí crear un espacio donde se combinan técnica, calidad, ambiente relajado y atención cercana.",
    closing:
      "Gracias por confiar en este proyecto. Será un placer verte en alguna de nuestras sedes. 💈✂️",
  },
  en: {
    title: "About me",
    intro:
      "Hi! I'm Adib Guardiola, founder of this BarberShop near Las Canteras beach. I've always lived between the sea, people, and personal care.",
    middle:
      "After years in hairdressing and barbering, I created a space that mixes technique, quality, a relaxed vibe, and close attention.",
    closing:
      "Thanks for trusting this project. I'd love to see you at any of our locations. 💈✂️",
  },
};

export function LocationsPage() {
  const { language, theme } = usePreferences();
  const isDark = theme === "dark";
  const about = ABOUT_COPY[language];

  const cardText = isDark ? "text-slate-300" : "text-slate-700";
  const subtleText = isDark ? "text-slate-400" : "text-slate-600";
  const footerText = isDark ? "text-slate-500" : "text-slate-500";
  const aboutBackground = isDark
    ? "bg-slate-800/40 text-slate-200 shadow-black/30"
    : "bg-slate-100 text-slate-800";
  const aboutBorder = isDark ? "border-slate-700" : "border-slate-200";

  return (
    <>
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {LOCATIONS.map((location) => {
          const copy = location[language];
          return (
            <Card
              key={location.id}
              className={isDark ? "shadow-black/30" : "shadow-slate-200/60"}
            >
              <CardHeader>
                <CardTitle>{copy.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className={cardText}>{copy.address}</p>
                <p className={`${subtleText} whitespace-pre-line text-xs`}>
                  {copy.schedule}
                </p>
                <p className={`${cardText} text-xs`}>{copy.phone}</p>
                <p className={`text-[11px] ${footerText}`}>{copy.note}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section
        className={`mt-12 flex flex-col md:flex-row items-center gap-8 p-6 rounded-xl border ${aboutBackground} ${aboutBorder}`}
      >
        <img
          src="/images/mifoto.jpg"
          alt={about.title}
          className={`w-40 h-40 rounded-full object-cover shadow-md border ${aboutBorder}`}
        />

        <div className={`text-sm md:text-base max-w-2xl ${cardText}`}>
          <h2 className="text-xl font-semibold text-cyan-500 mb-2">
            {about.title}
          </h2>

          <p className="mb-3">{about.intro}</p>
          <p className="mb-3">{about.middle}</p>
          <p>{about.closing}</p>
        </div>
      </section>
    </>
  );
}
