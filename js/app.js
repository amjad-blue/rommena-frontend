document.addEventListener('DOMContentLoaded', init)


function init() {
	handleHomePage()
	handleVideoLightGallery()
	handleImageLightGallery()
	handleAlbumSwiper()
	handleScrollToTop()
	handleHRBodiesSidebar()
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
	if (pageHeight <= 2000) {
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
 * Handles sidebar navigation for HR Bodies page
 * Manages active states and content switching
 * Ready for Drupal integration - reads data from HTML data attributes
 */
function handleHRBodiesSidebar() {
	const sidebar = document.querySelector('.section-hr .sidebar');
	const sectionActive = document.querySelector('.section-hr .section-active');
	
	if (!sidebar || !sectionActive) return;

	/**
	 * Extracts content data from sidebar link data attributes
	 * @param {HTMLElement} linkElement - The sidebar link element
	 * @returns {Object|null} Content object with title, text, and buttons
	 */
	function getContentFromDataAttributes(linkElement) {
		const title = linkElement.getAttribute('data-title');
		const text = linkElement.getAttribute('data-text');
		const buttonsJson = linkElement.getAttribute('data-buttons');

		if (!title || !text) {
			console.warn('Missing required data attributes on sidebar link');
			return null;
		}

		let buttons = [];
		if (buttonsJson) {
			try {
				buttons = JSON.parse(buttonsJson);
			} catch (e) {
				console.warn('Invalid JSON in data-buttons attribute:', e);
			}
		}

		return {
			title: title,
			text: text.replace(/&#10;/g, '\n'), // Convert HTML line breaks to actual newlines
			buttons: buttons
		};
	}

	/**
	 * Updates the active content section
	 * @param {HTMLElement} linkElement - The sidebar link element containing data attributes
	 */
	function updateActiveContent(linkElement) {
		const content = getContentFromDataAttributes(linkElement);
		if (!content) {
			return;
		}

		// Update title
		const titleElement = sectionActive.querySelector('.section-title');
		if (titleElement) {
			titleElement.textContent = content.title;
		}

		// Update text content
		const textElement = sectionActive.querySelector('.body-text');
		if (textElement) {
			textElement.textContent = content.text;
		}

		// Update buttons
		const buttonsWrapper = sectionActive.querySelector('.buttons-wrapper');
		if (buttonsWrapper) {
			if (content.buttons && content.buttons.length > 0) {
				buttonsWrapper.innerHTML = content.buttons
					.map(btn => `<a class="secondary-button" href="${btn.href || '#'}">${btn.text}</a>`)
					.join('');
			} else {
				buttonsWrapper.innerHTML = '';
			}
		}

		// Add fade animation
		sectionActive.style.opacity = '0';
		setTimeout(() => {
			sectionActive.style.opacity = '1';
		}, 150);
	}

	/**
	 * Handles sidebar item click
	 * @param {HTMLElement} clickedLink - The clicked sidebar link
	 */
	function handleSidebarClick(clickedLink) {
		// Remove active class from all items
		const allItems = sidebar.querySelectorAll('.sidebar-item');
		allItems.forEach(item => item.classList.remove('active'));

		// Add active class to clicked item
		clickedLink.closest('.sidebar-item')?.classList.add('active');

		// Update content from data attributes
		updateActiveContent(clickedLink);
	}

	// Initialize sidebar event listeners
	// Works with any sidebar link that has data-title attribute
	const sidebarLinks = sidebar.querySelectorAll('.sidebar-list a[data-title]');
	sidebarLinks.forEach(link => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			handleSidebarClick(link);
		});
	});

	// Set initial active content based on active sidebar item
	const activeItem = sidebar.querySelector('.sidebar-item.active a[data-title]');
	if (activeItem) {
		updateActiveContent(activeItem);
	}
}

