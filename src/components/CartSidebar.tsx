// src/components/CartSidebar.tsx
"use client";

import { useState } from "react";
import Button from "./Button";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import type { CartItem } from "@/app/page";
import { usePreferences } from "@/context/PreferencesContext";

type CartSidebarProps = {
  cart: CartItem[];
  total: number;
  onClear: () => void;
  onConfirm: (booking: { name: string; date: string; time: string }) => void;
};

type Copy = {
  cart: string;
  empty: string;
  total: string;
  name: string;
  namePlaceholder: string;
  date: string;
  previous: string;
  next: string;
  availability: string;
  time: string;
  timePlaceholder: string;
  confirm: string;
  clear: string;
  disclaimer: string;
  itemLabel: (count: number) => string;
};

const MONDAY_FIRST_WEEKDAY = 1;
const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

const COPY: Record<"es" | "en", Copy> = {
  es: {
    cart: "Carrito",
    empty: "Aún no has añadido ningún servicio. Selecciona uno para verlo aquí.",
    total: "Total servicios:",
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    date: "Fecha",
    previous: "← Anterior",
    next: "Siguiente →",
    availability: "Agenda disponible de lunes a sábado, de 9:00 a 13:00 y de 16:00 a 20:00.",
    time: "Hora",
    timePlaceholder: "Selecciona una hora",
    confirm: "Confirmar cita",
    clear: "Vaciar",
    disclaimer:
      "* Los servicios marcados como “Presupuesto” se confirman en tienda según el estado del cabello y el tipo de servicio.",
    itemLabel: (count) => `${count} artículo(s)`,
  },
  en: {
    cart: "Cart",
    empty: "You haven't added any service yet. Pick one to see it here.",
    total: "Service total:",
    name: "Name",
    namePlaceholder: "Your name",
    date: "Date",
    previous: "← Previous",
    next: "Next →",
    availability: "Available Monday to Saturday, 9:00–13:00 and 16:00–20:00.",
    time: "Time",
    timePlaceholder: "Select a time",
    confirm: "Confirm appointment",
    clear: "Clear",
    disclaimer:
      "* Services marked as “Quote” are confirmed in store based on hair condition and service type.",
    itemLabel: (count) => `${count} item(s)`,
  },
};

