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
})

const openVideoModal = () => {
    lockBody()

    currentTarget.classList.add('active')
    const canvas = currentTarget.querySelector('.video-canvas')
    const closeButton = canvas.querySelector('.video-close')
    const youtube = canvas.querySelector('.video-youtube')
    const code = currentTarget.dataset.youtube

    function resize() {
        position = currentTarget.getBoundingClientRect()

        console.log('position', position, position.top)
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
        currentTarget.classList.remove('active')
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

const lockBody = () => {
    document.body.classList.add('fixed')
}

const unlockBody = () => {
    document.body.classList.remove('fixed')
}

////////// Timeline
const scrollToYear = (target) => {
    const value = target.dataset.value
    const year = document.querySelector(`[data-year="${value}"]`)

    window.scrollTo({
        left: year.offsetLeft,
        behavior: 'smooth',
    })
}

///////////////// Windows Scroll
const timeline = document.querySelector('.timeline')
const timelineItems = Array.from(timeline.querySelectorAll('.timeline-item'))
const years = Array.from(document.querySelectorAll('.year'))
let currentYearIndex = 0
let offsets = []
let reversedOffsets = []

const calcYearsOffsets = () => {
    offsets = years.map((year, index) => !index ? 0 : year.offsetLeft)
    reversedOffsets = offsets.reverse()
}

const scroll = () => {
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

const highlightTimelineYear = () => {
    timelineItems.forEach((item, index) => {
        index === currentYearIndex
            ? item.classList.add('active')
            : item.classList.remove('active')
    })
}

calcYearsOffsets()
scroll()
highlightTimelineYear()
window.addEventListener('scroll', scroll)
window.addEventListener('resize', calcYearsOffsets)
