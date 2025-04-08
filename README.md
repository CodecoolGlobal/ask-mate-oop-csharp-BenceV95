#  AskApe

<a href="https://askape.benceveres.com" target="_blank">Check out the deployed version here</a>

##  About The Project

We are developing a Q&A platform similar to Gyakori Kérdések, where registered users can ask and answer questions, filter them by category, and vote on answers to determine their usefulness.

###  Core Features
- **User Authentication** (Login, Registration, Logout, Session Management)
- **Question Management** (Ask, Delete Questions)
- **Answer System** (Post, Delete Answers)
- **Voting System** (Upvote/Downvote Answers)
- **Categories & Filtering** (Sort and Filter Questions by Category)
- **Search Functionality** (Find Questions and Answers Easily)
- **User Profiles** (View User Contributions, Vote stats)


### Work in Progress
- [ ] Edit your Question, Answer
- [ ] Admin panel and it's front end implementations
- [ ] Nicer and more responsive design
- [ ] Public user profile for contributions
- [ ] Ads

###  Tech Stack  

- [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)  
- [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)  
- [![.NET 8](https://img.shields.io/badge/.NET_8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/en-us/)   
- [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)  
- [![Cookie-Based Auth](https://img.shields.io/badge/Auth-Cookies-FFD700?style=for-the-badge)]()  
- [![RESTful API](https://img.shields.io/badge/REST_API-02569B?style=for-the-badge&logo=api&logoColor=white)]()  


##  Getting Started

### 1️⃣ Prerequisites
Make sure you have the following installed on your machine:
- [Node.js (v18+)](https://nodejs.org/en)
- [npm](https://www.npmjs.com/)
- [.NET SDK (8.0+)](https://dotnet.microsoft.com/en-us/download/dotnet)
- [PostgreSQL](https://www.postgresql.org/)

### 2️⃣ Clone the repository
```sh
git clone https://github.com/CodecoolGlobal/ask-mate-oop-csharp-BenceV95.git
```

### 3️⃣ Start the application
# Running a Full-Stack Web App (ASP.NET + Frontend)
### Set up Postrgres:
  - Inside appsettings.json you can modify the connection string for your own needs.
  - Run the tables_creating.sql to set up your database schema.

### **Step 1: Restore Dependencies (Optional, but Recommended)**
```sh
dotnet restore
```

### **Step 2: Build the Project (Optional, but Good for Debugging)**
```sh
dotnet build
```

### **Step 3: Run the Backend**
```sh
dotnet run
```
By default, the backend runs on https://localhost:5141.

---

## 2. Start the Frontend

### **Step 1: Navigate to the Frontend Directory**
```sh
cd AskMate_frontend
```

### **Step 2: Install Dependencies**
```sh
npm install
```

### **Step 3: Start the Frontend**
#### React 
```sh
npm run dev  # Vite
```

By default, the frontend runs on http://localhost:5173

##  Usage
- **User Registration and Login:** Users must register an account and log in before accessing the application's features.
    * Currently, there is no email verification, meaning users can register with any email address.
- **Looking Up Questions:** Users can browse and search for previously asked questions.
- **Asking Questions:** Users can post their own questions for others to answer.
- **Voting on Questions and Answers:** Users can upvote or downvote questions and answers posted by others to indicate their helpfulness.
- **Deleting Questions and Answers:** Users can delete their own questions and answers at any time.
- **Profile settings can be changed** Users can modify their username, email and password.



##  The team:
<a href="https://github.com/CodecoolGlobal/ask-mate-oop-csharp-BenceV95/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=CodecoolGlobal/ask-mate-oop-csharp-BenceV95" />
</a>

##  License
It is not under any license, since it is a practice/learner project.

##  Contact

- **Bence**: [benceveres.com](https://puradomus.benceveres.com/)  ([GitHub](https://github.com/BenceV95))
- **Balint**:  ([GitHub](https://github.com/vulpes556))
- **Imi**:  ([GitHub](https://github.com/molnarimi0211))

 Project Repository: https://github.com/CodecoolGlobal/ask-mate-oop-csharp-BenceV95
