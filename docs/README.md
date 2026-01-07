BLOG API BACKEND

A product stye blog API for a blogging platfor built using nodeJS ExpressJS and mongoDB
the main focus during production was clean architucture , proper error handling and access control
the features are minimal as the priority was coceptual clarity and writing realistic backend code with proper authorization. , visibility and error behavior


FEATURES

- JWT , bcrypt and jsonWebToken based authentication (register and login)
- Posts with draft and published status
- Secure access control (drafts visible only to owners)
- Comments with ownership-based authorization (for deletion)
- Search and pagination for posts
- Centralized error handling (using catchASync and Error class)
- Request validation using express-validator


TECH STACK 

- nodeJD
- ExpressJS
- mongoDB + mongoose
- JWT JsonWebTokens and bcrypt for authentication
- express-validator for inpu validation


AUTHENTICATION FLOW

- user authentication is carried out using JWT tokens
- protected routes required a valid token
- ownership is therfore enforced at controller/query level
- unauthorized access (403) is intentionall hidden using 404 to avoid resource leakage

API OVERVIEW


----auth API----
- POST /api/auth/register 
- POST /api/auth/login

----post API----
- POST /api/posts - createPost (auth required , guests can't write posts)
- GET /api/posts - getAllPosts (optionalAuth , everyone can see published post but drafts can only be seen by the author)
- GET /api/posts/:id - getPostById (optionalAuth , only author can get drafted posts)
- PATCH /api/posts/:id - updatePost (auth required , only author can update their posts)
- DELETE /api/posts/:id - deletPost (auth required , only author can delete their posts)

----comment API----
- GET /api/posts/:postId/comments - getCommentsForPost 
- POST /api/posts/:postId/comments - postComment (auth required)
- DELETE /api/comments/:id - deleteComment (comment owner only)


DESIGN DESICION


- Regeuest Validation - All query/body/params are validated via validation middleware (using express-validator ) before reaching the controllers helps avoid 500 - internal server errors

- OptionalAuth for public endpoints - some public paths are preceded by optional auth
     this allow: 
          - guests only see published posts
          - logged in users see published posts + their own drafts
          - single endpoint can now be used for both cases

- Post visibility via status field - 2 types of status -- drafts and published
    - drafts are only visible to authors but published posts are visible to everyone

- Authorization based ownership
    - posts and comments can be updated / deletd by owners only
    - avoids premature role complexity

- Centralized error handling
    - all errors are routed to  AppError class using a centralized error middleware
    - consistent error responses
    - seperation of expected (operational)errors from bugs
    - no try catch in controllers

- Async controller safety 
    - async controllers are wrapped in catch async utility to to forwared rejcted promises to error middleware

TESTING


The API was manually tested using Postman:
   - Authentication flows
   - Access control edge cases
   - Search and pagination behavior 
   - Error handling and validation responses


SETUP INSTRUCTIONS 

1. clone the repository
2. install dependancies
     - npm install
3. create .env file
      PORT=3000
      MONGO_URI=your_mongodb_uri
      JWT_SECRET=your_secret
4. run the server
     - npm run dev


KNOWN LIMITATIONS

- no frontend
- no role based access(admin / user)
- no automated test suite
- DB search currently uses regex (no text index)


PURPOSE OF THE PROJECT

This project was built to : 
    - understand backend beyond basic crud
    - practice error handling and access control
    - write explainable and maintainable code
    - this project prioritizes crarity and correctness over feature quantity



# POST /POSTS/:POSTID/COMMENTS — DESIGN NOTES

## PURPOSE
This endpoint creates a comment on a blog post in a way that is safe under:
- client retries
- server crashes
- concurrent requests

The primary goal is correctness of database state, not feature richness.

---

## SCOPE AND NON-GOALS
IN SCOPE:
- correctness under retries
- concurrency safety
- authorization and visibility correctness

OUT OF SCOPE:
- frontend behavior
- UI concerns
- notifications
- moderation features
- performance optimizations beyond correctness

---

## REQUEST CONTRACT
The client must send:
- authenticated user context
- comment content
- `Idempotency-Key` header (UUID)

The idempotency key represents one logical attempt to create a comment.
Retries of the same attempt must reuse the same key.

---

## IDEMPOTENCY STRATEGY
Idempotency is enforced per:
- userId
- postId
- idempotencyKey

Rule:
The same `(userId, postId, idempotencyKey)` must never create more than one comment.

If the same request is received multiple times, the server returns the
already-created comment instead of creating a new one.

---

## DATABASE INVARIANTS
The database enforces correctness using a unique constraint.

Invariant:
At most one comment exists for a given `(userId, postId, idempotencyKey)`.

This ensures:
- retry safety
- concurrency safety
- crash safety

Duplicate key errors are treated as successful retries, not failures.

---

## CONCURRENCY CONSIDERATIONS
Multiple identical requests may arrive at the same time due to:
- double submits
- network retries
- load balancer behavior

Application-level checks are not sufficient.
The database is the source of truth for enforcing uniqueness.

Only one request may succeed in inserting the comment.
All others must return the existing comment.

---

## VISIBILITY RULES
A comment is allowed only if:
- the post exists
- the post is visible to the requesting user at commit time
- the user has permission to comment

Visibility must be validated at the time of writing the comment,
not only during request pre-processing.

Middleware checks are considered advisory, not authoritative.

---

## FAILURE MODES AND RETRY BEHAVIOR
Possible failures:
- server crashes after database write
- network failure before response is delivered
- database primary step-down
- Redis unavailability

Design rule:
Clients must be able to safely retry requests with the same idempotency key.

Redis is not a source of truth.
Correctness must not depend on Redis availability.

---

## HTTP RESPONSE SEMANTICS
- 201 Created: comment created successfully on first attempt
- 200 OK: idempotent retry, existing comment returned
- 401 Unauthorized: user not authenticated
- 403 Forbidden: user authenticated but not allowed to comment
- 404 Not Found: post does not exist or is not visible to the user

Retrying a request must never result in duplicated comments.

---

## OBSERVABILITY AND DEBUGGING NOTES
Each comment stores:
- userId
- postId
- idempotencyKey
- creation timestamp

This allows tracing:
- retries
- duplicate requests
- unexpected client behavior

---

## OPEN QUESTIONS / FUTURE HARDENING
- Should idempotency keys expire?
- Should comment creation be fully transactional with post state?
- Should comment count be derived instead of stored?
