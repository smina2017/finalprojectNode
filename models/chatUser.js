var chatSchema = new mongoose.Schema({
    userId : String,
    msg : String,
    Time : String,
    type : String,
    Count : Number
  
  })
  
module.exports = mongoose.model('chat',chatSchema);