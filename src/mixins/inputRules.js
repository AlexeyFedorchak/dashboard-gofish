export default {
  methods: {
    // eslint-disable-next-line consistent-return
    isNumber(e) {
      const char = String.fromCharCode(e.keyCode)
      if (/^[0-9]+$/.test(char)) return true
      e.preventDefault()
    },
    // eslint-disable-next-line consistent-return
    isLetter(e) {
      const char = String.fromCharCode(e.keyCode)
      if (/^[A-Za-z,А-ЯІЄЇҐ,а-яієїґ]+$/.test(char)) return true
      e.preventDefault()
    },
  },
}
