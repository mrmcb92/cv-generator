"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cvTemplates, TemplateId } from "@/types/template";

// Mini thumbnail previews for each template
const TEMPLATE_THUMBS: Record<TemplateId, React.ReactNode> = {
  classic: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect width="40" height="52" fill="white"/>
      <rect width="40" height="12" fill="#1e293b"/>
      <rect x="4" y="3" width="18" height="2.5" rx="1" fill="white" opacity="0.9"/>
      <rect x="4" y="7" width="12" height="1.5" rx="0.5" fill="white" opacity="0.5"/>
      <rect x="4" y="16" width="32" height="1" rx="0.5" fill="#e2e8f0"/>
      <rect x="4" y="19" width="22" height="1.5" rx="0.5" fill="#94a3b8"/>
      <rect x="4" y="22" width="28" height="1" rx="0.5" fill="#cbd5e1"/>
      <rect x="4" y="25" width="28" height="1" rx="0.5" fill="#e2e8f0"/>
      <rect x="4" y="30" width="32" height="1" rx="0.5" fill="#e2e8f0"/>
      <rect x="4" y="33" width="20" height="1.5" rx="0.5" fill="#94a3b8"/>
      <rect x="4" y="36" width="28" height="1" rx="0.5" fill="#cbd5e1"/>
      <rect x="4" y="41" width="14" height="1" rx="0.5" fill="#e2e8f0"/>
      <rect x="22" y="41" width="14" height="1" rx="0.5" fill="#e2e8f0"/>
      <rect x="4" y="43.5" width="10" height="1" rx="0.5" fill="#cbd5e1"/>
      <rect x="22" y="43.5" width="10" height="1" rx="0.5" fill="#cbd5e1"/>
    </svg>
  ),
  modern: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect width="40" height="52" fill="white"/>
      <rect width="14" height="52" fill="#0f172a"/>
      <rect x="2" y="4" width="8" height="2" rx="0.5" fill="#38bdf8" opacity="0.9"/>
      <rect x="2" y="7" width="6" height="1.2" rx="0.5" fill="white" opacity="0.6"/>
      <rect x="2" y="12" width="10" height="0.8" rx="0.3" fill="#38bdf8" opacity="0.5"/>
      <rect x="2" y="14" width="8" height="0.8" rx="0.3" fill="white" opacity="0.3"/>
      <rect x="2" y="15.5" width="8" height="0.8" rx="0.3" fill="white" opacity="0.3"/>
      <rect x="2" y="20" width="10" height="0.8" rx="0.3" fill="#38bdf8" opacity="0.5"/>
      <rect x="2" y="22" width="9" height="0.5" rx="0.2" fill="white" opacity="0.25"/>
      <rect x="2" y="23.2" width="7" height="0.5" rx="0.2" fill="white" opacity="0.25"/>
      <rect x="2" y="24.4" width="8" height="0.5" rx="0.2" fill="white" opacity="0.25"/>
      <rect x="17" y="4" width="19" height="0.8" rx="0.3" fill="#0ea5e9" opacity="0.7"/>
      <rect x="17" y="6.5" width="14" height="1.2" rx="0.4" fill="#1e293b"/>
      <rect x="17" y="8.5" width="10" height="1" rx="0.4" fill="#94a3b8"/>
      <rect x="17" y="11" width="19" height="0.5" rx="0.2" fill="#e2e8f0"/>
      <rect x="17" y="13" width="19" height="0.8" rx="0.3" fill="#0ea5e9" opacity="0.7"/>
      <rect x="17" y="15" width="14" height="1.2" rx="0.4" fill="#1e293b"/>
      <rect x="17" y="17" width="10" height="1" rx="0.4" fill="#0ea5e9" opacity="0.6"/>
      <rect x="17" y="19" width="19" height="0.5" rx="0.2" fill="#e2e8f0"/>
    </svg>
  ),
  minimal: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect width="40" height="52" fill="white"/>
      <rect x="4" y="5" width="24" height="4" rx="1" fill="#18181b" opacity="0.85"/>
      <rect x="4" y="11" width="30" height="0.6" rx="0.2" fill="#e4e4e7"/>
      <rect x="4" y="14" width="32" height="0.8" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="16" width="28" height="0.8" rx="0.3" fill="#d4d4d8"/>
      <rect x="4" y="18" width="30" height="0.8" rx="0.3" fill="#d4d4d8"/>
      <rect x="4" y="23" width="8" height="0.8" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="26" width="18" height="1" rx="0.4" fill="#3f3f46"/>
      <rect x="4" y="28" width="12" height="0.8" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="31" width="28" height="0.6" rx="0.2" fill="#d4d4d8"/>
      <rect x="4" y="33" width="18" height="1" rx="0.4" fill="#3f3f46"/>
      <rect x="4" y="35" width="12" height="0.8" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="38" width="30" height="0.6" rx="0.2" fill="#d4d4d8"/>
      <rect x="4" y="41" width="8" height="0.8" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="43.5" width="14" height="0.7" rx="0.3" fill="#d4d4d8"/>
      <rect x="20" y="43.5" width="14" height="0.7" rx="0.3" fill="#d4d4d8"/>
    </svg>
  ),
  creative: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect width="40" height="52" fill="white"/>
      <rect width="40" height="1.5" fill="url(#cg)"/>
      <defs>
        <linearGradient id="cg" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#0ea5e9"/>
          <stop offset="100%" stopColor="#22d3ee"/>
        </linearGradient>
      </defs>
      <rect x="4" y="5" width="20" height="3.5" rx="0.8" fill="#0f172a" opacity="0.9"/>
      <rect x="28" y="5" width="8" height="1" rx="0.3" fill="#94a3b8" opacity="0.6"/>
      <rect x="28" y="7" width="6" height="1" rx="0.3" fill="#94a3b8" opacity="0.4"/>
      <rect x="4" y="11" width="30" height="0.5" rx="0.2" fill="#f1f5f9"/>
      <rect x="4" y="14" width="2" height="2" rx="0.3" fill="#0ea5e9"/>
      <rect x="8" y="14.2" width="8" height="0.8" rx="0.3" fill="#0ea5e9" opacity="0.8"/>
      <rect x="4" y="18" width="2" height="14" rx="0.3" fill="#bae6fd" opacity="0.6"/>
      <rect x="8" y="18" width="14" height="1.2" rx="0.4" fill="#1e293b"/>
      <rect x="8" y="20.5" width="10" height="1" rx="0.3" fill="#0ea5e9" opacity="0.7"/>
      <rect x="8" y="22.5" width="22" height="0.7" rx="0.3" fill="#d1d5db"/>
      <rect x="8" y="24.5" width="18" height="0.7" rx="0.3" fill="#d1d5db"/>
      <rect x="8" y="27.5" width="14" height="1.2" rx="0.4" fill="#1e293b"/>
      <rect x="8" y="30" width="10" height="1" rx="0.3" fill="#0ea5e9" opacity="0.7"/>
      <rect x="4" y="35" width="2" height="0.8" rx="0.3" fill="#0ea5e9"/>
      <rect x="8" y="35" width="8" height="0.8" rx="0.3" fill="#0ea5e9" opacity="0.8"/>
      <rect x="4" y="38" width="8" height="3" rx="1" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="0.4"/>
      <rect x="14" y="38" width="8" height="3" rx="1" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="0.4"/>
      <rect x="24" y="38" width="8" height="3" rx="1" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="0.4"/>
    </svg>
  ),
  academic: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect width="40" height="52" fill="white"/>
      <rect width="40" height="14" fill="#6d28d9"/>
      <rect x="4" y="3" width="16" height="2.5" rx="1" fill="white" opacity="0.9"/>
      <rect x="4" y="7" width="10" height="1.5" rx="0.5" fill="white" opacity="0.5"/>
      <rect x="4" y="17" width="32" height="0.8" rx="0.3" fill="#e2e8f0"/>
      <rect x="4" y="20" width="3" height="3" rx="0.5" fill="#6d28d9"/>
      <rect x="9" y="21" width="22" height="0.8" rx="0.3" fill="#cbd5e1"/>
      <rect x="9" y="23" width="14" height="0.7" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="26" width="3" height="10" rx="0.5" fill="#ddd6fe" opacity="0.6"/>
      <rect x="9" y="27" width="14" height="1" rx="0.4" fill="#1e293b"/>
      <rect x="9" y="29.5" width="10" height="0.8" rx="0.3" fill="#6d28d9" opacity="0.7"/>
      <rect x="9" y="31.5" width="22" height="0.6" rx="0.3" fill="#d1d5db"/>
      <rect x="9" y="33.5" width="18" height="0.6" rx="0.3" fill="#d1d5db"/>
      <rect x="4" y="39" width="3" height="2" rx="0.5" fill="#6d28d9"/>
      <rect x="9" y="39.5" width="8" height="0.7" rx="0.3" fill="#6d28d9" opacity="0.8"/>
      <rect x="4" y="44" width="10" height="1.2" rx="0.4" fill="#1e293b" opacity="0.9"/>
      <rect x="16" y="44" width="8" height="1.2" rx="0.4" fill="#1e293b" opacity="0.9"/>
      <rect x="26" y="44" width="10" height="1.2" rx="0.4" fill="#1e293b" opacity="0.9"/>
    </svg>
  ),
  executive: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect width="40" height="52" fill="white"/>
      <rect width="40" height="2" fill="#b91c1c"/>
      <rect x="4" y="5" width="22" height="3.5" rx="0.8" fill="#1e293b" opacity="0.9"/>
      <rect x="4" y="10" width="12" height="1.2" rx="0.4" fill="#94a3b8"/>
      <rect x="4" y="12.5" width="30" height="0.6" rx="0.2" fill="#e2e8f0"/>
      <rect x="4" y="14.5" width="32" height="0.5" rx="0.2" fill="#f1f5f9"/>
      <rect x="4" y="17" width="8" height="0.7" rx="0.3" fill="#b91c1c"/>
      <rect x="4" y="19" width="32" height="0.9" rx="0.3" fill="#1e293b"/>
      <rect x="4" y="21" width="28" height="0.7" rx="0.3" fill="#b91c1c" opacity="0.5"/>
      <rect x="4" y="23.5" width="30" height="0.5" rx="0.2" fill="#d1d5db"/>
      <rect x="4" y="25.5" width="30" height="0.5" rx="0.2" fill="#d1d5db"/>
      <rect x="4" y="28.5" width="8" height="0.7" rx="0.3" fill="#b91c1c"/>
      <rect x="4" y="30.5" width="32" height="0.9" rx="0.3" fill="#1e293b"/>
      <rect x="4" y="32.5" width="24" height="0.7" rx="0.3" fill="#b91c1c" opacity="0.5"/>
      <rect x="4" y="35" width="28" height="0.5" rx="0.2" fill="#d1d5db"/>
      <rect x="4" y="37" width="28" height="0.5" rx="0.2" fill="#d1d5db"/>
      <rect x="4" y="40" width="8" height="0.7" rx="0.3" fill="#b91c1c"/>
      <rect x="4" y="42" width="14" height="0.8" rx="0.3" fill="#94a3b8"/>
      <rect x="20" y="42" width="8" height="0.8" rx="0.3" fill="#94a3b8"/>
      <rect x="4" y="44.5" width="10" height="0.6" rx="0.2" fill="#cbd5e1"/>
      <rect x="18" y="44.5" width="10" height="0.6" rx="0.2" fill="#cbd5e1"/>
    </svg>
  ),
};

