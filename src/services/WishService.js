const WishModel=require('../models/WishModel')

const mongoose=require('mongoose')
const ObjectId=mongoose.Types.ObjectId;

const ReadWishListService=async (req)=>{
    try {
        let userId=new ObjectId(req.headers.userId)

        let dataFilterStage={$match:{userID:userId}};
        let joinWithProductStage={$lookup:{from:'products',localField:'productID',foreignField:'_id',as:'WishProduct'}}
        let unwindProductStage={$unwind:'$WishProduct'};

        let joinWithBrandStage={$lookup:{from:'brands',localField:'WishProduct.brandID',foreignField:'_id',as:'brand'}}
        let unwindBrandStage={$unwind:'$brand'};

        let joinWitCategoryStage={$lookup:{from:'categories',localField:'WishProduct.categoryID',foreignField:'_id',as:'category'}}
        let unwindCategoryStage={$unwind:'$category'};

        let projectionStage={$project:{'userID':0,'productID':0,'createdAt':0,'updatedAt':0,'WishProduct._id':0,
            'WishProduct.createdAt':0,'WishProduct.updatedAt':0,'category._id':0,'brand._id':0,'category.updatedAt':0,
                'category.createdAt':0,'brand.updatedAt':0,'brand.createdAt':0,
            }}

        let data=await WishModel.aggregate([
            dataFilterStage,
            joinWithProductStage,
            unwindProductStage,
            joinWitCategoryStage,
            unwindCategoryStage,
            joinWithBrandStage,
            unwindBrandStage,
            projectionStage
        ])

        return {status:'success',msg:'wish List showed Successfully',data:data}
    }catch (e) {
        return {status:'failed',msg:'wish not found',err:e.toString()}
    }
}

const SaveWishListService=async (req)=>{
    try{
        let userId=req.headers.userId;
        let reqBody=req.body;
        reqBody.userID=userId;
        let data=await WishModel.updateOne(reqBody,{$set:reqBody},{upsert:true})
        return {status:'success',msg:'wish List added Successfully',data:data}
    }catch (e) {
        return {status:'failed',msg:'wish List not added',err:e.toString()}
    }
}

const RemoveWishListService=async (req)=>{
    try{
        let userId=req.headers.userId;
        let reqBody=req.body;
        reqBody.userID=userId;
        await WishModel.deleteOne(reqBody)
        return {status:'success',msg:'wish List Deleted Successfully'}
    }catch (e) {
        return {status:'failed',msg:'Remove Failed',err:e.toString()}
    }
}

module.exports={
    ReadWishListService,
    SaveWishListService,
    RemoveWishListService
}