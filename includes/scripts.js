let position = null
let currentTarget = null

window.addEventListener('click', (event) => {
    const action = event.target.dataset.action
    const target = event.target

    if (action === 'open-video') {
        currentTarget = target
        openVideoModal(target)
    }
})

function openVideoModal() {
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

function lockBody() {
    document.body.classList.add('fixed')
}

function unlockBody() {
    document.body.classList.remove('fixed')
}

///////////////// Windows Scroll
const timeline = document.querySelector('.timeline')

function scroll() {
    timeline.classList.toggle('active', window.pageYOffset > window.innerHeight)
}

// scroll()
// window.addEventListener('scroll', scroll)