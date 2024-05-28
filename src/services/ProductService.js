

const BrandModel=require('../models/BrandModel')
const CategoryModel=require('../models/CategoryModel')
const ProductDetailModel=require('../models/ProductDetailModel')
const ProductModel=require('../models/ProductModel')
const ProductReviewModel=require('../models/ProductReviewModel')
const ProductSliderModel=require('../models/ProductSliderModel')


const mongoose=require('mongoose')
const ObjectId=mongoose.Types.ObjectId;

const BrandListService=async ()=>{
    try{
        const data=await BrandModel.find()
        return {status:'success',data:data}
    }catch(e){
        return {status:'failed',data:e.toString()}
    }
}
const CategoryListService=async ()=>{
    try{
        const data=await CategoryModel.find()
        return {status:'success',data:data}
    }catch(e){
        return {status:'failed',data:e.toString()}
    }
}
const SliderListService=async ()=>{
    try{
        const data=await ProductSliderModel.find()
        return {status:'success',data:data}
    }catch(e){
        return {status:'failed',data:e.toString()}
    }
}

const ListByBrandService=async (req)=>{
    try{
        const BrandID=new ObjectId(req.params.BrandID);
        let matchingStage={$match:{brandID:BrandID}}
        let joinWithBrandStage={$lookup:{from:'brands',localField:'brandID',foreignField:'_id',as:'brand'}}
        let joinWithCategoryStage={$lookup:{from:'categories',localField:'categoryID',foreignField:'_id',as:'category'}}
        let unwindBrandStage={$unwind:'$brand'}
        let unwindCategoryStage={$unwind:'$category'}
        let projectionStage={$project:{'brandID':0,'categoryID':0,'brand._id':0,'category._id':0}}
        const data=await ProductModel.aggregate([
            matchingStage,
            joinWithBrandStage, joinWithCategoryStage,
            unwindBrandStage,unwindCategoryStage,
            projectionStage
        ])
        return {status:'success',data:data}

    }catch (e){
        return {status:'failed',data:e.toString()}
    }
}
const ListByCategoryService=async (req)=>{
    try{
        const CategoryID=new ObjectId(req.params.CategoryID);
        let matchingStage={$match:{categoryID:CategoryID}}
        let joinWithBrandStage={$lookup:{from:'brands',localField:'brandID',foreignField:'_id',as:'brand'}}
        let joinWithCategoryStage={$lookup:{from:'categories',localField:'categoryID',foreignField:'_id',as:'category'}}
        let unwindBrandStage={$unwind:'$brand'}
        let unwindCategoryStage={$unwind:'$category'}
        let projectionStage={$project:{'brandID':0,'categoryID':0,'brand._id':0,'category._id':0}}
        const data=await ProductModel.aggregate([
            matchingStage,
            joinWithBrandStage, joinWithCategoryStage,
            unwindBrandStage,unwindCategoryStage,
            projectionStage
        ])
        return {status:'success',data:data}

    }catch (e){
        return {status:'failed',data:e.toString()}
    }
}
const ListByRemarkService=async (req)=>{
    try{
        const Remark=req.params.Remark;
        let matchingStage={$match:{remark:Remark}}
        let joinWithBrandStage={$lookup:{from:'brands',localField:'brandID',foreignField:'_id',as:'brand'}}
        let joinWithCategoryStage={$lookup:{from:'categories',localField:'categoryID',foreignField:'_id',as:'category'}}
        let unwindBrandStage={$unwind:'$brand'}
        let unwindCategoryStage={$unwind:'$category'}
        let projectionStage={$project:{'brandID':0,'categoryID':0,'brand._id':0,'category._id':0}}
        const data=await ProductModel.aggregate([
            matchingStage,
            joinWithBrandStage, joinWithCategoryStage,
            unwindBrandStage,unwindCategoryStage,
            projectionStage
        ])
        return {status:'success',data:data}

    }catch (e){
        return {status:'failed',data:e.toString()}
    }
}
const ListBySimilarService=async (req)=>{
    try{
        const CategoryID=new ObjectId(req.params.CategoryID);
        let matchingStage={$match:{categoryID:CategoryID}}
        let limitStage={$limit:10}
        let joinWithBrandStage={$lookup:{from:'brands',localField:'brandID',foreignField:'_id',as:'brand'}}
        let joinWithCategoryStage={$lookup:{from:'categories',localField:'categoryID',foreignField:'_id',as:'category'}}
        let unwindBrandStage={$unwind:'$brand'}
        let unwindCategoryStage={$unwind:'$category'}
        let projectionStage={$project:{'brandID':0,'categoryID':0,'brand._id':0,'category._id':0}}
        const data=await ProductModel.aggregate([
            matchingStage,limitStage,
            joinWithBrandStage, joinWithCategoryStage,
            unwindBrandStage,unwindCategoryStage,
            projectionStage
        ])
        return {status:'success',data:data}

    }catch (e){
        return {status:'failed',data:e.toString()}
    }
}
const ListByKeywordService=async (req)=>{
    try{
        let searchRegex={"$regex":req.params.Keyword,"$options":"i"}
        let searchParams=[{title:searchRegex},{shortDes:searchRegex}]
        let searchQuery={$or:searchParams}

        let matchingStage={$match:searchQuery}

        let joinWithBrandStage={$lookup:{from:'brands',localField:'brandID',foreignField:'_id',as:'brand'}}
        let joinWithCategoryStage={$lookup:{from:'categories',localField:'categoryID',foreignField:'_id',as:'category'}}

        let unwindBrandStage={$unwind:'$brand'}
        let unwindCategoryStage={$unwind:'$category'}

        let projectionStage={$project:{'brandID':0,'categoryID':0,'brand._id':0,'category._id':0}}

        const data=await ProductModel.aggregate([
            matchingStage,
            joinWithBrandStage, joinWithCategoryStage,
            unwindBrandStage,unwindCategoryStage,
            projectionStage
        ])
        return {status:'success',data:data}

    }catch (e){
        return {status:'failed',data:e.toString()}
    }
}


