document.addEventListener('DOMContentLoaded', () => {
    // --- Word Lists ---
    const wordLists = [
        ["a", "and", "away", "big", "blue", "can", "come", "down", "find", "for", "funny", "go", "help", "here", "I", "in", "is", "it", "jump", "little", "look", "make", "me", "my", "not", "one", "play", "red", "run", "said", "see", "the", "three", "to", "two", "up", "we", "where", "yellow", "you"],
        ["all", "am", "are", "at", "ate", "be", "black", "brown", "but", "came", "did", "do", "eat", "four", "get", "good", "have", "he", "into", "like", "must", "new", "no", "now", "on", "our", "out", "please", "pretty", "ran", "ride", "saw", "say", "she", "so", "soon", "that", "there", "they", "this", "too", "under", "want", "was", "well", "went", "what", "white", "who", "will", "with", "yes"],
        ["after", "again", "an", "any", "as", "ask", "by", "could", "every", "fly", "from", "give", "going", "had", "has", "her", "him", "his", "how", "just", "know", "let", "live", "may", "of", "old", "once", "open", "over", "put", "round", "some", "stop", "take", "thank", "them", "then", "think", "walk", "were", "when"]
    ];

    // --- Game Elements ---
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    const levelButtons = document.querySelectorAll('.level-btn');
    const starsContainer = document.getElementById('stars-container');
    const speakerBtn = document.getElementById('speaker-btn');
    const scoreCounter = document.getElementById('score-counter');
    const playAgainBtn = document.getElementById('play-again-btn');

    // --- Game State ---
    let currentWords = [];
    let targetWord = '';
    let score = 0;
    const wordsPerRound = 10;
    const optionsPerTurn = 5;

    // --- Functions ---
    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    }

    function startGame(level) {
        currentWords = [...wordLists[level]];
        score = 0;
        updateScore();
        startScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        nextTurn();
    }

    function nextTurn() {
        starsContainer.innerHTML = '';
        
        // Shuffle words and pick a target
        currentWords.sort(() => 0.5 - Math.random());
        targetWord = currentWords[0];
        
        // Get options for display
        const options = currentWords.slice(0, optionsPerTurn);
        options.sort(() => 0.5 - Math.random()); // Shuffle the options

        options.forEach(word => {
            const star = document.createElement('div');
            star.classList.add('star');
            star.textContent = word;
            star.addEventListener('click', () => checkAnswer(word, star));
            starsContainer.appendChild(star);
        });

        setTimeout(() => speak(`Find the word... ${targetWord}`), 500);
    }

    function checkAnswer(selectedWord, starElement) {
        if (selectedWord === targetWord) {
            score++;
            updateScore();
            starElement.classList.add('correct');
            // Play a success sound if you have one
            setTimeout(() => {
                if (score >= wordsPerRound) {
                    endGame();
                } else {
                    nextTurn();
                }
            }, 1000);
        } else {
            starElement.classList.add('incorrect');
            speak("Oops, try again!");
            setTimeout(() => {
                starElement.classList.remove('incorrect');
            }, 500);
        }
    }

    function updateScore() {
        scoreCounter.textContent = `Stars: ${score} / ${wordsPerRound}`;
    }

    function endGame() {
        gameScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
        speak("Great job! You collected all the stars!");
    }

    // --- Event Listeners ---
    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const level = button.dataset.level;
            startGame(level);
        });
    });

    speakerBtn.addEventListener('click', () => speak(targetWord));
    playAgainBtn.addEventListener('click', () => {
        endScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
    });
});