export function CartSidebar({
  cart,
  total,
  onClear,
  onConfirm,
}: CartSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [monthCursor, setMonthCursor] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const { language, theme } = usePreferences();
  const isDark = theme === "dark";
  const copy = COPY[language];

  const hasItems = cart.length > 0;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggle = () => setIsOpen((prev) => !prev);

  const today = new Date();
  const todayAtMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const isCurrentMonth =
    monthCursor.getFullYear() === todayAtMidnight.getFullYear() &&
    monthCursor.getMonth() === todayAtMidnight.getMonth();

  const goToMonth = (increment: number) => {
    const next = new Date(monthCursor);
    next.setMonth(monthCursor.getMonth() + increment, 1);
    setMonthCursor(next);
  };

  const formatDateKey = (value: Date) => value.toISOString().split("T")[0];

  const monthLabel = monthCursor.toLocaleDateString(
    language === "es" ? "es-ES" : "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  const firstDayOfMonth = new Date(
    monthCursor.getFullYear(),
    monthCursor.getMonth(),
    1,
  );
  const daysInMonth = new Date(
    monthCursor.getFullYear(),
    monthCursor.getMonth() + 1,
    0,
  ).getDate();
  const startOffset =
    (firstDayOfMonth.getDay() + 7 - MONDAY_FIRST_WEEKDAY) % 7;

  const dayLabels = language === "es"
    ? ["L", "M", "X", "J", "V", "S", "D"]
    : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const isDisabledDate = (value: Date) => {
    const weekday = value.getDay();
    const isSunday = weekday === 0;
    return isSunday || value < todayAtMidnight;
  };

  const handleConfirmClick = () => {
    if (!name || !date || !time) return;
    onConfirm({ name, date, time });
    setName("");
    setDate("");
    setTime("");
    setIsOpen(false);
  };

  const panelClass = isDark
    ? "bg-slate-900 shadow-xl shadow-black/50 border border-slate-700"
    : "bg-white shadow-xl border border-slate-200";
  const labelClass = isDark ? "text-slate-300" : "text-slate-700";
  const inputClass = isDark
    ? "w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
    : "w-full rounded-md bg-white border border-slate-300 px-2 py-1 text-xs text-slate-900 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500";
  const calendarShell = isDark
    ? "rounded-lg border border-slate-700 bg-slate-900 p-3"
    : "rounded-lg border border-slate-200 bg-slate-50 p-3";
  const navButtonClass = isDark
    ? "rounded-md bg-slate-800 px-2 py-1 text-slate-200 transition hover:bg-slate-700 disabled:opacity-40"
    : "rounded-md bg-slate-200 px-2 py-1 text-slate-800 transition hover:bg-slate-300 disabled:opacity-40";
  const dayLabelClass = isDark
    ? "text-slate-400"
    : "text-slate-500";
  const noteClass = isDark ? "text-slate-500" : "text-slate-500";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:bg-transparent"
          onClick={toggle}
        />
      )}

      <div className="fixed bottom-6 right-6 z-40 space-y-3">
        {isOpen && (
          <Card className={`w-80 max-h-[70vh] overflow-y-auto ${panelClass}`}>
            <CardHeader>
              <CardTitle>{copy.cart}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {!hasItems ? (
                <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                  {copy.empty}
                </p>
              ) : (
                <>
                  <ul className="space-y-3">
                    {cart.map((item) => (
                      <li
                        key={item.service.id}
                        className={`flex items-start justify-between gap-3 border-b pb-2 last:border-0 ${
                          isDark
                            ? "border-slate-700/70"
                            : "border-slate-200"
                        }`}
                      >
                        <div>
                          <p className="font-medium">
                            {item.service.name[language]}
                          </p>
                          <p className={isDark ? "text-xs text-slate-400" : "text-xs text-slate-600"}>
                            {item.quantity} × {" "}
                            {item.service.price > 0
                              ? `${item.service.price} €`
                              : language === "es"
                                ? "Presupuesto"
                                : "Quote"}
                          </p>
                        </div>
                        <div
                          className={
                            isDark
                              ? "text-right text-sm font-semibold text-cyan-300"
                              : "text-right text-sm font-semibold text-cyan-700"
                          }
                        >
                          {item.service.price > 0
                            ? `${item.service.price * item.quantity} €`
                            : "-"}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`mt-2 flex items-center justify-between border-t pt-3 text-sm ${
                      isDark ? "border-slate-700/70" : "border-slate-200"
                    }`}
                  >
                    <span className={`font-semibold ${labelClass}`}>
                      {copy.total}
                    </span>
                    <span
                      className={
                        isDark
                          ? "text-lg font-bold text-cyan-400"
                          : "text-lg font-bold text-cyan-700"
                      }
                    >
                      {total} €
                    </span>
                  </div>

                  <div className="space-y-3 text-xs mt-2">
                    <div>
                      <label className={`block mb-1 ${labelClass}`}>
                        {copy.name}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                        placeholder={copy.namePlaceholder}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className={`block ${labelClass}`}>{copy.date}</label>
                      <div className={calendarShell}>
                        <div className={`mb-2 flex items-center justify-between text-[11px] ${labelClass}`}>
                          <button
                            type="button"
                            className={navButtonClass}
                            onClick={() => goToMonth(-1)}
                            disabled={isCurrentMonth}
                          >
                            {copy.previous}
                          </button>
                          <span className="font-semibold capitalize">{monthLabel}</span>
                          <button
                            type="button"
                            className={navButtonClass}
                            onClick={() => goToMonth(1)}
                          >
                            {copy.next}
                          </button>
                        </div>

                        <div className={`grid grid-cols-7 gap-2 text-center text-[11px] ${dayLabelClass}`}>
                          {dayLabels.map((label) => (
                            <span key={label}>{label}</span>
                          ))}
                        </div>

                        <div className="mt-1 grid grid-cols-7 gap-2 text-sm">
                          {Array.from({ length: startOffset }).map((_, idx) => (
                            <span key={`offset-${idx}`} />
                          ))}

                          {Array.from({ length: daysInMonth }).map((_, idx) => {
                            const dayNumber = idx + 1;
                            const currentDate = new Date(
                              monthCursor.getFullYear(),
                              monthCursor.getMonth(),
                              dayNumber,
                            );
                            const disabled = isDisabledDate(currentDate);
                            const dateKey = formatDateKey(currentDate);
                            const isSelected = date === dateKey;

                            return (
                              <button
                                key={dayNumber}
                                type="button"
                                onClick={() => setDate(dateKey)}
                                disabled={disabled}
                                className={`w-full rounded-md border px-2 py-2 text-center transition ${
                                  disabled
                                    ? isDark
                                      ? "cursor-not-allowed border-slate-800 bg-slate-900 text-slate-600"
                                      : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                                    : isSelected
                                      ? "border-cyan-400 bg-cyan-500/90 text-slate-900 font-semibold shadow-sm shadow-cyan-500/40"
                                      : isDark
                                        ? "border-slate-700 bg-slate-800 text-slate-100 hover:border-cyan-500 hover:text-cyan-100"
                                        : "border-slate-200 bg-white text-slate-800 hover:border-cyan-500 hover:text-cyan-700"
                                }`}
                              >
                                {dayNumber}
                              </button>
                            );
                          })}
                        </div>
                        <p className={`mt-2 text-[11px] ${noteClass}`}>
                          {copy.availability}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className={`block mb-1 ${labelClass}`}>
                        {copy.time}
                      </label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className={inputClass}
                      >
                        <option value="">{copy.timePlaceholder}</option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1"
                      disabled={
                        total === 0 || !hasItems || !name || !date || !time
                      }
                      onClick={handleConfirmClick}
                    >
                      {copy.confirm}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={onClear}
                    >
                      {copy.clear}
                    </Button>
                  </div>
                  <p className={`text-[11px] ${noteClass}`}>
                    {copy.disclaimer}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        <Button
          className="flex items-center gap-2 rounded-full px-5 py-2 shadow-lg"
          onClick={toggle}
        >
          <span>🛒</span>
          <span className="text-sm font-semibold">
            {itemCount > 0 ? copy.itemLabel(itemCount) : copy.cart}
          </span>
          <span className="text-sm font-bold">{total > 0 ? `${total} €` : ""}</span>
        </Button>
      </div>
    </>
  );
}
