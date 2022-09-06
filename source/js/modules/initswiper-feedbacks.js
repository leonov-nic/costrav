import Swiper, { Navigation, Pagination, FreeMode } from 'swiper';

import '../../../node_modules/swiper/swiper-bundle.min';

export function initSwiperFeedbacks() {

  const swiper = new Swiper(".swiper--feedbacks", {
    modules: [Navigation, Pagination, FreeMode],
    spaceBetween: 20,
    // slidesPerView: 1,
    freeMode: true,
    // loop: true,
    // centeredSlides: true,
    // slidesPerView: 1,
    // clickable: true,
    grabCursor: true,
    loopFillGroupWithBlank: true,

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
