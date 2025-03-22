const nodeOps = {
  qs(selector, scope) {
    return (scope || document).querySelector(selector);
  },
  qsAll(selector, scope) {
    return (scope || document).querySelectorAll(selector);
  },
  getById(selector, scope) {
    return (scope || document).getElementById(selector);
  },
};

/* ======================================================
// 375px未満はviewport固定
// ------------------------------------------------------ */
(function () {
  const viewport = nodeOps.qs('meta[name="viewport"]');
  function switchViewport() {
    const value = 
      window.outerWidth > 375
        ? "width=device-width,initial-scale=1"
        : "width=375";
    if (viewport.getAttribute('content') !== value) {
      viewport.setAttribute('content', value);
    }
  }

  let resizeTimer;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      switchViewport()
    }, 100);
  }, false);

  switchViewport();
})();

/* ======================================================
// Header　tracking switching.
// ------------------------------------------------------ */
const fvSection = nodeOps.qs('.p-fv');
const header = nodeOps.qs('.js-header');
const navList = nodeOps.qs('.js-nav-list')
const menuButton = nodeOps.qs('.js-modal-open-button');
const menuIcon =nodeOps.qs('.js-menu-icon');
const logo = nodeOps.qs('.js-header-logo');

const fvObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        header.classList.add('fade');
        header.style.background = 'var(--white-color)';
        navList.style.color = 'var(--black-color)';
        menuButton.style.color = 'var(--black-color)';
        logo.setAttribute('src', './assets/img/logo_black.webp');
      } else {
        header.classList.remove('fade');
        header.style.background = '';
        navList.style.color = '';
        menuButton.style.color = '';
        logo.setAttribute('src', './assets/img/logo_white.webp');
      }
    });
  },
  {
    threshold: 0,
    rootMargin: '0px 0px 0px 0px',
  }
);

fvObserver.observe(fvSection);

/* ======================================================
// Smooth scroll
// ------------------------------------------------------ */
const linkButtons = nodeOps.qsAll('.js-link-button');

// 視差効果の状態を判定する関数
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// スクロールタイプの設定を取得する関数
function getScrollBehavior(isReducedMotion) {
  return isReducedMotion ? 'instant' : 'smooth'
};

// スクロール実行関数
function executeScroll(targetId, targetElement, isReducedMotion) {
  const behavior = getScrollBehavior(isReducedMotion);

  if (targetId === '#') {
    window.scrollTo({
      top: 0,
      behavior
    });
  } else {
    targetElement.scrollIntoView({
      behavior,
      block: 'start',
      inline: 'nearest'
    });
  }
};

// スムーススクロール初期化関数
function initSmoothScroll(buttons) {
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      // クリックされたボタンの href 属性を取得
      const targetId = button.getAttribute('href');

      // 全てのボタンとクリックされたボタンの href 属性を比較する
      buttons.forEach(i => {
        if (i.getAttribute('href') === targetId) {
          // href 属性が同じ場合 aria-current 属性を設定
          i.setAttribute('aria-current', 'true');
        } else {
          // href 属性が違う場合 aria-current 属性を削除
          i.removeAttribute('aria-current');
        }
      });

      // クリックされたボタンの要素を取得
      let targetElement = targetId === '#' ? null : nodeOps.getById(targetId.replace('#', ''));

      executeScroll(targetId, targetElement, prefersReducedMotion())
    });
  });
};

// 初期化実行
initSmoothScroll(linkButtons);

/* ======================================================
// To top button
// ------------------------------------------------------ */
/**
 * トップボタンの表示/非表示を制御する即時実行関数
 * スクロール位置に応じてボタンを表示/非表示し、トランジションを適用します
 * 
 * @description
 * - ページ最上部ではボタンをフェードアウトして非表示にします
 * - スクロールするとボタンを表示します
 * - アニメーションにはCSS transitionとrequestAnimationFrameを使用します
 * - 表示状態の変更はスクロール位置に基づいて自動的に行われます
 * 
 * @returns {void}
 */
