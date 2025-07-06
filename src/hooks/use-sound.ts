
"use client";

import { useRef, useCallback, useEffect } from 'react';
import * as Tone from 'tone';
import { SOUND_THEMES, type SoundThemeName } from '@/lib/sound-themes';

export const useSound = (themeName: SoundThemeName = 'default') => {
    const isInitialized = useRef(false);
    
    const synths = useRef<Record<string, Tone.Synth | null>>({
        flip: null,
        match: null,
        win: null,
        button: null,
    });
    const currentTheme = useRef(themeName);

    const initAudio = useCallback(async (name: SoundThemeName) => {
        if (isInitialized.current && currentTheme.current === name) return;
        
        await Tone.start();

        const theme = SOUND_THEMES.find(t => t.id === name) || SOUND_THEMES[0];
        
        // Dispose old synths
        Object.values(synths.current).forEach(synth => synth?.dispose());

        synths.current.flip = new Tone.Synth(theme.sounds.flip.synth).toDestination();
        synths.current.match = new Tone.Synth(theme.sounds.match.synth).toDestination();
        synths.current.win = new Tone.Synth(theme.sounds.win.synth).toDestination();
        synths.current.button = new Tone.Synth(theme.sounds.button.synth).toDestination();

        isInitialized.current = true;
        currentTheme.current = name;
    }, []);

    useEffect(() => {
        initAudio(themeName);
    }, [themeName, initAudio]);

    const playSoundSequence = useCallback(async (synthKey: 'flip' | 'match' | 'win' | 'button') => {
        await initAudio(themeName);
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }
        
        const synth = synths.current[synthKey];
        const theme = SOUND_THEMES.find(t => t.id === themeName) || SOUND_THEMES[0];
        const sequence = theme.sounds[synthKey].sequence;

        if (synth) {
            const now = Tone.now();
            sequence.forEach(event => {
                synth.triggerAttackRelease(event.note, event.duration, now + event.time);
            });
        }
    }, [initAudio, themeName]);

    const playFlipSound = useCallback(() => playSoundSequence('flip'), [playSoundSequence]);
    const playMatchSound = useCallback(() => playSoundSequence('match'), [playSoundSequence]);
    const playWinSound = useCallback(() => playSoundSequence('win'), [playSoundSequence]);
    const playButtonSound = useCallback(() => playSoundSequence('button'), [playSoundSequence]);

    return { playFlipSound, playMatchSound, playWinSound, playButtonSound };
};
