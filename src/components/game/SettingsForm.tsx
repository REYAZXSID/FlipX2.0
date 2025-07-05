
"use client";

import { useState } from "react";
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
import { Loader2, Lock, ArrowLeft, ArrowRight, Timer, Bomb, Square, LayoutGrid, Table2 } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const STEPS = [
  { 
    title: "Choose Your Challenge",
    description: "How do you want to play?",
    fields: ["gameMode"] 
  },
  { 
    title: "Select Grid Size",
    description: "How sharp is your memory today?",
    fields: ["gridSize"] 
  },
  { 
    title: "Customize Your Game",
    description: "Make it yours.",
    fields: ["theme", "cardBack", "customTheme"]
  },
];

export function SettingsForm({ onStartGame, defaultValues, isGenerating }: SettingsFormProps) {
  const { inventory } = useUserData();
  const [step, setStep] = useState(0);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gridSize: defaultValues.gridSize,
      theme: "", // Changed to force selection
      customTheme: defaultValues.customTheme,
      gameMode: defaultValues.gameMode || 'classic',
      cardBack: "", // Changed to force selection
    },
    mode: 'onChange', // Added for better UX with validation
  });

  const selectedTheme = useWatch({
    control: form.control,
    name: "theme"
  });

  const nextStep = async () => {
    const fields = STEPS[step].fields;
    const output = await form.trigger(fields as any, { shouldFocus: true });
    if (!output) return;
    setStep((prev) => prev < STEPS.length - 1 ? prev + 1 : prev);
  };

  const prevStep = () => {
    setStep((prev) => prev > 0 ? prev - 1 : prev);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onStartGame)} className="space-y-6">
        
        <div className="relative h-2 w-full bg-muted rounded-full mb-8">
            <div 
                className="absolute top-0 left-0 h-2 bg-primary rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${(step / (STEPS.length -1)) * 100}%` }}
            ></div>
        </div>

        <div key={step} className="min-h-[300px] animate-step-in">
          <div className="text-center mb-6">
              <h3 className="text-xl font-semibold">{STEPS[step].title}</h3>
              <p className="text-muted-foreground">{STEPS[step].description}</p>
          </div>
          {step === 0 && (
             <FormField
                control={form.control}
                name="gameMode"
                render={({ field }) => (
                    <FormItem>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {GAME_MODES.map(mode => (
                                <FormItem key={mode.id}>
                                    <FormControl>
                                        <RadioGroupItem value={mode.id} id={`radio-${field.name}-${mode.id}`} className="sr-only" />
                                    </FormControl>
                                    <label htmlFor={`radio-${field.name}-${mode.id}`}>
                                        <Card className={cn(
                                            "cursor-pointer hover:border-primary transition-all p-6 text-center h-full",
                                            field.value === mode.id && "border-primary ring-2 ring-primary shadow-lg"
                                        )}>
                                            <CardHeader className="p-0">
                                              <CardTitle className="flex flex-col items-center justify-center gap-4">
                                                  {mode.id === 'classic' ? <Timer className="w-10 h-10 text-primary" /> : <Bomb className="w-10 h-10 text-destructive" />}
                                                  <span className="text-lg font-semibold">{mode.label}</span>
                                              </CardTitle>
                                            </CardHeader>
                                        </Card>
                                    </label>
                                </FormItem>
                            ))}
                        </RadioGroup>
                        <FormMessage className="text-center pt-2" />
                    </FormItem>
                )}
            />
          )}

          {step === 1 && (
            <FormField
                control={form.control}
                name="gridSize"
                render={({ field }) => (
                    <FormItem>
                        <RadioGroup onValueChange={(val) => field.onChange(Number(val))} value={String(field.value)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { size: 2, label: '2x2', icon: <Square className="w-8 h-8"/> },
                                { size: 4, label: '4x4', icon: <LayoutGrid className="w-8 h-8"/> },
                                { size: 6, label: '6x6', icon: <Table2 className="w-8 h-8"/> }
                            ].map(item => (
                                <FormItem key={item.size}>
                                    <FormControl>
                                        <RadioGroupItem value={String(item.size)} id={`radio-${field.name}-${item.size}`} className="sr-only" />
                                    </FormControl>
                                    <label htmlFor={`radio-${field.name}-${item.size}`}>
                                        <Card className={cn(
                                            "cursor-pointer hover:border-primary transition-all p-6 text-center h-full",
                                            field.value === item.size && "border-primary ring-2 ring-primary shadow-lg"
                                        )}>
                                            <CardHeader className="p-0">
                                              <CardTitle className="flex flex-col items-center justify-center gap-4">
                                                  <div className="text-primary">{item.icon}</div>
                                                  <span className="text-lg font-semibold">{item.label}</span>
                                                  <span className="text-sm text-muted-foreground">{GRID_SIZES.find(s=>s.value===item.size)?.label.match(/\((.*)\)/)?.[1]}</span>
                                              </CardTitle>
                                            </CardHeader>
                                        </Card>
                                    </label>
                                </FormItem>
                            ))}
                        </RadioGroup>
                        <FormMessage className="text-center pt-2" />
                    </FormItem>
                )}
            />
          )}

          {step === 2 && (
            <div className="space-y-6">
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
          )}
        </div>

        <div className="flex justify-between items-center mt-8">
            <Button type="button" variant="outline" onClick={prevStep} disabled={step === 0}>
                <ArrowLeft /> Back
            </Button>
            
            {step < STEPS.length - 1 ? (
                 <Button type="button" onClick={nextStep}>
                    Next <ArrowRight />
                </Button>
            ) : (
                <Button type="submit" size="lg" className="text-lg font-bold" disabled={isGenerating || !form.formState.isValid}>
                    {isGenerating && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    {isGenerating ? 'Generating...' : 'Start Game'}
                </Button>
            )}
        </div>
      </form>
    </Form>
  );
}
