var config = {
	baseBet: { value: 1500, type: 'balance', label: 'Base bet'},
	gamesToWait: { value: 5, type: 'text', label: 'Games to cool down after a win'}
}

//3x chasing script by @Cannonball
//Feel free to tip, as is it a free script
//Also feel free to ping me if you got questions
//Will continuously chase 3x
//->Will wait the cooldown value you set
//-->Will bet "base bet" value for two games, then do an addition of the two last amount that we have bet
//Has logging functionalities, press F12

var currentBet = config.baseBet.value;
var cooldown = 0;
var isBettingNow = false;
var numberOf3xCashedOut = 0;
var userProfit = 0;
var currentStreakBets = [];

log('FIRST LAUNCH | WELCOME!');

engine.on('GAME_STARTING', function () {
    log('');
    log('NEW GAME')
    log('Profit since starting the script: ' + userProfit / 100 + ' bits. Got ' + numberOf3xCashedOut + ' times 3x.');
    if(cooldown == 0){
        engine.bet(currentBet, 3);
        currentStreakBets.push(currentBet);
        log("Betting " + currentBet / 100 + " bits this game.");
        isBettingNow = true;
    }else{
        log("Cooldown for the next " + cooldown + " games...");
        isBettingNow = false;
    }
});

engine.on('GAME_ENDED', function () {
    let gameInfos = engine.history.first();
    if(isBettingNow){
        if (!gameInfos.cashedAt) {
            //Lost
            log('Lost...');
            userProfit -= currentBet;
            if(currentStreakBets.length > 1){
                currentBet = currentStreakBets[currentStreakBets.length - 1] + currentStreakBets[currentStreakBets.length - 2];
            }
        } else {
            //Won
            log('Won!');
            userProfit += currentBet*3;
            cooldown = config.gamesToWait.value;
            currentStreakBets = [];
            numberOf3xCashedOut++;
        }
    }else{
        if(cooldown > 0){
            log("Decrementing cooldown...");
            cooldown--;
        }
    }
    log('END GAME');
});