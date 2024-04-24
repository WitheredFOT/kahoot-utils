// ==UserScript==
// @name         Kahoot Utils
// @namespace    http://tampermonkey.net/
// @version      b0.3
// @description  Helps you study questions in kahoot.
// @author       DanSavageGames
// @match        https://kahoot.it/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kahoot.it
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Credits
    var credits = ["https://github.com/Yuvix25/kahoot-answer-bot/tree/main/js", "https://greasyfork.org/en/scripts/425312-kaboot-modified"];

    // Keycode Variables
    const keyMap = {
        38: 1, // Top Left
        39: 2, // Top Right
        40: 3, // Bottom Left
        41: 4  // Bottom Right
    };

    // Key Answer Triggers
    document.addEventListener('keydown', e => {
        if (e.isComposing) return;
        const keyCode = e.keyCode;
        if (keyMap.hasOwnProperty(keyCode)) {
            clickAnswer(keyMap[keyCode]);
        }
    });

    // Click the answer element
    function clickAnswer(answerIndex) {
        const answerElement = document.querySelector(`[data-functional-selector="answer-${answerIndex}"]`);
        if (answerElement) {
            answerElement.click();
            logAnswer(answerElement.innerText, getCorrectAnswer());
        }
    }

    // Get the correct answer
    function getCorrectAnswer() {
        const correctElement = document.querySelector('[data-correct]');
        return correctElement ? correctElement.innerText : null;
    }

    // Log the answer
    function logAnswer(yourAnswer, correctAnswer) {
        const questionElement = document.querySelector('h1');
        const question = questionElement ? questionElement.innerText : null;

        if (question && yourAnswer && correctAnswer) {
            const isCorrect = yourAnswer === correctAnswer;
            saveToFile([question, yourAnswer, correctAnswer, isCorrect]);
        }
    }

    // Save to file
    function saveToFile(data) {
        const blob = new Blob([data.join('\t') + '\n'], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, `KahootQuestions-${new Date().toLocaleDateString()}.txt`);
    }
    
    // start of Toast function

    const getOnScreen = () => {
        const toast = document.createElement("div");
        toast.className = "toast-container";
        toast.innerHTML = `
    <div class="toast ${isCorrect ? "correct" : "incorrect"}">
      <i class="fa-solid fa-check" aria-hidden="true"></i>
      <span class="message"></span>
      <div class="timer"></div>
    </div>
  `;
        document.body.appendChild(toast);
        return toast;
    };

    const getOffScreen = () => {
        const toast = document.querySelector(".toast-container .toast");
        if (toast) {
            toast.style.transform = "translateY(100%)";
        }
    };

    const onScreen = (toast, message, duration) => {
        const messageElement = toast.querySelector(".message");
        messageElement.textContent = message;
        toast.querySelector(".timer").style.transition = `width ${duration}ms`;
        toast.querySelector(".timer").style.width = "100%";
        toast.style.transform = "translateY(0)";
        setTimeout(() => {
            toast.style.transform = "translateY(100%)";
        }, duration);
    };

    const isCorrect = (yourAnswer, correctAnswer) => yourAnswer === correctAnswer;

    const toast = (yourAnswer, correctAnswer, isCorrect) => {
        const message = isCorrect
        ? "Correct!"
        : "Incorrect.";
        const toast = getOnScreen();
        onScreen(toast, message, 3000);
    };

    /*
    Toast function

    This toast function will tell me whether my answer is correct (with a green checkmark, green text saying "Correct!", and slight green tint for the toast window), or incorrect (with a red X, red text saying "Incorrect.", and a slight red tint for the toast window)
    I would also like the toast to be in the bottom right of the tab. 600 pixels long, 325 pixels tall (600 * 325) and the outline is slightly rounded (8px), and is darker than the inside. It also turns green or red whether the answer is correct.
    I think I'd love it to have a smooth animation too when the toast shows up, from the right to the bottom right corner, and when it's finished it will move downwards with another smooth animation.
    A great addition to all this is to have a bar timer towards the bottom of the toast.
    When the animation for the toast to appear starts, (200ms), I'd like the timer and bar to start (3000ms). Only when the timer is finished, the animation for it to leave will begin (200ms)

    */
})();
