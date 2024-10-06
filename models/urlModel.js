var mongoose = require('mongoose');
var shortid = require('shortid')
var mongoosePaginate = require('mongoose-paginate-v2');
var urlSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    addedtime : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : [true,'Title is required']
    }
    ,
    fullurl : {
        type : String,
        required : [true, 'Url is required'],
        match: [/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\/\w-]*)*\/?(\?.*)?(#.*)?$/, 'Please enter a valid URL']
    },
    shorturl : {
        type : String,
        required : true,
        default : shortid.generate
    }
})

urlSchema.plugin(mongoosePaginate);

var Url = mongoose.model('Url',urlSchema);
module.exports = Url;