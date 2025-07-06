
import type { Frequency, SynthOptions } from "tone";

type SoundEvent = {
    note: Frequency;
    duration: string;
    time: number;
}

type SoundConfig = {
    synth: Partial<SynthOptions>;
    sequence: SoundEvent[];
}

export type SoundThemeName = 'default' | '8-bit' | 'sci-fi';

export type SoundTheme = {
    id: SoundThemeName;
    name: string;
    description: string;
    cost: number;
    type: 'sound-theme';
    sounds: {
        flip: SoundConfig;
        match: SoundConfig;
        win: SoundConfig;
        button: SoundConfig;
    }
};

export const SOUND_THEMES: SoundTheme[] = [
    {
        id: 'default',
        name: 'Default',
        description: 'The standard, classic sound experience.',
        cost: 0,
        type: 'sound-theme',
        sounds: {
            flip: {
                synth: { oscillator: { type: 'sine' }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.2, release: 0.1 }, volume: -12 },
                sequence: [{ note: 'G5', duration: '32n', time: 0 }]
            },
            match: {
                synth: { oscillator: { type: 'triangle8' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 }, volume: -6 },
                sequence: [{ note: 'C5', duration: '16n', time: 0 }, { note: 'G5', duration: '8n', time: 0.1 }]
            },
            win: {
                synth: { oscillator: { type: 'pulse', width: 0.4 }, envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 0.5 }, volume: -3 },
                sequence: [{ note: 'C4', duration: '16n', time: 0 }, { note: 'E4', duration: '16n', time: 0.1 }, { note: 'G4', duration: '16n', time: 0.2 }, { note: 'C5', duration: '8n', time: 0.3 }]
            },
            button: {
                synth: { oscillator: { type: 'square' }, envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 }, volume: -15 },
                sequence: [{ note: 'C4', duration: '32n', time: 0 }]
            }
        }
    },
    {
        id: '8-bit',
        name: '8-Bit',
        description: 'A retro-style sound pack for an arcade feel.',
        cost: 100,
        type: 'sound-theme',
        sounds: {
            flip: {
                synth: { oscillator: { type: 'square' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }, volume: -18 },
                sequence: [{ note: 'A5', duration: '32n', time: 0 }]
            },
            match: {
                synth: { oscillator: { type: 'square' }, envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 }, volume: -14 },
                sequence: [{ note: 'C5', duration: '16n', time: 0 }, { note: 'C6', duration: '16n', time: 0.1 }]
            },
            win: {
                synth: { oscillator: { type: 'square' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0.2, release: 0.1 }, volume: -12 },
                sequence: [{ note: 'G3', duration: '16n', time: 0 }, { note: 'C4', duration: '16n', time: 0.1 }, { note: 'E4', duration: '16n', time: 0.2 }, { note: 'G4', duration: '8n', time: 0.3 }]
            },
            button: {
                synth: { oscillator: { type: 'square' }, envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.08 }, volume: -20 },
                sequence: [{ note: 'G3', duration: '32n', time: 0 }]
            }
        }
    },
    {
        id: 'sci-fi',
        name: 'Sci-Fi',
        description: 'Futuristic sounds from another galaxy.',
        cost: 150,
        type: 'sound-theme',
        sounds: {
            flip: {
                synth: { oscillator: { type: 'sawtooth' }, filter: { type: 'lowpass', frequency: 1200 }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.0, release: 0.1 }, volume: -15 },
                sequence: [{ note: 'B5', duration: '64n', time: 0 }]
            },
            match: {
                synth: { oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.5, sustain: 0.2, release: 0.2 }, volume: -10 },
                sequence: [{ note: 'E5', duration: '8n', time: 0 }, { note: 'B5', duration: '8n', time: 0.05 }]
            },
            win: {
                synth: { oscillator: { type: 'sawtooth' }, filter: { type: 'lowpass', frequency: 2000 }, envelope: { attack: 0.2, decay: 0.5, sustain: 0.3, release: 0.5 }, volume: -8 },
                sequence: [{ note: 'C4', duration: '4n', time: 0 }, { note: 'G4', duration: '4n', time: 0.2 }, { note: 'C5', duration: '4n', time: 0.4 }]
            },
            button: {
                synth: { oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 }, volume: -18 },
                sequence: [{ note: 'C7', duration: '64n', time: 0 }]
            }
        }
    }
];
