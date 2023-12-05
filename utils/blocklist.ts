export const removeBlockListComment = (text: string) => {
  return text.replace(/ *#.*$/m, '')
}
export const parseBlockListComment = (text: string) => {
  return removeBlockListComment(text).split('\n')
}
