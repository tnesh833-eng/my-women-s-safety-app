function bypassLogin(event) {
    event.preventDefault();
    const overlay = document.getElementById('loginOverlay');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
}

function handleFeedbackSubmit(event) {
    event.preventDefault();
    const toast = document.getElementById('feedbackSuccessToast');
    toast.style.display = 'block';

    document.getElementById('feedback-name').value = '';
    document.getElementById('feedback-email').value = '';
    document.getElementById('feedback-category').selectedIndex = 0;
    document.getElementById('feedback-message').value = '';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 5500);
}

let audioCtx = null;
let primaryOsc = null;
let secondaryOsc = null;
let gainNode = null;
let modulatorNode = null;
let isAlarmPlaying = false;

function toggleEmergencyAlarm() {
    const btn = document.getElementById('panicButton');
    const container = document.getElementById('panicContainer');
    const statusText = document.getElementById('alarmStatus');

    if (!isAlarmPlaying) {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);

        primaryOsc = audioCtx.createOscillator();
        primaryOsc.type = 'sawtooth';
        primaryOsc.frequency.setValueAtTime(850, audioCtx.currentTime);

        secondaryOsc = audioCtx.createOscillator();
        secondaryOsc.type = 'square';
        secondaryOsc.frequency.setValueAtTime(855, audioCtx.currentTime);

        modulatorNode = audioCtx.createOscillator();
        modulatorNode.type = 'sine';
        modulatorNode.frequency.setValueAtTime(3.5, audioCtx.currentTime);

        let modulationGain = audioCtx.createGain();
        modulationGain.gain.setValueAtTime(300, audioCtx.currentTime);

        modulatorNode.connect(modulationGain);
        modulationGain.connect(primaryOsc.frequency);
        modulationGain.connect(secondaryOsc.frequency);

        primaryOsc.connect(gainNode);
        secondaryOsc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        primaryOsc.start();
        secondaryOsc.start();
        modulatorNode.start();

        isAlarmPlaying = true;
        btn.innerText = "STOP\nALARM";
        btn.classList.add('active');
        container.classList.add('ringing');
        statusText.innerText = "📢 CRITICAL: SIREN RUNNING AT MAXIMUM ACOUSTIC VELOCITY";
        statusText.style.color = "#ef4444";

    } else {
        if (primaryOsc) { primaryOsc.stop(); primaryOsc.disconnect(); }
        if (secondaryOsc) { secondaryOsc.stop(); secondaryOsc.disconnect(); }
        if (modulatorNode) { modulatorNode.stop(); modulatorNode.disconnect(); }
        if (gainNode) { gainNode.disconnect(); }

        isAlarmPlaying = false;
        btn.innerText = "Trigger\nAlarm";
        btn.classList.remove('active');
        container.classList.remove('ringing');
        statusText.innerText = "Status: Alarm Ready & Armed";
        statusText.style.color = "#10b981";
    }
}
