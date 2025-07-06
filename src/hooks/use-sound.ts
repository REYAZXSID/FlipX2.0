
"use client";

import { useRef, useCallback } from 'react';
import * as Tone from 'tone';

export const useSound = () => {
    const isInitialized = useRef(false);
    
    const flipSynth = useRef<Tone.Synth | null>(null);
    const matchSynth = useRef<Tone.Synth | null>(null);
    const winSynth = useRef<Tone.Synth | null>(null);
    const buttonSynth = useRef<Tone.Synth | null>(null);

    const initAudio = useCallback(async () => {
        if (isInitialized.current) return;
        
        await Tone.start();

        flipSynth.current = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0.2, release: 0.1 },
        }).toDestination();
        flipSynth.current.volume.value = -12;

        matchSynth.current = new Tone.Synth({
            oscillator: { type: 'triangle8' },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 },
        }).toDestination();
        matchSynth.current.volume.value = -6;

        winSynth.current = new Tone.Synth({
            oscillator: { type: 'pulse', width: 0.4 },
            envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 0.5 },
            filter: new Tone.Filter(800, 'lowpass'),
            filterEnvelope: {
                attack: 0.1,
                decay: 0.2,
                sustain: 0.5,
                release: 1,
                baseFrequency: 300,
                octaves: 3,
            }
        }).toDestination();
        winSynth.current.volume.value = -3;

        buttonSynth.current = new Tone.Synth({
            oscillator: { type: 'square' },
            envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 },
        }).toDestination();
        buttonSynth.current.volume.value = -15;
        
        isInitialized.current = true;
    }, []);

    const playSound = useCallback(async (player: React.MutableRefObject<Tone.Synth | null>, note: string, duration: Tone.Unit.Time, time?: Tone.Unit.Time) => {
        await initAudio();
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }
        player.current?.triggerAttackRelease(note, duration, time || Tone.now());
    }, [initAudio]);

    const playFlipSound = useCallback(() => {
        playSound(flipSynth, 'G5', '32n');
    }, [playSound]);

    const playMatchSound = useCallback(() => {
        const now = Tone.now();
        playSound(matchSynth, 'C5', '16n', now);
        playSound(matchSynth, 'G5', '8n', now + 0.1);
    }, [playSound]);

    const playWinSound = useCallback(() => {
        const now = Tone.now();
        const synth = winSynth.current;
        if (!synth) return;
        synth.triggerAttackRelease("C4", "16n", now);
        synth.triggerAttackRelease("E4", "16n", now + 0.1);
        synth.triggerAttackRelease("G4", "16n", now + 0.2);
        synth.triggerAttackRelease("C5", "8n", now + 0.3);
    }, [winSynth]);

    const playButtonSound = useCallback(() => {
       playSound(buttonSynth, 'C4', '32n');
    }, [playSound]);

    return { playFlipSound, playMatchSound, playWinSound, playButtonSound };
};
