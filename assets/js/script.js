/* PSUEDO CODING SCRATCHPAD
Hook listener to button to initiate quiz
On start, logic picks a question and feeds it to the renderer
Select a question using a random number, check if questions 
    have already been asked (Array includes?)
Once selected, interface draws question/choices to appropriate boxes (randomized as well?)
On click, the contents of the selection are compared to correct answer, pass/fail determined
User feedback given and another question is drawn (flash elements red/green briefly?)
    Possibly shuffle missed questions back into the stack?
    Deplete timer (check for 0)
Timer counts down seconds, checking for 0
Timer reaches 0, call fail function
    Clear elements, indicate failure. Offer restart.
    Restart clears question stack, begins again.
All questions answered, freeze timer
*/

/*=======================================
// Quiz Question Array
------------------------------------------
Stores the questions and answers in a single
semi-convenient object, an array of objects
=========================================*/
var quizData = [
    {
        question : "Question here.",
        answers : {
            a : "Choice",
            b : "Choice",
            c : "Choice",
            d : "Choice"
        },
        correct : "d"
    }
];

/*=======================================
// Quiz Logic Module
------------------------------------------
Handles the backend logic of the quiz app
=========================================*/
var quizLogic = (function() {

    var startTimer = function() {
        // Timer code here
    }

    return {
        startTimer : startTimer
    };
})();

/*====================================
// Quiz Interface Module
------------------------------------------
Interfaces with the DOM and the GUI
====================================*/
var quizInterface = (function() {

    return {
        land
    }
})();

/*====================================
// Runtime Code
------------------------------------------
Initiates the app
====================================*/
