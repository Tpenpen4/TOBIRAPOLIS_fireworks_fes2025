function showRestTime() {
  const urlParams = new URLSearchParams(window.location.search);
  const forceState = urlParams.get('state');

  let now = new Date();
  const goal = new Date('2025-08-17T19:30:00'); // イベント開催日時
  const end = new Date('2025-08-17T22:00:00'); // イベント終了日時
  const startDate = new Date('2025-08-01T15:00:00'); // プログレスバーの開始日時
  const preOpenStartDate = new Date('2025-08-10T00:00:00'); // プレオープン開始日時
  const preOpenEndDate = new Date('2025-08-16T23:59:00'); // プレオープン終了日時
  const buttonVisibilityStartDate = new Date('2025-08-17T19:00:00'); // ワールドボタン表示開始日時
  const artistCardChangeDate = new Date('2025-08-08T23:59:00'); // アーティスト様カード変更日時

  const countdownContainer = document.querySelector('.countdown-container');
  const countdownTimeDisplay = document.getElementById('countdown-time-display');
  const countdownText = countdownContainer.querySelector('h2');
  const progressBar = document.getElementById('progress-bar');
  const youtubeWrapperTitle = document.querySelector('.youtube-wrapper h2');
  const youtubeIframe = document.querySelector('.youtube-container iframe');

  const defaultYoutubeUrl = 'https://www.youtube.com/embed/6oIrMch8MFY?si=2vt2u-EVXRkH6FFu&playsinline=1&rel=0';
  const eventYoutubeUrl = 'https://www.youtube-nocookie.com/embed/UhCI5kItiDE?si=Px7Qh_VevpLtUxlt&playsinline=1&rel=0';

  if (forceState === 'during') {
    now = goal;
  } else if (forceState === 'after') {
    now = end;
  } else if (forceState === 'preopen') {
    now = preOpenStartDate;
  } else if (forceState === 'button_visible') {
    now = buttonVisibilityStartDate;
  }

  const buttons = document.querySelectorAll('.btnWrap .btn_01');
  const btnPreOpen = Array.from(buttons).find(btn => btn.querySelector('b')?.textContent === 'プレオープンワールド');
  const btnEnnichi = Array.from(buttons).find(btn => btn.querySelector('b')?.textContent === '縁日ワールド');
  const btnHanabi = Array.from(buttons).find(btn => btn.querySelector('b')?.textContent === '花火ワールド');
  const btnCredit = Array.from(buttons).find(btn => btn.querySelector('b')?.textContent === 'クレジット');

  const artistCard = document.querySelector('.card[data-content-url="pages/artists_soon.html"] img[alt=""]')?.closest('.card');

  const isPreOpenTime = now >= preOpenStartDate && now <= preOpenEndDate;

  if (isPreOpenTime) {
    const day = now.getDate();
    const urls = {
      13: "https://cluster.mu/w/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      14: "https://cluster.mu/w/yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
      15: "https://cluster.mu/w/zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz",
      16: "https://cluster.mu/w/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    };
    if (btnPreOpen) {
      const link = btnPreOpen.querySelector('a');
      if (link) {
        link.href = urls[day] || "test";
      }
    }
  }
  const isButtonVisibleTime = now >= buttonVisibilityStartDate && now < end;
  const isAfterEvent = now >= end;

  if (btnPreOpen) btnPreOpen.style.display = 'none';
  if (btnEnnichi) btnEnnichi.style.display = 'none';
  if (btnHanabi) btnHanabi.style.display = 'none';
  if (btnCredit) btnCredit.style.display = 'none';

  if (isAfterEvent) {
    if (btnCredit) btnCredit.style.display = 'block';
  } else if (isButtonVisibleTime) {
    if (btnEnnichi) btnEnnichi.style.display = 'block';
    if (btnHanabi) btnHanabi.style.display = 'block';
  } else if (isPreOpenTime) {
    if (btnPreOpen) btnPreOpen.style.display = 'block';
  } else {
  }

  // アーティスト様カードのリンクを切り替え
  if (artistCard) {
    if (now >= artistCardChangeDate) {
      artistCard.dataset.contentUrl = 'pages/artists.html';
    } else {
      artistCard.dataset.contentUrl = 'pages/artists_soon.html';
    }
  }

  const restMillisecond = goal.getTime() - now.getTime();
  const endMillisecond = end.getTime() - now.getTime();

  if (endMillisecond <= 0) {
    countdownText.style.display = 'none';
    countdownTimeDisplay.textContent = "イベントは終了しました";
    progressBar.style.width = '100%';
    if (youtubeWrapperTitle) youtubeWrapperTitle.textContent = '配信アーカイブ';
    if (youtubeIframe && youtubeIframe.src !== eventYoutubeUrl) {
        youtubeIframe.src = eventYoutubeUrl;
    }
    clearInterval(window.countdownInterval);
    return;
  } else if (restMillisecond <= 0) {
    countdownText.style.display = 'none';
    countdownTimeDisplay.textContent = "花火大会開催中！";
    const eventDuration = end.getTime() - goal.getTime();
    const elapsedDuringEvent = now.getTime() - goal.getTime();
    let progressPercentage = (elapsedDuringEvent / eventDuration) * 100;
    if (progressPercentage < 0) progressPercentage = 0;
    if (progressPercentage > 100) progressPercentage = 100;
    progressBar.style.width = `${progressPercentage}%`;
    if (youtubeWrapperTitle) youtubeWrapperTitle.textContent = 'LIVE配信中！';
    if (youtubeIframe && youtubeIframe.src !== eventYoutubeUrl) {
        youtubeIframe.src = eventYoutubeUrl;
    }
  } else {
    countdownText.style.display = 'block';
    const totalDuration = goal.getTime() - startDate.getTime();
    const day = Math.floor(restMillisecond / (1000 * 60 * 60 * 24));
    const hour = Math.floor((restMillisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minute = Math.floor((restMillisecond % (1000 * 60 * 60)) / (1000 * 60));
    const second = Math.floor((restMillisecond % (1000 * 60)) / 1000);
    countdownTimeDisplay.textContent = `${day}日 ${String(hour).padStart(2, '0')}時間 ${String(minute).padStart(2, '0')}分 ${String(second).padStart(2, '0')}秒`;
    let progressPercentage = (restMillisecond / totalDuration) * 100;
    if (progressPercentage < 0) progressPercentage = 0;
    if (progressPercentage > 100) progressPercentage = 100;
    progressBar.style.width = `${progressPercentage}%`;
    if (youtubeIframe && youtubeIframe.src !== defaultYoutubeUrl) {
        youtubeIframe.src = defaultYoutubeUrl;
    }
  }
}
function setupAccordion() {
  document.querySelectorAll('.panel-header').forEach(trigger => {
    trigger.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const panel = this.closest('.panel');

      document.querySelectorAll('.panel-header').forEach(otherTrigger => {
        if (otherTrigger !== this) {
          otherTrigger.classList.remove('active');
          const otherContent = otherTrigger.nextElementSibling;
          otherContent.style.height = '0';
        }
      });

      this.classList.toggle('active');

      if (this.classList.contains('active')) {
        const body = content.querySelector('.panel-body');
        content.style.height = body.offsetHeight + 'px';
      } else {
        content.style.height = '0';
      }
    });
  });
}
    let touchedCard = null;
    const modalOpenBtns = document.querySelectorAll('.modal-open-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalBody = document.getElementById('modal-body');
    const spectrumContainers = document.querySelectorAll('.audio-spectrum');
    const cards = document.querySelectorAll('.card.neon-effect');

    const setTheme = () => {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDarkMode ? 'dark' : 'light');
    };

    setTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);

    cards.forEach(card => {
        const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
        card.style.setProperty('--neon-color', randomColor);

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
            return luminance > 0.5; // 閾値
        };

        let isProductCardAndLight = false;
        if (isLightColor(randomColor)) {
            card.classList.add('light-neon-bg');

            if (card.dataset.productCard !== undefined) {
                isProductCardAndLight = true;
                const cardImage = card.querySelector('img');
                if (cardImage) {
                    const originalSrc = cardImage.src;
                    cardImage.dataset.originalSrc = originalSrc;
                    card.addEventListener('mouseleave', () => {
                        cardImage.src = cardImage.dataset.originalSrc;
                    });
                }
            }
        }

        card.addEventListener('touchstart', function(event) {
            event.stopPropagation();

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
            this.isProductCardAndLight = isProductCardAndLight;


            touchedCard = this;
        });
    });

    const createSpectrumBars = (container) => {
        container.innerHTML = '';
        let barCount;
        if (window.innerWidth < 768) {
            barCount = 10; // スマホ
        } else {
            barCount = 20; // PC
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
            const randomHeight = Math.floor(Math.random() * 95) + 5;
            bar.style.height = `${randomHeight}%`;
        });
    };

    let spectrumAnimation, closeModalTimeout, scrollPosition;

    modalOpenBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        clearTimeout(closeModalTimeout);
        const contentUrl = btn.dataset.contentUrl;
        const modalTarget = btn.dataset.modalTarget;

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
            modalOverlay.style.display = 'flex';
            requestAnimationFrame(() => {
              modalBody.scrollTop = 0;
              modalOverlay.classList.add('active');
              document.querySelector('.modal-content').classList.add('active');
              setupAccordion();
              spectrumAnimation = setInterval(randomizeBarHeights, 150);
              scrollPosition = window.pageYOffset;
              document.body.style.top = `-${scrollPosition}px`;
              document.body.classList.add('no-scroll');
            });
          })
          .catch(error => {
            console.error('んにょ', error);
            modalBody.innerHTML = '<h1>エラーです。メニューを開き直してください。</h1>';
            modalOverlay.style.display = 'flex';
            requestAnimationFrame(() => {
              modalBody.scrollTop = 0;
              modalOverlay.classList.add('active');
              document.querySelector('.modal-content').classList.add('active');
              scrollPosition = window.pageYOffset;
              document.body.style.top = `-${scrollPosition}px`;
              document.body.classList.add('no-scroll');
            });
          });
      });
    });

    modalCloseBtn.addEventListener('click', () => {
      const modalContent = document.querySelector('.modal-content');
      modalOverlay.classList.remove('active');
      modalContent.classList.remove('active');
      document.body.classList.remove('no-scroll');
      document.body.style.removeProperty('top');
      window.scrollTo(0, scrollPosition);
      clearInterval(spectrumAnimation);
      closeModalTimeout = setTimeout(() => {
        modalOverlay.style.display = 'none';
      }, 500);
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        const modalContent = document.querySelector('.modal-content');
        modalOverlay.classList.remove('active');
        modalContent.classList.remove('active');
        document.body.classList.remove('no-scroll');
        document.body.style.removeProperty('top');
        window.scrollTo(0, scrollPosition);
        clearInterval(spectrumAnimation);
        closeModalTimeout = setTimeout(() => {
          modalOverlay.style.display = 'none';
        }, 500);
      }
    });

    const fadeInSections = document.querySelectorAll('.fade-in-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(fadeInSections).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeInSections.forEach(section => {
        observer.observe(section);
    });

    const mainTopSection = document.getElementById('main_top');
    const btnWrap = document.querySelector('.btnWrap');

    if (mainTopSection && btnWrap) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    btnWrap.classList.add('is-visible');
                } else {
                    btnWrap.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.1 });

        observer.observe(mainTopSection);
    }

const minimumDisplayTime = 1000;
const loadingStartTime = Date.now();

window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        document.body.classList.add('no-scroll');

        const elapsedTime = Date.now() - loadingStartTime;
        const remainingTime = minimumDisplayTime - elapsedTime;

        const hideLoadingScreen = () => {
            loadingScreen.classList.add('fade-out');
            loadingScreen.addEventListener('transitionend', () => {
                loadingScreen.style.display = 'none';
                document.body.classList.remove('no-scroll');
                const topLogo = document.querySelector('.top .top-logo');
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

showRestTime();
window.countdownInterval = setInterval(showRestTime, 1000);
function openModalByHash() {
    const hash = window.location.hash;
    let targetButton = null;

    switch (hash) {
        case '#artists':
            targetButton = document.querySelector('.modal-open-btn[data-content-url="pages/artists.html"]');
            break;
    }
    if (targetButton) {
        targetButton.click();
    }
}
document.addEventListener('DOMContentLoaded', openModalByHash);
window.addEventListener('hashchange', openModalByHash);