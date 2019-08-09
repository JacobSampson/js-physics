const updateFrequency = 100;
const maxInitVelocity = 10;

class Planet {
    constructor(system, planet, planetConfig) {
        this._planet = planet;
        this._posX = planetConfig.posX;
        this._posY = planetConfig.posY;
        this._velX = planetConfig.velX;
        this._velY = planetConfig.velY;

        this.maxX = getComputedStyle(system).width.slice(0, -2) + getComputedStyle(planet).width.slice(0, -2);
        this.maxY = getComputedStyle(system).height.slice(0, -2) + getComputedStyle(planet).height.slice(0, -2);
    }

    get planet() {
        return this._planet;
    }

    get posX() {
        return this._posX;
    }

    set posX(posX) {
        this._posX = posX;
    }
    
    get posY() {
        return this._posY;
    }

    set posY(posY) {
        this._posY = posY;
    }
    get velX() {
        return this._velX;
    }

    set velX(velX) {
        this._velX = velX;
    }
    get velY() {
        return this._velY;
    }

    set velY(velY) {
        this._velY = velY;
    }

    update() {
        let velX = this.velX;
        let velY = this.velY;

        let deltaX = this.calcDelta(this.posX, velX, 0, this.maxX);
        let deltaY = this.calcDelta(this.posY, velY, 0, this.maxY);

        this.posX += deltaX;
        this.posY += deltaY;

        this.planet.style.transform = `translate(${this.posX}px, ${this.posY}px)`;
    }

    calcDelta(currPos, setDelta, min, max) {
        let newPos = currPos + setDelta;

        return newPos >= max ? max : newPos <= min ? min : setDelta;
    }
}

(function () {
    console.log("Initialize");
    let solarSystem = document.querySelector('.solar-system');
    let documentPlanets = document.querySelectorAll('.solar-system__planet');

    let planets = [];
    documentPlanets.forEach(planet => {
        planets.push(initPlanet(solarSystem, planet));
    });

    setInterval(() => { updateSystem(solarSystem, planets) }, updateFrequency);
})();

function initPlanet(system, planet) {
    let maxWidth = getComputedStyle(system).width.slice(0, -2) - getComputedStyle(planet).width.slice(0, -2);
    let maxHeight = getComputedStyle(system).height.slice(0, -2) - getComputedStyle(planet).height.slice(0, -2);

    let initX = Math.floor(Math.random() * maxWidth);
    let initY = Math.floor(Math.random() * maxHeight);

    let initVelX = Math.floor(Math.random() * maxInitVelocity);
    let initVelY = Math.floor(Math.random() * maxInitVelocity);

    planet.style.transform = `translate(${initX}px, ${initY}px)`;

    return new Planet(system, planet, {
        posX: initX,
        posY: initY,
        velX: initVelX,
        velY: initVelY
    });
}

function updateSystem(system, planets) {
    planets.forEach(planet => {
        planet.update();
    });
    console.log("Update");
}