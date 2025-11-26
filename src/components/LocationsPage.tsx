import { Card, CardHeader, CardTitle, CardContent } from "./Card";

export function LocationsPage() {
  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Sede Triana */}
      <Card className="bg-slate-800/80 shadow-lg shadow-black/30">
        <CardHeader>
          <CardTitle>Sede Triana</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-slate-300">
            Calle Mayor de Triana 45 • 35002 • Las Palmas de Gran Canaria
          </p>
          <p className="text-slate-400 text-xs">
            Lunes a viernes: 10:00–14:00 / 16:30–20:30
            <br />
            Sábados: 10:00–14:00
          </p>
          <p className="text-slate-300 text-xs">
            Teléfono: <span className="font-semibold">+34 828 001 122</span>
          </p>
          <p className="text-[11px] text-slate-500">
            En pleno corazón comercial de Triana. Reparaciones rápidas en el día.
          </p>
        </CardContent>
      </Card>

      {/* Sede Mesa y López */}
      <Card className="bg-slate-800/80 shadow-lg shadow-black/30">
        <CardHeader>
          <CardTitle>Sede Mesa y López</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-slate-300">
            Avenida José Mesa y López 82 • 35010 • Las Palmas de G.C.
          </p>
          <p className="text-slate-400 text-xs">
            Lunes a viernes: 9:30–14:00 / 17:00–21:00
          </p>
          <p className="text-slate-300 text-xs">
            Teléfono: <span className="font-semibold">+34 828 333 444</span>
          </p>
          <p className="text-[11px] text-slate-500">
            Zona comercial por excelencia. Servicio express de cambio de pantalla.
          </p>
        </CardContent>
      </Card>

      {/* Sede Siete Palmas */}
      <Card className="bg-slate-800/80 shadow-lg shadow-black/30">
        <CardHeader>
          <CardTitle>Sede Siete Palmas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-slate-300">
            Centro Comercial 7 Palmas • Planta 1 • 35012 • Las Palmas de G.C.
          </p>
          <p className="text-slate-400 text-xs">
            Lunes a domingo: 10:00–22:00
          </p>
          <p className="text-slate-300 text-xs">
            Teléfono: <span className="font-semibold">+34 828 555 666</span>
          </p>
          <p className="text-[11px] text-slate-500">
            Perfecto para dejar tu móvil mientras haces compras o deporte.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