const ProductDetailService=async (req)=>{
    try{
        const ProductID=new ObjectId(req.params.ProductID);
        let matchingStage={$match:{_id:ProductID}}

        let joinWithBrandStage={$lookup:{from:'brands',localField:'brandID',foreignField:'_id',as:'brand'}}
        let joinWithCategoryStage={$lookup:{from:'categories',localField:'categoryID',foreignField:'_id',as:'category'}}
        let joinWithDetailsStage={$lookup:{from:'productdetails',localField:'_id',foreignField:'productID',as:'detail'}}

        let unwindBrandStage={$unwind:'$brand'}
        let unwindCategoryStage={$unwind:'$category'}
        let unwindDetailsStage={$unwind:'$detail'}
        let projectionStage={$project:{'brandID':0,'categoryID':0,'brand._id':0,'category._id':0}}
        const data=await ProductModel.aggregate([
            matchingStage,
            joinWithBrandStage, joinWithCategoryStage,joinWithDetailsStage,
            unwindBrandStage,unwindCategoryStage,unwindDetailsStage,
            projectionStage
        ])
        return {status:'success',data:data}

    }catch (e){
        return {status:'failed',data:e.toString()}
    }
}

const ReviewListService=async (req)=>{
 try{
     const ProductID=new ObjectId(req.params.ProductID)
     let matchingStage={$match:{productID:ProductID}}
     let joinWithProfileStage={$lookup:{from:'profiles',localField:'userID',foreignField:'userID',as:'profile'}}
     let unwindProfileStage={$unwind:'$profile'}
     let projectionStage={$project:{'des':1,'rating':1,'profile.cus_name':1}}

     const data=await ProductReviewModel.aggregate([
         matchingStage,joinWithProfileStage,
         unwindProfileStage,projectionStage
     ]);
     return {status:'success',data:data}

 }catch (e) {
     return {status:'failed',data:e.toString()}
 }
}

const CreateReviewService=async (req)=>{
    try{
        const userId=req.headers.userId;
        const reqBody=req.body;
        reqBody.userID=userId;
        const data=await ProductReviewModel.create(reqBody)
        return {status:'success',data:data}

    }catch (e) {
        return {status:'failed',data:e.toString()}
    }
}


module.exports={
    BrandListService,
    CategoryListService,
    SliderListService,
    ListByBrandService,
    ListByCategoryService,
    ListBySimilarService,
    ListByKeywordService,
    ListByRemarkService,
    ProductDetailService,
    ReviewListService,
    CreateReviewService
}
