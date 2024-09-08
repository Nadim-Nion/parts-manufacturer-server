# **CompParts Hub  (Server Side)**

## Parts Manufacturer Website

This is the backend server for the "CompParts Hub" MERN Stack project, a Parts Manufacturer website. This repository handles the server-side logic, including authentication, order management, and admin functionalities. The backend is built using **Node.js**, **Express.js**, **MongoDB**, **JWT**, and **Stripe** for payment integration.

---

## Key Features

1. **Authentication**: Implemented using Firebase (email/password-based, social login with Google).
2. **JWT Protection**: JWT tokens are used to secure routes and restrict access based on user roles (Admin/User).
3. **User & Admin Dashboards**: Users can manage orders, leave reviews, and update profiles, while Admins can manage orders, products, and assign roles.
4. **Stripe Payment Integration**: Users can complete purchases using credit cards, with payments handled by Stripe.
5. **Parts Management**: Admins can add, update, and delete parts from the collection.

---

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database for storing parts, orders, users, and reviews.
- **JWT (JSON Web Token)**: Secures user and admin routes with token-based authentication.
- **Stripe API**: Manages payment processing for orders.
- **Firebase**: For authentication (email/password and Google login).

---

## API Endpoints

### Parts Collection API

- **Get All Parts**
    - `GET /parts`
    - Fetches all parts from the collection.
  
- **Get Part by ID**
    - `GET /parts/:id`
    - Fetches a single part based on the given ID.
  
- **Add New Part**
    - `POST /parts`
    - Adds a new part (Admin Only).
  
- **Update Part**
    - `PUT /parts/:id`
    - Updates an existing part (Admin Only).
  
- **Delete Part**
    - `DELETE /parts/:id`
    - Deletes a part by ID (Admin Only).

### Reviews Collection API

- **Get All Reviews**
    - `GET /reviews`
    - Fetches all reviews.
  
- **Add Review**
    - `POST /reviews`
    - Allows users to add a review.

### Purchased Parts API

- **Get All Orders (User-specific)**
    - `GET /purchasedParts?email=userEmail`
    - Fetches orders placed by the logged-in user.

- **Place New Order**
    - `POST /purchasedParts`
    - Places a new order.
  
- **Update Order Status**
    - `PATCH /purchasedParts/status/:id`
    - Updates the status of a specific order to "shipped" (Admin Only).

- **Delete Order**
    - `DELETE /purchasedParts/:id`
    - Deletes an order that is not paid yet (Admin Only).

### Admin Functions

- **Make User Admin**
    - `PATCH /users/admin/:email`
    - Grants admin privileges to a user.

- **Manage All Orders**
    - `GET /admin/orders`
    - Admin can view and manage all orders placed by users.
  
- **Add New Product**
    - `POST /admin/product`
    - Admin can add new products to the parts collection.

- **Delete Product**
    - `DELETE /admin/product/:id`
    - Admin can delete a product from the parts collection.

### Stripe Payment API

- **Create Payment Intent**
    - `POST /create-payment-intent`
    - Creates a Stripe payment intent for an order.

---

## Admin Credentials

**email**: admin@gmail.com

**password**: 123456789

---
## Backend API

Vercel: https://parts-manufacturer-server-nine.vercel.app/

---
## Getting Startted

## Database Schema

### Parts Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "image": "string",
  "short_description": "string",
  "minimum_order_quantity": "number",
  "available_quantity": "number",
  "price_per_unit": "number"
}
```

### Reviews Collection
```json
{
  "_id": "ObjectId",
  "userEmail": "string",
  "userName": "string",
  "rating": "number",
  "description": "string"
}
```

### Purchased Parts Collection
```json
{
  "_id": "ObjectId",
  "userEmail": "string",
  "toolName": "string",
  "price": "number",
  "orderQuantity": "number",
  "status": "string",
  "transactionId": "string",
  "address": "string",
  "phone": "string"
}
```
---

## Security

- JWT is used to protect all user-specific and admin routes.
- Stripe API handles secure payments.


---
## Installation


## 📝 **Instructions**

1. Clone the repository:

   ```bash
   git clone https://github.com/Nadim-Nion/parts-manufacturer-server.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Add environment variables in `.env.local` for Firebase and Stripe configurations.Absolutely, here's the section on commits with a potential improvement:

---

## Commits

This repository adheres to a structured commit message convention to enhance readability and maintainability. Here's an overview of the key commit types:

- **feat:** Introduces a new feature to the application.
- **fix:** Addresses a bug or issue identified in the codebase.
- **docs:** Encompasses changes made to documentation, such as updates, additions, or corrections.
- **style:** Covers formatting adjustments, whitespace changes, or fixing minor inconsistencies like missing semicolons.
- **refactor:** Represents code structure improvements without altering functionality. This can involve code organization, renaming variables or functions, or improving readability.
- **test:** Introduces new tests or updates existing tests to ensure code quality and maintainability.
- **chore:** Encompasses changes that don't directly affect the application's functionality, such as updating build tasks, package manager configurations, or dependency versions.

**Optional Improvement:**

Consider adopting a more comprehensive commit message convention like Conventional Commits ([https://www.conventionalcommits.org/en/v1.0.0-beta.4/](https://www.conventionalcommits.org/en/v1.0.0-beta.4/)). This approach provides a standard format for commit messages, including type, scope (optional), and a clear description of the change, making it easier to generate changelogs, automate workflows, and collaborate effectively.

By following these guidelines and potentially adopting a more detailed convention, you'll ensure clear and consistent commit messages that benefit you and your team in the long run.

---

## Contributing

Contributions are always welcome!

Contributions are welcome! Please open a pull request for any improvements or features.

Please adhere to this project's `code of conduct`.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Deployment

To deploy this project run

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Nadim-Nion/parts-manufacturer-server.git
git push -u origin main

```

---

## Tech Stack

**Client:** React+Vite, React Router, Firebase (Authentication & Hosting), Tailwind CSS, Daisy UI, Axios JS

**Server:** Express.js, Node.js, JWT, Stripe

**Database:** MongoDB

**Tools:** Vite, Vercel, npm, Surge, Netlify

**State Management:** Context API

---

## FAQ

#### Is this website reponsible?

Answer : Yes, the full website is responsive for the all devices (Desktop, Tablet and Phone)

#### Is this website store data to the database?

Answer : I have stored all the data in MongoDB.

---

## 🚀 About Me
Hi, I am Nadim Mahmud Nion. I have recently concluded my graduation from the department of Computer Science and Engineering (CSE) at the Daffodil International University (DIU). I have been learning MERN Stack Web Development since 2022. I am expertise in the following skills:

* React

* Express.js 

* Node.js 

* MongoDB

* JWT

* Stripe

* Vite

* React Router

* Firebase (Authentication & Hosting)

* Vercel

* JavaScript

* Advanced JavaScript

* Daisy UI 

* Bootstrap

* Tailwind

* HTML5

* CSS3

* Media Query

I have built multiple projects using these skills. You are invited to my GitHub profile to know about my projects and don't forget to give a star to my projects.

