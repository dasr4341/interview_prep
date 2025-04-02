import { updateScoreBoard } from "../utils/updateScoreBoard";

// ----------------------------------------------------
AFRAME.registerComponent("user-body", {
  init: function () {
    const ele = this.el;
    this.el.addEventListener("collide", function (e) {
      const isProjectile = Boolean(e.detail.body.el?.dataset?.isuserdestroyer);

      if (isProjectile) {
        ele.components.haptics.pulse(0.5, 200);
        updateScoreBoard("userHealth");
      }
    });
  },
});
