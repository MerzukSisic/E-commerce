# E-commerce Store for Video Games 🎮

This is a modern e-commerce web application for buying and selling video games, built with **.NET 9** and **Angular 18**. The project follows **Clean Architecture**, ensuring maintainability, scalability, and separation of concerns.

## 🚀 Features

- **User Authentication & Authorization** – Secure login and registration system.
- **Product Management** – CRUD operations for video games, including multiple images and filtering options.
- **Shopping Cart & Checkout** – Users can add games to their cart and complete purchases.
- **Order Management** – Admins can **refund purchases** if necessary.
- **Payment Integration** – Secure payment processing via **Stripe**.
- **Redis Integration** – Used for caching and storing active shopping cart data.
- **AI Chat Support** – Integrated AI-powered chat for user assistance.
- **Email Service** – Used for **email verification** and support notifications.
- **Webhook Support** – External system integration via webhooks.
- **Interactive Maps** – Integrated maps for location-based services.
- **Filtering & Sorting** – Users can filter games by genre, platform, and price.
- **Admin Panel** – Allows game management and order refunds.

## 🛠️ Tech Stack

### **Frontend**
- Angular 18
- TypeScript
- Tailwind CSS

### **Backend**
- .NET 9 (ASP.NET Core)
- C#
- Entity Framework Core
- SQL Server

### **Infrastructure**
- Redis – Used for caching and storing shopping cart state per user
- Stripe – Payment processing
- Docker – Containerization
- Azure DevOps – CI/CD and project management

## 📦 Installation & Setup

### 1️⃣ Clone the repository
```bash 
git clone https://github.com/MerzukSisic/E-commerce.git  
cd E-commerce  
```

### 2️⃣ Backend Setup (.NET 9)
- Navigate to the API project folder:  
```bash  
cd Backend  
```
- Restore dependencies:  
```bash  
dotnet restore  
```
- Apply database migrations:  
```bash  
dotnet ef database update  
```
- Run the backend:
```bash  
dotnet run  
```

### 3️⃣ Frontend Setup (Angular 18)
- Navigate to the Angular project folder:  
```bash  
cd Frontend  
```
- Install dependencies:  
```bash  
npm install  
```
- Run the Angular app:  
```bash  
ng serve  
```

## ⚙️ Environment Variables

Create an `.env` file in the backend project and configure your **Stripe API keys**, **database connection string**, and **Redis settings**.

```env  
STRIPE_SECRET_KEY=your_stripe_secret_key  
STRIPE_PUBLIC_KEY=your_stripe_public_key  
DATABASE_CONNECTION_STRING="your_database_connection"  
REDIS_CONNECTION="your_redis_connection"  
```

## 📜 License
This project is licensed under the MIT License.

---

👨‍💻 Developed by **Merzuk Šišić & Benjamin Skula**
