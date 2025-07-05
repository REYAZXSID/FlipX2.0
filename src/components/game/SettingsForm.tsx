"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { THEMES, GRID_SIZES, type GameSettings } from "@/lib/game-constants";
import { Loader2 } from "lucide-react";

const FormSchema = z.object({
  gridSize: z.coerce.number().min(2).max(6),
  theme: z.string().min(1, "Please select a theme."),
  customTheme: z.string().optional(),
}).refine(data => {
    if (data.theme === 'ai-magic') {
        return !!data.customTheme && data.customTheme.length > 2;
    }
    return true;
}, {
    message: "Please enter a theme with at least 3 characters.",
    path: ["customTheme"],
});

type SettingsFormProps = {
  onStartGame: (settings: Omit<GameSettings, 'sound'>) => void;
  defaultValues: Omit<GameSettings, 'sound'>;
  isGenerating: boolean;
};

export function SettingsForm({ onStartGame, defaultValues, isGenerating }: SettingsFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gridSize: defaultValues.gridSize,
      theme: defaultValues.theme,
      customTheme: defaultValues.customTheme,
    },
  });

  const selectedTheme = useWatch({
    control: form.control,
    name: "theme"
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onStartGame)} className="space-y-6">
        <FormField
          control={form.control}
          name="gridSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Grid Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger className="py-6 text-base">
                    <SelectValue placeholder="Select a grid size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GRID_SIZES.map((size) => (
                    <SelectItem key={size.value} value={String(size.value)} className="py-2">
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Theme</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="py-6 text-base">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(THEMES).map((theme) => (
                    <SelectItem key={theme.name} value={theme.name} className="py-2">
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedTheme === 'ai-magic' && (
          <FormField
            control={form.control}
            name="customTheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Custom AI Theme</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. 'Cute Dinosaurs' or 'Vintage Cars'" 
                    {...field}
                    className="py-6 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" size="lg" className="w-full text-lg font-bold" disabled={isGenerating}>
            {isGenerating && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isGenerating ? 'Generating...' : 'Start Game'}
        </Button>
      </form>
    </Form>
  );
}