// Larger preview for hover tooltip (~3x scale)
const TEMPLATE_PREVIEW_HOVER: Record<TemplateId, React.ReactNode> = {
  classic: (
    <svg viewBox="0 0 40 52" width={240} height={312}>
      <rect width="40" height="52" fill="white"/>
      <rect width="40" height="12" fill="#1e293b"/>
      <rect x="4" y="3" width="18" height="2.5" rx="1" fill="white" opacity="0.9"/>
      <rect x="4" y="7" width="12" height="1.5" rx="0.5" fill="white" opacity="0.5"/>
      <rect x="4" y="16" width="32" height="1" rx="0.5" fill="#e2e8f0"/>
      <rect x="4" y="19" width="22" height="1.5" rx="0.5" fill="#94a3b8"/>
      <rect x="4" y="22" width="28" height="1" rx="0.5" fill="#cbd5e1"/>
      <rect x="4" y="25" width="28" height="1" rx="0.5" fill="#e2e8f0"/>
      <rect x="4" y="30" width="32" height="1" rx="0.5" fill="#e2e8f0"/>
      <rect x="4" y="33" width="20" height="1.5" rx="0.5" fill="#94a3b8"/>
      <rect x="4" y="36" width="28" height="1" rx="0.5" fill="#cbd5e1"/>
      <rect x="4" y="41" width="14" height="1" rx="0.5" fill="#e2e8f0"/>
      <rect x="22" y="41" width="14" height="1" rx="0.5" fill="#e2e8f0"/>
      <rect x="4" y="43.5" width="10" height="1" rx="0.5" fill="#cbd5e1"/>
      <rect x="22" y="43.5" width="10" height="1" rx="0.5" fill="#cbd5e1"/>
    </svg>
  ),
  modern: (
    <svg viewBox="0 0 40 52" width={240} height={312}>
      <rect width="40" height="52" fill="white"/>
      <rect width="14" height="52" fill="#0f172a"/>
      <rect x="2" y="4" width="8" height="2" rx="0.5" fill="#38bdf8" opacity="0.9"/>
      <rect x="2" y="7" width="6" height="1.2" rx="0.5" fill="white" opacity="0.6"/>
      <rect x="2" y="12" width="10" height="0.8" rx="0.3" fill="#38bdf8" opacity="0.5"/>
      <rect x="2" y="14" width="8" height="0.8" rx="0.3" fill="white" opacity="0.3"/>
      <rect x="2" y="15.5" width="8" height="0.8" rx="0.3" fill="white" opacity="0.3"/>
      <rect x="2" y="20" width="10" height="0.8" rx="0.3" fill="#38bdf8" opacity="0.5"/>
      <rect x="2" y="22" width="9" height="0.5" rx="0.2" fill="white" opacity="0.25"/>
      <rect x="2" y="23.2" width="7" height="0.5" rx="0.2" fill="white" opacity="0.25"/>
      <rect x="2" y="24.4" width="8" height="0.5" rx="0.2" fill="white" opacity="0.25"/>
      <rect x="17" y="4" width="19" height="0.8" rx="0.3" fill="#0ea5e9" opacity="0.7"/>
      <rect x="17" y="6.5" width="14" height="1.2" rx="0.4" fill="#1e293b"/>
      <rect x="17" y="8.5" width="10" height="1" rx="0.4" fill="#94a3b8"/>
      <rect x="17" y="11" width="19" height="0.5" rx="0.2" fill="#e2e8f0"/>
      <rect x="17" y="13" width="19" height="0.8" rx="0.3" fill="#0ea5e9" opacity="0.7"/>
      <rect x="17" y="15" width="14" height="1.2" rx="0.4" fill="#1e293b"/>
      <rect x="17" y="17" width="10" height="1" rx="0.4" fill="#0ea5e9" opacity="0.6"/>
      <rect x="17" y="19" width="19" height="0.5" rx="0.2" fill="#e2e8f0"/>
    </svg>
  ),
  minimal: (
    <svg viewBox="0 0 40 52" width={240} height={312}>
      <rect width="40" height="52" fill="white"/>
      <rect x="4" y="5" width="24" height="4" rx="1" fill="#18181b" opacity="0.85"/>
      <rect x="4" y="11" width="30" height="0.6" rx="0.2" fill="#e4e4e7"/>
      <rect x="4" y="14" width="32" height="0.8" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="16" width="28" height="0.8" rx="0.3" fill="#d4d4d8"/>
      <rect x="4" y="18" width="30" height="0.8" rx="0.3" fill="#d4d4d8"/>
      <rect x="4" y="23" width="8" height="0.8" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="26" width="18" height="1" rx="0.4" fill="#3f3f46"/>
      <rect x="4" y="28" width="12" height="0.8" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="31" width="28" height="0.6" rx="0.2" fill="#d4d4d8"/>
      <rect x="4" y="33" width="18" height="1" rx="0.4" fill="#3f3f46"/>
      <rect x="4" y="35" width="12" height="0.8" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="38" width="30" height="0.6" rx="0.2" fill="#d4d4d8"/>
      <rect x="4" y="41" width="8" height="0.8" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="43.5" width="14" height="0.7" rx="0.3" fill="#d4d4d8"/>
      <rect x="20" y="43.5" width="14" height="0.7" rx="0.3" fill="#d4d4d8"/>
    </svg>
  ),
  creative: (
    <svg viewBox="0 0 40 52" width={240} height={312}>
      <rect width="40" height="52" fill="white"/>
      <rect width="40" height="1.5" fill="url(#cg1)"/>
      <defs>
        <linearGradient id="cg1" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#0ea5e9"/>
          <stop offset="100%" stopColor="#22d3ee"/>
        </linearGradient>
      </defs>
      <rect x="4" y="5" width="20" height="3.5" rx="0.8" fill="#0f172a" opacity="0.9"/>
      <rect x="28" y="5" width="8" height="1" rx="0.3" fill="#94a3b8" opacity="0.6"/>
      <rect x="28" y="7" width="6" height="1" rx="0.3" fill="#94a3b8" opacity="0.4"/>
      <rect x="4" y="11" width="30" height="0.5" rx="0.2" fill="#f1f5f9"/>
      <rect x="4" y="14" width="2" height="2" rx="0.3" fill="#0ea5e9"/>
      <rect x="8" y="14.2" width="8" height="0.8" rx="0.3" fill="#0ea5e9" opacity="0.8"/>
      <rect x="4" y="18" width="2" height="14" rx="0.3" fill="#bae6fd" opacity="0.6"/>
      <rect x="8" y="18" width="14" height="1.2" rx="0.4" fill="#1e293b"/>
      <rect x="8" y="20.5" width="10" height="1" rx="0.3" fill="#0ea5e9" opacity="0.7"/>
      <rect x="8" y="22.5" width="22" height="0.7" rx="0.3" fill="#d1d5db"/>
      <rect x="8" y="24.5" width="18" height="0.7" rx="0.3" fill="#d1d5db"/>
      <rect x="8" y="27.5" width="14" height="1.2" rx="0.4" fill="#1e293b"/>
      <rect x="8" y="30" width="10" height="1" rx="0.3" fill="#0ea5e9" opacity="0.7"/>
      <rect x="4" y="35" width="2" height="0.8" rx="0.3" fill="#0ea5e9"/>
      <rect x="8" y="35" width="8" height="0.8" rx="0.3" fill="#0ea5e9" opacity="0.8"/>
      <rect x="4" y="38" width="8" height="3" rx="1" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="0.4"/>
      <rect x="14" y="38" width="8" height="3" rx="1" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="0.4"/>
      <rect x="24" y="38" width="8" height="3" rx="1" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="0.4"/>
    </svg>
  ),
  academic: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect width="40" height="52" fill="white"/>
      <rect width="40" height="14" fill="#6d28d9"/>
      <rect x="4" y="3" width="16" height="2.5" rx="1" fill="white" opacity="0.9"/>
      <rect x="4" y="7" width="10" height="1.5" rx="0.5" fill="white" opacity="0.5"/>
      <rect x="4" y="17" width="32" height="0.8" rx="0.3" fill="#e2e8f0"/>
      <rect x="4" y="20" width="3" height="3" rx="0.5" fill="#6d28d9"/>
      <rect x="9" y="21" width="22" height="0.8" rx="0.3" fill="#cbd5e1"/>
      <rect x="9" y="23" width="14" height="0.7" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="26" width="3" height="10" rx="0.5" fill="#ddd6fe" opacity="0.6"/>
      <rect x="9" y="27" width="14" height="1" rx="0.4" fill="#1e293b"/>
      <rect x="9" y="29.5" width="10" height="0.8" rx="0.3" fill="#6d28d9" opacity="0.7"/>
      <rect x="9" y="31.5" width="22" height="0.6" rx="0.3" fill="#d1d5db"/>
      <rect x="9" y="33.5" width="18" height="0.6" rx="0.3" fill="#d1d5db"/>
      <rect x="4" y="39" width="3" height="2" rx="0.5" fill="#6d28d9"/>
      <rect x="9" y="39.5" width="8" height="0.7" rx="0.3" fill="#6d28d9" opacity="0.8"/>
      <rect x="4" y="44" width="10" height="1.2" rx="0.4" fill="#1e293b" opacity="0.9"/>
      <rect x="16" y="44" width="8" height="1.2" rx="0.4" fill="#1e293b" opacity="0.9"/>
      <rect x="26" y="44" width="10" height="1.2" rx="0.4" fill="#1e293b" opacity="0.9"/>
    </svg>
  ),
  executive: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect width="40" height="52" fill="white"/>
      <rect width="40" height="2" fill="#b91c1c"/>
      <rect x="4" y="5" width="22" height="3.5" rx="0.8" fill="#1e293b" opacity="0.9"/>
      <rect x="4" y="10" width="12" height="1.2" rx="0.4" fill="#94a3b8"/>
      <rect x="4" y="12.5" width="30" height="0.6" rx="0.2" fill="#e2e8f0"/>
      <rect x="4" y="14.5" width="32" height="0.5" rx="0.2" fill="#f1f5f9"/>
      <rect x="4" y="17" width="8" height="0.7" rx="0.3" fill="#b91c1c"/>
      <rect x="4" y="19" width="32" height="0.9" rx="0.3" fill="#1e293b"/>
      <rect x="4" y="21" width="28" height="0.7" rx="0.3" fill="#b91c1c" opacity="0.5"/>
      <rect x="4" y="23.5" width="30" height="0.5" rx="0.2" fill="#d1d5db"/>
      <rect x="4" y="25.5" width="30" height="0.5" rx="0.2" fill="#d1d5db"/>
      <rect x="4" y="28.5" width="8" height="0.7" rx="0.3" fill="#b91c1c"/>
      <rect x="4" y="30.5" width="32" height="0.9" rx="0.3" fill="#1e293b"/>
      <rect x="4" y="32.5" width="24" height="0.7" rx="0.3" fill="#b91c1c" opacity="0.5"/>
      <rect x="4" y="35" width="28" height="0.5" rx="0.2" fill="#d1d5db"/>
      <rect x="4" y="37" width="28" height="0.5" rx="0.2" fill="#d1d5db"/>
      <rect x="4" y="40" width="8" height="0.7" rx="0.3" fill="#b91c1c"/>
      <rect x="4" y="42" width="14" height="0.8" rx="0.3" fill="#94a3b8"/>
      <rect x="20" y="42" width="8" height="0.8" rx="0.3" fill="#94a3b8"/>
      <rect x="4" y="44.5" width="10" height="0.6" rx="0.2" fill="#cbd5e1"/>
      <rect x="18" y="44.5" width="10" height="0.6" rx="0.2" fill="#cbd5e1"/>
    </svg>
  ),
};

