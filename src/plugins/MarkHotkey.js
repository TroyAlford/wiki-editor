export default ({ hotkey, mark }) => ({
  onKeyDown(event, data, state) {
    if (!event.metaKey || data.key !== hotkey) return undefined

    event.preventDefault()
    return state
      .transform()
      .toggleMark(mark)
      .apply()
  },
})
