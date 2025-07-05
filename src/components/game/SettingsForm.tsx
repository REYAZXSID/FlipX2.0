"use client";

import { useForm } from "react-hook-form";
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
import { THEMES, GRID_SIZES, type GameSettings } from "@/lib/game-constants";

const FormSchema = z.object({
  gridSize: z.coerce.number().min(2).max(6),
  theme: z.string().min(1, "Please select a theme."),
});

type SettingsFormProps = {
  onStartGame: (settings: GameSettings) => void;
  defaultValues: GameSettings;
};

export function SettingsForm({ onStartGame, defaultValues }: SettingsFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gridSize: defaultValues.gridSize,
      theme: defaultValues.theme,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    onStartGame(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="gridSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grid Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a grid size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GRID_SIZES.map((size) => (
                    <SelectItem key={size.value} value={String(size.value)}>
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
              <FormLabel>Theme</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(THEMES).map((theme) => (
                    <SelectItem key={theme.name} value={theme.name}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Start Game</Button>
      </form>
    </Form>
  );
}
