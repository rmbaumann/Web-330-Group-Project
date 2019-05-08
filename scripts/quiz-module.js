/*
============================================
; Title: Web 330 Group Project
; Author: Lance Desrouleaux, Troy Martin, Adam Donner, Reva Baumann
; Date: 05/03/2019
; Modified By:
; 05/03/2019 Troy Martin Created initial file
; Description: JavaScript module used for managing the quiz
;===========================================
*/

// declare the data to build the questions
let QuestionData = [
  {
    id: 1,
    question: "Which of these is the correct syntax?",
    answers: [
      {id: 1,
      answer:
`<pre>function clearAll() {
  document.getElementsByClassName("independence")[0].style.visibility = 'hidden';
};</pre>`},
      {id: 2,
      answer:
`<pre>function clearAll() {
  getElementsByClassName("independence")[0].style.visibility = 'hidden';
};</pre>`},
      {id: 3,
      answer:
`<pre>function clearAll() {
  document.getByClassName("independence")[0].style.visibility = 'hidden';</pre>`},
      {id: 4,
        answer:
`<pre>function clearAll() {
  document.("independence")[0].style.visibility = 'hidden';
}</pre>`}
    ],
    correct: 1
  },
  {
    id: 2,
    question: "Which of these is the correct syntax?",
    answers: [
      {id: 1,
      answer:`<pre>$(btn).on("click", function(){}</pre>`},
      {id: 2,
      answer:`<pre>$(#btn).on(click, function(){}</pre>`},
      {id: 3,
      answer:`<pre>$("#btn").on("click", function(){}</pre>`},
      {id: 4,
      answer:`<pre>(#btn").on("click", function(){}</pre>`}
    ],
    correct: 1
  },
  {
    id: 3,
    question: "Which of these is the correct syntax?",
    answers: [
      {id: 1,
      answer:`<pre>&lt;button type="button" onclick= "document.getElementById('.furniture').innerHTML = new Date()"&gt;</pre>`},
      {id: 2,
      answer:`<pre>&lt;button type="button" onclick= "getElementById(‘#furniture').innerHTML = new Date()"&gt;</pre>`},
      {id: 3,
      answer:`<pre>&lt;button type="button" onclick= "getElementById('furniture').innerHTML = new Date()"&gt;</pre>`},
      {id: 4,
      answer:`<pre>&lt;button type="button" onclick= "document.getElementById('furniture').innerHTML = new Date()"&gt;</pre>`}
    ],
    correct: 1
  },
  {
    id: 4,
    question: "What is the term used for the space between the curly braces of a function?",
    answers: [
      {id: 1, answer: "The function parameters."},
      {id: 2, answer: "The function arguments."},
      {id: 3, answer: "The function body."},
      {id: 4, answer: "The function whitespace."}
    ],
    correct: 3
  },
  {
    id: 5,
    question: "What is the name of the function on the console object used to output values to the screen?",
    answers: [
      {id: 1, answer: "console.draw"},
      {id: 2, answer: "console.log"},
      {id: 3, answer: "console.output"},
      {id: 4, answer: "console.writeLine"}
    ],
    correct: 2
  },
  {
    id: 6,
    question: "Which is an example of a constructor prototype?",
    answers: [
      {id: 1,
      answer:
`<pre>Song.constructor.toString = function(){
  return \`\${this.title} performed by \${this.artist}\`;
}</pre>`},
      {id: 2,
      answer:
`<pre>Song.toString = function(){
  return \`\${this.title} performed by \${this.artist}\`;
}</pre>`},
      {id: 3,
      answer:
`<pre>this.toString = function(){
  return \`\${this.title} performed by \${this.artist}\`;
}</pre>`},
      {id: 4,
        answer:
`<pre>Song.prototype.toString = function(){
  return \`\${this.title} performed by \${this.artist}\`;
}</pre>`}
    ],
    correct: 4
  },
]

// declare the question factory
let QuestionFactory = function(){};
// declare the createQuestion function on the prototype of the factory
QuestionFactory.prototype.createQuestion = function(data){
  let q = new Question();
  q.id = data.id;
  q.question = data.question;
  q.correctAnswerId = data.correct;
  q.userAnswerId = -1;
  q.answers = [];
  data.answers.forEach(a => {
    q.answers.push(a);
  });

  return q;
}

// declare the Question class
let Question = function(){
  this.id = 0;
  this.question = "";
  this.answers = [];
  this.correctAnswerId = 0;
  this.userAnswerId = 0;
};
// declare the function isCorrect on the prototype
Question.prototype.isCorrect = function(){
  return this.userAnswerId === this.correctAnswerId;
}

