import { gunsInfo } from "../utils/gunsData";

const sceneEl = document.querySelector("a-scene");
const controllerEl = document.getElementById("rightController");
const debuggerText = document.querySelector("#debugger");
const gunDroppingSound = document.querySelector("#gun-dropping-sound");
const gunGrabbingSound = document.querySelector("#gun-loading-sound");


const allGunFireSoundRef = gunsInfo.map(gun => {
  const gunSoundRef = document.querySelector("#" + gun.fireSoundId);
  return gunSoundRef;
});

const allControllerGunsRef = gunsInfo.map(gun => {
  const gunSoundRef = document.querySelector("#" + gun.controllerGunId);
  return gunSoundRef;
});

const gunAmmoCurrentState = gunsInfo.reduce((prev, current) => {
  const obj = {
    ...prev
  };
  obj[current.gunIndex] = current.ammo;
  return obj;
}, {});

//  -----------------------------------------
// helpers ----------------------------------
// ------------------------------------------
const controllerShoot = (gunIndex) => {
  debuggerText.setAttribute('value', gunIndex)
  const bullet = document.createElement("a-entity");
  const gunData = gunsInfo[gunIndex];

  try {
    const gunFireSoundRef = allGunFireSoundRef[gunIndex];
    gunFireSoundRef.components.sound.stopSound();
    gunFireSoundRef.components.sound.playSound();
  } catch (err) {
    debuggerText.setAttribute('value', err?.message)
  }

  const position = new THREE.Vector3();
  controllerEl.object3D.getWorldPosition(position);
  bullet.setAttribute("position", position);

  const direction = new THREE.Vector3();
  controllerEl.object3D.getWorldDirection(direction);

  bullet.setAttribute("gltf-model", '#' + gunData.bullet.assetId);
  bullet.setAttribute("scale", gunData.bullet.scale);
  bullet.setAttribute("velocity", direction.multiplyScalar(-20));
  bullet.setAttribute("data-isbullet", "true");
  bullet.setAttribute("class", "collidable");
  bullet.setAttribute("id", "bullet");
  bullet.setAttribute("data-damage", gunData.bullet.damage);

  // xplosion.setAttribute("self-remove", { timeout: 100 });

  bullet.setAttribute("dynamic-body", "shape:box; mass:0");
  bullet.setAttribute("collide-detect", null);
  sceneEl.appendChild(bullet);

};
function resetEnvGunState(gunIndex) {
  if (!gunIndex) {
    return
  };
  setTimeout(() => {
    const initialInfo = (gunsInfo)[gunIndex];
    if (!initialInfo?.envGunId) return;

    gunAmmoCurrentState[gunIndex] = initialInfo.ammo;
    const gunRef = document.querySelector("#" + initialInfo.envGunId);
    gunRef.setAttribute("position", initialInfo.position);
    gunRef.setAttribute("visible", true);

  }, 2000);
}
function getPickedGunDomId(index) {
  return `#gun${index}-picked`;
}
function resetControllerGunState(gunId) {
  if (!gunId) return;
  allControllerGunsRef.forEach(gun => {
    gun.setAttribute('visible', false)
  })
}
//  -----------------------------------------
// helpers ----------------------------------
// ------------------------------------------



AFRAME.registerComponent("collider-check-right", {
  dependencies: ["raycaster"],

  init: function () {
    this.el.addEventListener("raycaster-intersection", function (e) {
      //-- get selected object
      if (!!e.detail.els.length && e.detail.els[0]?.dataset?.isgun) {
        this.selectedObj = e.detail.els[0];
      }
    });

    //-- grip button pressed
    this.el.addEventListener("gripdown", function (e) {
      this.grip = true;
      if (!this.selectedObj.dataset?.isgun) return;
      // play the grabbing sound
        try {
          gunGrabbingSound.components.sound.stopSound();
          gunGrabbingSound.components.sound.playSound();
        } catch (err) {
          debuggerText.setAttribute('value', err?.message)
        }
    });

    //-- grip button released
    this.el.addEventListener("gripup", function (e) {
      this.grip = false;
      if (!this.selectedObj) return;
      const gunIndex = this.selectedObj?.dataset?.gunindex;
      resetControllerGunState(gunIndex);
      resetEnvGunState(gunIndex);
      // dropping sound
      try {
        gunDroppingSound.components.sound.stopSound();
        gunDroppingSound.components.sound.playSound();
      } catch (err) {
        debuggerText.setAttribute('value', err?.message)
      }
      this.selectedObj = null;
    });

    // shooting
    //-- trigger button pressed
    this.el.addEventListener("triggerdown", function () {
      if (!this.grip) return;
      if (!this.selectedObj) return;
      const gunIndex = this.selectedObj.dataset.gunindex;
      if (gunAmmoCurrentState[gunIndex]) {
        gunAmmoCurrentState[gunIndex]--;
        controllerShoot(gunIndex);
      } else {
        debuggerText.setAttribute("value", "Please select another gun");
      }
    });
  },

  tick: function () {
    if (!this.el.selectedObj) return;
    if (!this.el.grip) return;

    // grabbing objects 
    // const rayCast = this.el.getAttribute("raycaster").direction;

    // const pos = new THREE.Vector3(rayCast.x, rayCast.y, rayCast.z);
    // pos.normalize();

    // //-- final destination of object will be 2m in front of ray
    // pos.multiplyScalar(0.1);

    // //-- convert to world coordinate
    // this.el.object3D.localToWorld(pos);

    // //Move selected object to follow the tip of raycaster.
    // this.el.selectedObj.object3D.position.set(pos.x, pos.y, pos.z);

    // if (this.el.selectedObj.components["dynamic-body"]) {
    //   this.el.selectedObj.components["dynamic-body"].syncToPhysics();
    // }
  
    const isGun = this.el?.selectedObj?.dataset?.isgun;
    if (!isGun) return;
    const gunId = this.el.selectedObj?.dataset?.gunindex;

    // steps of picking up the guns :
    // now we are getting the reference of the gun asset which are inside controller 
    // 1. will visible that gun
    // 2. hide the gun in open env
    const gunRef = document.querySelector(getPickedGunDomId(gunId));
    gunRef?.setAttribute('visible', true)
    this.el.selectedObj.setAttribute('visible', false)
   
  }
});


