# Overview - Durm. MTB Proj.

The application provides an intuitive interface for viewing mountain bike trails and POIs, and it allows users to interact with the map and view the height profile of the trails. The application is easy to install and use, and it is designed to be responsive and work on different screen sizes.

The project is a web application built in React, TypeScript, and Webpack. The purpose of the application is to display GPS mountain bike trails on a map using the Google Maps API. The trail data is stored in JSON format and saved locally in a file with the app. In addition to displaying trails on the map, the application also allows users to view a height profile of a trail when clicked on. The height profile can have changing resolution from 25 to 250 samples. The application also allows users to add points of interest (POI) to a trail, which can include a title, description, geo point value, and picture (stored locally).

snazzymaps.com


## **Architecture Overview**

The application is built using a modular architecture that follows the best practices of React. The application consists of several modules, each with its specific responsibilities. The main modules are:

- App: The entry point of the application that initializes the state, renders the main layout, and sets up the routing.
- Map: Responsible for rendering the map, the trails, and the POIs. This module uses Google Maps API to draw the map and the trails and POIs.
- Trail: Responsible for loading the trail data, drawing the polylines, and calculating the height profile.
- POI: Responsible for loading the POI data and rendering them on the map.
- HeightProfile: Responsible for rendering the height profile chart below the map.
- Sidebar: Responsible for rendering the sidebar that shows the list of trails and POIs.
- Modal: Responsible for rendering the modal that shows the details of a trail or POI.


## **Features**

Display GPS mountain bike trails on a map using Google Maps API
View height profile of a trail when clicked on, with adjustable resolution
Add points of interest (POI) to a trail, including a title, description, geo point value, and picture


## **Technologies Used**

- React
- Webpack
- Babel
- Chart.js v3
- Jest

Installation and Usage
To install the application, follow these steps:

Clone the repository from Github.
Run npm install to install the dependencies.
Run npm start to start the development server.
Open a browser and go to http://localhost:3000 to see the application running.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.