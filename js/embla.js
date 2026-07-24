const addTogglePrevNextButtonsActive = (emblaApi, prevBtn, nextBtn) => {
    const togglePrevNextButtonsState = () => {
        if (emblaApi.canScrollPrev()) {
            prevBtn.classList.remove('embla__button--disabled')
        } else {
            prevBtn.classList.add('embla__button--disabled')
        }

        if (emblaApi.canScrollNext()) {
            nextBtn.classList.remove('embla__button--disabled')
        } else {
            nextBtn.classList.add('embla__button--disabled')
        }
    }

    togglePrevNextButtonsState()

    emblaApi
        .on('select', togglePrevNextButtonsState)
        .on('reInit', togglePrevNextButtonsState)
}

const addPrevNextButtonClickHandlers = (emblaApi, prevBtn, nextBtn) => {
    const scrollPrev = () => {
        emblaApi.scrollPrev()
    }
    const scrollNext = () => {
        emblaApi.scrollNext()
    }
    prevBtn.addEventListener('click', scrollPrev, false)
    nextBtn.addEventListener('click', scrollNext, false)

    addTogglePrevNextButtonsActive(emblaApi, prevBtn, nextBtn)
}

const addDotButtonAndClickHandlers = (emblaApi, dotsNode) => {
    let dotNodes = []

    const addDotBtnsWithClickHandlers = () => {
        dotsNode.innerHTML = emblaApi
            .scrollSnapList()
            .map(() => '<button class="embla__dot" type="button"></button>')
            .join('')

        const scrollTo = (index) => {
            emblaApi.scrollTo(index)
        }

        dotNodes = Array.from(dotsNode.querySelectorAll('.embla__dot'))
        dotNodes.forEach((dotNode, index) => {
            dotNode.addEventListener('click', () => scrollTo(index), false)
        })
    }

    const toggleDotButtonsActive = () => {
        const previous = emblaApi.previousScrollSnap()
        const selected = emblaApi.selectedScrollSnap()
        dotNodes[previous].classList.remove('embla__dot--selected')
        dotNodes[selected].classList.add('embla__dot--selected')
    }

    addDotBtnsWithClickHandlers()
    toggleDotButtonsActive()

    emblaApi
        .on('reInit', addDotBtnsWithClickHandlers)
        .on('reInit', toggleDotButtonsActive)
        .on('select', toggleDotButtonsActive)
}

const addCaptionSync = (emblaApi, captionNode) => {
    const captions = emblaApi
        .slideNodes()
        .map((slideNode) => slideNode.querySelector('.embla__slide-caption')?.innerHTML || '')

    const updateCaption = () => {
        captionNode.innerHTML = captions[emblaApi.selectedScrollSnap()]
    }

    updateCaption()

    emblaApi.on('select', updateCaption).on('reInit', updateCaption)
}

const initEmblaCarousel = (emblaNode) => {
    const viewportNode = emblaNode.querySelector('.embla__viewport')
    const prevBtn = emblaNode.querySelector('.embla__button--prev')
    const nextBtn = emblaNode.querySelector('.embla__button--next')
    const dotsNode = emblaNode.querySelector('.embla__dots')
    const captionNode = emblaNode.querySelector('.embla__caption')

    const emblaApi = EmblaCarousel(viewportNode, OPTIONS)

    addPrevNextButtonClickHandlers(emblaApi, prevBtn, nextBtn)
    addDotButtonAndClickHandlers(emblaApi, dotsNode)
    addCaptionSync(emblaApi, captionNode)

    return emblaApi
}

const OPTIONS = {}

const emblaNodes = Array.from(document.querySelectorAll('.embla'))
const emblaApis = emblaNodes.map(initEmblaCarousel)
