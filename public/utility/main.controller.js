import {getMainTemplate, renderViewToContainer} from "./main.view"

export const createMainContainer = () => {
  const mainContainer = getMainTemplate()
  renderViewToContainer(mainContainer, "body")
}