// declare the module to control the quiz
var quizModule = (function(exports){
  let factory = new QuestionFactory();
  let questions = [];
  let questionIndex = 0;

  /*
  ; Params: none
  ; Response: undefined
  ; Description: Function to initialize the quiz.
  */
  function initializeQuiz(){
    QuestionData.forEach(q => {
      questions.push(factory.createQuestion(q));
    });
  }

  /*
  ; Params: none
  ; Response: {id: number, question: string, answers: [], correctAnswerId: number, userAnswerId: number}
  ; Description: Function retrieve the current question.
  */
  function getCurrentQuestion() {
    return questions[questionIndex];
  }

  /*
  ; Params: none
  ; Response: number
  ; Description: Function to return the index of the last question.
  */
  function getLastIndex(){
    return questions.length - 1;
  }

  /*
  ; Params: none
  ; Response: {id: number, question: string, answers: [], correctAnswerId: number, userAnswerId: number}
  ; Description: Function to set the next question index and return the question.
  */
  function getNextQuestion(){
    questionIndex = questionIndex < getLastIndex() ? questionIndex + 1 : 0;
    return getCurrentQuestion();
  }

  /*
  ; Params: none
  ; Response: {id: number, question: string, answers: [], correctAnswerId: number, userAnswerId: number}
  ; Description: Function to set the previous question index and return the question.
  */
  function getPreviousQuestion(){
    questionIndex = questionIndex > 0 ? questionIndex - 1 : getLastIndex();
    return getCurrentQuestion();
  }

  /*
  ; Params: answerId: number
  ; Response: undefined
  ; Description: Function to set the answer of the current question.
  */
  function setQuestionAnswer(answerId){
    questions[questionIndex].userAnswerId = answerId;
  }

  /*
  ; Params: none
  ; Response: {correct: [], missed: [], noAnswer: [], score: number, rank: string}
  ; Description: Function calculate and return the summary.
  */
  function getSummary(){
    let correct = questions.filter(q => q.isCorrect());
    let missed = questions.filter(q => !q.isCorrect());
    let noAnswer = questions.filter(q => q.userAnswerId === -1);

    return {
      correct,
      missed,
      noAnswer,
      score: getScore(correct.length, missed.length, noAnswer.length),
      rank: getRanking(correct.length)
    }

  }

  /*
  ; Params: correct: number, missed: number, noAnswer: number
  ; Response: number
  ; Description: Function to calculate the percentage score of the quiz.
  */
  function getScore(correct, missed, noAnswer){
    let x = (correct / (correct + missed + noAnswer)) * 100;
    return x;
  }

  /*
  ; Params: correct: number
  ; Response: string
  ; Description: Function to return the users rank based on the number of questions correct.
  */
  function getRanking(correct){
    if(correct < 6){
      return "Beginner";
    } else if(correct >= 6 && correct < 8){
      return "Novice";
    } else{
      return "Expert";
    }
  }

  // declare the public interface

  /*
  ; Params: none
  ; Response: {id: number, question: string, answers: [], correctAnswerId: number, userAnswerId: number}
  ; Description: Function to initialize the quiz.
  */
  exports.startQuiz = function(){
    initializeQuiz();
    return getCurrentQuestion();
  };

  /*
  ; Params: none
  ; Response: {correct: [], missed: [], noAnswer: [], score: number, rank: string}
  ; Description: Function to retrieve the results of the quiz.
  */
  exports.getSummary = function(){
    return getSummary();
  };

  /*
  ; Params: answerId: number
  ; Response: question
  ; Description: Function to set the answer of the current question and get the next one.
  */
  exports.setAnswer = function(answerId){
    setQuestionAnswer(answerId);
    return getNextQuestion();
  };

  /*
  ; Params: none
  ; Response: question
  ; Description: Function to retrieve the next question on the list, user skips question.
  */
  exports.getNext = function(){
    return getNextQuestion();
  };

  /*
  ; Params: none
  ; Response: question
  ; Description: Function to retrieve the previous question on the list.
  */
  exports.getPrevious = function(){
    return getPreviousQuestion();
  };

  /*
  ; Params: none
  ; Response: number
  ; Description: Function to retrieve the index of the current question.
  */
  exports.currentQuestionNumber = function(){
    return currentQuestionNumber;
  };

  /*
  ; Params: none
  ; Response: number
  ; Description: Function to retrieve the number of questions.
  */
  exports.numberOfQuestions = function(){
    return questions.length;
  };

  exports.getQuestions = function(){
    return questions;
  }

  // return the exports object to expose the public methods and variables
  return exports;

// will create the quizModule or an empty object
}(quizModule || {}));



