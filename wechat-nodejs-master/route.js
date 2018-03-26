module.exports = function(app){
	app.get('/', function(req, res){
		res.render('index', {issuccess: 'success'});
	});

	app.get('/interface', function(req, res){
		var token="weixin";//wechat token

		//fetch parameters from wechat server
		var signature = req.query.signature;
		var timestamp = req.query.timestamp;
		var echostr   = req.query.echostr;//random string
		var nonce     = req.query.nonce;//random number

		//sort token, timestamp and nonce
		var oriArray = new Array();
		oriArray[0] = nonce;
		oriArray[1] = timestamp;
		oriArray[2] = token;
		oriArray.sort();

		//encryption
		var original = oriArray.join('');
		console.log(original);
		var crypto = require('crypto');
		var shaSum = crypto.createHash('sha1');
		shaSum.update(original);
		var shaResult = shaSum.digest('hex');

		if(signature===shaResult){//validation success
			res.send(echostr);
		}
		else{//validation fail
			res.send('wechat validation failed!');
		}
	});

	app.post('/interface', function(req, res){
		var post_data="";
		req.on("data",function(data){post_data=data;});
		req.on("end",function(){
			var xmlStr=post_data.toString('utf-8',0,post_data.length);
			/*---------------receive messages from wechat server starts-----------------*/
			var xml=require('node-xml');
			// 定义解析存储变量
			var ToUserName="";
			var FromUserName="";
			var CreateTime="";
			var MsgType="";
			var Content="";
			var tempName="";
			//开始解析消息
			var parse=new xml.SaxParser(function(cb){
    			cb.onStartElementNS(function(elem,attra,prefix,uri,namespaces){
         			tempName=elem;
    			});
    			cb.onCharacters(function(chars){
        			chars=chars.replace(/(^\s*)|(\s*$)/g, "");
        			if(tempName=="CreateTime"){
            			CreateTime=chars;
        			}
    			});
    			cb.onCdata(function(cdata){
            		if(tempName=="ToUserName"){
                		ToUserName=cdata;
            		}else if(tempName=="FromUserName"){
                		FromUserName=cdata;
            		}else if(tempName=="MsgType"){
                		MsgType=cdata;
            		}else if(tempName=="Content"){
                		Content=cdata;
            		}
            		console.log(tempName+":"+cdata);
        		});
   				cb.onEndElementNS(function(elem,prefix,uri){
         			tempName="";
   				});
   				cb.onEndDocument(function(){
          			//按收到的消息格式回复消息
   				});
			});
 			parse.parseString(xmlStr);
 			/*---------------receive messages from wechat server ends-----------------*/

			/*---------------send messages to wechat server starts--------------*/
			CreateTime=parseInt(new Date().getTime() / 1000);
			if(MsgType==="text"){
				var msg="Thanks for following, what you said is: "+Content;
				var sendMessage="<xml><ToUserName><![CDATA["+FromUserName+"]]></ToUserName><FromUserName><![CDATA["+ToUserName+"]]></FromUserName><CreateTime>"+CreateTime+"</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA["+msg+"]]></Content></xml>";
    			res.send(sendMessage);
			}
			/*---------------send messages to wechat server ends--------------*/
		});
	});
}