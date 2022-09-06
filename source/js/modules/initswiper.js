import Swiper, { Navigation, Pagination, Autoplay } from 'swiper';

import '../../../node_modules/swiper/swiper-bundle.min';

export function initSwiper() {

  const swiper = new Swiper(".swiper", {
    modules: [Navigation, Pagination, Autoplay],
    initialSlide: 1,
    spaceBetween: 20,
    slidesPerView: 3,
    clickable: true,
    grabCursor: true,
    // loop: true,
    loopFillGroupWithBlank: true,
    // autoplay: {
    //   delay: 3000,
    //   // disableOnInteraction: true,
    // },
    pagination: {
      clickable: true,
      el: ".swiper-pagination",
      type: 'bullets',
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + '</span>';
      },
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}
