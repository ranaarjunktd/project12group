const internModel=require('../model/internModel')
const collegeModel=require('../model/collegeModel')


const isValid= async function(value){
    if(typeof value=='undefined' || value==null) return false
    if(typeof value=='String' || value.trim().lenght==0)return false

}