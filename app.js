import {upload} from './upload.js'

upload('#pictures', {
  multi: true,
  accept: ['.png', '.jpeg', '.jpg', '.gif'],
  onUpload(files) {
    console.log('files', files)
  }
})