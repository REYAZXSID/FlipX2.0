
"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Loader2, Lock, Timer, Bomb, Square, LayoutGrid, Table2, Sparkles, Smile, Globe, CaseSensitive } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { cn } from "@/lib/utils";

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
    defaultValues,
  });

  const selectedTheme = useWatch({
    control: form.control,
    name: "theme"
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onStartGame)} className="space-y-8 w-full max-w-lg p-1">
        
        <FormField
            control={form.control}
            name="gameMode"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Game Mode</FormLabel>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {GAME_MODES.map(mode => (
                            <FormItem key={mode.id}>
                                <FormControl>
                                    <RadioGroupItem value={mode.id} id={`radio-gamemode-${mode.id}`} className="sr-only" />
                                </FormControl>
                                <label htmlFor={`radio-gamemode-${mode.id}`} className={cn(
                                    "flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-colors",
                                    field.value === mode.id ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
                                )}>
                                    {mode.id === 'classic' ? <Timer className="w-8 h-8 mb-2 text-primary" /> : <Bomb className="w-8 h-8 mb-2 text-destructive" />}
                                    <span className="font-semibold">{mode.label}</span>
                                </label>
                            </FormItem>
                        ))}
                    </RadioGroup>
                </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="gridSize"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Grid Size</FormLabel>
                    <RadioGroup onValueChange={(val) => field.onChange(Number(val))} value={String(field.value)} className="grid grid-cols-3 gap-4">
                        {[
                            { size: 2, label: '2x2', icon: <Square className="w-6 h-6 mb-2"/> },
                            { size: 4, label: '4x4', icon: <LayoutGrid className="w-6 h-6 mb-2"/> },
                            { size: 6, label: '6x6', icon: <Table2 className="w-6 h-6 mb-2"/> }
                        ].map(item => (
                            <FormItem key={item.size}>
                                <FormControl>
                                    <RadioGroupItem value={String(item.size)} id={`radio-grid-${item.size}`} className="sr-only" />
                                </FormControl>
                                <label htmlFor={`radio-grid-${item.size}`} className={cn(
                                    "flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-colors",
                                    field.value === item.size ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
                                )}>
                                    {item.icon}
                                    <span className="font-semibold">{item.label}</span>
                                </label>
                            </FormItem>
                        ))}
                    </RadioGroup>
                </FormItem>
            )}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                        {Object.values(THEMES).map((theme) => {
                             let Icon;
                             switch(theme.name) {
                                 case 'emojis': Icon = Smile; break;
                                 case 'flags': Icon = Globe; break;
                                 case 'letters': Icon = CaseSensitive; break;
                                 case 'ai-magic': Icon = Sparkles; break;
                                 default: Icon = Smile;
                             }
                            return (
                                <SelectItem key={theme.name} value={theme.name}>
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4" />
                                        <span>{theme.label}</span>
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
                                      <div className="flex items-center gap-3">
                                          <div className={cn("w-10 h-7 rounded-sm flex-shrink-0 border", back.className)}></div>
                                          <span>{back.name}</span>
                                      </div>
                                      {!isOwned && <Lock className="w-4 h-4 text-muted-foreground ml-2" />}
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
                    <FormDescription>Describe the theme you want the AI to create!</FormDescription>
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
