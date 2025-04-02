import { updateScoreBoard } from "../utils/updateScoreBoard";

const swordHitSoundRef = document.querySelector("#sword-hit-sound");

AFRAME.registerComponent("collider-check-left", {
  dependencies: ["raycaster"],

  init: function () {
    const movingPlatform = document.getElementById("mybox");

    this.el.addEventListener("raycaster-intersection", function (e) {
      this.selectedObj = e.detail.els[0];
      const isGun = Boolean(this.selectedObj?.dataset?.isgun);
      const isUserBody = Boolean(this.selectedObj?.dataset?.isuserbody);
      const isSword = Boolean(this.selectedObj?.dataset?.issword);
      if (isGun || isUserBody || isSword) {
        return;
      }
      try {
        swordHitSoundRef.components.sound.stopSound();
        swordHitSoundRef.components.sound.playSound();
      } catch (err) {
        debuggerText.setAttribute('value', err?.message)
      }

      //--explosion--
      const pos = this.selectedObj.getAttribute("position");

      // TODO : change animation :IMP ****
      const xplosion = document.createElement("a-entity");
      xplosion.setAttribute("gltf-model", "#explosion-gltf");
      xplosion.setAttribute("scale", "0.03 0.03 0.03");
      xplosion.setAttribute("color", "yellow");
      xplosion.setAttribute("position", pos);
      xplosion.setAttribute("self-remove", { timeout: 100 });
      movingPlatform.appendChild(xplosion);

      // OLD  CODE ****
      // const xplosion = document.createElement("a-sphere");
      // xplosion.setAttribute("radius", "0.5");
      // xplosion.setAttribute("opacity", "0.1");
      // xplosion.setAttribute("emissive", "#FFFFFF");
      // xplosion.setAttribute("color", "yellow");
      // xplosion.setAttribute("position", pos);
      // xplosion.setAttribute("self-remove", { timeout: 100 });

      const selectedObjectId = this.selectedObj.getAttribute("id");
      this.selectedObj.parentNode.removeChild(this.selectedObj);

      if (selectedObjectId === "virus-green") {
        updateScoreBoard("userScore", 10);
      }
      if (selectedObjectId === "virus-red") {
        updateScoreBoard("userScore", 20);
      }
      if (selectedObjectId === "virus-blue") {
        updateScoreBoard("userScore", 30);
      }
    });

    this.el.addEventListener("raycaster-intersection-cleared", function (e) {
      this.selectedObj = null;
    });
  }
});
