function showRestTime() {
  const now = new Date();
  const goal = new Date('2025-07-17T19:00:00'); // イベント開催日時
  const startDate = new Date('2025-07-01T00:00:00'); // プログレスバーの開始日時 (本日)

  const countdownTimeDisplay = document.getElementById('countdown-time-display');
  const progressBar = document.getElementById('progress-bar');

  const totalDuration = goal.getTime() - startDate.getTime();
  const restMillisecond = goal.getTime() - now.getTime();

  if (restMillisecond <= 0) {
    countdownTimeDisplay.textContent = "イベント開催中！";
    progressBar.style.width = '100%';
    clearInterval(window.countdownInterval); // カウントダウンを停止
    return;
  }

  const day = Math.floor(restMillisecond / (1000 * 60 * 60 * 24));
  const hour = Math.floor((restMillisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minute = Math.floor((restMillisecond % (1000 * 60 * 60)) / (1000 * 60));
  const second = Math.floor((restMillisecond % (1000 * 60)) / 1000);

  countdownTimeDisplay.textContent = `${day}日 ${String(hour).padStart(2, '0')}時間 ${String(minute).padStart(2, '0')}分 ${String(second).padStart(2, '0')}秒`;

  let progressPercentage = (restMillisecond / totalDuration) * 100;
  if (progressPercentage < 0) progressPercentage = 0; // 終了日時が過去の場合
  if (progressPercentage > 100) progressPercentage = 100; // 開始日時が未来の場合

  progressBar.style.width = `${progressPercentage}%`;
}

// 初回呼び出しとインターバルの設定
showRestTime();
window.countdownInterval = setInterval(showRestTime, 1000);

document.addEventListener('DOMContentLoaded', () => {
    const modalOpenBtns = document.querySelectorAll('.modal-open-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalBody = document.getElementById('modal-body');
    const spectrumContainers = document.querySelectorAll('.audio-spectrum');
    const cards = document.querySelectorAll('.card.neon-effect');

    // Set data-theme on html element based on prefers-color-scheme
    const setTheme = () => {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDarkMode ? 'dark' : 'light');
    };

    setTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);

    cards.forEach(card => {
        const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        card.style.setProperty('--neon-color', randomColor);

        card.addEventListener('touchstart', function() {
            this.classList.add('is-touched');
        });

        card.addEventListener('touchend', function() {
            this.classList.remove('is-touched');
        });
    });

    // オーディオスペクトラムのバーを生成する関数
    const createSpectrumBars = (container) => {
        container.innerHTML = ''; // 既存のバーをクリア
        const barCount = 20; // バーの数
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.classList.add('bar');

            const gradientOffset = (i / barCount) * -3000;
            bar.style.setProperty('--gradient-offset', `${gradientOffset}%`);

            container.appendChild(bar);
        }
    };

    spectrumContainers.forEach(container => {
        createSpectrumBars(container);
    });

    const randomizeBarHeights = () => {
        const allBars = document.querySelectorAll('.bar');
        allBars.forEach(bar => {
            const randomHeight = Math.floor(Math.random() * 95) + 5; // 5%から100%の間のランダムな高さ
            bar.style.height = `${randomHeight}%`;
        });
    };

    setInterval(randomizeBarHeights, 150);

    modalOpenBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const contentUrl = btn.dataset.contentUrl;
        const modalTarget = btn.dataset.modalTarget;

        // 注意事項モーダル用のクラスを付け外し
        if (modalTarget === 'precautions') {
          modalBody.classList.add('precautions-modal');
        } else {
          modalBody.classList.remove('precautions-modal');
        }
        fetch(contentUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.text();
          })
          .then(html => {
            modalBody.innerHTML = html;
            // Ensure modal is visible for transition
            modalOverlay.style.display = 'flex';
            requestAnimationFrame(() => {
              modalOverlay.classList.add('active');
              document.querySelector('.modal-content').classList.add('active');
            });
          })
          .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            modalBody.innerHTML = '<p>準備中です。</p>';
            // Ensure modal is visible for transition
            modalOverlay.style.display = 'flex';
            requestAnimationFrame(() => {
              modalOverlay.classList.add('active');
              document.querySelector('.modal-content').classList.add('active');
            });
          });
      });
    });

    modalCloseBtn.addEventListener('click', () => {
      const modalContent = document.querySelector('.modal-content');
      modalOverlay.classList.remove('active');
      modalContent.classList.remove('active');
      modalOverlay.addEventListener('transitionend', function handler() {
        modalOverlay.style.display = 'none';
        modalOverlay.removeEventListener('transitionend', handler);
      }, { once: true });
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        const modalContent = document.querySelector('.modal-content');
        modalOverlay.classList.remove('active');
        modalContent.classList.remove('active');
        modalOverlay.addEventListener('transitionend', function handler() {
          modalOverlay.style.display = 'none';
          modalOverlay.removeEventListener('transitionend', handler);
        }, { once: true });
      }
    });

    // フェードアップアニメーションのJavaScript
    const fadeInSections = document.querySelectorAll('.fade-in-section');

    const observerOptions = {
        root: null, // ビューポートをルートとする
        rootMargin: '0px',
        threshold: 0.1 // 要素の10%が見えたら発火
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(fadeInSections).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100); // 100ms delay per card
                observer.unobserve(entry.target); // 一度表示されたら監視を停止
            }
        });
    }, observerOptions);

    fadeInSections.forEach(section => {
        observer.observe(section);
    });
});

const minimumDisplayTime = 1000; // 1秒 (ミリ秒)
const loadingStartTime = Date.now();

window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        const elapsedTime = Date.now() - loadingStartTime;
        const remainingTime = minimumDisplayTime - elapsedTime;

        const hideLoadingScreen = () => {
            loadingScreen.classList.add('fade-out');
            loadingScreen.addEventListener('transitionend', () => {
                loadingScreen.style.display = 'none';
                // ローディング画面が完全に非表示になった後にロゴアニメーションを開始
                const topLogo = document.querySelector('.top .top-logo'); // .topの子要素として指定
                if (topLogo) {
                    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDarkMode) {
                        topLogo.classList.add('animate-dark');
                    } else {
                        topLogo.classList.add('animate-light');
                    }
                }
            }, { once: true });
        };

        if (remainingTime > 0) {
            setTimeout(hideLoadingScreen, remainingTime);
        } else {
            hideLoadingScreen();
        }
    }
});