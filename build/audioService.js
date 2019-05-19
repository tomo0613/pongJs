const audioContext = new AudioContext();
export const AudioService = {
    playEffect(frequency, length = 0.02) {
        const oscillator = audioContext.createOscillator();
        oscillator.connect(audioContext.destination);
        oscillator.type = 'square';
        oscillator.frequency.value = frequency;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.02);
    },
};
//# sourceMappingURL=audioService.js.map