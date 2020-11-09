//Book class: Represents a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


//UI Class: Handle UI tasks
class UI {
    static displayBooks() {
        // const StoredBooks= [
        //     {
        //         title: "Book One",
        //         author: "Akshay Shetty",
        //         isbn:"32466586"
        //     },
        //     {
        //         title: "Book Two",
        //         author: "Jen Shetty",
        //         isbn:"676431654"
        //     }
        // ];

        const books = Store.getBooks();

        books.forEach(book => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector("#book-list");

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm 
        delete">Delete</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains("delete")){
            //el.parentElement=<td>; el.parentElement.parentElement=<tr>
            el.parentElement.parentElement.remove();
        }
    }

    //<div class="alert alert-success">Message</div>
    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        //insert in DOM before the form
        const container = document.querySelector("#book-form").parentNode;
        const form = document.querySelector("#book-form");

        //insert div before the form
        container.insertBefore(div, form);

        //Lasts for 3 seconds
        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 3000);

    }

    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
    }
}

//Store Class: Handles Storage (local storage)
class Store {
    static getBooks() {
        let books;

        if(localStorage.getItem("books") === null) {
            books = [];
        } else {
            //JSON.parse as localStorage has strings
            books = JSON.parse(localStorage.getItem("books"));
        }

        return books;
    };

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        //books is an object
        localStorage.setItem("books", JSON.stringify(books));
    };

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {

            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem("books", JSON.stringify(books));
    };
}


//Event: Display Books

document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Event: Add a Book

document.querySelector("#book-form").addEventListener("submit", (event) => {
    
    //prevent actual submit

    event.preventDefault();

    //Get form values
    title = document.querySelector("#title").value;
    author = document.querySelector("#author").value;
    isbn = document.querySelector("#isbn").value;

    //Validate

    if(title === "" || author === "" || isbn === "") {
        UI.showAlert("Please enter all fields", "danger");
    } else {

        //instantiate a book
        const book = new Book(title, author, isbn);

        //Add Book to UI
        UI.addBookToList(book);

        //Add book to store
        Store.addBook(book);

        //show success message
        UI.showAlert("Book Added", "success");

        //clear fields
        UI.clearFields();
    }
});

//Event: Remove a Book through event propogation by targetting parent(list)
document.querySelector("#book-list").addEventListener("click", (event) => {
    //event.target gives anything clicked on in body (book-list)
     UI.deleteBook(event.target);

     //remove vook from store
     Store.removeBook(event.target.parentElement.previousElementSibling.textContent);

     //show removed book message
     UI.showAlert("Book Removed", "success");
})