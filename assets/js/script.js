/*=======================================
// Global Variables
------------------------------------------
Declares global variables, including commonly
manipulated DOM elements
=========================================*/
const questionBox = document.getElementById("question");
const choiceBoxes = document.querySelectorAll(".choicebox");
const feedbackBox = document.getElementById("feedback");
const timerBox = document.getElementById("timer");
const formBox = document.getElementById("form");
const nameBox = document.getElementById("name");
const leaderTable = document.getElementById("score-list")
const leaderBox = document.getElementById("leaderboard")

var currentQuestion = 0;
var completedQuestions = [];
var scoreBoard = [];

var timeRemaining = 0;
var timer;

/*=======================================
// Quiz Question Array
------------------------------------------
Stores the questions and answers in a single
semi-convenient container, an array of objects
=========================================*/
var quizData = [
    {
        question : "Welcome to Bear's Animal Facts! You will have a limited time to answer 10 animal related questions. You lose time for wrong answers, so choose carefully! Try to complete it with as much time remaining as possible!",
        answers : [
            " ",
            "Start Quiz",
            " ",
            " "
        ],
        correct : "Start Quiz"
    },
    {
        question : "What animal has fingerprints so similar to a human's that they can taint crime scenes?",
        answers : [
            "Domestic Cat",
            "Koala",
            "Gorrila",
            "Chimpanzee"
        ],
        correct : "Koala"
    },
    {
        question : "The first thing a catepillar usually eats is...",
        answers : [
            "Its shell",
            "Bugs",
            "Leaves",
            "Wheaties"
        ],
        correct : "Its shell"
    },
    {
        question : "Gorrillas have a bite force of how many PSI?",
        answers : [
            "600",
            "900",
            "1100",
            "1300"
        ],
        correct : "1300"
    },
    {
        question : "Squid have how many tentacles?",
        answers : [
            "2",
            "4",
            "6",
            "8"
        ],
        correct : "2"
    },
    {
        question : "The largest tiger ever recorded in captivity was...",
        answers : [
            "932 lbs.",
            "865 lbs.",
            "793 lbs.",
            "633 lbs."
        ],
        correct : "932 lbs."
    },
    {
        question : "How many bones are in a homo sapiens?",
        answers : [
            "163",
            "206",
            "256",
            "302"
        ],
        correct : "206"
    },
    {
        question : "What is the fastest land animal?",
        answers : [
            "Cheetah",
            "Siberian Tiger",
            "Brown Recluse",
            "Grizzly Bear"
        ],
        correct : "Cheetah"
    },
    {
        question : "Which of these animals is technically immortal?",
        answers : [
            "Wombat",
            "Great White Shark",
            "Hydra",
            "E. Coli"
        ],
        correct : "Hydra"
    },
    {
        question : "What is the largest spider in the world?",
        answers : [
            "Goliath Bird-Eater",
            "Hercules Cow-Killer",
            "Sampson Big-Leg",
            "The Big Widow"
        ],
        correct : "Goliath Bird-Eater"
    },
    {
        question : "Hippos are most closely related to which animals?",
        answers : [
            "Pigs",
            "Orcs",
            "Dogs",
            "Dolphins"
        ],
        correct : "Dolphins"
    },
];

