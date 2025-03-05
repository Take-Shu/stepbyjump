/* ======================================================
// Swiper
// ------------------------------------------------------ */
const swiperFv = new Swiper('.p-fv__slide', {
  loop: true,
  effect: 'fade',
  autoplay: {
    delay: 4000,
    disableOnInteraction: false, // ユーザが操作しても自動再生を継続させる
  },
  speed: 3000,
});