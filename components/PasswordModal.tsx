"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Lock, X, Check, ShieldAlert, KeyRound } from "lucide-react";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CORRECT_PASSWORD = "4042";

export default function PasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: PasswordModalProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const inputRef0 = useRef<HTMLInputElement>(null);
  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const inputRef3 = useRef<HTMLInputElement>(null);
  const inputRefs = [inputRef0, inputRef1, inputRef2, inputRef3];

  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setDigits(["", "", "", ""]);
      setError(false);
      setErrorMessage("");
      setIsSuccess(false);
      setIsShaking(false);

      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Focus first input box
      const timer = setTimeout(() => {
        inputRef0.current?.focus();
      }, 120);

      return () => {
        document.body.style.overflow = originalOverflow;
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  // Handle Escape key & focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap inside modal
      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Validate entered password
  const validatePassword = useCallback(
    (enteredPassword: string) => {
      if (enteredPassword === CORRECT_PASSWORD) {
        setError(false);
        setErrorMessage("");
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 600);
      } else {
        setError(true);
        setErrorMessage("Incorrect password. Please try again.");
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setTimeout(() => {
          setDigits(["", "", "", ""]);
          inputRef0.current?.focus();
        }, 300);
      }
    },
    [onSuccess]
  );

  // Handle single digit changes
  const handleChange = (index: number, value: string) => {
    if (error) {
      setError(false);
      setErrorMessage("");
    }

    const cleanValue = value.replace(/[^0-9]/g, "");

    if (cleanValue.length > 1) {
      handlePasteData(cleanValue);
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleanValue;
    setDigits(newDigits);

    if (cleanValue && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    const fullCode = newDigits.join("");
    if (fullCode.length === 4) {
      validatePassword(fullCode);
    }
  };

  // Handle Backspace & Arrow key navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
        inputRefs[index - 1].current?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 4);
    if (pastedData) handlePasteData(pastedData);
  };

  const handlePasteData = (pastedDigits: string) => {
    const newDigits = ["", "", "", ""];
    for (let i = 0; i < Math.min(pastedDigits.length, 4); i++) {
      newDigits[i] = pastedDigits[i];
    }
    setDigits(newDigits);

    if (pastedDigits.length === 4) {
      validatePassword(pastedDigits);
    } else {
      const nextFocus = Math.min(pastedDigits.length, 3);
      inputRefs[nextFocus].current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = digits.join("");
    if (entered.length < 4) {
      setError(true);
      setErrorMessage("Please enter all 4 digits.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    validatePassword(entered);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-modal-title"
      aria-describedby="password-modal-desc"
    >
      {/* Dark Translucent Space Backdrop */}
      <div
        className="fixed inset-0 bg-[#0b1528]/90 backdrop-blur-xl transition-opacity duration-300 pointer-events-auto"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-md z-10 my-auto rounded-3xl bg-[#172B45]/95 border transition-all duration-300 shadow-[0_0_60px_rgba(114,230,232,0.15),0_25px_60px_rgba(11,21,40,0.95)] backdrop-blur-2xl ring-1 ring-white/10 text-[#F2F6FA] p-6 sm:p-8 space-y-6 ${
          isShaking ? "animate-shake" : ""
        } ${
          error
            ? "border-[#D99BCF]/60 shadow-[0_0_35px_rgba(217,155,207,0.25)]"
            : isSuccess
            ? "border-[#72E6E8] shadow-[0_0_45px_rgba(114,230,232,0.4)]"
            : "border-[#72E6E8]/35"
        }`}
      >
        {/* Ambient Sci-Fi Lighting Fields */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl -z-10">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#72E6E8]/15 blur-3xl opacity-70" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-[#AAA2C8]/15 blur-3xl opacity-60" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#72E6E8]/50 to-transparent" />
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#142B52]/60 hover:bg-[#72E6E8]/20 border border-[#F2F6FA]/15 hover:border-[#72E6E8]/60 text-[#B7C7D9] hover:text-[#72E6E8] flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#72E6E8]/60 cursor-pointer z-20 group"
          aria-label="Close password modal"
        >
          <X className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-1">
          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
              isSuccess
                ? "bg-[#72E6E8]/20 border-[#72E6E8] text-[#72E6E8] shadow-[0_0_20px_rgba(114,230,232,0.4)] scale-110"
                : error
                ? "bg-[#D99BCF]/20 border-[#D99BCF] text-[#D99BCF]"
                : "bg-[#142B52]/80 border-[#72E6E8]/40 text-[#72E6E8] shadow-[0_0_15px_rgba(114,230,232,0.15)]"
            }`}
          >
            {isSuccess ? (
              <Check className="w-7 h-7 stroke-[2.5]" />
            ) : error ? (
              <ShieldAlert className="w-7 h-7" />
            ) : (
              <Lock className="w-7 h-7" />
            )}
          </div>

          <h2
            id="password-modal-title"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#F2F6FA]"
          >
            Password Required to Access
          </h2>

          <p
            id="password-modal-desc"
            className="text-xs sm:text-sm text-[#B7C7D9] leading-relaxed font-light max-w-sm pt-1"
          >
            This project portfolio contains work covered under a non-disclosure agreement (NDA), so the details are password protected.
          </p>
        </div>

        {/* 4-Digit Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-center items-center gap-3 sm:gap-4 my-2">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                aria-label={`Digit ${idx + 1} of 4`}
                className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-mono font-bold rounded-2xl bg-[#142B52]/70 border transition-all duration-200 outline-none ${
                  error
                    ? "border-[#D99BCF] bg-[#D99BCF]/10 text-[#D99BCF] focus:ring-2 focus:ring-[#D99BCF]/60"
                    : isSuccess
                    ? "border-[#72E6E8] bg-[#72E6E8]/20 text-[#F2F6FA] shadow-[0_0_15px_rgba(114,230,232,0.4)]"
                    : "text-[#72E6E8] border-[#F2F6FA]/15 focus:border-[#72E6E8] focus:bg-[#142B52] focus:shadow-[0_0_20px_rgba(114,230,232,0.3)] hover:border-[#72E6E8]/40"
                }`}
              />
            ))}
          </div>

          {/* Error message */}
          {errorMessage && (
            <p className="text-center text-xs font-mono text-[#D99BCF] flex items-center justify-center gap-1.5">
              <span>●</span>
              <span>{errorMessage}</span>
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSuccess}
            className={`w-full py-3.5 px-6 rounded-2xl font-mono text-xs sm:text-sm tracking-wider font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              isSuccess
                ? "bg-[#72E6E8] text-[#142B52] shadow-[0_0_25px_rgba(114,230,232,0.5)]"
                : "bg-[#72E6E8] hover:bg-[#88f0f2] text-[#142B52] shadow-[0_0_20px_rgba(114,230,232,0.3)] hover:shadow-[0_0_30px_rgba(114,230,232,0.5)]"
            }`}
          >
            {isSuccess ? (
              <>
                <span>ACCESS GRANTED</span>
                <Check className="w-4 h-4 stroke-[3]" />
              </>
            ) : (
              <>
                <span>UNLOCK ACCESS</span>
                <KeyRound className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-2 border-t border-[#F2F6FA]/10 text-center">
          <p className="text-[11px] sm:text-xs text-[#B7C7D9] font-mono">
            Please contact{" "}
            <a
              href="mailto:moni.dhanesh@gmail.com"
              className="text-[#72E6E8] font-semibold hover:underline focus:outline-none focus:underline"
            >
              moni.dhanesh@gmail.com
            </a>{" "}
            to request access.
          </p>
        </div>
      </div>
    </div>
  );
}
