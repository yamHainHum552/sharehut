"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Folder, Activity, Server } from "lucide-react";

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  icon: any;
}

const stats: Stat[] = [
  { label: "Active Rooms", value: 11, suffix: "+", icon: Activity },
  { label: "Users Joined", value: 15, suffix: "+", icon: Users },
  { label: "Files Shared", value: 100, suffix: "+", icon: Folder },
  { label: "Uptime", value: 99.9, suffix: "%", icon: Server },
];

export default function BrandStatsSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));

  /* ---------------- Intersection Observer ---------------- */

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // Trigger only once
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  /* ---------------- Counter Animation ---------------- */

  useEffect(() => {
    if (!visible) return;

    const duration = 1500;
    const steps = 40;
    const intervalTime = duration / steps;

    const intervals = stats.map((stat, index) => {
      const increment = stat.value / steps;

      return setInterval(() => {
        setCounts((prev) => {
          const updated = [...prev];
          if (updated[index] < stat.value) {
            updated[index] = Math.min(stat.value, updated[index] + increment);
          }
          return updated;
        });
      }, intervalTime);
    });

    return () => intervals.forEach(clearInterval);
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 bg-gradient-to-b from-black to-neutral-950 overflow-hidden"
    >
      {/* Heading */}
      <div
        className={`max-w-6xl mx-auto text-center mb-14 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Trusted by Collaborators Worldwide
        </h2>
        <p className="text-neutral-400 mt-3 max-w-2xl mx-auto">
          ShareHut powers real-time collaboration for teams, students, and
          professionals who need instant secure sharing.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className={`bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-1000 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-16"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="mb-4 p-3 rounded-full bg-neutral-800">
                <Icon size={24} className="text-purple-500" />
              </div>

              <div className="text-3xl md:text-4xl font-bold text-white">
                {stat.suffix === "%"
                  ? counts[index].toFixed(1)
                  : Math.floor(counts[index])}
                {stat.suffix}
              </div>

              <p className="text-neutral-400 mt-2 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
