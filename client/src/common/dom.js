let appNode

export function getAppNode() {
  if (!appNode) appNode = document.getElementById('root')

  return appNode
}
