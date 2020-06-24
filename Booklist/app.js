// Book class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
//UI - handle UI tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(function (book) {
      UI.addBookToList(book);
    });
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>  
    `;

    list.appendChild(row);
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    // vanish in 3 seconds
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 1000);
  }
  static clearFields() {
    document.querySelector("#book-form").reset();
  }
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }
}
// Store class: books storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}
// Event: display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);
// add book func
document
  .querySelector("#book-form")
  .addEventListener("submit", function (event) {
    // prevent the default form submit
    event.preventDefault();
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // validate a book
    if (title === "" || author === "" || isbn === "") {
      UI.showAlert("Please fill all the fields", "danger");
    } else {
      // Instantiate a book

      const book = new Book(title, author, isbn);

      // add book to list
      UI.addBookToList(book);

      // add book to store
      Store.addBook(book);

      // show success message

      UI.showAlert("Book added", "success");
      // clear the form fields
      UI.clearFields();
    }
  });

// delete book func
document
  .querySelector("#book-list")
  .addEventListener("click", function (event) {
    // remove book from UI
    UI.deleteBook(event.target);

    // remove book from store
    Store.removeBook(
      event.target.parentElement.previousElementSibling.textContent
    );

    // show book removed message
    UI.showAlert("Book Removed", "success");
  });
