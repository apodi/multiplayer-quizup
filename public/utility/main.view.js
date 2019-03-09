
const htmlToTemplate = (htmlstr) => {
  const template = document.createElement("template")
  template.innerHTML = htmlstr
  return template.content
}
export const renderViewToContainer = (content, containerKey) => {
  const container = document.querySelector(containerKey)
  container.appendChild(content)
}
export const getMainTemplate = () => {
  const mainHtmlStr = "<main></main>"
  return htmlToTemplate(mainHtmlStr)
}

