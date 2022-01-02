const modalDiv = document.querySelector('#modal')
const modalOverlay = document.querySelector('#overlay')
const modalClose = document.querySelector('#modal-close')
const youtubeFrame = document.querySelector('#youtube')

let position = null

window.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
        closeModal()
    }
})

window.addEventListener('click', (event) => {
    const action = event.target.dataset.action

    if (action === 'open-modal') {
        position = event.target.getBoundingClientRect()
        openModal(event.target.dataset.src, event.target.dataset.youtube)
    }

    console.log('click', action)

    if (action === 'close-modal') {
        closeModal()
    }
})

function openModal(src, youtube) {
    document.body.classList.add('fixed')

    setInitialPosition()
    modalDiv.style.backgroundImage = `url(${src})`
    modalDiv.classList.add('visible', 'animated')

    setTimeout(() => {
        modalDiv.style = ''
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
        modalDiv.style = ''
        modalOverlay.classList.remove('animated', 'visible')
        modalDiv.style.backgroundImage = ''
        youtubeFrame.classList.remove('visible')
        youtubeFrame.src = ''
    }, 300)
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

        console.log(width, height, left, top)
        modalDiv.style.width = `${width}px`
        modalDiv.style.height = `${height}px`
        modalDiv.style.left = `${left}px`
        modalDiv.style.top = `${top}px`
    }
    image.src = src
}


function setYoutubeFrame(youtube) {
    youtubeFrame.classList.add('visible')
    youtubeFrame.src = `https://www.youtube.com/embed/${youtube}?controls=2&rel=0&autoplay=1&controls=0`
}