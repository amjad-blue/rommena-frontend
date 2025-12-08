document.addEventListener('DOMContentLoaded', init)


function init() {
	handleHomePage()
	handleVideoLightGallery()
	handleImageLightGallery()
	handleAlbumSwiper()
	handleScrollToTop()
	handleFAQAccordion()
	handleHRBodiesSidebarScroll()
	handleFixedHeader()
	handleActiveLink()
}

// function for active link in header based in url
function handleActiveLink() {
	const url = window.location.href;
	const headerLinks = document.querySelectorAll('.list-items a');
	headerLinks.forEach(link => {
		if (link.href === url) {
			link.classList.add('active');
		}
	});
}


function handleHomePage() {
	if (document.querySelector('.homepage')) {

		const headerHeight = document.querySelector('.header').offsetHeight ;
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

function handleVideoLightGallery() {
	const videoGalleries = document.querySelectorAll('[data-gallery="video"]');
	if (videoGalleries.length > 0 && typeof lightGallery !== 'undefined') {
		videoGalleries.forEach(gallery => {
			lightGallery(gallery, {
				selector: 'a',
				plugins: [lgVideo, lgThumbnail, lgZoom],
				download: false,
				zoomFromOrigin: false,
				allowMediaOverlap: true,
			});
		});
	}
}

function handleImageLightGallery() {
	const imageGalleries = document.querySelectorAll('[data-gallery="image"]');
	if (imageGalleries.length > 0 && typeof lightGallery !== 'undefined') {
		imageGalleries.forEach(gallery => {
			lightGallery(gallery, {
				selector: 'a',
				plugins: [lgThumbnail, lgZoom],
				download: false,
				zoomFromOrigin: false,
				allowMediaOverlap: true,
			});
		});
	}
}

function handleAlbumSwiper() {
	const albumGalleries = document.querySelectorAll('.gallery-container.album');
	if (albumGalleries.length > 0 && typeof Swiper !== 'undefined') {
		albumGalleries.forEach(gallery => {
			const items = gallery.querySelectorAll('a');
			if (items.length > 4) {
				// Wrap items in Swiper structure
				const swiperWrapper = document.createElement('div');
				swiperWrapper.className = 'swiper-wrapper';

				items.forEach(item => {
					const swiperSlide = document.createElement('div');
					swiperSlide.className = 'swiper-slide';
					swiperSlide.appendChild(item.cloneNode(true));
					swiperWrapper.appendChild(swiperSlide);
					item.remove();
				});

				// Create Swiper container
				const swiperContainer = document.createElement('div');
				swiperContainer.className = 'swiper album-swiper';
				swiperContainer.appendChild(swiperWrapper);

				// Add pagination bullets
				const pagination = document.createElement('div');
				pagination.className = 'swiper-pagination';
				swiperContainer.appendChild(pagination);

				// Replace gallery content with Swiper
				gallery.appendChild(swiperContainer);

				// Initialize Swiper
				new Swiper(swiperContainer, {
					slidesPerView: 4,
					spaceBetween: 20,
					pagination: {
						el: pagination,
						clickable: true,
					},
					breakpoints: {
						320: {
							slidesPerView: 1,
							spaceBetween: 10,
						},
						640: {
							slidesPerView: 2,
							spaceBetween: 15,
						},
						1024: {
							slidesPerView: 3,
							spaceBetween: 20,
						},
						1280: {
							slidesPerView: 4,
							spaceBetween: 20,
						},
					},
				});

				// Initialize lightGallery after Swiper is set up
				if (typeof lightGallery !== 'undefined') {
					setTimeout(() => {
						lightGallery(gallery, {
							selector: 'a',
							plugins: [lgThumbnail, lgZoom],
							download: false,
							zoomFromOrigin: false,
							allowMediaOverlap: true,
						});
					}, 100);
				}
			}
		});
	}
}

function handleScrollToTop() {
	// Check if page height is more than 2000px
	const pageHeight = document.documentElement.scrollHeight;
	if (pageHeight <= 2500) {
		return; // Don't add button if page is not tall enough
	}

	// Create scroll-to-top button
	const scrollTopBtn = document.createElement('button');
	scrollTopBtn.className = 'scroll-to-top';
	scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
	scrollTopBtn.innerHTML = '<span class="icon-arrow-top"></span>';
	document.body.appendChild(scrollTopBtn);

	// Show/hide button based on scroll position
	function toggleScrollButton() {
		if (window.scrollY > 300) {
			scrollTopBtn.classList.add('visible');
		} else {
			scrollTopBtn.classList.remove('visible');
		}
	}

	// Scroll to top function
	function scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	// Event listeners
	window.addEventListener('scroll', toggleScrollButton);
	scrollTopBtn.addEventListener('click', scrollToTop);

	// Initial check
	toggleScrollButton();
}

/**
 * Handles FAQ accordion functionality
 * Toggles FAQ items open/closed with smooth animations
 */
function handleFAQAccordion() {
	const faqSections = document.querySelectorAll('.faq-section');

	if (faqSections.length === 0) return;

	faqSections.forEach(faqSection => {
		const faqItems = faqSection.querySelectorAll('.faq-item');

		faqItems.forEach(faqItem => {
			const faqHeader = faqItem.querySelector('.faq-header');
			const faqBody = faqItem.querySelector('.faq-body');
			const faqIcon = faqItem.querySelector('.faq-icon');

			if (!faqHeader || !faqBody || !faqIcon) return;

			// Initialize: close all items by default
			faqItem.classList.remove('active');

			// Add click handler
			faqHeader.addEventListener('click', () => {
				const isActive = faqItem.classList.contains('active');

				// Close all other items (accordion behavior)
				faqItems.forEach(item => {
					if (item !== faqItem) {
						item.classList.remove('active');
					}
				});

				// Toggle current item
				if (isActive) {
					// Close
					faqItem.classList.remove('active');
				} else {
					// Open
					faqItem.classList.add('active');
				}
			});
		});
	});
}

/**
 * Handles sidebar navigation with smooth scrolling for HR Bodies page
 * Updates active states based on scroll position
 */
function handleHRBodiesSidebarScroll() {
	const sidebar = document.querySelector('.section-hr .sidebar');
	const hrSections = document.querySelector('.section-hr .hr-sections');

	if (!sidebar || !hrSections) return;

	const sidebarLinks = sidebar.querySelectorAll('.sidebar-list a[href^="#"]');
	const sections = hrSections.querySelectorAll('[id]');

	if (sidebarLinks.length === 0 || sections.length === 0) return;

	/**
	 * Smooth scroll to target section
	 * @param {HTMLElement} targetSection - The section to scroll to
	 */
	function scrollToSection(targetSection) {
		const headerOffset = 100; // Offset for fixed header
		const elementPosition = targetSection.getBoundingClientRect().top;
		const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth'
		});
	}

	/**
	 * Updates active sidebar item based on current scroll position
	 */
	function updateActiveSidebarItem() {
		const scrollPosition = window.pageYOffset + 150; // Offset for header

		let currentActive = null;
		sections.forEach(section => {
			const sectionTop = section.offsetTop;
			const sectionHeight = section.offsetHeight;

			if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
				currentActive = section.id;
			}
		});

		// Update active class on sidebar items
		sidebarLinks.forEach(link => {
			const linkItem = link.closest('.sidebar-item');
			const href = link.getAttribute('href');

			if (href === `#${currentActive}`) {
				linkItem?.classList.add('active');
			} else {
				linkItem?.classList.remove('active');
			}
		});
	}

	// Add click handlers to sidebar links
	sidebarLinks.forEach(link => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			const targetId = link.getAttribute('href').substring(1);
			const targetSection = document.getElementById(targetId);

			if (targetSection) {
				// Remove active from all items
				sidebar.querySelectorAll('.sidebar-item').forEach(item => {
					item.classList.remove('active');
				});

				// Add active to clicked item
				link.closest('.sidebar-item')?.classList.add('active');

				// Scroll to section
				scrollToSection(targetSection);
			}
		});
	});

	// Update active state on scroll
	let scrollTimeout;
	window.addEventListener('scroll', () => {
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			updateActiveSidebarItem();
		}, 100);
	});

	// Initial active state check
	updateActiveSidebarItem();
}

/**
 * Handles fixed header-wrapper on scroll
 * Makes header-wrapper fixed when scrolling down
 */
function handleFixedHeader() {
	const headerWrapper = document.querySelector('.header-wrapper');
	const header = document.querySelector('.header');

	if (!headerWrapper || !header) return;

	const headerTopHeight = document.querySelector('.header .header-top')?.offsetHeight || 0;

	function handleScroll() {
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

		if (scrollTop > headerTopHeight) {
			headerWrapper.classList.add('fixed');
		} else {
			headerWrapper.classList.remove('fixed');
		}
	}

	// Throttle scroll event for better performance
	let ticking = false;
	window.addEventListener('scroll', () => {
		if (!ticking) {
			window.requestAnimationFrame(() => {
				handleScroll();
				ticking = false;
			});
			ticking = true;
		}
	});

	// Initial check
	handleScroll();
}

