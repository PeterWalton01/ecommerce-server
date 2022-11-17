# Codecademy Portfolio Project - E-Commerce App (REST API)

## Description:

This project was completed as part of the Codecademy Full-Stack Engineer course. Specifically, the project covers the _E-Commerce App (REST API)_ project.

The purpose of the project is to provide a REST API that could be used for a simple e-commerce website. Specifically, the API supports the following:

1.  The ability to register new customers (users), and to allow these to log into and to log out of the site. When not logged in, most of the API calls will be declined on the basis of the customer not being logged in. <br> <br>
2.  All user registrations will be recorded in a Postgres database. The registration process will include encryption of the password provided before storage. <br> <br>
3.  The API supports the maintenance of a collection of products. A full set of CRUD operations on the products is supported. <br> <br>
4.  It is possible to create cart and cart contents. These carts are templates that can be promoted to actual orders. Note that this use of carts to create orders does not alter the cart; the cart remains in place for further use. <br> <br>
5.  The carts can be created by any logged-in user but are not owned - they are referred to using a cart id. <br> <br>
6.  All orders will be owned by the user that creates them. Only this user will be allowed to amend each order. <br> <br>
7.  Orders can be created by two methods: <br> <br>
    7.1 &nbsp;&nbsp;&nbsp; By creating an order using an existing cart ID to specify an order template. That order can then be modified using the API, which will allow the modification of existing items as well as the addition or deletion of order items. <br>
    7.2 &nbsp;&nbsp;&nbsp;An order can be created from scratch. This involves using the API to create a header, and the addition of items. <br> <br>
8.  The application maintains creation and modification dates. These are maintained within the system and they cannot be changed by the API. <br> <br>
9.  The system contains many checks that ensure that the information maintained by the system has full integrity. For example, the update of an order item that would create two items for the same products in an order will be blocked with a sensible message. <br> <br>
10. Given that products are superseded and that unit prices change, the product descriptions and unit prices are copied to the order when the order is created. This is sensible as later changes to these values will distress the customer.

Further details of these features are given below, and details of the API be found in the <i>swagger</i>.yml file within the project. This documentation can also be viewed using <i>/docs</i> on the API

### Implementation details

1. The application is an express application. It make use of the *pg* module to interact with a Postgres database. The data to support connection to the database is stored in a .env file at the root of the application file systems.
2. The data access and business logic are presented in the `/models` and `/controllers` directories of the project.
3. Nearly all of the database interactions are on single rows. The only API end-point requiring a transaction is the <i>/cart_to_order/:id</i> request.
4. Authorisation and access are controlled using the *passport* and *passport-local* modules. Password salting and encryption uses the *bcrypt* module.
5. The directory structure of the application is:
   > `/ - essential central control files` 

   > `/models - SQL-interface to the database` 

   > `/controller -logic and error handling for the SQL interface` 

   > `/db - SQL scripts to build and populate the Postgres database` 

   > `/passport - file to support user authorisation and access` 

   > `/rest - a set of .rest files for the API. Requires the 'REST Client' extension.` 

   > `/routes - set of routes needed by the API` 

   > `/swagger - a file to allow online access to the ymal document` 

   > `/utils - a file to support time stamping within the API`

## Getting Started- notes and guidance
1. To begin, create a Postgres database and use the files in */db* to build and populate the database.
2. Settings to identify the database and to allow access can be set in the .env file.
3. The listening port for the API can be set in the .env file. If no port is provided, the API will default to 3000.
4. Run the express application (e.g using nodemon in a vscode terminal).
5. To check all is well, use a browser to access the */docs* route. This should display the API documentation in the browser. 
6. Only two end-points of the API can be accessed without a login. These are */auth/register* and */auth/login*. All other routes will decline with a message requesting a login.
7. A user must logout (/logout) before logging in again.
8. The project contains a *rest* directory with a set of example API requests. In *vscode*, these can be used directly by the *Rest Client* extension. Alternatively the rest files contain examples that can be used in other tools to create API requests. 

## API Detail
Technical detail of the API be found in the project yaml file, or by using the /docs end-point of the API. 

General - the usual html codes are used in responses. These are 200, 201, 404, 409, and for system exceptions, 500.

We now provide details of the business logic embodied in the API.

### Registration and Authorisation

`POST:/auth/register`    
>    Open access. Registers a new user. Uses an email to provide an account identifier and records a password (encrypted).
    Check:
     - The email provided must be new.

`POST:/auth/login`
>    Logs in a previously registered user. Checks that account email is not already logged in.
    Checks:
     - Checks that that the email is known.
     - Checks that the correct password has been provided.

