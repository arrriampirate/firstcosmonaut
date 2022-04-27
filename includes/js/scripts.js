const lockBody = () => document.body.classList.add('__fixed')
const unlockBody = () => document.body.classList.remove('__fixed')
const scrollToPosition = (offset) => {
    const params = isMobile ? { top: offset } : { left: offset }
    window.scrollTo({ ...params, behavior: 'smooth' })
}

const debounce = (func, wait, immediate) => {
    let timeout
    return function() {
        const context = this
        const args = arguments
        const later = function() {
            timeout = null
            if (!immediate) func.apply(context, args)
        }
        const callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }
}

let position = null
let currentTarget = null
let isScrollLocked = false
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

if (isMobile) {
    document.body.classList.add('__mobile')
}

const clickEventName = isMobile ? 'touchend' : 'click'

window.addEventListener(clickEventName, clickHandler)

function clickHandler(event) {
    const action = event.target.dataset.action
    const target = event.target

    if (action === 'open-video') {
        if (!isMobile) {
            event.preventDefault()
            currentTarget = target
            openVideoModal(target)
        }
    }

    if (action === 'scroll-to-year') {
        currentTarget = target
        scrollToYear(target)
    }

    if (action === 'scroll-to-start') {
        scrollToStart()
    }
}

const openVideoModal = () => {
    lockBody()
    isScrollLocked = true

    currentTarget.classList.add('__active')
    const canvas = currentTarget.querySelector('.video__canvas')
    const closeButton = canvas.querySelector('.video__close')
    const youtube = canvas.querySelector('.video__youtube')
    const code = currentTarget.dataset.youtube

    function resize() {
        position = currentTarget.getBoundingClientRect()
        canvas.style.left = `${position.left * -1}px`
        canvas.style.top = `${position.top * -1}px`
        canvas.style.width = `100vw`
        canvas.style.height = `100vh`
    }

    resize()

    const youtubeTimeout = window.setTimeout(() => {
        youtube.src = `https://www.youtube.com/embed/${code}?controls=2&rel=0&autoplay=1&controls=0&fs=0&modestbranding=1&showinfo=0&iv_load_policy=3`
    }, 300)

    function close(event) {
        if (event && event.preventDefault) {
            event.preventDefault()
        }
        unlockBody()
        isScrollLocked = false

        clearTimeout(youtubeTimeout)
        currentTarget.classList.remove('__active')
        canvas.style = ''
        youtube.src = ''

        closeButton.removeEventListener(clickEventName, close)
        window.removeEventListener('keyup', keyUpClose)
        window.removeEventListener('resize', resize)
    }

    function keyUpClose(event) {
        if (event.key === 'Escape') {
            close()
        }
    }

    closeButton.addEventListener(clickEventName, close)
    window.addEventListener('keyup', keyUpClose)
    window.addEventListener('resize', resize)
}

////////// Timeline
const scrollToYear = (target) => {
    const year = document.querySelector(`[data-year="${target.dataset.value}"]`)
    highlightTimelineYearByYear(target.dataset.value)
    scrollToPosition(isMobile ? year.offsetTop : year.offsetLeft)
}

////////// Scroll Forward
const scrollToStart = () => {
    scrollToPosition(0)
}

const arrow = document.querySelector('.arrow')
const setActiveScrollForwardArrow = () => {
    const offset = isMobile ? window.scrollY : window.scrollX
    arrow.classList.toggle('__disabled', offset < 100)
}

///////////////// Windows Scroll
const timeline = document.querySelector('.timeline')
const timelineItems = Array.from(timeline.querySelectorAll('.timeline__item'))
const years = Array.from(document.querySelectorAll('.year'))
let currentYearIndex = 0
let offsets = []
let reversedOffsets = []

const calcYearsOffsets = () => {
    offsets = years.map((year, index) => !index ? 0 : isMobile ? year.offsetTop : year.offsetLeft)
    reversedOffsets = offsets.reverse()
}

const setActiveTimelineItem = () => {
    offsets.find((offset, index) => {
        const scrollPosition = isMobile ? window.scrollY : window.scrollX
        if (scrollPosition >= offset) {
            const newYearIndex = offsets.length - 1 - index
            if (newYearIndex !== currentYearIndex) {
                currentYearIndex = newYearIndex
                highlightTimelineYear()
            }
            return true
        }
        return false
    })
}

const scroll = () => {
    setActiveTimelineItem()
    setActiveScrollForwardArrow()
}

const highlightTimelineYear = () => {
    timelineItems.forEach((item, index) => {
        if (index === currentYearIndex) {
            item.classList.add('__active')
            item.scrollIntoView({
                behavior: 'smooth',
            })
        } else {
            item.classList.remove('__active')
        }
    })
}

const highlightTimelineYearByYear = (year) => {
    timelineItems.forEach(item => {
        item.dataset.value === year
            ? item.classList.add('__active')
            : item.classList.remove('__active')
    })
}

calcYearsOffsets()
scroll()
highlightTimelineYear()
window.addEventListener('scroll', debounce(scroll, 100))
window.addEventListener('resize', calcYearsOffsets)

if (!isMobile) {
    window.addEventListener('wheel', (event) => {
        if (isScrollLocked) {
            return
        }
        const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX
        window.scrollTo({
            left: window.scrollX + delta
        })
    })
}

window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('loaded')
    }, isMobile ? 500 : 0)
})