interface Props {
  selected: TemplateId;
  onChange: (id: TemplateId) => void;
  isDark: boolean;
}

export default function TemplatePicker({ selected, onChange, isDark }: Props) {
  const [hoveredId, setHoveredId] = useState<TemplateId | null>(null);
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0 border-b overflow-x-auto"
      style={{
        borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
        background: isDark ? "rgba(9,9,11,0.5)" : "rgba(248,250,252,0.9)",
      }}>
      <span className={`text-[10px] font-semibold uppercase tracking-[0.1em] flex-shrink-0 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
        Template
      </span>
      <div className="flex gap-2">
        {cvTemplates.map((tpl) => {
          const active = selected === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => onChange(tpl.id)}
              onMouseEnter={() => setHoveredId(tpl.id)}
              onMouseLeave={() => setHoveredId(null)}
              title={tpl.description}
              className="group flex flex-col items-center gap-1 flex-shrink-0 transition-all duration-200 active:scale-95"
              style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
            >
              <div className="relative">
                <div
                  className={`w-10 h-[52px] rounded-md overflow-hidden transition-all duration-200 ${
                    active
                      ? "ring-2 ring-sky-500 shadow-md shadow-sky-500/20"
                      : isDark
                        ? "ring-1 ring-white/10 opacity-50 hover:opacity-80 hover:ring-white/20"
                        : "ring-1 ring-black/10 opacity-50 hover:opacity-80 hover:ring-black/15"
                  }`}
                >
                  {TEMPLATE_THUMBS[tpl.id]}
                </div>
                <AnimatePresence>
                  {hoveredId === tpl.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 shadow-lg rounded-xl p-2 ${
                        isDark ? "bg-zinc-800" : "bg-white"
                      }`}
                    >
                      <div className="w-60 h-[312px]">
                        {TEMPLATE_PREVIEW_HOVER[tpl.id]}
                      </div>
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent ${
                          isDark ? "border-t-zinc-800" : "border-t-white"
                        }`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className={`text-[9px] font-medium transition-colors ${
                active
                  ? isDark ? "text-sky-400" : "text-sky-600"
                  : isDark ? "text-zinc-600" : "text-zinc-400"
              }`}>
                {tpl.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
