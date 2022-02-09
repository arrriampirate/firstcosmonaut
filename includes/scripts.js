const modalDiv = document.querySelector('#modal')
const modalOverlay = document.querySelector('#overlay')
const modalClose = document.querySelector('#modal-close')
const youtubeFrame = document.querySelector('#youtube')

let position = null
let currentTarget = null

window.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
        closeModal()
    }
})

window.addEventListener('click', (event) => {
    const action = event.target.dataset.action
    const target = event.target

    if (action === 'open-video') {
        currentTarget = target
        openVideoModal(target)
    }

    if (action === 'open-modal') {
        position = event.target.getBoundingClientRect()
        // openModal(event.target.dataset.src, event.target.dataset.youtube)
    }

    console.log('click', event.target, action)

    if (action === 'close-modal') {
        // closeModal()
    }
})

function openModal(src, youtube) {
    document.body.classList.add('fixed')

    setInitialPosition()
    modalDiv.classList.add('visible', 'animated')
    modalDiv.style.backgroundImage = `url(${src})`

    setTimeout(() => {
        modalDiv.style.backgroundImage = `url(${src})`
        modalOverlay.classList.add('visible')
        modalClose.classList.add('visible')

        if (!youtube) {
            setImagePosition(src)
        }

        if (youtube) {
            setYoutubeFrame(youtube)
        }
    }, 20)
}

function closeModal() {
    if (!document.body.classList.contains('fixed')) {
        return
    }
    document.body.classList.remove('fixed')
    modalOverlay.classList.remove('visible')
    modalClose.classList.remove('visible')

    setInitialPosition()

    setTimeout(() => {
        modalDiv.classList.remove('animated', 'visible')
        modalDiv.style.backgroundImage = ''
        youtubeFrame.classList.remove('visible')
        youtubeFrame.src = ''
    }, 200)
}

function setInitialPosition() {
    modalDiv.style.width = `${position.width}px`
    modalDiv.style.height = `${position.height}px`
    modalDiv.style.left = `${position.left}px`
    modalDiv.style.top = `${position.top}px`
}

function setImagePosition(src) {
    const image = new Image()
    image.onload = function() {
        const winWidth = window.innerWidth
        const winHeight = window.innerHeight
        let width = this.width
        let height = this.height
        const k = width / height

        if (width > winWidth) {
            width = winWidth
            height = height * k
        } else if (height > winHeight) {
            height = winHeight
            width = width * k
        }

        const left = (winWidth - width) / 2
        const top = (winHeight - height) / 2

        modalDiv.style.width = `${width}px`
        modalDiv.style.height = `${height}px`
        modalDiv.style.left = `${left}px`
        modalDiv.style.top = `${top}px`
    }
    image.src = src
}


function openVideoModal() {
    lockBody()

    currentTarget.classList.add('active')
    const canvas = currentTarget.querySelector('.video-canvas')
    const youtube = canvas.querySelector('.video-youtube')
    const code = currentTarget.dataset.youtube

    position = canvas.getBoundingClientRect()
    canvas.style.left = `-${position.left}px`
    canvas.style.top = `-${position.top}px`
    canvas.style.width = `100vw`
    canvas.style.height = `100vh`

    youtube.src = `https://www.youtube.com/embed/${code}?controls=2&rel=0&autoplay=1&controls=0`
}

function lockBody() {
    document.body.classList.add('fixed')
}

function unlockBody() {
    document.body.classList.remove('fixed')
}