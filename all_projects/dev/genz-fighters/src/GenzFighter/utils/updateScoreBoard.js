
const userHealthScoreBoard = document.querySelector("#player-health");
const villainHealthScoreBoard = document.querySelector("#villain-health");
const userScoreBoard = document.querySelector("#score");
const dragonHealthRef = document.querySelector("#dragonHealth");
const gokuHealthRef = document.querySelector("#gokuHealth");
const kidbuHealthRef = document.querySelector("#kidbuHealth");

const gokuBody = document.querySelector("#villain-body-goku");
const villainBodyKidBuu = document.querySelector("#villain-body-kid-buu");

const debuggerText = document.querySelector("#debugger");

const totalHealth = 600;
let initialVillainHealth = 600;
let playerHealth = 100;
let score = 200;

const checkWinOrLooseUser = (currentScore, opponentScore) => {
  if (currentScore <= 0) {
    // loose
    debuggerText.setAttribute("value", "Game Over");

    return false;
  } else if (opponentScore <= 0) {
    // win
    debuggerText.setAttribute("value", "You Win");
  }
  return true;
};

export const updateScoreBoard = (type, value = 1) => {
  if (type === "userScore") {
    score -= value;
  } else if (type === "userHealth") {
    playerHealth -= value;
    const textToShow =
      "You: " +
      (checkWinOrLooseUser(playerHealth, initialVillainHealth)
        ? playerHealth
        : 0);

    userHealthScoreBoard.setAttribute("value", textToShow);
  } else if (type === "villainHealth") {
    if (initialVillainHealth <= 0) {
      initialVillainHealth = 0;
    }
    initialVillainHealth -= value;
    villainHealthScoreBoard.setAttribute(
      "value",
      "Computer :" + initialVillainHealth
    );
    
    // TODO: refactor
    if (initialVillainHealth <= 600 && initialVillainHealth > 500) {
      // totalHealth
      dragonHealthRef.setAttribute('value',  initialVillainHealth - (totalHealth - 100))
      // nothing
    } else if (initialVillainHealth <= 500 && initialVillainHealth > 300) {
      // blast
      const blast = document.querySelector("#enemy-explosion");
      blast.setAttribute("visible", true);
      blast.setAttribute("self-remove", { timeout: 100 });


      // remove villainBody
      const villainBody = document.querySelector("#villain-body");
      villainBody.setAttribute("self-remove", { timeout: 100 });
      villainBodyKidBuu.setAttribute("position", "2 -1 -1");

      userScoreBoard.setAttribute("value", "Defeat kidbuu and goku");
     
 
      kidbuHealthRef.setAttribute('value', initialVillainHealth - (totalHealth - 300))
      dragonHealthRef.setAttribute('visible', false)

    } else if (initialVillainHealth <= 300 && initialVillainHealth > 0) {
      // blast

      const blast = document.querySelector("#goku-explosion");
      blast.setAttribute("visible", true);
      blast.setAttribute("self-remove", { timeout: 100 });

      villainBodyKidBuu.setAttribute("self-remove", { timeout: 100 });
      userScoreBoard.setAttribute("value", "Defeat goku");


      gokuHealthRef.setAttribute('value', initialVillainHealth)
      kidbuHealthRef.setAttribute('visible', false)
     

    } else {
      // blast

      const blast = document.querySelector("#kidbuu-explosion");
      blast.setAttribute("visible", true);
      blast.setAttribute("self-remove", { timeout: 200 });
      gokuBody.setAttribute("self-remove", { timeout: 100 });
      userScoreBoard.setAttribute("value", "Yayyyy!!! You win!!!");

      gokuHealthRef.setAttribute('visible', false)
    }

  }
};
