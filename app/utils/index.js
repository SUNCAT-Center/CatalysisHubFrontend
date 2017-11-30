function download(filename, text, click = true) {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  if (click) {
    element.click();
  }
  document.body.removeChild(element);
  return document
}

module.exports = { download };
