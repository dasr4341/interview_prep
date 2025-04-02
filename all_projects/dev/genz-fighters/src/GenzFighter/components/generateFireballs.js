
const cameraRigRef = document.getElementById("cameraRig");
const fireSoundRef = document.getElementById('enemy-fire-sound');

const randomHealthObjects = [
  { target: "#apple", scale: "0.1 0.1 0.1", id: "apple" },
  { target: "#pear", scale: "0.02 0.02 0.02", id: "pear" },
];
const bullets = [
  { target: "#virus-green", scale: "0.2 0.2 0.2", id: "virus-green" },
  { target: "#virus-red", scale: "0.2 0.2 0.2", id: "virus-red" },
  { target: "#virus-blue", scale: "0.04 0.04 0.04", id: "virus-blue" },
];

function shootRandom (obj, animationDuration, scene) {
  const entity = document.createElement("a-entity");
  const xPos = 2 * Math.random();
  const yPos = 1.5 * Math.random();

  entity.setAttribute("gltf-model", obj.target);
  entity.setAttribute("id", obj.id);
  entity.setAttribute("scale", obj.scale);
  entity.setAttribute("dynamic-body", "shape:box; mass:0");
  entity.setAttribute("position", { x: xPos, y: yPos, z: 0 });
  entity.setAttribute("animation", {
    property: "position",
    to: { x: 0.4, z: 10 },
    dur: animationDuration,
  });
  entity.setAttribute("data-isuserdestroyer", "true");
  entity.setAttribute("class", "collidable");
  entity.setAttribute("self-remove", { timeout: animationDuration });
  try {
    fireSoundRef.components.sound.stopSound();
    fireSoundRef.components.sound.playSound();
  } catch (err) {
    debuggerText.setAttribute('value', err?.message)
  }
  scene.appendChild(entity);
}
function controllerShoot (obj, animationDuration, scene) {

  const entity = document.createElement("a-entity");
  const position = new THREE.Vector3();
  cameraRigRef.object3D.getWorldPosition(position);

  const direction = new THREE.Vector3();
  cameraRigRef.object3D.getWorldDirection(direction);

  entity.setAttribute("position", position);
  entity.setAttribute("velocity", direction.multiplyScalar(10));

  entity.setAttribute("gltf-model", obj.target);
  entity.setAttribute("id", obj.id);
  entity.setAttribute("scale", obj.scale);
  entity.setAttribute("dynamic-body", "shape:box; mass:0");

  entity.setAttribute("data-isuserdestroyer", "true");
  entity.setAttribute("class", "collidable");

  entity.setAttribute("self-remove", { timeout: animationDuration });
  try {
    fireSoundRef.components.sound.stopSound();
    fireSoundRef.components.sound.playSound();
  } catch (err) {
    debuggerText.setAttribute('value', err?.message)
  }

  scene.appendChild(entity);
};

AFRAME.registerComponent("generator", {
  init: function () {
    const scene = this.el;
    setInterval(function () {
      const index = Math.floor(Math.random() * bullets.length);
     
      controllerShoot(bullets[index], 1500, scene);
    }, 2000);

    setInterval(function () {
      const index = Math.floor(Math.random() * bullets.length);
      shootRandom(bullets[index], 1500, scene);
    }, 3000);

  },
});