`GET: /auth/login/federated/google`
>   Requests a Google login. A html page is returned with the outcome. This response must be handled by the client application. The logon status is recorded against the Google email used for authorisation. All order will be recorded against this email account. 

`DELETE:/auth/logout`
>    Logs out the current user. Checks that someone is logged in. 

### Products

`GET: /products`
>    Login required. Returns an array of all product.

`GET: /products/{:id}`
>    Login required. Returns a product for the specified id.

`GET: /products/query/{:q}`
>   Login required. Returns an array of products that match a query string. This query is against the product description. To return all products  use a query value of %25. This is due to the role of % in URL strings. 

`POST: /products`
>    Login required. Creates a new product.
    Checks:
    - Checks that the product code is new.

`PUT: /products/{:id}`
>    Login required. Updates a  product
    Checks:
     - Check that the product id is known.
     - If the product code changes, make sure it does not create a duplicate.

`DELETE: /product/{:id}`
>    Login required. Deletes a specified product.
    Checks:
     - Check that the product id is known. 

### Cart Headers

`GET:/carts`
>    Login required. Returns an array of cart headers.

`GET:/carts/{:id}`
>    Login required. Returns a specified cart header.

`POST:/carts`
>    Login required. Returns a new cart header.

`PUT:/carts/{id}`
>    Login required. Updates a specified cart header.
    Check:
     - Check id is known.

`DELETE: /carts/{:id}`
>    Login required. Deletes a specified cart header.
    Checks:
     - Check that the cart id is known. 

### Cart Items

`GET:/cart/items`
>    Login required: Returns an array of all cart items.

`GET:/cart/items/{:id}`
>    Login required: Returns a specified cart item.

`POST:/cart/items`
>    Login required. Creates a new cart item for a cart header.
    Checks:
      - Check that the cart header id is known.
      - Check that the product code is known
      - Ensure the the product code is not already in the cart header specified.  

`PUT:/cart/items/{id}`
>    Login required. Updates a specified cart item.
    Checks:
      - Ensure that the cart item id is known.
      - Check that the quantity provided is valid.

`DELETE:/cart/items/{id}`
>    Login required. Deletes a specified cart item.
    Checks:
      Ensures that the id provided is known.

`GET:"/cart/:cart_id/items`
>    Login required. Returns an array containing the cart items in the specified car id. 

### Order Headers

`GET:/orders`
>    Login required. Returns an array of order headers.

`GET:/orders/{:id}`
>    Login required. Returns a specified order header.

`POST:/orders`
>    Login required. Returns a new order header. The order header is created against the email of the user currently logged in. Only this user can modify the order and its items going forward.

`PUT:/orders/{id}`
>    Login required. Updates a specified order header.
    Check:
     - Check id is known.
     - Check that the current user owns the order.
     - Ensure that order status is 10 characters or less.
     - Check that the order is not placed.

`DELETE: /orders/{:id}`
>    Login required. Deletes a specified order header.
    Checks:
     - Check that the order id is known.
     - Check that the current user own the order 
     - Check that the order is not placed.

### Order Items

`GET:/order/items`
>    Login required: Returns an array of all order items.

`GET:/order/items/{:id}`
>    Login required: Returns a specified order item.

`GET : /history`
>   Return all order header for the account currently logged on. 

`POST:/order/items`
>    Login required. Creates a new order item for an order header.
    Checks:
      - Check that the order header id is known.
      - Validates that the order is owned by the current user.
      - Check that the product code is known.
      - Ensure the the product code given is not already in the order header specified.
      - Check that the order is not placed  

`PUT:/order/items/{id}`
>    Login required. Updates a specified order item.
    Checks:
      - Ensure that the order item id is known.
      - Validates that the order is owned by the current user.
      - Check that the quantity provided is valid.
      - Check that the order is not placed

`DELETE:/order/items/{id}`
>    Login required. Deletes a specified cart item.
    Checks:
      - Ensures that the id provided is known.
      - Validates that the order is owned by the current user.
      - Check that the order is not placed


`GET:"/order/:order_id/items`
>    Login required. Returns an array containing the order items in the specified order id.
    Checks:
      - Validates that the order is owned by the current user.

## Order Based on Cart Id

`POST:/cart_to_order/:id`
> Login required. Creates an order based on a given cart Id; the cart and detail are copied to form an order. An object is returned that contains the order header and an array containing the order items. The order is owner by the current use.
   Check:
     Check that the cart id is known.

## License

The code in this project can be freely copied and distributed provided the copies bear an appropriate acknowledgement.