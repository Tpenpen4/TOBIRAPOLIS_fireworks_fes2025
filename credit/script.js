document.addEventListener('DOMContentLoaded', () => {
    const modeSelector = document.getElementById('mode-selector');
    const playMusicButton = document.getElementById('play-music');
    const noMusicButton = document.getElementById('no-music');
    const mainContent = document.querySelector('main');
    const audio = document.getElementById('bgm');

    playMusicButton.addEventListener('click', () => {
        modeSelector.style.display = 'none';
        mainContent.style.display = 'block';
        document.body.style.overflow = 'hidden'; // 自動スクロール時はoverflowをhiddenに
        audio.play();
        mainContent.style.animation = 'scroll 260s linear forwards';
    });

    noMusicButton.addEventListener('click', () => {
        modeSelector.style.display = 'none';
        mainContent.style.display = 'block';
        document.body.style.overflow = 'auto'; // 手動スクロール時はoverflowをautoに
        // 音楽は再生せず、スクロールアニメーションも適用しない
    });
});