/* index.js */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/admin'); // 기본 설정에 따라 포트가 상이 할 수 있습니다.
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log("mongo db connection OK.");
});



var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var chatSchema = new mongoose.Schema({
  userId : String,
  message : String,
  Time : String,
  

});

var chat = mongoose.model('chat',chatSchema);


//소켓이 연결되었을때, 즉 사용자가 채팅에입장했을때.
io.sockets.on('connection', function (socket) {
  

  socket.on('login_member',function(data){
    chat.find({},function(err,chats){
      if(err){
           console.log("에러다")
      }else{
    console.log("메세지 전체 다 보냄");

    io.emit('msgAll'+data.id ,chats);
         }
      });  
    
    socket.name = data.id;
   console.log('한명의 유저가 접속을 했습니다.');
  
    
    socket.broadcast.emit('newUser',{id: data.id});

  });
  
      
 
//소켓 연결이 끊겼을때 , 즉 사용자가 나갔을때.
socket.on('disconnect', function () {
  
    console.log('한명의 유저가 접속해제를 했습니다.');
    io.emit('userOut',{id: socket.name});

   
});



 
socket.on('send_msg', function (data) {
  console.log(data.id);


  chat.create({userId:data.id,message:data.msg,Time:data.Time},function(err){
    if(err) {
      console.log("chat 생성실패")
    }
 }) 


 /*  chat.updateMany({userId:data.id},
    {$push :{message :data.msg}},function(err){
      if(err){
        console.log("업데이트 실패")
      }
    }); */
    
/*   chat.updateMany({userId:data.id},
    {$push :{Time :data.Time}},function(err){
      if(err){
        console.log("업데이트 실패")
      }
    }); */
 //   chat.updateMany({userId:data.id},
 //     {$push :{type :data.type}},function(err){
 //       if(err){
 //         console.log("업데이트 실패")
 //       }
 //     });

 // if(data.type=="user"){
 //     chat.updateMany({userId:data.id},
 //       {$push :{count :1}},function(err){
 //         if(err){
  //          console.log("업데이트 실패")
  //        }
  //      }); 
  //    }


//콘솔로 출력을 한다.
  console.log(data);
//다시, 소켓을 통해 이벤트를 전송한다.
  io.emit('send_msg', data);

  chat.find({},function(err,chats){
	  if(err){
	       console.log("에러다")
	  }else{
	 console.log("이건 업데이트 후 chats들 =-==============>>"+chats);
	io.emit('chats',chats);
	     }
	  });
});


   
//어드민 아이디 클릭시 대화내용 가져오기
socket.on("userId",function(data){
	chat.find({userId:data},function(err,chatOne){
		  if(err){
		       console.log("에러다")
		     }else{
		    	 console.log(chatOne);
		    	io.emit('chatOne',chatOne);
          }          
  });

  chat.updateOne({userId:data},
    {$unset :{count :1}},function(err){
      if(err){
        console.log("업데이트 실패")
      }
    }); 
    chat.find({},function(err,chats){
      if(err){
           console.log("에러다")
      }else{
     console.log(chats);
    io.emit('chats',chats);
         }
      });

  

});
//고객화면 대화리스트 가져오기
socket.on("userId2",function(data){
	
	chat.find({userId:data},function(err,chatOne){
		  if(err){
		       console.log("에러다")
		     }else{
		    	 console.log(chatOne);
		    	io.emit('chatOne2',chatOne);
          }          
  });

});

});
http.listen(82, function () {
    console.log('listening on *:82');
});