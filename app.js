import {upload} from './upload.js'

console.log('app.js work!!')

upload('#pictures', {
  multi: true,
  accept: ['.png', '.jpeg', '.jpg', '.gif']
})