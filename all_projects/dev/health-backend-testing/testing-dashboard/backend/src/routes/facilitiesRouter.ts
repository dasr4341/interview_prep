import { Router } from 'express';
import { listFacilitiesController } from '../modules/controller/facilities/listFacilitiesController';

export default (router: Router) => {
    router.post('/facilities/list', listFacilitiesController);
}