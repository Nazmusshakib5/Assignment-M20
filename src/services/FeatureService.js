const FeatureModel = require("../models/FeatureModel");

const FeaturesListService=async (req)=>{
    try{
        const data = await FeatureModel.find()
        return {status:'success',data:data}
    }catch (e) {
        return {status:'failed',msg:'Invoice not Created',err:e.toString()}
    }

}
module.exports={FeaturesListService}