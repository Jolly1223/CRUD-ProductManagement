function getProducts(){
    $('#products').text('');
    fetch('http://localhost:5000/products/')
    .then(products => {
        return products.json();
    }).then((data) =>{
        data.forEach(product => {
            $('#products').append(
                `
                    <tr>
                        <td>${product._id}</td>
                        <td>${product.name}</td>
                        <td>${product.quantity}</td>
                        <td>${product.price}</td>
                        <td>
                            <div class='d-flex justify-content-around'>
                                <button class = "btn btn-success" onclick = "editProduct('${product._id}')">Edit</button>
                                <button class = "btn btn-danger" onclick = "deleteProduct('${product._id}')">Delete</button>
                            </div>
                        </td>
                    </tr>
                `
            );
        });
    }).catch(error => console.log(error));
}

function editProduct(id){
    fetch(`http://localhost:5000/products/${id}`)
    .then(product => product.json())
    .then((data) => {
        $('#id').val(data._id);
        $('#name').val(data.name);
        $('#quantity').val(data.quantity);
        $('#price').val(data.price);
    })
    .catch(error => console.log(error));
}

function deleteProduct(id){
    fetch(`http://localhost:5000/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(response => {
        message(response);
        getProducts();
    })
    .catch(error => console.log(error));
}

function message(message){
    $('#message').text('');
    $('#message').append(
        `
            <div class = "alert alert-success">
                ${message}
            </div>
        `
    );
}

function createProduct(){
    let name = $('#name').val(),
        quantity = $('#quantity').val(),
        price = $('#price').val();

    let formData = {name, quantity, price};

    fetch('http://localhost:5000/products/create', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(response => {
        message(response);
        $('input').val('');
        getProducts();
    })
    .catch(error => console.log(error));
}

function updateProduct(){
    let id = $('#id').val(),
        name = $('#name').val(),
        quantity = $('#quantity').val(),
        price = $('#price').val();

    let formData = {id, name, quantity, price};

    fetch(`http://localhost:5000/products/update/${id}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(response => {
        message(response);
        $('input').val('');
        getProducts();
    })
    .catch(error => console.log(error));
}

$(document).ready(function(){
    //this will call the function which loads the data from the database to the table
    getProducts();


    //prevent the page to reload as the submit button under the form is clicked
    $('#form').submit(function(event){
        event.preventDefault();
    });

    //if create button is clicked then it will call the createProduct function that adds the data into the database
    $('#create').on('click', createProduct);


    //if update button is clicked then it will call the updateProdcut function that udpates the data in the table where the edit button was clicked
    $('#update').on('click', updateProduct);
});