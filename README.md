# Groupchat Manager API

**Groupchat Manager API** is a RESTful API built using Express, Prisma ORM, and MySQL as the database. It provides functionalities for managing users, groups, and messages, making it suitable for the backend of a group chat application.

## Database Diagram

![database](https://github.com/Arundaon/groupchat-manager-API/assets/68210759/1b76fe84-e3ba-41e6-a1c9-6f4618c69045)

This entity-relational diagram shows the tables and relationships for user, group, and message data storage. The `participants` table tracks user membership in groups and their roles.

## Features

* Manages user accounts (registration, login, profile updates)
* Creates, retrieves, and updates groups
* Enables adding and removing members from groups
* Facilitates sending and retrieving messages within groups

## Endpoints

Detailed documentation for each API endpoint category is available at the following links:

- [User Management](https://github.com/Arundaon/groupchat-manager-API/blob/master/docs/user-management.md)
- [Group Management](https://github.com/Arundaon/groupchat-manager-API/blob/master/docs/group-management.md)
- [Message Management](https://github.com/Arundaon/groupchat-manager-API/blob/master/docs/message-management.md)

## Installation

**Prerequisites:**

Make sure you have Node.js and npm installed on your system.

**Steps:**

1. Run `npm install` in the project directory to install all the required modules.

2. Create a file named `.env` in the root directory of your project. Add the following variables to the `.env` file, replacing the placeholders with your actual values:
```
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
PORT=3000
```

- `DATABASE_URL`: This variable defines the connection string for your MySQL database.
- `PORT`: This variable defines the port on which the API will run. 

3. Run `npx prisma migrate dev --name init` to initialize the Prisma schema to your database. Make sure your MySQL database is already running.

**Detailed instructions or configuration for different databases can be found on the Prisma Getting Started Page:** [Prisma Getting Started Page](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-node-mysql)

## License

This project is licensed under the MIT License.