(function toTopBtnFadeout() {
  /** @type {HTMLElement} トップに戻るボタン要素 */
  const toTopButton = nodeOps.qs('.js-top-button');

  /**
   * トランジション完了時のイベントハンドラ
   * フェードアウト完了後に要素を非表示にします
   * 
   * @returns {void}
   */
  const handleTransitionEnd = () => {
    if (toTopButton.classList.contains('fadeout')) {
      toTopButton.style.display = 'none';
    }
  };

  // トランジション終了イベントのリスナーを一度だけ登録
  toTopButton.addEventListener('transitionend', handleTransitionEnd);

  /**
   * スクロール位置に応じてボタンの表示/非表示状態を更新する関数
   * 最上部ではフェードアウト、それ以外ではフェードインします
   * 
   * @returns {void}
   */
  const updateButtonVisibility = () => {
    if (window.scrollY === 0) {
      // 最上部ではフェードアウト
      toTopButton.classList.add('fadeout');
    } else {
      toTopButton.style.display = 'block';
      toTopButton.classList.remove('fadeout');
    }
  };

  // 初期表示状態の設定
  updateButtonVisibility();

  // スクロール時のイベントリスナー登録
  window.addEventListener('scroll', updateButtonVisibility);
})();

/* ======================================================
// Scroll event for nav item.
// ------------------------------------------------------ */
const sections = nodeOps.qsAll('.js-observer-target');

function sectionCallback(entries) {
  entries.forEach(entry => {
    const targetId = entry.target.id;
    const activeItems = nodeOps.qsAll(`nav .js-link-button[href="#${targetId}"]`);

    if (!activeItems) return;

    if (entry.isIntersecting) {
      linkButtons.forEach(button => button.removeAttribute('aria-current'));
      activeItems.forEach(item => item.setAttribute('aria-current', 'true'));
    }
  });
};

const sectionObserver = new IntersectionObserver(
  sectionCallback,
  {
    root: null,
    rootMargin: '0px 0px -50% 0px',
    threshold: 0,
  }
);

// 全てのセクションを監視対象に設定
sections.forEach(section => {
  sectionObserver.observe(section);
});

/* ======================================================
// Drawer
// ------------------------------------------------------ */
const modalOpenButton = nodeOps.qs('.js-modal-open-button');
const modalCloseButton = nodeOps.qs('.js-modal-close-button');
const drawerLinkButtons = nodeOps.qsAll('.p-drawer .js-link-button');
const drawerLogoLinkButton = nodeOps.qs('.p-drawer__header-logo-link');
let currentModal = null;
let isTransitioning = false;

/**
 * モーダルを開く処理
 * @param {Event} e - クリックイベント 
 */
function handleModalOpen(e) {
  const openButton = e.target.closest('.js-modal-open-button');
  if (!openButton) return;

  isTransitioning = true;

  const attributeValue = openButton.getAttribute('data-modal-open');
  const targetModal = nodeOps.getById(attributeValue);
  currentModal = targetModal;
  
  targetModal.classList.add('show-from');
  targetModal.showModal();
  header.classList.add('is-scroll-lock');
  targetModal.addEventListener('keydown', addKeydownEvent);
  drawerLogoLinkButton.addEventListener('click', handleModalClose);
  drawerLinkButtons.forEach(button => {
    button.addEventListener('click', handleModalClose)
  });
  requestAnimationFrame(() => {
    targetModal.classList.remove('show-from');
    
    if (currentModal) {
      isTransitioning = false;
    }
  });
};

/**
 * モーダルを閉じる処理
 */
function handleModalClose() {
  if (!currentModal || isTransitioning) return;

  isTransitioning = true;

  currentModal.classList.add('hide-to');
  currentModal.addEventListener('transitionend', () => {
    currentModal.classList.remove('hide-to');
    currentModal.close();
    header.classList.remove('is-scroll-lock');
    currentModal = null;
    isTransitioning = false;
  },
  {
    once: true,
  });
};

