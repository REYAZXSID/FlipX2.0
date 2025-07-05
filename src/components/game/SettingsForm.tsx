
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { THEMES, GRID_SIZES, GAME_MODES, CARD_BACKS, type GameSettings } from "@/lib/game-constants";
import { Loader2, Lock } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";

const FormSchema = z.object({
  gridSize: z.coerce.number().min(2).max(6),
  theme: z.string().min(1, "Please select a theme."),
  gameMode: z.string().min(1, "Please select a game mode."),
  cardBack: z.string().min(1, "Please select a card back."),
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
  const { inventory } = useUserData();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gridSize: defaultValues.gridSize,
      theme: defaultValues.theme,
      customTheme: defaultValues.customTheme,
      gameMode: defaultValues.gameMode || 'classic',
      cardBack: defaultValues.cardBack || 'default',
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
          name="gameMode"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Game Mode</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {GAME_MODES.map(mode => (
                    <FormItem key={mode.id} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                            <RadioGroupItem value={mode.id} />
                        </FormControl>
                        <FormLabel className="font-normal">{mode.label}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                name="cardBack"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Card Back</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a card back" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {CARD_BACKS.map((back) => {
                            const isOwned = inventory.includes(back.id);
                            return (
                                <SelectItem key={back.id} value={back.id} disabled={!isOwned}>
                                    <div className="flex items-center justify-between w-full">
                                        <span>{back.name}</span>
                                        {!isOwned && <Lock className="w-4 h-4 text-muted-foreground" />}
                                    </div>
                                </SelectItem>
                            )
                        })}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

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

        {selectedTheme === 'ai-magic' && (
          <FormField
            control={form.control}
            name="customTheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom AI Theme</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. 'Cute Dinosaurs' or 'Vintage Cars'" 
                    {...field}
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
