const element = (tag, classes = [], content) => {
  const node = document.createElement(tag)

  if (classes.length) {
    node.classList.add(...classes)
  }

  if (content) {
    node.textContent = content
  }

  return node
}

const noop = () => {}

export const upload = (selector, options = {}) => {
  let files = []
  const onUpload = options.onUpload ?? noop
  const inputPictures = document.querySelector(selector)

  const openButton = element('button', ['btn'], 'Открыть')
  const preview = element('div', ['preview'])
  const upload = element('button', ['btn', 'primary'], 'Загрузить')

  upload.style.display = 'none'

  if (options.multi) {
    inputPictures.setAttribute('multiple', true)
  }

  inputPictures.insertAdjacentElement('afterend', preview)
  inputPictures.insertAdjacentElement('afterend', upload)
  inputPictures.insertAdjacentElement('afterend', openButton)

  if (options.accept && Array.isArray(options.accept)) {
    inputPictures.setAttribute('accept', options.accept.join(','))
  }

  const openHandler = () => inputPictures.click()

  const changeHandler = event => {
    if (!event.target.files.length) {
      return
    }

    upload.style.display = 'inline-block'

    files = Array.from(event.target.files)
    
    files.forEach(file => {
      preview.innerHTML = ''

      const reader = new FileReader()

      if (!file.type.match('image')) {
        return
      }

      reader.onload = ev => {
        const src = ev.target.result
        preview.insertAdjacentHTML('afterbegin', `
        <div class="preview-image">
          <div class="preview-remove" data-name="${file.name}">&times;</div>
          <img src=${src} alt=${file.name}>
          <div class="preview-info">
            <p>${file.name}</p>
            <p>${(file.size/(1024*1024)).toFixed(2)} MB</p>
          </div>
        </div>`)
      }

      reader.readAsDataURL(file)
    })
  }

  const removeHandler = event => {
    if(!event.target.dataset.name) {
      return
    }

    const {name} = event.target.dataset
    files = files.filter(x => x.name !== name)

    const block = preview
      .querySelector(`[data-name="${name}"]`)
      .closest('.preview-image')

    block.classList.add('removing')

    block.addEventListener('transitionend', () => {
      block.remove()
    })

    if (!files.length) {
      upload.style.display = 'none'
    }
  }

  const clearPreview = el => {
    el.innerHTML = '<div class="preview-info-progress"></div>'
    el.style.bottom = '0'
    el.style.padding = '0'
    el.style.height = '20px'
  }

  const uploadHandler = () => {
    preview.querySelectorAll('.preview-remove').forEach(x => x.remove())
    const previewInfo = preview.querySelectorAll('.preview-info').forEach(node => clearPreview(node))
    onUpload(files)
  }

  openButton.addEventListener('click', openHandler)
  inputPictures.addEventListener('change', changeHandler)
  preview.addEventListener('click', removeHandler)
  upload.addEventListener('click', uploadHandler)
}