/*=======================================
// Quiz Logic Module
------------------------------------------
Handles the backend logic of the quiz app
=========================================*/
var quizLogic = (function() {

    function onClick(event) {
        // General click handler
        var buttonClicked = event.target.innerHTML;

        if (buttonClicked == "Start Quiz" || buttonClicked == "Try Again") {
            // we're starting the quiz (over?)
            startQuiz();
        } else if (event.target.innerHTML == quizData[currentQuestion].correct) {
            checkAnswer(true); // button clicked matches the correct answer
        } else if (buttonClicked == " ") {
            return;
        } else if (buttonClicked == "Save Score") {
            console.log("Save Score clicked");
            saveScore();
        }
        else {
            checkAnswer(false); // button clicked does NOT match the correct answer
        }
    }

    function checkAnswer(didGood) {
        // Add question to the number right or dock time
        if (didGood) {
            var numRight = completedQuestions.push(currentQuestion);
        } else {
            timeRemaining = timeRemaining - 1;
            checkTime();
        };
        if (numRight == 10) {
            loadScores();
            quizInterface.drawPass(); // All questions answered right! Quiz over
        } else {
            incrementQuiz();
        };
    }

    // decrements the time, updates the timer, and checks if time has run out
    function checkTime() {
        timeRemaining = timeRemaining - 1;
        quizInterface.drawTimer();
        if (timeRemaining <= 0) {
            console.log("Clearing timer")
            clearInterval(timer);
            quizInterface.drawFail();
        }
    }

    // This functions saving the score to memory and then reloads the scores
    function saveScore() {
        let name = nameBox.value;
        console.log("Save Score started");
        if (name == null) {
            return; // name is empty, do nothing
        }
        let score = {
            "name": name,
            "score": timeRemaining
        };
        console.log(score);
        scoreBoard.push(score);
        console.log(scoreBoard);
        if (scoreBoard.length > 5) {
            scoreBoard.shift(); // trims the leaderboard at 5
        }

        localStorage.setItem("scores", JSON.stringify(scoreBoard));

        loadScores();
        quizInterface.finishQuiz();
    }
    // This function handles the loading of scores from memory
    function loadScores() {
        tempStorage = JSON.parse(localStorage.getItem("scores"));

        if (tempStorage == null) {
            return; // cancel if there are no scores
        }

        scoreBoard = tempStorage;

        console.log("new scoreboard: " + scoreBoard)
        // loop through the scoreboard, adding table rows and cells
        for (var i = 0; i < scoreBoard.length; i++) {
            console.log("adding tr")
            var tr = document.createElement("tr");
            var nameCell = document.createElement("td");
            var scoreCell = document.createElement("td");

            nameCell.textContent = scoreBoard[i].name;
            scoreCell.textContent = scoreBoard[i].score;

            console.log("appending children")

            tr.appendChild(nameCell);
            tr.appendChild(scoreCell);

            leaderTable.appendChild(tr);
        }
    }

    // Handles moving forward, skipping previous successes
    function incrementQuiz() {
        if (timeRemaining <= 0) {
            return; // don't even bother if the timer is out
        }

        currentQuestion++;
        if (currentQuestion > 10) {
            currentQuestion = 1;
        }

        for (var i = currentQuestion; i <= 10; i++) {
            // if question not answered, pull up that question
            if (!completedQuestions.includes(i)) {
                currentQuestion = i;
                quizInterface.drawQuiz(currentQuestion);
                return;
            }
        }
    }

    // Sets and starts the timer, normalizes variables, and moves forward
    function startQuiz() {
        // hide the form if it was shown
        formBox.setAttribute("class", "hide");
        // Show the choiceboxes if they were hidden
        for (var i = 0; i < choiceBoxes.length; i++) {
            choiceBoxes[i].setAttribute("class", "choicebox choiceboxlight");
        }
        currentQuestion = 1;
        timeRemaining = 45;
        console.log("Setting timer");
        timer = setInterval(checkTime, 1000);
        quizInterface.drawTimer();
        incrementQuiz();
    }

    // Most of the logic is hidden away, only interfaced through the
    // click handler
    return {
        onClick : onClick
    };
})();

/*====================================
// Quiz Interface Module
------------------------------------------
Interfaces with the DOM and the GUI
====================================*/
var quizInterface = (function() {

    // Initializes or reinitializes the quiz
    function initQuiz() {
        drawQuiz(0);
        // Hook in event listeners on choiceboxes
        for (var i = 0; i < choiceBoxes.length; i++) {
            choiceBoxes[i].addEventListener('click', quizLogic.onClick);
            choiceBoxes[i].setAttribute("class", "choicebox");
        }
        choiceBoxes[1].setAttribute("class", "choicebox choiceboxlight");
    }

    // Sets the question and answers to match the current level
    function drawQuiz(num) {
        questionBox.innerHTML = quizData[num].question;
        for (var i = 0; i < choiceBoxes.length; i++) {
            choiceBoxes[i].innerHTML = quizData[num].answers[i];
        }
    }

    // Handles the drawing of the win screen
    function drawPass() {
        clearInterval(timer);
        questionBox.innerHTML = "<p>You won! Please enter your name for the leaderboard.</p> <p>Thanks for playing!</p>";
        for (var i = 0; i < choiceBoxes.length; i++) {
            choiceBoxes[i].setAttribute("class", "hide");
        }
        formBox.removeAttribute("class");
        choiceBoxes[0].setAttribute("class", "choicebox choiceboxlight");
        choiceBoxes[0].innerHTML = "Save Score";
        leaderBox.removeAttribute("class")
    }

    // Handles the drawing of the fail screen
    function drawFail() {
        clearInterval(timer);
        completedQuestions = [];
        questionBox.innerHTML = "<p>Oh no! You ran out of time!</p>";
        for (var i = 0; i < choiceBoxes.length; i++) {
            choiceBoxes[i].setAttribute("class", "hide");
        }
        choiceBoxes[0].setAttribute("class", "choicebox choiceboxlight");
        choiceBoxes[0].innerHTML = "Try Again";
    }

    function finishQuiz() {
        timerBox.innerHTML = "";
        timerBox.setAttribute("class", "hide");
        nameBox.setAttribute("class", "hide");
        choiceBoxes[0].setAttribute("class", "hide");
    }

    // Handles drawing the timer
    function drawTimer() {
        timerBox.textContent = "Time Left: " + timeRemaining;
    }

    // Reveal parts needed for the logic
    return {
        initQuiz : initQuiz,
        drawQuiz : drawQuiz,
        drawFail : drawFail,
        drawPass : drawPass,
        drawTimer : drawTimer,
        finishQuiz : finishQuiz
    }

})();

/*====================================
// Runtime Code
------------------------------------------
Initiates the app
====================================*/

quizInterface.initQuiz();