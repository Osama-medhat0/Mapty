# 🗺️ Mapty - Workout Tracker with Maps

Mapty is a web application that lets users log running and cycling workouts with geolocation using **Leaflet.js** and the **Geolocation API**. It stores workouts in local storage and displays them on the map with beautiful popups and a workout list.

![image](https://github.com/user-attachments/assets/808454be-ec7f-4189-ba56-a7137327b8d4)

---

## 🚀 Features

- 🌍 Displays your current location on a map
- 🏃 Log running and cycling workouts
- 📍 Places markers for each workout
- 📝 Shows workout details like distance, duration, pace/speed
- 💾 Saves data in Local Storage (persists on page reload)
- 🎯 Click on a workout to pan to its location on the map
- 🔄 Reset all workouts with a single function

---

## 📦 Technologies Used

- **JavaScript (ES6+)**
- **Leaflet.js** for interactive maps
- **HTML5 & CSS3**
- **Geolocation API**
- **LocalStorage API**

---

## 🖥️ How to Run the Project

### With Live Server (VS Code)
1. Open the folder in **VS Code**
2. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
3. Right-click `index.html` → **"Open with Live Server"**
4. Allow location access in the browser

## 📁 Project Structure

Mapty/
│
├── index.html        # Main HTML file
├── style.css         # CSS styles
├── script.js         # JavaScript functionality
├── img/
│   └── logo.png      # App logo
└── README.md         # This file

## ⚠️ Permissions
Make sure to allow location access when prompted by the browser. The app won't work otherwise.

## 🙏 Acknowledgments

Inspired by Jonas Schmedtmann's JavaScript course

Uses Leaflet for maps

## 📃 License
This project is for educational and portfolio use only. Do not use it to teach or redistribute without credit.

## 💡 Future Improvements

- Add ability to edit or delete workouts

- Add backend (Firebase or MongoDB)

- Mobile responsiveness

- Export data to CSV/JSON
