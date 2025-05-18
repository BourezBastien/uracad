"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { themes, type Theme, getThemePreview } from "@/lib/themes";
import { useThemeStorage } from "@/hooks/use-theme-storage";

type ThemeSelectorProps = {
  organizationId: string;
};

export function ThemeSelector({ organizationId }: ThemeSelectorProps) {
  const { theme: mode } = useTheme();
  const { saveTheme } = useThemeStorage(organizationId);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const isDark = mode === "dark";

  useEffect(() => {
    // Charger le thème sauvegardé au montage
    const savedThemeName = localStorage.getItem(`theme-${organizationId}`);
    if (savedThemeName) {
      const theme = themes.find((t) => t.name === savedThemeName);
      if (theme) {
        setSelectedTheme(theme);
      }
    }
  }, [organizationId]);

  const handleThemeChange = (themeName: string) => {
    const theme = themes.find((t) => t.name === themeName);
    if (theme) {
      setSelectedTheme(theme);
      saveTheme(theme);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <RadioGroup
          value={selectedTheme.name}
          onValueChange={handleThemeChange}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {themes.map((theme) => {
            const preview = getThemePreview(theme, isDark);
            return (
              <div key={theme.name}>
                <RadioGroupItem
                  value={theme.name}
                  id={theme.name}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={theme.name}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: preview.primary }}
                      />
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: preview.secondary }}
                      />
                    </div>
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: preview.background }}
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <div className="font-medium">{theme.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {theme.description}
                    </div>
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
} 