document.addEventListener('DOMContentLoaded', function() {
    const symbols = ['🍓', '🍒', '🍋', '🍎', '🍉', '🍑', '🍇', '🍍', '🍌'];
    const columns = [
        document.getElementById('column1'),
        document.getElementById('column2'),
        document.getElementById('column3')
    ];
    const spinButton = document.getElementById('spinButton');
    const result = document.getElementById('result');
    const balanceElement = document.getElementById('balance');
    const betElement = document.getElementById('bet');
    const increaseBetButton = document.getElementById('increaseBet');
    const decreaseBetButton = document.getElementById('decreaseBet');
    const maxBetButton = document.getElementById('maxBet');
    const setMinBetButton = document.getElementById('setMinBet');
    const menuButton = document.getElementById('menuButton');
    const menu = document.getElementById('menu');

    let balance = 1000;
    let bet = 10;
    const minBet = 10;

    const payoutTable = {
        '🍓': 10,
        '🍒': 20,
        '🍋': 30,
        '🍎': 40,
        '🍉': 50,
        '🍑': 60,
        '🍇': 70,
        '🍍': 80,
        '🍌': 90
    };

    const winLines = [
        [0, 0, 0],  // Прямая линия по верхнему ряду
        [1, 1, 1],  // Прямая линия по среднему ряду
        [2, 2, 2],  // Прямая линия по нижнему ряду
        [0, 1, 2],  // Диагональ сверху вниз
        [2, 1, 0]   // Диагональ снизу вверх
    ];

    function updateBalance() {
        balanceElement.textContent = balance;
    }

    function updateBet() {
        betElement.textContent = bet;
    }

    function getRandomSymbols() {
        const weightedSymbols = [
            '🍓', '🍓', '🍓', '🍓', '🍒', '🍒', '🍒', '🍒', '🍋', '🍋', '🍋', '🍋',
            '🍎', '🍎', '🍎', '🍎', '🍉', '🍉', '🍑', '🍑', '🍇', '🍇', '🍍', '🍍', '🍌'
        ];
        return [
            weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)],
            weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)],
            weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)]
        ];
    }

    function initializeSlots() {
        columns.forEach(column => {
            column.innerHTML = '';
            for (let i = 0; i < 3; i++) { // 3 символа для каждого барабана
                const randomSymbol = getRandomSymbols()[i];
                column.innerHTML += `<div class="slot">${randomSymbol}</div>`;
            }
        });
    }

    function spinColumn(column, delay) {
        setTimeout(() => {
            column.classList.add('spin');
            setTimeout(() => {
                column.classList.remove('spin');
                const randomSymbols = getRandomSymbols();
                column.innerHTML = `
                    <div class="slot">${randomSymbols[0]}</div>
                    <div class="slot">${randomSymbols[1]}</div>
                    <div class="slot">${randomSymbols[2]}</div>
                `;
                if (columns.indexOf(column) === columns.length - 1) {
                    checkWin();
                }
            }, 2000);
        }, delay);
    }

    function spinSlots() {
        if (balance < bet) {
            result.textContent = 'Insufficient balance!';
            return;
        }

        balance -= bet;
        updateBalance();
        result.textContent = '';

        columns.forEach((column, index) => {
            spinColumn(column, index * 500);
        });
    }

    function checkWin() {
        const allSymbols = columns.map(column => Array.from(column.children).map(child => child.textContent));

        let winAmount = 0;
        winLines.forEach(line => {
            const [a, b, c] = line;
            if (allSymbols[0][a] === allSymbols[1][b] && allSymbols[1][b] === allSymbols[2][c]) {
                winAmount += payoutTable[allSymbols[0][a]] * bet;
            }
        });

        if (winAmount > 0) {
            balance += winAmount;
            result.textContent = `You win ${winAmount} coins!`;
        } else {
            result.textContent = 'Try again!';
        }

        updateBalance();
    }

    increaseBetButton.addEventListener('click', () => {
        bet += 10;
        updateBet();
    });

    decreaseBetButton.addEventListener('click', () => {
        if (bet > minBet) {
            bet -= 10;
            updateBet();
        }
    });

    maxBetButton.addEventListener('click', () => {
        bet = Math.floor(balance * 0.5);
        updateBet();
    });

    setMinBetButton.addEventListener('click', () => {
        bet = minBet;
        updateBet();
    });

    menuButton.addEventListener('click', () => {
        if (menu.style.display === 'none') {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    });

    spinButton.addEventListener('click', spinSlots);

    initializeSlots();
    updateBalance();
    updateBet();
});

function handleTelegramLogin() {
    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('id');
    const first_name = urlParams.get('first_name');
    const last_name = urlParams.get('last_name');
    const username = urlParams.get('username');
    
    console.log('User ID:', user_id);
    console.log('First Name:', first_name);
    console.log('Last Name:', last_name);
    console.log('Username:', username);
}
