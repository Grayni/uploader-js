export const upload = (selector, options = {}) => {
  const inputPictures = document.querySelector(selector)

  const openButton = document.createElement('button')
  openButton.classList.add('btn')
  openButton.textContent = 'Открыть'

  const preview = document.createElement('div')
  preview.classList.add('preview')


  if (options.multi) {
    inputPictures.setAttribute('multiple', true)
  }

  inputPictures.insertAdjacentElement('afterend', preview)
  inputPictures.insertAdjacentElement('afterend', openButton)

  openButton.addEventListener('click', () => {
    inputPictures.click()
  })

  if (options.accept && Array.isArray(options.accept)) {
    inputPictures.setAttribute('accept', options.accept.join(','))
  }

  const changeHandler = event => {
    if (!event.target.files.length) {
      return
    }

    const files = Array.from(event.target.files, file => {
      preview.innerHTML = ''

      const reader = new FileReader()

      if (!file.type.match('image')) {
        return
      }

      reader.onload = ev => {
        const src = ev.target.result
        preview.insertAdjacentHTML('afterbegin', `
        <div class="preview-image">
          <div class="preview-remove">&times;</div>
          <img src=${src} alt=${file.name}>
          <div class="preview-info">
            <p>${file.name}</p>
            <p>${(file.size/(1024*1024)).toFixed(2)} Mb</p>
          </div>
        </div>`)
      }

      reader.readAsDataURL(file)
      console.log(file)
    })
  }

  inputPictures.addEventListener('change', changeHandler)
}