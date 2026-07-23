"use client"

import { createContext, useContext, useState, useCallback } from "react"

type ToastType = "success" | "error" | "info"

type Toast = {
  id: number
  message: string
  type: ToastType
}

type ToastContextType = {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType) => void
  removeToast: (id: number) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

let toastId = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 3500)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => removeToast(t.id)}
            className={`pointer-events-auto flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-lg border backdrop-blur-md text-sm font-medium cursor-pointer transition-all duration-300 animate-toast-in ${
              t.type === "success"
                ? "bg-green-700/90 border-green-600/50 text-white"
                : t.type === "error"
                ? "bg-red-700/90 border-red-600/50 text-white"
                : "bg-gray-800/90 border-gray-700/50 text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {t.type === "success" ? "check_circle" : t.type === "error" ? "error" : "info"}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}
