/* Parameters */

const updateFrequency = 10;
const maxInitVelocity = 1;
const density = 1;
const gravity = 6.67e-11;


class Planet {
    constructor(system, planets, planet, planetConfig) {
        this._system = system;
        this._planets = planets;
        this._planet = planet;
        this._posX = planetConfig.posX;
        this._posY = planetConfig.posY;
        this._velX = planetConfig.velX;
        this._velY = planetConfig.velY;
        this._density = planet.density || density;
        this.mass = this.updateMass();
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
        
        console.log(this.posX)

        this.planet.style.transform = `translate(${this.posX}px, ${this.posY}px)`;
    }

    calcVelocities(velX, velY) {
        let gravityVec = 0;

        this.planets.forEach((planet) => {
            if (planet === this) return;

            gravityVec += ((gravity * this.mass * planet.mass) / this.getDistance(planet)) * updateFrequency;

            let diffX = planet.posX - this.posX;
            let diffY = planet.posY - this.posY;

            let angle = Math.atan(diffY / diffX);

            velX += Math.cos(angle) * gravityVec;
            velY += Math.sin(angle) * gravityVec;
        });

        return [velX, velY]
    }

    calcDelta(currPos, delta, min, max) {
        let newPos = currPos + delta;

        return newPos >= max ? -delta : newPos <= min ? -delta : delta;
    }
}

(function () {
    console.log("Initialize");
    let solarSystem = document.querySelector('.solar-system');
    let documentPlanets = document.querySelectorAll('.solar-system__planet');

    let planets = [];
    documentPlanets.forEach(planet => {
        planets.push(initPlanet(solarSystem, planets, planet));
    });

    setInterval(() => { updateSystem(solarSystem, planets) }, updateFrequency);
})();

function initPlanet(system, planets, planet) {
    let maxWidth = getComputedStyle(system).width.slice(0, -2) - getComputedStyle(planet).width.slice(0, -2);
    let maxHeight = getComputedStyle(system).height.slice(0, -2) - getComputedStyle(planet).height.slice(0, -2);

    let initX = Math.floor(Math.random() * maxWidth);
    let initY = Math.floor(Math.random() * maxHeight);

    let initVelX = Math.ceil(Math.random() * 2 * maxInitVelocity) - maxInitVelocity;
    let initVelY = Math.ceil(Math.random() * 2 * maxInitVelocity) - maxInitVelocity;

    planet.style.transform = `translate(${initX}px, ${initY}px)`;

    return new Planet(system, planets, planet, {
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