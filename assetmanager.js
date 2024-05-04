class AssetManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.downloadQueue = [];
    };

    queueDownload(path) {
        console.log("Queueing " + path);
        this.downloadQueue.push(path);
    };

    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    };

    downloadAll(callback) {
        if (this.downloadQueue.length === 0) setTimeout(callback, 10);
        for (let i = 0; i < this.downloadQueue.length; i++) {
            const img = new Image();

            const path = this.downloadQueue[i];
            console.log(path);

            img.addEventListener("load", () => {
                console.log("Loaded " + img.src);
                this.successCount++;
                if (this.isDone()) callback();
            });

            img.addEventListener("error", () => {
                console.log("Error loading " + img.src);
                this.errorCount++;
                if (this.isDone()) callback();
            });

            img.src = path;
            this.cache[path] = img;
        }
    };

    getAsset(path) {
        return this.cache[path];
    };

    initializePreset(presetName) {
        this.automata = this.createEmptyAutomata(); 

        const presetActions = {
            glider: () => this.placeGlider(10, 10),
            spaceship: () => this.placeSpaceship(15, 15),
            pulsar: () => this.placePulsar(20, 20),
            gosperGliderGun: () => this.placeGosperGliderGun(10, 50),
        };

        if (presetActions[presetName]) {
            presetActions[presetName]();
        }
    }

    placeGlider(col, row) {
        this.activateCell(col + 1, row, 1);
        this.activateCell(col + 2, row + 1, 1);
        this.activateCell(col, row + 2, 1);
        this.activateCell(col + 1, row + 2, 1);
        this.activateCell(col + 2, row + 2, 1);
    }

    placeSpaceship(col, row) {
        this.activateCell(col + 1, row, 1);
        this.activateCell(col + 2, row, 1);
        this.activateCell(col + 3, row, 1);
        this.activateCell(col + 4, row, 1);
        this.activateCell(col, row + 1, 1);
        this.activateCell(col + 4, row + 1, 1);
        this.activateCell(col + 4, row + 2, 1);
        this.activateCell(col, row + 3, 1);
        this.activateCell(col + 3, row + 3, 1);
    }

    activateCell(col, row, state) {
        if (col >= 0 && col < this.width && row >= 0 && row < this.height) {
            this.automata[col][row] = state;
        }
    }
};