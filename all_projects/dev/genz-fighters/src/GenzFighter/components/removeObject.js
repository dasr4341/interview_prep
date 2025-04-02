// remove projectile objects
AFRAME.registerComponent("self-remove", {
  schema: {
    timeout: { type: "number", default: 2000 },
  },

  init: function () {
    const movingPlatform = document.getElementById("mybox");
    let element = this.el;
    setTimeout(function () {
      if (movingPlatform) {
       movingPlatform?.removeChild(element);
      }
    }, this.data.timeout);
  },
});
