// // 'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration'); 
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


class App{
  
  #map;
  #mapEvent;
  #workout = [];

  constructor(){
    // get user position
    this._getPosition();

  // Get data from local storage
  this._getLocalStorage();

    // events
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationField);
    containerWorkouts.addEventListener("click", this._moveToPop.bind(this));
  }
  
  _getPosition(){
    
    // Check if geolocation is supported
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( this._loadMap.bind(this) ,function () {
        alert("Couldn't get your location");
      })
    }
  }
  
  _loadMap(position){
    
    const { latitude,longitude } = position.coords;
    // Coordinates array
    const coords = [latitude, longitude];
    // Initialize the map and set the view to the user's coordinates
    // console.log(this);
    this.#map = L.map('map').setView(coords, 13);
    
    // Add a tile layer to the map
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);
    
    // Add a marker to the map at the user's location
    L.marker(coords).addTo(this.#map)
    .bindPopup('your location')
    .openPopup();

    this.#map.on('click', this._showForm.bind(this));  

    this.#workout.forEach(workout => this._renderWorkoutMarker(workout));
  }
  
  _showForm(mapE){

      this.#mapEvent = mapE;
      form.classList.remove('hidden');
      inputDistance.focus();
  }
  
  _hideForm(){
     
    inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = '';
    
    form.style.display= 'none';
    form.classList.add('hidden'); 
    setTimeout(()=> form.style.display = 'grid',1000); 
  }
  
  _toggleElevationField(){

    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e){
    e.preventDefault();
    
    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;  // adding + to convert it to a num
    const duration = +inputDuration.value;  
    const {lat,lng} = this.#mapEvent.latlng;
    const cadence = +inputCadence.value;
    const elevation = +inputElevation.value;
    let workout;

    const inputValid = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    const positiveValid = (...inputs) => inputs.every(inp => inp > 0 )

    if(type === 'running'){

      if(
       !inputValid(duration,distance,cadence) || 
       !positiveValid(duration,distance,cadence)
      )
      alert("Inputs have to be positive numbers");
      
      else{

        workout = new Runing(distance,duration,[lat,lng],cadence);
          
      // render workout on map as a marker
      this._renderWorkoutMarker(workout);
      
      // Render workout on list
      this._renderWorkoutList(workout);
      
      // hide form
      this._hideForm();
      }

    }

    if(type === 'cycling'){

      if(
        !inputValid(duration,distance,elevation) || 
        !positiveValid(duration,distance)
      )
      alert("Inputs have to be positive numbers");

      else{
        
        workout = new Cycling(distance,duration,[lat,lng],elevation);
          
      // render workout on map as a marker
      this._renderWorkoutMarker(workout);
      
      // Render workout on list
      this._renderWorkoutList(workout);
      
      // hide form
      this._hideForm();
      }
    }
    
    // push new obj to workout array
    this.#workout.push(workout);
    // console.log(workout);

    // Set local storage to all workouts
    this._setLocalStorage();
  }

  _renderWorkoutMarker(Workout){
    L.marker(Workout.coords)
    .addTo(this.#map)
    .bindPopup(
      L.popup({
        maxWidth:250,
        minWidth:100,
        autoClose: false,
        closeOnClick: false,
        className: `${Workout.type}-popup`,
      })
    ).setPopupContent(`${Workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${Workout.description}`)
    .openPopup();  
  }

  _renderWorkoutList(workout){

    let html = ` 
  <li class="workout workout--${workout.type}" data-id="${workout.id}">
     <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon"> ${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">KM</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>`;

        if(workout.type === 'running'){

          html += 
          `<div class="workout__details"><span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details"><span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span></div></li>`;
        }

        if(workout.type === 'cycling'){
          
          html += `  <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value"${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">m</span>
          </div>`
        }

        form.insertAdjacentHTML("afterend",html);
      }
      
      _moveToPop(e){
        const workoutEl = e.target.closest('.workout');
        
        if(!workoutEl) return;
        
        const workout = this.#workout.find(
          work => work.id === workoutEl.dataset.id
        );
        // console.log(workoutEl);
        // console.log(workout);
        
        this.#map.setView(workout.coords, 13,{
          animate:true,
          pan:{
            duration:1
          }
        }); 
        // workout.click(); obj come from local storage will not inherit all the methods that they did before
  }

  _setLocalStorage(){
    localStorage.setItem('workout',JSON.stringify(this.#workout)); // to convert obj to str
  }

  _getLocalStorage(){

    const data = JSON.parse( localStorage.getItem('workout') ); //to convert str to obj
    // console.log(data);

    if(!data) return;

    this.#workout = data;

    this.#workout.forEach( workout => {
      this._renderWorkoutList(workout);
     });
  }

  reset(){
    
    localStorage.removeItem('workout');
    location.reload();
  }
}
  

class Workout{

  date = new Date();
  id = (Date.now() + '').slice(-9);
  clicks = 0;

  constructor(distance,duration,coords){
    this.distance = distance;
    this.duration = duration;
    this.coords= coords; // [lt,lng]
  }

  _setDescription(){
    const month = [ 'January','February','March','April','May','June','July','August','September','October','November', ,'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${month[this.date.getMonth()]} ${this.date.getDate()}`;
  }

  click(){
    this.clicks++;
  }
}

class Runing extends Workout{
  type = 'running';
  
  constructor(distance,duration,coords,cadence){
    super(distance,duration,coords);
    this.cadence= cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace(){
    this.pace = this.distance / this.duration;
    return this.pace;
  }
}

class Cycling extends Workout{
  type = 'cycling';

  constructor(distance,duration,coords,elevation){
    super(distance,duration,coords);
    this.elevation = elevation;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed(){
    this.speed = this.distance / (this.duration / 60);
  }
}

const app = new App();

const running = new Runing(5.2,24,[39,-12],178);
const cycling= new Cycling(27,95,[39,-12],523);

// console.log(running,cycling);

  // // Check if geolocation is supported
  // if (navigator.geolocation) {
  
  //   navigator.geolocation.getCurrentPosition(
  //     function (position) {
  //       const { longitude } = position.coords;
  //       const { latitude } = position.coords;
  
  //       // Coordinates array
  //       const coords = [latitude, longitude];
  
  //       // Initialize the map and set the view to the user's coordinates
  //       map = L.map('map').setView(coords, 13);
  
  //       // Add a tile layer to the map
  //       L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //       }).addTo(map);
  
  //       // Add a marker to the map at the user's location
        
  //       L.marker(coords).addTo(map)
  //         .bindPopup('your location')
  //         .openPopup();
        
  
  //         map.on('click', function(mapE) {
  //           mapEvent = mapE;
  //           form.classList.remove('hidden');
  //           inputDistance.focus();
           
  //         } cft 6x
  //       );
  //     },
  //     function () {
  //       alert("Couldn't get your location");
  //     }
  //   );
  // }

  
// let map,mapEvent;

// form.addEventListener("submit",function(e){
//   e.preventDefault();
  
//   // clear inputs
//   inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = '';
  
//   const {lat,lng} = mapEvent.latlng;
  
//   L.marker([lat,lng])
//   .addTo(map)
//   .bindPopup(
//     L.popup({
//       maxWidth:250,
//       minWidth:100,
//       autoClose: false,
//       closeOnClick: false,
//       className: 'running-popup',
//     })
//   ) .setPopupContent('Runing')
//   .openPopup();  
// })

// inputType.addEventListener("change",function(){
  
//   inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
//   inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
// })
