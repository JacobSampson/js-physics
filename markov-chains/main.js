const NUM_ROWS = 3;
const NUM_COLS = 4;

const MARKOV_NAME = 'markov-chain';
const FREQ_GRAPH_NAME = 'freq-graph';

const PATHS = new Map(Object.entries({
    1: [
        2
    ],
    2: [
        1, 3
    ],
    3: [
        2, 4, 7
    ],
    4: [
        3
    ],
    5: [
        6, 9
    ],
    6: [
        5, 7, 9, 10
    ],
    7: [
        3, 6, 8, 11
    ],
    8: [
        7, 12
    ],
    9: [
        5, 6, 10
    ],
    10: [
        6, 9, 11
    ],
    11: [
        7, 10
    ],
    12: [
        8
    ]
}));

class MarkovTable {
    constructor(cells, paths, rows, cols, style) {
        this.cells = cells;
        this.paths = paths;
        this.rows = rows;
        this.cols = cols;
        this.style = style;

        this.currId = 0;
        this.table = this.create(cells, rows, cols, style);
        this.setPaths(paths);
        this.timer = null;
        this.total = 0;

        this.cellArray = this.cells.reduce((array, cellRow) => {
            cellRow.forEach(cell => array.push(cell));

            return array;
        }, []);
    }

    start(interval) {
        // Run simulation
        let occupiedCell = this.cells[0][0];
        occupiedCell.visit();
        this.total++;

        this.timer = setInterval(() => {
            occupiedCell = occupiedCell.move();
            occupiedCell.visit();
            this.total++;
        }, interval);
    }

    stop() {
        if (!this.timer) return;

        this.reset();
    
        clearInterval(this.timer);
    }

    restart(interval) {
        this.total = 0;
        this.stop();
        this.start(interval);
    }

    create(table, rows, cols, style) {
        let htmlTable = document.createElement('table');
        htmlTable.classList.add(`${style}__table`);
        
        for (let j = 0; j < rows; ++j) {
            table[j] = [];
    
            let row = document.createElement('tr');
            row.classList.add(`${style}__row`);
            for (let i = 0; i < cols; ++i) {
                let cell = document.createElement('td');
                cell.classList.add(`${style}__cell`);
                row.appendChild(cell);
    
                table[j][i] = new MarkovCell(this.currId, cell, j * this.cols + i, this.style);
                this.currId++;
            }
            htmlTable.appendChild(row);
    
         }
    
        return htmlTable;
    }

    setPaths(paths) {
        for (let j = 0; j < this.rows; ++j) {
            for (let i = 0; i < this.cols; ++i) {
                this.cells[j][i].update();
    
                let indices = paths.get((j * this.cols + i + 1).toString())
                indices.forEach(index => {
                    this.cells[j][i].addPath(this.cells[Math.floor((index - 1) / this.cols)][(index - 1) % this.cols])
                });
            }
        }
    }

    reset() {
        this.cells.forEach(cellRow => {
            cellRow.forEach(cell => cell.reset())
        })
    }
}

class MarkovCell {
    constructor(id, htmlCell, value, style) {
        this.id = id;
        this.htmlCell = htmlCell;
        this.value = value;
        this.style = style;

        this.timesVisited = 0;
        this.paths = [];
    }

    update() {
        this.htmlCell.innerHTML = `${this.value + 1} [${this.timesVisited}]`;
    }
    
    visit() {
        this.timesVisited++;
        this.htmlCell.classList.add(`${this.style}__cell--visiting`);
        this.update();
    }

    reset() {
        this.timesVisited = 0;
        this.htmlCell.classList.remove(`${this.style}__cell--visiting`);
        this.update();
    }

    addPath(htmlCell) {
        this.paths.push(htmlCell);
    }

    move() {
        this.htmlCell.classList.remove(`${this.style}__cell--visiting`);
        let index = Math.floor(Math.random() * (this.paths.length));
        return this.paths[index];
    }
}

class FreqGraph {
    constructor(table, maxHeight, style) {
        this.table = table;
        this.elements = table.cellArray;
        this.maxHeight = maxHeight;
        this.style = style;

        console.log(maxHeight)

        this.graph = document.createElement('div');
        this.graph.classList.add(`${FREQ_GRAPH_NAME}__graph`);

        this.bars = this.create(this.elements, this.graph);
        this.timer = null;
    }

    create(elements, graph) {
        let bars = new Map();

        elements.forEach(element => {
            let bar = document.createElement('div');
            bar.classList.add(`${FREQ_GRAPH_NAME}__bar`);
            graph.appendChild(bar);

            bars.set(element.id, bar);
        });

        return bars;
    }

    run() {
        this.timer = setInterval(() => {
            this.elements.forEach(element => {
                let bar = this.bars.get(element.id);
                let percentage = (element.timesVisited / this.table.total);

                bar.style.height = `${percentage * this.maxHeight}px`;
                bar.innerHTML = `
                    <h4 class=${this.style}__id>${element.id + 1}</h4>
                    <p class=${this.style}__label>${(100 * percentage).toFixed(0)}%</p>
                `;
            })
        }, 10);
    }

    stop() {
        if (!this.timer) return;

        clearInterval(this.timer);
    }

    restart() {
        this.stop();
        this.run();
    }
}

(function() {
    // Instantiate table
    let markovTable = new MarkovTable([], PATHS, NUM_ROWS, NUM_COLS, MARKOV_NAME);

    // Add table to document
    document.querySelector(`.${MARKOV_NAME}`).appendChild(markovTable.table);
    let freqGraph = new FreqGraph(
        markovTable,
        parseInt(window.getComputedStyle(document.querySelector(`.${FREQ_GRAPH_NAME}`)).height.slice(0, -2)),
        FREQ_GRAPH_NAME
    );
    document.querySelector(`.${FREQ_GRAPH_NAME}`).appendChild(freqGraph.graph);

    // Add ability to set delay using HTML field
    document.querySelector(`.${MARKOV_NAME}__toggle`).addEventListener('click', () => {
        markovTable.restart(document.querySelector(`.${MARKOV_NAME}__speed`).value);
        freqGraph.restart();
    });

    // Start simulation
    markovTable.start(document.querySelector(`.${MARKOV_NAME}__speed`).value);
    freqGraph.run();
})();
