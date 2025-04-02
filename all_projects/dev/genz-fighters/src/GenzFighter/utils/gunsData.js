// TODO : make this obj an array of guns

export const gunsInfo = [
  {
    gunIndex: 0,
    visibleIn: 1000,
    ammo: "10000",
    envGunId: "gun0",
    controllerGunId: "gun0-picked",
    fireSoundId: "gun0-fire-sound",
    scale: "0.001 0.001 0.001",
    rotation: "0 180 0",
    position: "0.5 0.4 -1",
    bullet: {
      assetId: "gun0-bullet-asset",
      scale: " 0.4 0.4 0.4",
      damage: 1,
    },
  },
  {
    gunIndex: 1,
    visibleIn: 500,
    ammo: "10000",
    envGunId: "gun1",
    controllerGunId: "gun1-picked",
    fireSoundId: "gun1-fire-sound",
    scale: "0.2 0.2 0.2",
    rotation: "0 90 0",
    position: "-0.5 1 -1",
    bullet: {
      assetId: "gun1-bullet-asset",
      scale: "0.2 0.2 0.2",
      damage: 2,
    },
  },
  {
    gunIndex: 2,
    visibleIn: 800,
    ammo: "10000",
    envGunId: "gun2",
    controllerGunId: "gun2-picked",
    fireSoundId: "gun2-fire-sound",
    scale: "0.001 0.001 0.001",
    rotation: "0 180 0",
    position: "0.5 2 -0.8",
    bullet: {
      assetId: "gun2-bullet-asset",
      scale: " 0.009 0.009 0.009",
      damage: 4,
    },
  },
];