/**
 * キーボードイベントの処理
 * @param {KeyboardEvent} e - キーボードイベント 
 */
function addKeydownEvent(e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    handleModalClose();
  }
};

/**
 * モーダルダイアログの初期化関数
 * @param {HTMLElement} openButton - モーダルを開くボタン
 * @param {HTMLElement} closeButton - モーダルを閉じるボタン
 */
function initModal(openButton, closeButton) {
    openButton.addEventListener('click', handleModalOpen);
    closeButton.addEventListener('click', handleModalClose);
};

/**
 * 指定されたボタン要素を使用してモーダルを初期化する
 * @see initModal
 */
initModal(modalOpenButton, modalCloseButton);

/* ======================================================
// Title animation
// ------------------------------------------------------ */
const titleElements = nodeOps.qsAll('.js-observer-target-title');

/**
 * IntersectionObserverのコールバック関数
 * 監視対象の要素が表示領域に入った時にshowクラスを追加する
 * 
 * @param {IntersectionObserverEntry[]} entries - タイトル要素の配列 
 */
function titleCallback(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
};

/**
 * タイトル要素を監視するIntersectionObserverインスタンス
 * 
 * @type {IntersectionObserver}
 * @param {Function} titleCallback - 交差した時に実行されるコールバック
 * @param {Object} options - IntersectionObserverの設定オプション
 * @param {Element|null} options.root - 交差を計算する基準となる要素（nullの場合はビューポート）
 * @param {string} options.rootMargin - ルート要素のマージン（下部に-10%のマージンを設置）
 * @param {number} options.threshold - 交差と見なす閾値（0は要素が少しでも表示されたら交差と見なす）
 */
const titleObserver = new IntersectionObserver(
  titleCallback,
  {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0,
  }
);

/**
 * すべてのタイトル要素に対してIntersectionObserverによる監視を開始する
 */
titleElements.forEach(title => {
  titleObserver.observe(title);
});

/* ======================================================
// Loading animation
// ------------------------------------------------------ */
/**
 * ローディング表示を制御する即時実行関数
 * ページ読み込み後、一定時間経過後にローディング要素をフェードアウトして非表示にします
 * 
 * @description
 * - DOMContentLoadedイベント時にローディング要素のフェードアウト処理を開始します
 * - 複数回呼び出された場合にタイマーをリセットする機能があります
 * - トランジションとタイムアウトを組み合わせて滑らかな表示切替を実現します
 * 
 * @returns {void}
 */
(function loadingFactory() {
  /** @type {number|null} フェードアウト開始のタイマーID */
  let fadeTimer = null;

  /** @type {number|null} 要素を非表示にするタイマーID */
  let hideTimer = null;

  /**
   * 
   * @param {string} elementId - フェードアウトする要素のID
   * @returns {void}
   */
  function fadeOutAndHideElement(elementId){
    /** トランジションのアニメーション時間（ミリ秒） */
    const TRANSITION_DURATION = 600;

    /** @type {HTMLElement|null} 対象の要素 */
    const element = nodeOps.getById(elementId);
    if (!element) return;

    element.style.transition = `opacity ${TRANSITION_DURATION / 1000}s ease-out`;
    element.style.opacity = '0';

    if (hideTimer) {
      clearTimeout(hideTimer);
    }

    hideTimer = setTimeout(() => {
      element.style.display = 'none';
    }, TRANSITION_DURATION);
  }

  /**
   * ローディング要素の初期化と自動フェードアウト設定を行う関数
   * 
   * @returns {void} 
   */
  const initLoading = () => {
    const FADE_DELAY = 2800;

    if (fadeTimer) {
      clearTimeout(fadeTimer);
    }

    fadeTimer = setTimeout(() => {
      fadeOutAndHideElement('loading');
    }, FADE_DELAY);
  };

  // DOMContentLoadedイベントでローディング処理を初期化
  window.addEventListener('DOMContentLoaded', initLoading);

})();