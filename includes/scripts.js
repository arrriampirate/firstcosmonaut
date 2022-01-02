const modalDiv = document.querySelector('#modal')
const modalOverlay = document.querySelector('#overlay')
const modalClose = document.querySelector('#modal-close')

let position = null

window.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
        closeModal()
    }
})

window.addEventListener('click', (event) => {
    const action = event.target.dataset.action

    if (action === 'open-modal') {
        const type = event.target.dataset.type
        const src = event.target.dataset.src
        position = event.target.getBoundingClientRect()
        openModal()
    }

    console.log('click', action)

    if (action === 'close-modal') {
        closeModal()
    }
})

function openModal() {
    document.body.classList.add('fixed')

    setInitialPosition()
    modalDiv.classList.add('visible', 'animated')
    modalDiv.classList.add('expanded')

    setTimeout(() => {
        modalDiv.style = ''
        modalOverlay.classList.add('visible')
        modalClose.classList.add('visible')
    }, 20)
}

function closeModal() {
    if (!document.body.classList.contains('fixed')) {
        return
    }
    document.body.classList.remove('fixed')
    modalOverlay.classList.remove('visible')
    modalClose.classList.remove('visible')

    modalDiv.classList.remove('expanded')
    setInitialPosition()

    setTimeout(() => {
        modalDiv.style = ''
        modalOverlay.classList.remove('animated', 'visible')
    }, 300)
}

function setInitialPosition() {
    modalDiv.style.width = `${position.width}px`
    modalDiv.style.height = `${position.height}px`
    modalDiv.style.left = `${position.left}px`
    modalDiv.style.top = `${position.top}px`
}
