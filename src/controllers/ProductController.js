const {
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
} = require('../services/ProductService')




// Retrieving List data

exports.ProductBrandList=async (req,res)=>{
    const data=await BrandListService()
    return  res.status(200).json(data);
}

exports.ProductCategoryList=async (req,res)=>{
    const data=await CategoryListService()
    return  res.status(200).json(data);
}

exports.ProductSliderList=async (req,res)=>{
    const data=await SliderListService()
    return  res.status(200).json(data);
}

//Filtering BY brand Category similar  keyword remark

exports.ProductListByBrand=async (req,res)=>{
    const data=await ListByBrandService(req)
    return  res.status(200).json(data);
}

exports.ProductListByCategory=async (req,res)=>{
    const data=await ListByCategoryService(req)
    return  res.status(200).json(data);
}

exports.ProductListBySimilar=async (req,res)=>{
    const data=await ListBySimilarService(req)
    return  res.status(200).json(data);
}

exports.ProductListByKeyword=async (req,res)=>{
    const data=await ListByKeywordService(req)
    return  res.status(200).json(data);
}

exports.ProductListByRemark=async (req,res)=>{
    const data=await ListByRemarkService(req)
    return  res.status(200).json(data);
}

//specific product details

exports.ProductDetails=async (req,res)=>{
    const data=await ProductDetailService(req)
    return  res.status(200).json(data);
}


//  fetching and creating Review

exports.ProductReviewList=async (req,res)=>{
    const data=await ReviewListService(req)
    return  res.status(200).json(data);
}

exports.CreateReview=async (req,res)=>{
    const data=await CreateReviewService(req)
    return  res.status(200).json(data);
}


