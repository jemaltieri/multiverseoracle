const GAMES = {
    megaMillions: {
        spanID: "mega-millions",
        choices: [
            {
                min: 1,
                max: 70
            },
            {
                min: 1,
                max: 70
            },
            {
                min: 1,
                max: 70
            },
            {
                min: 1,
                max: 70
            },
            {
                min: 1,
                max: 70
            },
            {
                min: 1,
                max: 25
            },
        ]
    }
};


function isWithinRange(range, num) {
    return (num <= range.max && num >= range.min);
}

function chooseNumsForGame(gameDefinition, randomSourceArray) {
    let i = 0;
    let result = [];
    for (choice of gameDefinition.choices) {
        while (i < randomSourceArray.length &&
            !isWithinRange(choice, randomSourceArray[i])) {
                i++;
            }
        if (i >= randomSourceArray.length) {
            throw 'not enough source numbers met criteria';
        }
        result.push(randomSourceArray[i]);
        i++;
    }
    return result;
}

function populateGameChoices(randomSourceArray) {
    for (k in GAMES) {
        let gameDefinition = GAMES[k];
        let nums = chooseNumsForGame(gameDefinition, randomSourceArray);
        document.getElementById(gameDefinition.spanID).innerHTML = nums.join(" ");
    }
}

function populateWaitingMessage() {
    for (k in GAMES) {
        let spanID = GAMES[k].spanID;
        document.getElementById(spanID).innerHTML = "Decohering... please wait";
    }
}

function consultOracle() {
    populateWaitingMessage();
    fetch('https://qrng.anu.edu.au/API/jsonI.php?length=1024&type=uint8')
    .then(response => {
        return response.json()
    })
    .then(data => {
        populateGameChoices(data.data);
    })
    .catch(err => {
        // Do something for an error here
    })
}
