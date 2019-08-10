/* Parameters */

const updateFrequency = 10;
const maxInitVelocity = 2;
const density = 500000;
const gravity = 6.67e-11;
const properties = [
    {
        posX: 750,
        posY: 300,
        velX: 0,
        velY: 0,
        density: 50000000
    },
    {
        posX: 750,
        posY: 600,
        velX: 5,
        velY: 0
    },
    {
        posX: 750,
        posY: 50,
        velX: -5,
        velY: 0
    },
    {
        posX: 750,
        posY: 100,
        velX: -5,
        velY: 0
    }
];

class Planet {
    constructor(system, planets, planet, planetConfig) {
        // Elements
        this._system = system;
        this._planets = planets;
        this._planet = planet;

        // Initial state
        this._posX = planetConfig.posX;
        this._posY = planetConfig.posY;
        this._velX = planetConfig.velX;
        this._velY = planetConfig.velY;

        // Properties
        this._density = planetConfig.density || density;
        this._mass = this.updateMass();
    }

    get system() {
        return this._system;
    }

    get planets() {
        return this._planets;
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

    set mass(mass) {
        this._mass = mass;
    }

    get mass() {
        return this._mass;
    }

    get density() {
        return this._density;
    }

    getDistance(planet) {
        return Math.sqrt(Math.abs(this.posX - planet.posX) ** 2 + Math.abs(this.posY - planet.posY) ** 2)
    }

    updateMass() {
        this.mass = this.density * (4 / 3) * Math.PI * ((getComputedStyle(this.planet).width.slice(0, -2)) ** 3);
        return this.mass;
    }

    update() {
        let [velX, velY] = this.calcVelocities(this.velX, this.velY)

        let maxX = getComputedStyle(this.system).width.slice(0, -2) - Math.trunc(getComputedStyle(this.planet).width.slice(0, -2) / 2);
        let maxY = getComputedStyle(this.system).height.slice(0, -2) - Math.trunc(getComputedStyle(this.planet).height.slice(0, -2) / 2);

        this.velX = this.calcDelta(this.posX, velX, 0, maxX);
        this.velY = this.calcDelta(this.posY, velY, 0, maxY);

        this.posX += this.velX;
        this.posY += this.velY;
        
        this.planet.style.transform = `translate(${this.posX}px, ${this.posY}px)`;
    }

    calcVelocities(velX, velY) {
        this.planets.forEach((planet) => {
            if (planet === this) return;

            let gravityVec = ((gravity * this.mass * planet.mass) / (this.getDistance(planet) ** 2)) / this.mass * updateFrequency;

            let diffX = planet.posX - this.posX;
            let diffY = planet.posY - this.posY;

            let angle = Math.atan(diffY / diffX);

            let deltaVelX = Math.abs(Math.cos(angle) * gravityVec);
            let deltaVelY = Math.abs(Math.sin(angle) * gravityVec);

            velX += diffX > 0 ? deltaVelX : -deltaVelX;
            velY += diffY > 0 ? deltaVelY : -deltaVelY;
        });

        return [velX, velY]
    }

    calcDelta(currPos, delta, min, max) {
        let newPos = currPos + delta;

        return newPos >= max ? -delta : newPos <= min ? -delta : delta;
    }
}

function initPlanet(system, planets, planet, properties) {
    let maxWidth = getComputedStyle(system).width.slice(0, -2) - getComputedStyle(planet).width.slice(0, -2);
    let maxHeight = getComputedStyle(system).height.slice(0, -2) - getComputedStyle(planet).height.slice(0, -2);

    let initX = properties.posX || Math.floor(Math.random() * maxWidth);
    let initY = properties.posY || Math.floor(Math.random() * maxHeight);

    let initVelX = properties.velX || Math.ceil(Math.random() * 2 * maxInitVelocity) - maxInitVelocity;
    let initVelY = properties.velY || Math.ceil(Math.random() * 2 * maxInitVelocity) - maxInitVelocity;

    planet.style.transform = `translate(${initX}px, ${initY}px)`;

    return new Planet(system, planets, planet, {
        posX: initX,
        posY: initY,
        velX: initVelX,
        velY: initVelY,
        density: properties.density
    });
}

function updateSystem(system, planets) {
    planets.forEach(planet => {
        planet.update();
    });
}

(function () {
    let solarSystem = document.querySelector('.solar-system');
    let documentPlanets = document.querySelectorAll('.solar-system__planet');

    let planets = [];
    documentPlanets.forEach((planet, index) => {
        planets.push(initPlanet(solarSystem, planets, planet, properties[index]));
    });

    setInterval(() => { updateSystem(solarSystem, planets) }, updateFrequency);
})();