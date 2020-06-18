# Vision

**We Aim To Provide A Social Service That's Similar To Talk Therapy, To Help People Going Through A Hard Time To Cope, Get Some Advice From People Going/Went Through A Similar Situation, And Simply Be Heard!**  

**We Want To Provide A Free And Easy Solution For People Who Can't Afford A Professional Therapist And Are Just In Need For A Quick Free Talk Without The Fear Of Judgement.**


# Scope In

- The web app  will provide the users with private chat rooms.
- Users can submit reviews about other users.
- Users can share public posts.
- Users can save favorit quotes.

# Scope Out

- The web app will not provide video chat between users.

# MVP

Our clients should be able to register/signin by creating a new account or using a third party integration, users should have a home page and a profile page, users should be able to share posts and join private live chat rooms.

# Stretch

- filter/search posts by tags
- add comments to posts
- add Google OAuth integration for sign-in/sign-up

# Functional Requirements

- An admin can delete user accounts
- A user can update their profile information
- A user can save a quote
- A user can share a post
- A user can join a live chat room
- A user can submit a review
- A user can view other users' profiles and add reviews

# Data Flow

A user signs up to our web application, either by creating an account or by sigining up using other platform.  
user information will be added to the database, the pasword will be hashed, and a Bearer Auth tokin will be created.  
Users then will have the ability to edit their profile information (ACL) and add favorit quotes to their profiles.  
Users will have the ability to share a post and book a shared post, shared posts and booked posts will be connected with the user's profile in the DB (1 to many relation). 
A user who shares a post will be assigned a venter role, a user who books the post will be assigned a listener role.  
Venters and listeners will be assigned to a private live chat room.


# Non-Functional Requirements

- Security
  Security will be implemented in our web app in saving user's password (in DB) by hashing the password so that no one (even us the developers) can know the password.

- Usability
  Usability will be implemented by following modular programming and writing usable modules for each feature.

- Testability
  Testability will be implemented by following TTD approach and writing unit tests for each module.


