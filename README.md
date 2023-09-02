# food-court-backend
The backend system of a food court built using expressJs, typescript language and mongodb as a database

## Routing and API Endpoints:
- The system defines various API endpoints to handle different functionalities.
- For example, endpoints could include /menu to retrieve the menu items, /orders to place and manage orders, and /users to manage user accounts.
- 
## Authentication and Authorization:

- Implement user authentication and authorization mechanisms using middleware JWT (JSON Web Tokens).
- Authenticate users during login and authorize them to perform specific actions based on their roles (e.g., vendor, user, admins).

## Database Integration:

- Connected to a database MongoDB to store and manage data.
- Create database schemas for entities such as menu items, orders, users, and vendor.
  
##  Menu Management:

- Provide API endpoints to manage the food court's menu.
- Allow administrators to add, update, and delete menu items.
- Include features for categorizing items (e.g., appetizers, main courses, beverages).
  
## Order Processing:

Implement endpoints for placing, viewing, and managing orders.
Users can add items to their cart, specify quantities, and place orders.
Staff can view and process orders, mark them as fulfilled, and update order statuses.

## User Management:

- Include user registration and login functionality.
- Maintain user profiles with details such as name, contact information, and order history.
- Implement password hashing and security best practices.

## Staff Management (Admin Panel):

- Provide administrative access with an admin panel.
- Admins can  update menus, view order history, and generate reports.
