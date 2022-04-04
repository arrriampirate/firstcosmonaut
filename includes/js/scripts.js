const lockBody = () => document.body.classList.add('__fixed')
const unlockBody = () => document.body.classList.remove('__fixed')
const scrollToX = (left) => window.scrollTo({ left, behavior: 'smooth' })

////////// Timeline
let position = null
let currentTarget = null

window.addEventListener('click', (event) => {
    const action = event.target.dataset.action
    const target = event.target

    if (action === 'open-video') {
        currentTarget = target
        openVideoModal(target)
    }

    if (action === 'scroll-to-year') {
        currentTarget = target
        scrollToYear(target)
    }

    if (action === 'scroll-forward') {
        scrollForward()
    }
})

const openVideoModal = () => {
    lockBody()

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

    function close() {
        unlockBody()

        clearTimeout(youtubeTimeout)
        currentTarget.classList.remove('__active')
        canvas.style = ''
        youtube.src = ''

        closeButton.removeEventListener('click', close)
        window.removeEventListener('keyup', keyUpClose)
        window.removeEventListener('resize', resize)
    }

    function keyUpClose(event) {
        if (event.key === 'Escape') {
            close()
        }
    }

    closeButton.addEventListener('click', close)
    window.addEventListener('keyup', keyUpClose)
    window.addEventListener('resize', resize)
}

////////// Timeline
const scrollToYear = (target) => {
    const year = document.querySelector(`[data-year="${target.dataset.value}"]`)
    scrollToX(year.offsetLeft)
}

////////// Scroll Forward
const scrollForward = () => {
    scrollToX(window.scrollX + window.innerWidth)
}

const main = document.querySelector('.main')
const arrow = document.querySelector('.arrow')
const setActiveScrollForwardArrow = () => {
    arrow.classList.toggle('__disabled', window.scrollX >= main.clientWidth - window.innerWidth - 100)
}

///////////////// Windows Scroll
const timeline = document.querySelector('.timeline')
const timelineItems = Array.from(timeline.querySelectorAll('.timeline__item'))
const years = Array.from(document.querySelectorAll('.year'))
let currentYearIndex = 0
let offsets = []
let reversedOffsets = []

const calcYearsOffsets = () => {
    offsets = years.map((year, index) => !index ? 0 : year.offsetLeft)
    reversedOffsets = offsets.reverse()
}

const setActiveTimelineItem = () => {
    offsets.find((offset, index) => {
        if (window.scrollX >= offset) {
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
        index === currentYearIndex
            ? item.classList.add('__active')
            : item.classList.remove('__active')
    })
}

calcYearsOffsets()
scroll()
highlightTimelineYear()
window.addEventListener('scroll', scroll)
window.addEventListener('resize', calcYearsOffsets)
