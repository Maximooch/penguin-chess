// Chess Sound Effects
class ChessSounds {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
        this.initialized = false;
    }
    
    init() {
        if (this.initialized) return true;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            return true;
        } catch (e) {
            console.warn('Web Audio API not supported');
            return false;
        }
    }
    
    // Call this on first user interaction
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.init()) return;
        this.resume();
        
        try {
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
        } catch (e) {
            console.warn('Sound play failed:', e);
        }
    }
    
    playMove() {
        this.playTone(440, 0.1, 'sine');
    }
    
    playCapture() {
        this.playTone(220, 0.15, 'square');
    }
    
    playCheck() {
        this.playTone(880, 0.2, 'sawtooth');
        setTimeout(() => this.playTone(880, 0.2, 'sawtooth'), 150);
    }
    
    playCheckmate() {
        [523, 659, 784, 1047].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.3, 'sine'), i * 150);
        });
    }
    
    playCastle() {
        this.playTone(330, 0.1, 'sine');
        setTimeout(() => this.playTone(330, 0.1, 'sine'), 100);
    }
    
    setEnabled(enabled) {
        this.enabled = enabled;
        if (enabled) this.init();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChessSounds;
}
