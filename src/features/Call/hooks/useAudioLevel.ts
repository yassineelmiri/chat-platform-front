
import { useEffect, useState } from 'react';

export const useAudioLevel = (stream: MediaStream | null) => {
    const [audioLevel, setAudioLevel] = useState(0);

    useEffect(() => {
        if (!stream) return;

        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const updateLevel = () => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(average);
            requestAnimationFrame(updateLevel);
        };

        updateLevel();

        return () => {
            microphone.disconnect();
            audioContext.close();
        };
    }, [stream]);

    return audioLevel;
};