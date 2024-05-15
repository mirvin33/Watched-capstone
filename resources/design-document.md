# Design Document - Watched Service Design

## 1. Problem Statement 

Watched is a streaming watchlist management service aiming to address the fragmented and inconvenient experience users 
face in managing their TV shows and movies across multiple streaming platforms. While various streaming services offer 
their own watchlist functionalities, users lack a centralized solution to organize, track, and update their content 
preferences effectively.

## 2. Top Questions to Resolve in Review
- What is the optimal user interface design to ensure intuitive navigation and ease of use for managing watchlists?


## 3. Use Cases
-  As a user, I want to create a new watchlist with a given name.
-  As a user, I want to retrieve my playlist with a given ID
-  As a user, I want to add TV shows and movies to my watchlist by specifying their titles and the streaming 
service they are available on.
-  As a user, I want to mark content as 'Watched' once I have viewed it to track my viewing progress.
-  As a user, I want to be able to add a show or movie to the end of the watchlist.
-  As a user, I want to be able to add a show or movie to the beginning of the watchlist. (Watch First) 
-  As a user, I want to be able to retrieve my 'Watched' list.
-  As a user, I want to be able to search my watchlist by title.
-  As a user, I want to be able to search my watchlist by streaming service. 

## 4. Project Scope

### 4.1 In Scope

- Developing a centralized watchlist service allowing users to add, organize, and update their content preferences.
- Implementing features to mark content as 'Watched' and track viewing progress.
- Providing search and discovery functionalities to help users find specific titles on their watchlist.

### 4.2 Out of Scope

- Integration with streaming platforms' APIs for real-time availability.
- Social features like sharing watchlists or personalized recommendations based on viewing history.
- Ability to play content from the website.

## 5. Proposed Architecture Overview 

## 6. API 

### 6.1 Public Models

```
// WatchlistModel

String id;
String title;
Integer streamServ;
Boolean watched;

```

### 6.2 Get Watchlist Endpoint

* Accepts `GET` request to `/watchlist/:id`
* Accepts a watchlist ID and returns the corresponding WatchlistModel.
    * If the given watchlist ID is not found, will throw a
        'WatchlistNotFoundException'

### 6.3. Create Watchlist Endpoint

* Accepts `POST` requests to `/watchlist`
* Accepts data to create a new watchlist with a provided name, a given customer
  ID, and an optional list of tags. Returns the new watchlist, including a unique
  watchlist ID assigned by the Watchlist Service.
* For security concerns, we will validate the provided watchlist name does not
  contain any invalid characters: `" ' \`
    * If the watchlist name contains any of the invalid characters, will throw an
      `InvalidAttributeValueException`.

### 6.4. Update Watchlist Endpoint

* Accepts `PUT` requests to `/watchlist/:id`
* Accepts data to update a watchlist including a watchlist ID, an updated watchlist
  name, and the customer ID associated with the watchlist. Returns the updated
  watchlist.
    * If the watchlist ID is not found, will throw a `WatchlistNotFoundException`
* For security concerns, we will validate the provided watchlist name does not
  contain invalid characters: `" ' \`
    * If the watchlist name contains invalid characters, it will throw an
      `InvalidAttributeValueException`.
  
### 6.5 Add Content to Watchlist Endpoint:

* Accepts `POST` `/watchlist/:id/add`
* Accepts and adds a new content item to the watchlist for the user with the specified user ID.
* Accepts a watchlist ID and a content item to be added. 
* By default, will insert the new song to the end of the playlist
 - If the optional `queueNext` parameter is provided and is `true`, this API will insert the new song to the front of the 
playlist so that it will be the next song played