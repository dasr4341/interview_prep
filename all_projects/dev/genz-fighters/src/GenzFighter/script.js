import "./components/villainMovement.js";
import "./components/createGun.js";
import "./components/generateFireballs.js";
import "./components/removeObject.js";
import "./components/manageUserHealth.js";
import "./components/bulletCollisionDetect.js";
import "./components/leftController.js";
import "./components/rightController.js";

const arButton = document.querySelector(".a-enter-ar");

arButton.onclick = () => {
  const scene = document.querySelector("a-scene");
  scene.enterAR();
};
