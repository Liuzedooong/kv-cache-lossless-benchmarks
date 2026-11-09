/* Article view count and one-per-browser likes.
 * Count API counters are public and approximate; they are not authentication.
 * The site stores no visitor identity or tracking cookies.
 */
(function () {
  'use strict';

  var API = 'https://countapi.mileshilliard.com/api/v1';
  var VIEWS = 'liuzedooong_kv_lossless_fp8_2026_article_views_v1';
  var LIKES = 'liuzedooong_kv_lossless_fp8_2026_article_likes_v1';
  var VIEW_SESSION = 'kv_lossless_fp8_2026_viewed_session_v1';
  var LIKE_STORAGE = 'kv_lossless_fp8_2026_liked_v1';

  function storageGet(storage, key) {
    try { return storage.getItem(key); } catch (_) { return null; }
  }

  function storageSet(storage, key, value) {
    try { storage.setItem(key, value); } catch (_) { /* private mode */ }
  }

  function renderNumber(node, value) {
    if (!node || !Number.isFinite(value) || value < 0) return;
    node.textContent = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  }

  async function counter(action, key) {
    var response = await fetch(API + '/' + action + '/' + key, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
      referrerPolicy: 'no-referrer'
    });
    if (action === 'get' && response.status === 404) return 0;
    if (!response.ok) throw new Error('Counter service: HTTP ' + response.status);
    var body = await response.json();
    var value = Number(body.value);
    if (!Number.isSafeInteger(value) || value < 0) throw new Error('Invalid counter value');
    return value;
  }

  function init() {
    var viewNode = document.getElementById('article-view-count');
    var likeNode = document.getElementById('article-like-count');
    var likeButton = document.getElementById('article-like-button');
    if (!viewNode || !likeNode || !likeButton) return;

    // A reload within the same tab session does not inflate views.
    var seenInSession = storageGet(sessionStorage, VIEW_SESSION) === '1';
    counter(seenInSession ? 'get' : 'hit', VIEWS).then(function (value) {
      renderNumber(viewNode, value);
      if (!seenInSession) storageSet(sessionStorage, VIEW_SESSION, '1');
    }).catch(function () {
      viewNode.textContent = '—';
      viewNode.parentElement.title = 'View count temporarily unavailable';
    });

    var hasLiked = storageGet(localStorage, LIKE_STORAGE) === '1';
    function markLiked() {
      hasLiked = true;
      likeButton.classList.add('is-liked');
      likeButton.setAttribute('aria-pressed', 'true');
      likeButton.setAttribute('aria-label', 'You liked this article');
      likeButton.title = 'Thanks for liking this article';
    }
    if (hasLiked) markLiked();

    counter('get', LIKES).then(function (value) {
      renderNumber(likeNode, value);
    }).catch(function () {
      likeNode.textContent = '—';
    });

    var inFlight = false;
    likeButton.addEventListener('click', async function () {
      if (hasLiked || inFlight) return;
      inFlight = true;
      likeButton.disabled = true;
      try {
        var value = await counter('hit', LIKES);
        renderNumber(likeNode, value);
        storageSet(localStorage, LIKE_STORAGE, '1');
        markLiked();
      } catch (_) {
        likeButton.title = 'Could not save your like. Please try again.';
      } finally {
        inFlight = false;
        likeButton.disabled = false;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
