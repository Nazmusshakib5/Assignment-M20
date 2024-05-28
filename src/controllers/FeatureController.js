const {FeaturesListService} = require("../services/FeatureService");

exports.FeaturesList=async (req,res)=>{
    const data=await FeaturesListService(req)
    return  res.status(200).json(data);
}