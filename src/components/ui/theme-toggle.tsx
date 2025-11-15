'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const themes = [
    { name: 'light', icon: Sun, label: 'Light' },
    { name: 'dark', icon: Moon, label: 'Dark' },
    { name: 'system', icon: Monitor, label: 'System' }
  ] as const

  const currentTheme = themes.find(t => t.name === theme) || themes[2]

  if (!mounted) {
    return null
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-background/50 backdrop-blur-sm border-border/50"
      >
        <currentTheme.icon className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-lg">
          {themes.map((themeOption) => (
            <button
              key={themeOption.name}
              onClick={() => {
                setTheme(themeOption.name)
                setIsOpen(false)
              }}
              className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${
                theme === themeOption.name ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <themeOption.icon className="mr-2 h-4 w-4" />
              {themeOption.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}