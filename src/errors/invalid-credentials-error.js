export class InvalidCredentialsError extends Error {
  constructor() {
    super("Crendenciais Inválidas"); // this is the error object constructor, we pass the message we want to display
    this.name = "InvalidCredentialsError"; // this.name asign the error name to the name of the class
  }
}
