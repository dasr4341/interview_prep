import { Router } from "express";
import { getSourceSystemData, getSourceSystemFacilityUser } from "../modules/controller/sourceSystem/sourceSystem.controller";
import hasSourceSystemType from "../middleWare/hasSourceSystemType";

export default (router: Router) => {
    router.get('/source-system/facilityList/:sourceSystemType', hasSourceSystemType, getSourceSystemFacilityUser);
    router.post('/source-system/:sourceSystemType', hasSourceSystemType, getSourceSystemData )
}