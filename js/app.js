document.addEventListener('DOMContentLoaded', init)


function init() {
	handleHomePage()
}


function handleHomePage() {
	if (document.querySelector('.homepage')) {
		
		const headerHeight = document.querySelector('.header').offsetHeight + document.querySelector('.header-wrapper').offsetHeight;
		document.documentElement.style.setProperty('--headerHeight', `${headerHeight}px`);

		// add hero swiper
		const heroSwiper = new Swiper(".hero-swiper", {
			slidesPerView: 1,
			spaceBetween: 20,
			effect: "fade",
			loop:true,
			fadeEffect: {
				crossFade: true,
			},
			speed: 600,
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev"
			}
		});

		const blogSwiper = new Swiper(".blog-swiper", {
			slidesPerView: 1,
			effect: "fade",
			loop:true,
			fadeEffect: {
				crossFade: true,
			},
			speed: 600,
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev"
			}
		});



	}
}

