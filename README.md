That is a personal project

## Goals were

- Explore PostgreSQL and basic Backend
- Explore Custom Auth Implementation
- Explore FullStack development in general.
- Explore Internationalisation on the client for static and dynamic content
- Crash-Test `@qyu/atom-state-core` (my library for global and remote state management on the client)
- Try to build something big and FullStack without it crushing under it's own weight

## Functionality and Definitions

- The Project itself is a Front and Back for E-Commerce Website with CMS
- `Item` is a thing that User-Facing View. It is a collection of `Variants` with name, tags, images as additional data
- `Variant` is a collection of `Products`, subdivision of `Item`
- `Product` is a thing that user actually buys. It realises `ProductTemplate` and has `Parameters`
- `Parameters` of a product is additional info that is communicated to the owner, that shows what user actually wants
- `Administrator` can add `Parameters` to the item on will, they are not hardcoded
- `Parameters` can be:
    - `boolean` - a switch
    - `line` - integer in given range (eg can be used as a configuration for size)
    - `rect` - two integers in a range (eg can be used as a configuration for dimensions)
    - `material` - used to choose `Materials` that the thing should be made of. `Materials` itself can be added in CMS
- `User` can modify `Parameters` and create `Custom Variants` themselves when buying stuff
- Each `ProductTemplate` has a `price`. `price` is a string of certain format, which is parsed to Math Formula, that calculates pricing based on `Parameters`
- `Material` and `MaterialTemplate` exist as hellpers for `Material Parameters`
- `ItemTemplate` exists as an additional cathegorisation of `Items` for user to be able to filter them on the frontpage
- Project also includes very simple `React-Native App`, for notifying about something happening. I dont even know if you can compile it from provided files, it does not matter anyway

## Project Structure

- `/app/web`, `/app/api`, `/app/mobile-push` are all endpoints for their respective domains
- `/app/web` contains all of react and related logic
- `/app/api` launches `Api Server`, also has some cron job for various purposes
- `/pckg/rest/` contains most of the Backend including `Database` and `Routes`
- `/pckg/gstate/` contains all the code for remote state management on the client
- `/pckg/config/` contains defenitions for Database and Remote State Management, from which most of the `REST` api and `/pckg/gstate/` generated
- `/pckg/capi/` contains functions for direct communications with `Api Server`
- `/pckg/syntax-math/` contains string-to-AST parser for math, that is used for prices
- `/pckg/syntax-search/` contains string-to-AST parser for search engine in CMS
- `/pckg/constants/` contains some constants for the whole app
- `/pckg/db_defaults/` contains default values for `Database` 
- `/pckg/express-utils/` contains some utilities for `Backend`

## How to use

- Clone the repo
- Fill in the .env files in `/app/api`, `/app/web`, `/pckg/capi` and `/app/db` following `.env.example` files
- Install necessary docker images and do `docker compose up --build`
- By default there will be no content, so you first go to `CONSOLE_HOST` and sign in with your `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- You create: 
    - Nodes are hidden by default, ensure you toggle the eye icon after creation
    - At least one `ItemTemplate` and `Item`. 
    - Populate it, you also create `MaterialTemplate`, `Material`, `ProductTemplate`
    - You add customisations such as `Parameters` for `ProductTemplate`, add some `Variants` to `Item` and add `Products` to them
- Now you will have a working view of your `Items` in `CLIENT_HOST`, you can customise and order them

## Summary

- Workspaces are Superior
- For that project was successfully created a set of abstractions that automates most of `Database` initialisation, `Remote State` management and `REST Routes` creation
- Project remains easily maintainable and extendable after more than 40k lines of code
- Project contributed significantly to `@qyu/atom-state-core@6.0.0` rewrite (my client state management library)
- Used Pattern for defining client-wide palette of common colors is garbage - shoulld think of something better
- PostgreSQL is much better than MySQL. Felt like a bliss. At least for pretty unorthodox querying pattern used here

## Notes

- There is no payments setup
- App uses internet connection to initialise. It downloads post locations and pushes them to `Database`. You can run it without internet, it will throw an error, but it will be fine
