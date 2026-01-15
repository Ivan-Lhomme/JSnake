export const game = {
    map: [],
    snake: [],
    startLength: 3,
    speed: 250,
    appleEaten: 0,
    moveLoop: undefined,
    apple: undefined,
    score: undefined,
    waiting: false,
    gameRunning: false,
    time: {
        display: undefined,
        number: 0,
        timer: undefined,
    },

//------------------------- game -------------------------
    init() {
        // keylogger
        document.body.addEventListener(
            "keypress",
            this.keylogger.bind(this)
        );

        // creation
        this.createScore();
        this.createTimer();
        this.createMap();
        this.createSnake();
        this.createApple();

        // placement
        this.placeSnake();
        this.placeApple();

        this.createModaleWindow(
            "Welcome to my little snake only make with javascript !",
            "Start"
        );
    },
    start() {
        this.deleteModaleWindow();

        this.gameRunning = true;
        this.move();
        this.startTimer();
    },
    reset() {
        clearInterval(this.moveLoop);

        this.score.dataset.score = 0;
        this.speed = 250;
        this.appleEaten = 0;
        this.time.number = 0;

        this.deleteSnake();
        this.deleteApple()

        this.createSnake();
        this.resetSnakeDirection();

        this.placeSnake();
        this.placeApple();

        this.updateScore();
        this.updateTimer();
    },
    resetSnakeDirection() {
        this.snake.forEach(function(snakeSection) {
            snakeSection.dataset.direction = "up";
        });
    },
    gameOver() {
        this.gameRunning = false;
        this.stopTimer();

        this.createModaleWindow(
            "Game over !",
            "Restart",
            true
        );

        this.reset();
    },
    stop() {
        if (!this.waiting) {
            clearInterval(this.moveLoop);
            this.stopTimer();
        } else {
            this.move();
            this.startTimer();
        }

        this.waiting = !this.waiting;
    },
    startTimer() {
        this.time.timer = setInterval(function() {
            this.time.number += 25;
            this.score.dataset.score = Number(this.score.dataset.score) + 0.5;
            this.updateScore();
            this.updateTimer();
        }.bind(this), 250);
    },
    stopTimer() {
        clearInterval(this.time.timer);
    },

//------------------------- creation -------------------------
    createMap() {
        const mapGrid = document.createElement("section");
        mapGrid.id = "map";

        for(let l = 0; l < 20; l++) {
            let line = [];

            for(let col = 0; col < 20; col++) {
                const element = document.createElement("div");
                element.classList.add("case");

                line.push(element);
                mapGrid.appendChild(element);
            }

            this.map.push(line);
        }

        document.body.appendChild(mapGrid);
    },
    createScore() {
        this.score = document.createElement("h1");
        this.score.dataset.score = 0
        this.score.textContent = `Score : ${this.score.dataset.score}`;

        document.body.appendChild(this.score);
    },
    createSnake() {
        this.snake = [];
        const head = document.createElement("div")
        head.classList.add("case-snake");

        head.dataset.direction = "up";
        head.dataset.line = 10;
        head.dataset.col = 10;

        this.snake.push(head);
        this.map[head.dataset.line][head.dataset.col].appendChild(head);

        for(let x = 1; x < this.startLength; x++) {
            this.createSnakeSection();
        }
    },
    createSnakeSection() {
        const newSnakeSection = document.createElement("div")
        newSnakeSection.classList.add("case-snake");

        const lastSnakeSection = this.snake[this.snake.length-1]
        const direction = lastSnakeSection.dataset.direction;

        let line = lastSnakeSection.dataset.line;
        let col = lastSnakeSection.dataset.col;
        
        if (direction === "up") {
            line++
        } else if (direction === "down") {
            line--
        } else if (direction === "right") {
            col++
        } else if (direction === "left") {
            col--
        }

        newSnakeSection.dataset.direction = direction;
        newSnakeSection.dataset.line = line;
        newSnakeSection.dataset.col = col;

        this.snake.push(newSnakeSection);
        this.map[line][col].appendChild(newSnakeSection);
    },
    createApple() {
        this.apple = document.createElement("div");
        this.apple.classList.add("case-apple");
    },
    createTimer() {
        this.time.display = document.createElement("h2");
        this.time.display.textContent = `Time : ${this.time.number}`;

        document.body.appendChild(this.time.display);
    },

//------------------------- update -------------------------
    updateScore() {
        this.score.textContent = `Score : ${Math.round(this.score.dataset.score)}`;
    },
    updateSnake(lineAdd, colAdd) {
        let line = Number(this.snake[0].dataset.line) + lineAdd;
        let col = Number(this.snake[0].dataset.col) + colAdd;

        if ((0 <= line && line < this.map.length) && (0 <= col && col < this.map.length)) {
 
            if (this.map[line][col].childElementCount > 0) {
                if (this.map[line][col].contains(this.apple)) {
                    this.eat();
                } else {
                    this.gameOver();
                }
            }

            if (this.gameRunning) {
                for(let x = this.snake.length-1; x > 0; x--) {
                    this.snake[x].dataset.line = this.snake[x-1].dataset.line;
                    this.snake[x].dataset.col = this.snake[x-1].dataset.col;
                }

                this.snake[0].dataset.line = Number(this.snake[0].dataset.line) + lineAdd;
                this.snake[0].dataset.col = Number(this.snake[0].dataset.col) + colAdd;

                this.placeSnake();
            }
        } else {
            this.gameOver();
        }
    },
    updateTimer() {
        this.time.display.textContent = `Time : ${this.time.number}`;
    },

//------------------------- placement -------------------------
    placeSnake() {
        this.snake.forEach(function(element) {
            let line = element.dataset.line;
            let col = element.dataset.col;

            this.map[line][col].appendChild(element);
        }.bind(this));
    },
    placeApple() {
        let mapCase = this.map[this.randomInt(0, 20)][this.randomInt(0, 20)];
        while(mapCase.children.length > 0) {
            mapCase = this.map[this.randomInt(0, 20)][this.randomInt(0, 20)];
        }

        mapCase.appendChild(this.apple);
    },

//------------------------- suppression -------------------------
    deleteSnake() {
        this.snake.forEach(function(element) {
            element.remove();
        });
    },
    deleteApple() {
        this.apple.remove();
    },

//------------------------- snake action -------------------------
    eat() {
        if ((this.speed - 15) > 0) {
            this.speed = this.speed - 15;
            clearInterval(this.moveLoop);
            this.move();
        }
        this.appleEaten++

        this.createSnakeSection();
        this.placeApple();
        this.score.dataset.score = Number(this.score.dataset.score) + 10;
        this.updateScore();
    },
    move() {
        this.moveLoop = setInterval(function() {
            if (this.snake[0].dataset.direction == "up") {
                this.updateSnake(-1, 0);
            } else if (this.snake[0].dataset.direction == "down") {
                this.updateSnake(1, 0);
            } else if (this.snake[0].dataset.direction == "right") {
                this.updateSnake(0, -1);
            } else if (this.snake[0].dataset.direction == "left") {
                this.updateSnake(0, 1);
            }
        }.bind(this), this.speed);
    },

//------------------------- modale window -------------------------
    createModaleWindow(text, buttonText, score) {
        const startModal = document.createElement("div");
        startModal.classList.add("modale-window");

        const startText = document.createElement("p");
        startText.textContent = text;

        const startButton = document.createElement("button");
        startButton.textContent = buttonText;
        startButton.addEventListener(
            "click",
            function(event) {
                this.start()
            }.bind(this)
        );

        document.body.appendChild(startModal);
        startModal.appendChild(startText);
        if (score) {
            const startScore = document.createElement("p");
            startScore.innerHTML = `Score : ${Math.round(this.score.dataset.score)}<br>Apple : ${this.appleEaten}<br>Time : ${this.time.number / 100}s`;

            startModal.appendChild(startScore);
        }
        startModal.appendChild(startButton);
    },
    deleteModaleWindow() {
        document.querySelector(".modale-window").remove();
    },

//------------------------- utilities -------------------------
    keylogger(event) {
        if (this.gameRunning && !this.waiting) {
            if (event.key === "z" && this.snake[0].dataset.direction !== "down") {
                this.snake[0].dataset.direction = "up";
            }
            
            if (event.key === "s" && this.snake[0].dataset.direction !== "up") {
                this.snake[0].dataset.direction = "down";
            }
            
            if (event.key === "q" && this.snake[0].dataset.direction !== "left") {
                this.snake[0].dataset.direction = "right";
            }
            
            if (event.key === "d" && this.snake[0].dataset.direction !== "right") {
                this.snake[0].dataset.direction = "left";
            }

            if (event.key === " ") {
                this.stop();
            }
        }
    },

    randomInt : (min, max) => Math.round(Math.random()* ((max - 1) - min) + min),
}