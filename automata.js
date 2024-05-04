class Automata {
    constructor(game, width = 80, height = 60) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.tickCount = 0;
        this.ticks = 0;
        this.speed = 60;
        this.automata = this.createEmptyAutomata();
        this.randomize();
    }

    createEmptyAutomata() {
        return Array.from({length: this.width}, () => Array.from({length: this.height}, () => 0));
    }

    randomize() {
        this.forEachCell((col, row) => {
            this.automata[col][row] = Math.floor(Math.random() * 2);
        });
    }

    forEachCell(callback) {
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                callback(col, row);
            }
        }
    }

    countNeighbors(col, row) {
        const indexes = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1],
        ];
        return indexes.reduce((count, [dCol, dRow]) => {
            const neighborCol = col + dCol, neighborRow = row + dRow;
            if (neighborCol >= 0 && neighborCol < this.width && neighborRow >= 0 && neighborRow < this.height) {
                count += this.automata[neighborCol][neighborRow];
            }
            return count;
        }, 0);
    }

    update() {
        this.updateSpeed();
        if (this.tickCount++ >= this.speedAdjustment()) {
            this.tickCount = 0;
            this.ticks++;
            this.nextGeneration();
        }
        this.updateDisplay();
    }

    updateSpeed() {
        const speedInput = document.getElementById("speed");
        if (speedInput) this.speed = parseInt(speedInput.value);
    }

    speedAdjustment() {
        return 120 - this.speed;
    }

    nextGeneration() {
        let next = this.createEmptyAutomata();

        this.forEachCell((col, row) => {
            const liveNeighbors = this.countNeighbors(col, row);
            const alive = this.automata[col][row] === 1;
            if ((alive && (liveNeighbors === 2 || liveNeighbors === 3)) || (!alive && liveNeighbors === 3)) {
                next[col][row] = 1;
            }
        });

        this.automata = next;
    }
    updateDisplay() {
        const ticksElement = document.getElementById('ticks');
        if (ticksElement) ticksElement.innerHTML = "Ticks: " + this.ticks;
    }

    draw(ctx) {
        const cellSize = 10, gap = 1;
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        this.forEachCell((col, row) => {
            if (this.automata[col][row] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(col * cellSize + gap, row * cellSize + gap, cellSize - 2 * gap, cellSize - 2 * gap);
            }
        });
    }
    
    loadPreset(presetName) {
        this.automata = this.createEmptyAutomata(); 

        const presets = {
            glider: () => this.placeGlider(1, 1), 
            spaceship: () => this.placeSpaceship(10, 10), 
            pulsar: () => this.placePulsar(20, 20), 
            gosperGliderGun: () => this.placeGosperGliderGun(1, 5), 
        };

        if (typeof presets[presetName] === 'function') {
            presets[presetName]();
        } else {
            console.error('Preset not found:', presetName);
        }
    }
}