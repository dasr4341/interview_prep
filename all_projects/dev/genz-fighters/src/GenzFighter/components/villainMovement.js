const movingPlatform = document.getElementById("mybox");

AFRAME.registerComponent("movement", {
  tick: function () {
    if (
      JSON.stringify(movingPlatform.getAttribute("position")) ===
      JSON.stringify({ x: -1, y: 1, z: -10 })
    ) {
      movingPlatform.setAttribute(
        "animation",
        "property:position; to: 1 1 -10; dur: 5000;"
      );
    } else if (
      JSON.stringify(movingPlatform.getAttribute("position")) ===
      JSON.stringify({ x: 1, y: 1, z: -10 })
    ) {
      movingPlatform.setAttribute(
        "animation",
        "property:position; to: -1 1 -10; dur: 5000;"
      );
    }
  },
});
