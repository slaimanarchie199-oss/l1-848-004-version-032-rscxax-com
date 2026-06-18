(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function initMobileNav() {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (slides.length === 0) {
            return;
        }
        var index = 0;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle("active", itemIndex === index);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle("active", itemIndex === index);
            });
        }
        dots.forEach(function (dot, itemIndex) {
            dot.addEventListener("click", function () {
                show(itemIndex);
            });
        });
        window.setInterval(function () {
            show(index + 1);
        }, 5200);
    }

    function initFilters() {
        var grids = Array.prototype.slice.call(document.querySelectorAll("[data-card-grid]"));
        if (grids.length === 0) {
            return;
        }
        var input = document.querySelector("[data-search-input]");
        var type = document.querySelector("[data-type-filter]");
        var empty = document.querySelector("[data-empty-state]");
        function apply() {
            var keyword = input ? input.value.trim().toLowerCase() : "";
            var mediaType = type ? type.value : "";
            var visible = 0;
            grids.forEach(function (grid) {
                var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
                cards.forEach(function (card) {
                    var search = card.getAttribute("data-search") || "";
                    var cardType = card.getAttribute("data-type") || "";
                    var matchedKeyword = keyword === "" || search.indexOf(keyword) !== -1;
                    var matchedType = mediaType === "" || cardType === mediaType;
                    var matched = matchedKeyword && matchedType;
                    card.style.display = matched ? "" : "none";
                    if (matched) {
                        visible += 1;
                    }
                });
            });
            if (empty) {
                empty.classList.toggle("show", visible === 0);
            }
        }
        if (input) {
            input.addEventListener("input", apply);
        }
        if (type) {
            type.addEventListener("change", apply);
        }
        apply();
    }

    window.initVideoPlayer = function (videoId, streamUrl, overlayId) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        if (!video) {
            return;
        }
        var hls = null;
        var started = false;

        function hideOverlay() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        }

        function playVideo() {
            hideOverlay();
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {});
            }
        }

        function bindStream() {
            if (started) {
                playVideo();
                return;
            }
            started = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                playVideo();
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MEDIA_ATTACHED, function () {
                    hls.loadSource(streamUrl);
                });
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    playVideo();
                });
                return;
            }
            video.src = streamUrl;
            playVideo();
        }

        if (overlay) {
            overlay.addEventListener("click", bindStream);
        }
        video.addEventListener("click", function () {
            if (!started) {
                bindStream();
            }
        });
    };

    ready(function () {
        initMobileNav();
        initHero();
        initFilters();
    });
})();
