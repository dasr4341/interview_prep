import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { Exception } from "../lib/Exception.lib.js";
import { messageData } from "../lib/message.lib.js";
import { cartModelGenerator } from "../modal/cartModal.js";

export default class CartController {
	async getAllProducts(req: Request, res: Response, next: NextFunction) {
		try {
			const cartModel = cartModelGenerator();
			const response = await cartModel.find({});

			return res.status(StatusCodes.OK).json({
				success: true,
				message: messageData.success.dataRetrievedSuccessFull,
				data: response,
			});
		} catch (e) {
			return next(e);
		}
	}
	async addToCart(req: Request, res: Response, next: NextFunction) {
		try {
			const products = req.body?.cart;
			// TODO : JOI
			if(!products?.length){
				throw new Exception(messageData.error.invalidData('product details not found'), StatusCodes.BAD_REQUEST, null);
			}

			const cartModel = cartModelGenerator();
			const response =  await cartModel.insertMany(products)

			return res.status(StatusCodes.OK).json({
				success: true,
				message: messageData.success.dataRetrievedSuccessFull,
				data: response,
			});

		} catch (e) {
			return next(e);
		}
	}
	async addToCart1(req: Request, res: Response, next: NextFunction) {
		try {
			const products = req.body?.cart;
			// TODO : JOI
			if(!products?.length){
				throw new Exception(messageData.error.invalidData('product details not found'), StatusCodes.BAD_REQUEST, null);
			}

			const cartModel = cartModelGenerator();
			const response =  await cartModel.insertMany(products)

			return res.status(StatusCodes.OK).json({
				success: true,
				message: messageData.success.dataRetrievedSuccessFull,
				data: response,
			});

		} catch (e) {
			return next(e);
		}
	}
	async removeAllProducts(req: Request, res: Response, next: NextFunction) {
		try {
			const cartModel = cartModelGenerator();
			const response = await cartModel.deleteMany({});

			return res.status(StatusCodes.OK).json({
				success: true,
				message: messageData.success.dataRetrievedSuccessFull,
				data: response,
			});
		} catch (e) {
			return next(e);
		}
	}
	async updateCartItemQuantityById(req: Request, res: Response, next: NextFunction) {
		try {
			const { productId } = req.params;
			const quantity = req.body.quantity;
			
			// TODO : JOI
			if(!quantity || !productId){
				throw new Exception(messageData.error.invalidData('product details not found'), StatusCodes.BAD_REQUEST, null);
			}

			const cartModel = cartModelGenerator();
			const response = await cartModel.updateOne({ _id: productId }, { $set: { quantity: Number(quantity) }  }, {upsert: true});

			return res.status(200).json({
				success: true,
				message: "All data",
				data: response,
			});
		} catch (e) {
			return next(e);
		}
	}
}
