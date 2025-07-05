"use client";

import { useRef, useCallback } from 'react';
import * as Tone from 'tone';

export const useSound = () => {
    const isInitialized = useRef(false);
    const flipPlayer = useRef<Tone.Player | null>(null);
    const matchPlayer = useRef<Tone.Player | null>(null);
    const winPlayer = useRef<Tone.Player | null>(null);
    const buttonPlayer = useRef<Tone.Player | null>(null);

    const initAudio = useCallback(async () => {
        if (isInitialized.current) return;
        
        await Tone.start();

        // Using simple synths as placeholders for audio files which cannot be generated.
        // A real app would use Tone.Player with audio file URLs.
        flipPlayer.current = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 },
        }).toDestination();

        matchPlayer.current = new Tone.Synth({
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.2 },
        }).toDestination();
        
        winPlayer.current = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.1, decay: 0.5, sustain: 0.5, release: 1 },
        }).toDestination();

        buttonPlayer.current = new Tone.Synth({
            oscillator: { type: 'square' },
            envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 },
        }).toDestination();
        
        isInitialized.current = true;
    }, []);

    const playSound = useCallback(async (player: React.MutableRefObject<Tone.Synth | null>, note: string, duration: Tone.Unit.Time) => {
        await initAudio();
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }
        player.current?.triggerAttackRelease(note, duration, Tone.now());
    }, [initAudio]);

    const playFlipSound = useCallback(() => {
        playSound(flipPlayer as any, 'C5', '8n');
    }, [playSound]);

    const playMatchSound = useCallback(() => {
        playSound(matchPlayer as any, 'E5', '4n');
        setTimeout(() => playSound(matchPlayer as any, 'G5', '4n'), 150);
    }, [playSound]);

    const playWinSound = useCallback(() => {
        const now = Tone.now();
        const winSynth = winPlayer.current;
        if (!winSynth) return;
        winSynth.triggerAttackRelease("C4", "8n", now);
        winSynth.triggerAttackRelease("E4", "8n", now + 0.2);
        winSynth.triggerAttackRelease("G4", "8n", now + 0.4);
        winSynth.triggerAttackRelease("C5", "4n", now + 0.6);
    }, []);

    const playButtonSound = useCallback(() => {
       playSound(buttonPlayer as any, 'A4', '16n');
    }, [playSound]);

    return { playFlipSound, playMatchSound, playWinSound, playButtonSound };
};
