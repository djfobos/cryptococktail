import Api from './api.js';
    

document.addEventListener('DOMContentLoaded', function() {
    Telegram.WebApp.ready();
    const initData = Telegram.WebApp.initData;
    const initDataUnsafe = Telegram.WebApp.initDataUnsafe;
    let TG_ID = null;

    const error = document.querySelector('.error');
    const tgid = document.getElementById('tgidval')

    if (!initData || !initDataUnsafe.user) 
    {
        error.classList.add('show');
    } 
    else 
    {
        TG_ID = initDataUnsafe.user.id;
        tgid.innerText = TG_ID
    }

    const symbols = [
        'abtc', 
        'avalanche', 
        'bitcoin', 
        'dodge', 
        'ethereum', 
        'shiba', 
        'solana', 
        'usdt', 
        'litecoin'
    ];
    
    
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
    const api = new Api();

    let balance = 1000;
    let bet = 10;
    const minBet = 10;

    const payoutTable = {
        'usdt': 10,
        'solana': 20,
        'shiba': 30,
        'avalanche': 40,
        'dodge': 50,
        'ethereum': 60,
        'litecoin': 70,
        'bitcoin': 80,
        'abtc': 90
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
            'usdt', 'usdt', 'usdt', 'usdt', 
            'solana', 'solana', 'solana', 'solana', 
            'shiba', 'shiba', 'shiba', 'shiba',
            'avalanche', 'avalanche', 'avalanche', 'avalanche', 
            'dodge', 'dodge', 
            'ethereum', 'ethereum', 
            'litecoin', 'litecoin', 
            'bitcoin', 'bitcoin', 
            'abtc'
        ];
        return [
            weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)],
            weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)],
            weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)]
        ];
    }

    function initializeSlots() {
        api.getBalance().then(balance => balanceElement.textContent = balance.data).catch(error => console.error(error));

        columns.forEach(column => {
            column.innerHTML = '';
            for (let i = 0; i < 3; i++) { // 3 символа для каждого барабана
                const randomSymbol = getRandomSymbols()[i];
                column.innerHTML += `<div class="slot"><img src="assets/images/slots/${randomSymbol}.svg" alt="${randomSymbol}"></div>`;
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
                    <div class="slot"><img src="assets/images/slots/${randomSymbols[0]}.svg" alt="${randomSymbols[0]}"></div>
                    <div class="slot"><img src="assets/images/slots/${randomSymbols[1]}.svg" alt="${randomSymbols[1]}"></div>
                    <div class="slot"><img src="assets/images/slots/${randomSymbols[2]}.svg" alt="${randomSymbols[2]}"></div>
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
        const allSymbols = columns.map(column => Array.from(column.children).map(child => child.querySelector('img').alt));

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

// Function to handle Telegram Login
function onTelegramAuth(user) {
    console.log('User ID:', user.id);
    console.log('First Name:', user.first_name);
    console.log('Last Name:', user.last_name);
    console.log('Username:', user.username);
}
