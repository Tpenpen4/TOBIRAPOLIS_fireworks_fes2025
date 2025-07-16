function showRestTime() {
  const now = new Date();
  const goal = new Date('2025-08-17T19:30:00'); // イベント開催日時
  const startDate = new Date('2025-05-10T15:00:00'); // プログレスバーの開始日時 (本日)

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
    let touchedCard = null; // タッチされたカードを追跡
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
        const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`; // 6桁になるように0埋め
        card.style.setProperty('--neon-color', randomColor);

        // 色の明るさを判定し、文字色を調整
        const hexToRgb = (hex) => {
            const r = parseInt(hex.substring(1, 3), 16);
            const g = parseInt(hex.substring(3, 5), 16);
            const b = parseInt(hex.substring(5, 7), 16);
            return { r, g, b };
        };

        const isLightColor = (hexColor) => {
            const { r, g, b } = hexToRgb(hexColor);
            // 輝度を計算 (ITU-R BT.709)
            const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            return luminance > 0.5; // 閾値は調整可能
        };

        let isProductCardAndLight = false; // Flag to check if it's a product card and light color

        if (isLightColor(randomColor)) {
            card.classList.add('light-neon-bg');

            // 販売物のカードにのみ画像変更のロジックを適用
            if (card.dataset.productCard !== undefined) {
                isProductCardAndLight = true;
                const cardImage = card.querySelector('img');
                if (cardImage) {
                    const originalSrc = cardImage.src;
                    cardImage.dataset.originalSrc = originalSrc; // 元のsrcを保存

                    card.addEventListener('mouseenter', () => {
                        cardImage.src = 'img/logo/clusterlogo_1line_trans_color.svg';
                    });

                    card.addEventListener('mouseleave', () => {
                        cardImage.src = cardImage.dataset.originalSrc;
                    });
                }
            }
        }

        // タッチイベントの処理
        card.addEventListener('touchstart', function(event) {
            event.stopPropagation(); // ドキュメントへの伝播を停止

            // 他のカードがタッチ状態ならリセット
            if (touchedCard && touchedCard !== this) {
                touchedCard.classList.remove('is-touched');
                if (touchedCard.isProductCardAndLight) {
                    const img = touchedCard.querySelector('img');
                    if (img && img.dataset.originalSrc) {
                        img.src = img.dataset.originalSrc;
                    }
                }
            }

            this.classList.add('is-touched');
            this.isProductCardAndLight = isProductCardAndLight; // 判定結果を要素に保存

            if (isProductCardAndLight) {
                const cardImage = this.querySelector('img');
                if (cardImage) {
                    cardImage.src = 'img/logo/clusterlogo_1line_trans_color.svg';
                }
            }
            touchedCard = this;
        });
    });

    // オーディオスペクトラムのバーを生成する関数
    const createSpectrumBars = (container) => {
        container.innerHTML = ''; // 既存のバーをクリア
        let barCount;
        if (window.innerWidth < 768) {
            barCount = 10; // モバイルの場合
        } else {
            barCount = 20; // PCの場合
        }
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

    // ボタンのフェードイン処理
    const mainTopSection = document.getElementById('main_top');
    const btnWrap = document.querySelector('.btnWrap');

    if (mainTopSection && btnWrap) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // main_topセクションが画面内に表示されたらボタンを表示
                if (entry.isIntersecting) {
                    btnWrap.classList.add('is-visible');
                } else {
                    // main_topセクションが画面外に出たらボタンを非表示
                    btnWrap.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.1 }); // main_topの10%が表示されたらトリガー

        observer.observe(mainTopSection);
    }
});

    

const minimumDisplayTime = 1000; // 1秒 (ミリ秒)
const loadingStartTime = Date.now();

window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        // ローディング画面表示中はスクロールを無効にする
        document.body.classList.add('no-scroll');

        const elapsedTime = Date.now() - loadingStartTime;
        const remainingTime = minimumDisplayTime - elapsedTime;

        const hideLoadingScreen = () => {
            loadingScreen.classList.add('fade-out');
            loadingScreen.addEventListener('transitionend', () => {
                loadingScreen.style.display = 'none';
                // ローディング画面が完全に非表示になったらスクロールを有効にする
                document.body.classList.remove('no-scroll');
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