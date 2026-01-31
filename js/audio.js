// Chess Sound Effects
class ChessSounds {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
    }
    
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playMove() {
        // Short blip for piece move
        this.init();
        this.playTone(440, 0.1, 'sine');
    }
    
    playCapture() {
        // Lower tone for capture
        this.init();
        this.playTone(220, 0.15, 'square');
    }
    
    playCheck() {
        // Alert tone for check
        this.init();
        this.playTone(880, 0.2, 'sawtooth');
        setTimeout(() => this.playTone(880, 0.2, 'sawtooth'), 150);
    }
    
    playCheckmate() {
        // Victory fanfare
        this.init();
        [523, 659, 784, 1047].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.3, 'sine'), i * 150);
        });
    }
    
    playCastle() {
        // Special sound for castling
        this.init();
        this.playTone(330, 0.1, 'sine');
        setTimeout(() => this.playTone(330, 0.1, 'sine'), 100);
    }
    
    setEnabled(enabled) {
        this.enabled = enabled;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChessSounds;
}
