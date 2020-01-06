export const ACCEPT_CONFIG = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
  video: ['.mp4', '.rmvb', '.mkv', '.wmv', '.flv'],
  audio: ['.mp3', '.wav', '.m4a', '.wma', '.ogg', '.aac', '.flac'],
  document: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.tif', '.tiff', '.rar', '.zip', '.arj', '.lzh', '.jar'],
  getAll () {
    return [...this.image, ...this.audio, ...this.video, ...this.document]
  }
}
