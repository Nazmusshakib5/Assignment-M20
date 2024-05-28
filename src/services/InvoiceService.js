const mongoose=require('mongoose');
const CartModel=require('../models/CartModel')
const ProfileModel=require('../models/ProfileModel')
const InvoiceModel=require('../models/InvoiceModel')
const InvoiceProductModel=require('../models/InvoiceProductModel')
const PaymentSettingModel=require('../models/PaymentSettingModel')
const ObjectId=mongoose.Types.ObjectId;
const formData=require('form-data');
const axios=require('axios')


const CreateInvoiceService=async (req)=>{
    try{
        const userId=new ObjectId(req.headers.userId);
        const cus_email=req.headers.email;

        //step 1: Bring The Products In cart List,Number of cart Items
        let matchingStage={$match:{userID:userId}}
        let joinWithProduct={$lookup:{from:'products',localField:'productID',foreignField:'_id',as:'product'}}
        let unwindProduct={$unwind:'$product'}

        const CartProducts=await CartModel.aggregate([matchingStage,joinWithProduct,unwindProduct])

        //step 2: Calculate The Total ,Payable and Vat
        let total=0,payable=0,Vat=0;
        let price=0;
        CartProducts.forEach((element)=>{
            price=element['product']['discount']?parseFloat(element['product']['discountPrice']):
                parseFloat(element['product']['price']);
            total+=price*parseInt(element['qty'])
        })

        Vat=total * 0.05;
        payable=total+Vat;


        //transaction id and validation id
        let trans_id=Math.floor(100000000+Math.random()*900000000);
        let val_id=0;

        //customer and shipping details and status
        let profile=await ProfileModel.aggregate([matchingStage])
        let cus_details= `name:${profile[0]['cus_name']},country:${profile[0]['cus_country']},address:${profile[0]
            ['cus_add']},phone:${profile[0]['cus_phone']}`;
        let ship_details= `name:${profile[0]['ship_name']},country:${profile[0]['ship_country']},address:${profile[0]
            ['ship_add']},phone:${profile[0]['ship_phone']}`;
        let delivery_status='pending'
        let payment_status='pending'


        //Create Invoice
        let Invoice=await InvoiceModel.create({
            userID:userId,
            payable:payable,
            cus_details:cus_details,
            ship_details:ship_details,
            tran_id:trans_id,
            val_id:val_id,
            delivery_status:delivery_status,
            payment_status:payment_status,
            total:total,
            vat:Vat
        })

        //Create Invoice Product Model
        let InvoiceID=Invoice['_id']
        CartProducts.forEach(async (element)=>{
           await InvoiceProductModel.create({
               userID:userId,
               invoiceID:InvoiceID,
               productID:element['productID'],
               qty:element['qty'],
               price:element['product']['discount']?parseFloat(element['product']['discountPrice']):
                   parseFloat(element['product']['price']),
               color:element['color'],
               size:element['size']
           })
        })


        //Delete All the Cart Items
        await CartModel.deleteMany({userID:userId})



        //SSL Commerce
        let paymentSettings=await PaymentSettingModel.find();

        const form=new formData()
        form.append('store_id',paymentSettings[0]['store_id'])
        form.append('store_passwd',paymentSettings[0]['store_passwd'])
        form.append('total_amount',payable.toString())
        form.append('currency',paymentSettings[0]['currency'])
        form.append('tran_id',trans_id)
        form.append('success_url',`${paymentSettings[0]['success_url']}/${trans_id}`)
        form.append('fail_url',`${paymentSettings[0]['fail_url']}/${trans_id}`)
        form.append('cancel_url',`${paymentSettings[0]['cancel_url']}/${trans_id}`)
        form.append('ipn_url',`${paymentSettings[0]['ipn_url']}/${trans_id}`)


        form.append('cus_name',profile[0]['cus_name'])
        form.append('cus_email',cus_email)
        form.append('cus_add1',profile[0]['cus_add'])
        form.append('cus_add2',profile[0]['cus_add'])
        form.append('cus_city',profile[0]['cus_city'])
        form.append('cus_state',profile[0]['cus_state'])
        form.append('cus_postcode',profile[0]['cus_postcode'])
        form.append('cus_country',profile[0]['cus_country'])
        form.append('cus_phone',profile[0]['cus_phone'])
        form.append('cus_fax',profile[0]['cus_fax'])



        form.append('shipping_method','YES')


        form.append('ship_name',profile[0]['ship_name'])
        form.append('ship_add1',profile[0]['ship_add'])
        form.append('ship_add2',profile[0]['ship_add'])
        form.append('ship_city',profile[0]['ship_city'])
        form.append('ship_state',profile[0]['ship_state'])
        form.append('ship_country',profile[0]['ship_country'])
        form.append('ship_postcode',profile[0]['ship_postcode'])
        form.append('product_name','According to invoice')
        form.append('product_category','According to invoice')
        form.append('product_profile','According to invoice')
        form.append('product_amount','According to invoice')

        let SSLres=await axios.post(paymentSettings[0]['init_url'],form)



        return {status:'success',msg:'Invoice Created',data:SSLres.data}

    }catch (e) {
        return {status:'failed',msg:'Invoice not Created',err:e.toString()}
    }
}



const PaymentSuccessService=async (req)=>{
    try{
        const transId=req.params.transID;
        await InvoiceModel.updateOne({tran_id:transId},{payment_status:'success'})
        return {status:'success'}
    }catch (e) {
        return {status:'failed',msg:'Invoice not Created',err:e.toString()}
    }
}

const PaymentFailService=async (req)=>{
    try{
        const transId=req.params.transID;
        await InvoiceModel.updateOne({tran_id:transId},{payment_status:'failed'})
        return {status:'failed'}
    }catch (e) {
        return {status:'failed',msg:'Invoice not Created',err:e.toString()}
    }

}

const PaymentCancelService=async (req)=>{
    try{
        const transId=req.params.transID;
        await InvoiceModel.updateOne({tran_id:transId},{payment_status:'cancel'})
        return {status:'cancel'}
    }catch (e) {
        return {status:'failed',msg:'Invoice not Created',err:e.toString()}
    }

}

const PaymentIPNService=async (req)=>{
    try{
        const transId=req.params.transID;
        const status=req.body['status'];
        await InvoiceModel.updateOne({tran_id:transId},{payment_status:status})
        return {status:'IPN'}
    }catch (e) {
        return {status:'failed',msg:'Invoice not Created',err:e.toString()}
    }
}

const InvoiceListService=async (req)=>{
    try{
        const userId=req.headers.userId;
        const data = await InvoiceModel.find({userID:userId})
        return {status:'success',data:data}
    }catch (e) {
        return {status:'failed',msg:'Invoice not Created',err:e.toString()}
    }

}

const InvoiceProductListService=async (req)=>{

    try{
        const userId=new ObjectId(req.headers.userId);
        const invoice_id=new ObjectId(req.params.invoice_id);

        let matchingStage={$match:{userID:userId,invoiceID:invoice_id}}
        let joinWithProduct={$lookup:{from:'products',localField:'productID',foreignField:'_id',as:'product'}}
        let unwindProduct={$unwind:'$product'}

        const data = await InvoiceProductModel.aggregate([
            matchingStage,
            joinWithProduct,
            unwindProduct
        ])
        return {status:'success',data:data}
    }catch (e) {
        return {status:'failed',msg:'Invoice not Created',err:e.toString()}
    }


}


module.exports={
    CreateInvoiceService,
    PaymentSuccessService,
    PaymentFailService,
    PaymentCancelService,
    PaymentIPNService,
    InvoiceListService,
    InvoiceProductListService
}