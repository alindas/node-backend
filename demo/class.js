class Human {
  #name = 'lili'
  name = 'lili_b'
  gender = 'female'

  constructor(name) {
    this.#name = name
  }

  getName() {
    return this.#name
  }
}

const lili = new Human('lilian')
// lili.
console.log(lili.#name) // lili
