const GAMES = {
    megaMillions: {
        spanID: "mega-millions",
        pools: [
            {
                name: "White Balls",
                numPicks: 5,
                min: 1,
                max: 70
            },
            {
                name: "Mega Ball",
                numPicks: 1,
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
    console.log("in choose");
    let i = 0;
    let result = [];
    for (let pool of gameDefinition.pools) {
        let poolResult = [];
        for (let pickNum = 1; pickNum <= pool.numPicks; pickNum++) {
            if (i >= randomSourceArray.length) {
                throw 'not enough source numbers met criteria';
            }
            let tempPick = randomSourceArray[i];
            while (
                !isWithinRange(pool, tempPick) ||
                poolResult.includes(tempPick)
            ) {
                i++;
                tempPick = randomSourceArray[i];
            }
            poolResult.push(tempPick);
            console.log(poolResult);
        }
        result.push(poolResult);
    }
    return result;
}

function populateGameChoices(randomSourceArray) {
    for (k in GAMES) {
        let gameDefinition = GAMES[k];
        let results = chooseNumsForGame(gameDefinition, randomSourceArray);
        let resultString = ""
        for (const [i, pool] of results.entries()) {
            resultString += gameDefinition.pools[i].name + ": ";
            resultString += pool.join(" ") + "<br />";
        }
        document.getElementById(gameDefinition.spanID).innerHTML = resultString;
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
