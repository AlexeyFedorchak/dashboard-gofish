export  default {
  methods:{
    isNumber (e) {
      let char = String.fromCharCode(e.keyCode);
      if (/^[0-9]+$/.test(char)) return true;
      else e.preventDefault();
    },
    isLetter(e) {
      let char = String.fromCharCode(e.keyCode);
      if (/^[A-Za-z,А-ЯІЄЇҐ,а-яієїґ]+$/.test(char)) return true;
      else e.preventDefault();
    },
  }
}
