# Amazon Home Page — WEB101 PA1 # git link https://github.com/02250376cst-cmd/web101
# Overview

In this assignment, I tried to recreate the Amazon home page using Next.js and Tailwind CSS.
The main aim of this project was to understand how modern websites are built using React and component-based structure.I also learned how to make the website responsive so it can work properly in mobile, tablet and desktop devices.

While doing this project, I faced some small difficulties, especially in layout design and responsiveness, but I managed to solve them by practicing and checking online resources.

# Functionality 

This web application includes several features similar to the Amazon homepage:

A responsive navigation bar with search bar, account section and cart icon
A hero banner which changes automatically after some time and also has manual next/previous buttons
A “Shop by Category” section which adjusts layout based on screen size (2 columns in mobile and 4 in desktop)
A “Today’s Deals” section where products are displayed in grid format
A reusable ProductCard component which shows product image, price and rating using stars
A footer section with multiple links and a back-to-top option

These features helped me understand how real e-commerce websites are structured.

# Component Architecture

I divided the whole application into smaller components so that the code is clean and reusable.

App (page.js)
|-- Navbar
|-- HeroBanner
|-- CategoryGrid
|-- DealsSection
|    |-- ProductCard (reusable)
|-- Footer

By using this structure, it becomes easier to manage and update different parts of the application without affecting others.

# Data Sources

For this project, I used simple mock data instead of real API:

    products.js → contains product details like title, price, rating and image
    categories.js → contains category information

This made it easier to test and display data in the UI.

# Tech Stack

The technologies used in this project are:

    Next.js 15 (App Router) for building the application
    Tailwind CSS for styling and making the UI responsive
    React Hooks like useState and useEffect for handling state and side effects

# Setup

To run the project, I followed these steps:

    Install dependencies using npm install
    Run the project using npm run dev
    Open the browser and check the output

# Responsive Breakpoints

The design is made responsive using the following breakpoints:

Mobile: less than 640px
Tablet: 640px to 1024px
Desktop: above 1024px

# Result
    ![alt text](<Screenshot 2026-04-03 205910.png>)
    
# Conclusion

From this assignment, I learned how to build a real-world style web page using React and Next.js.
I also improved my understanding of components, responsive design, and UI structuring.
Overall, this project helped me gain practical knowledge and confidence in front-end development.

