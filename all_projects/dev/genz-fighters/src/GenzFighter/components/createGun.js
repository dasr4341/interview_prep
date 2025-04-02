import { gunsInfo } from "../utils/gunsData";

function createGun() {
  gunsInfo.forEach(info => {
    const gunRef = document.querySelector('#' + info.envGunId);
    if (!gunRef) return;
    setTimeout(() => {
      gunRef.setAttribute("visible", "true");
    }, info.visibleIn);
  })
}
createGun();
