import { updateScoreBoard } from "../utils/updateScoreBoard";

AFRAME.registerComponent("collide-detect", {
  init: function () {
    this.el.addEventListener("collide", function (e) {
      // ent.parentNode.removeChild(e.detail.body.el);
      try {
        const isProjectile = Boolean(
          e.detail.body.el?.dataset?.isuserdestroyer
        );

        if (isProjectile) {
          // bullet collide with enemy bullet
        }

        // villain is shoot
        const villainbodyshielddragon = Boolean(
          e.detail.body.el?.dataset?.villainbodyshielddragon
        );

        // villainbodyshielddragon
        // villainbodyshieldkidbuu
        // villainbodyshieldgoku

        if (villainbodyshielddragon) {
          const bulletDamage = e.detail.target.el?.dataset?.damage;
          updateScoreBoard("villainHealth", Number(bulletDamage));
        }
        // TODO
        // this.el.parentNode.removeChild(e.detail.target.el)
      } catch (err) {}
    });
  },
});
