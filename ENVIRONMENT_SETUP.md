# 🔐 Environment Setup Guide

This guide explains how to configure environment variables for each project.

## Frontend Projects (foodies & adminpanel)

### Step 1: Create `.env.local` file

```bash
cd foodies
# or
cd adminpanel
```

### Step 2: Copy from `.env.example`

Copy the contents from `.env.example` and create a `.env.local` file:

```properties
VITE_API_URL=http://localhost:8080/api
VITE_AUTH_TIMEOUT=3600000
```

### Step 3: Customize if needed

Update `VITE_API_URL` if your API runs on a different port or domain.

---

## Backend Project (foodiesapi)

### Step 1: Create `.env` file in the root

```bash
cd foodiesapi
```

### Step 2: Copy from `.env.example`

Copy the contents from `.env.example` and create a `.env` file:

```properties
AWS_ACCESS_KEY=your_actual_aws_access_key
AWS_SECRET_KEY=your_actual_aws_secret_key
MONGODB_URI=mongodb://localhost:27017/foodies
JWT_SECRET_KEY=your_super_secret_jwt_key_min_32_chars
RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret_key
SERVER_PORT=8080
```

### Step 3: Get Your Credentials

#### AWS S3 Setup

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Create IAM user with S3 permissions
3. Generate Access Key and Secret Key
4. Copy to `.env`

#### MongoDB Setup

1. Install MongoDB locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Default local: `mongodb://localhost:27017/foodies`

#### JWT Secret

Generate a secure 32+ character key:

```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -SetSeed 0 -Count 32 | ForEach-Object {[char]$_})))
```

#### Razorpay Setup

1. Create account at [Razorpay](https://razorpay.com/)
2. Get keys from Settings > API Keys
3. Copy to `.env`

### Step 4: Load Environment Variables

The application will automatically load from `.env` file.

---

## ⚠️ Important Notes

- **Never commit `.env` files** - They contain sensitive credentials
- Always use `.env.example` as a template for new developers
- Keep `.env` files in `.gitignore` (already configured)
- Each developer should have their own `.env` file with their credentials
- For production, use GitHub Secrets or your hosting platform's secret management

---

## Running the Projects

### Frontend

```bash
cd foodies
npm run dev
# App runs at http://localhost:5173
```

### Backend

```bash
cd foodiesapi
mvn spring-boot:run
# API runs at http://localhost:8080
```

---

## 🆘 Troubleshooting

**Issue:** Environment variables not loading

- Solution: Restart the application after creating `.env` file

**Issue:** MongoDB connection failed

- Solution: Ensure MongoDB is running locally or check connection string

**Issue:** AWS credentials error

- Solution: Verify AWS_ACCESS_KEY and AWS_SECRET_KEY are correct and have S3 permissions

---

For more help, refer to individual README.md files in each project folder.
