# 🛒 Shopping Cart Project - Full Stack (FastAPI + React)

A modern, cloud-ready e-commerce shopping cart application built with **FastAPI**, **React**, and **DynamoDB**. The project includes complete cart, product, order, and user management features.

---

## 🚀 Features

* 🧾 Product Listings with filters
* 🛍️ Add to Cart / Update Quantity
* 👤 User Authentication (ready for Cognito integration)
* 💳 Place Order and view Order History
* 🎨 Tailwind-based responsive UI
* ⚡ FastAPI backend with async support
* ☁️ AWS-ready architecture

---

## 🛠️ Technologies Used

| Stack        | Description                               |
| ------------ | ----------------------------------------- |
| **Frontend** | React + Vite + Tailwind CSS + TypeScript  |
| **Backend**  | FastAPI (Python)                          |
| **Database** | DynamoDB (NoSQL)                          |
| **Cloud**    | AWS (S3, Lambda, API Gateway, CloudFront) |

---

## 📁 Project Structure

```bash
Shopping_Cart/
├── shopping-cart-backend/                  # FastAPI app files
│   ├── main.py
│   ├── cart.py
│   ├── products.py
│   ├── users.py
│   └── orders.py
└── requirements.txt         # Python dependencies
├── shopping-cart-frontend/  # React frontend
│   ├── src/
│   ├── public/
│   ├── vite.config.ts
│   └── tailwind.config.js

```

---

## ⚙️ Installation & Running

### 1. Backend Setup

```bash
cd backend
python -m venv env
source env/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup

```bash
cd shopping-cart-frontend
npm install
npm run dev
```

---

## 🧱 Deployment Options

### Local Development

* Run frontend and backend separately

### AWS Cloud (Recommended)

* React: Deploy to **S3 + CloudFront**
* FastAPI: Deploy on **Lambda** via **API Gateway** or containerized via **Fargate**
* Database: **DynamoDB** (fully managed)

---

## ☁️ AWS Optimizations

| AWS Tool           | Purpose                                 |
| ------------------ | --------------------------------------- |
| API Gateway        | Secure API routing, rate limiting       |
| Lambda             | Serverless backend hosting              |
| DynamoDB TTL       | Auto-expire old carts/orders            |
| CloudFront         | Global static asset delivery (React UI) |
| S3                 | Static site hosting                     |
| Cognito (Optional) | Secure user authentication              |

---

## 🔮 Future Improvements

* Integrate payments via Stripe
* Admin dashboard for order management
* Docker support and CI/CD pipelines
* Unit/Integration testing (pytest)

---

## 🧠 Authors & Contributors

Maintained by your development team.

---

## 🪪 License

This project is licensed under the MIT License.

---

## 📸 Architecture Overview

![Architecture Diagram](./docs/architecture.png)

For a full high-level design (HLD), optimizations, and AWS integrations, refer to the `/docs` folder.

---

## ⭐ Star this repo

If you like this project, give it a ⭐ to show your support!

---

> Built with ❤️ using FastAPI, React, and AWS.
