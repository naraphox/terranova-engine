var comms = {
	"ver": "042019.2250",
	"update_summary": {
		"042019.2250": "Moved socket.on registered to core module.",
		"042019.2110": "Made changes to socket.on registered listener for new developer key check status.",
		"031519.2300": "Fixed p2p system to not have to route through TURN all the time!"
	},
	"peers": {},
	"local": {},
	"name": 'Comms', //what is the name of this module
	"init": function(d){
		/* Socket.io Stuff */
		socket.on('reconnect', (attemptNumber) => {
			window.comms.reg();
			//todo: rejoin each room
			
		});
		socket.on('joined', (room,digest) => { //server telling our client it has joined and offering list of clients in the room
			window.funcsys.dolog('['+window.comms.name+'] Joined room '+room);
			window.funcsys.dolog('['+window.comms.name+'] Room '+room+' has '+(digest.length)+' clients in it');
			window.funcsys.dolog('['+window.comms.name+'] Room '+room+' clients (includes this viewer): '+digest);
			for(var i=0; i < digest.length; i++){ //add to client list, please move me to an async function!
				if(digest[i] != window.uid){
					var rid = digest[i];
					if(typeof window.clients[rid] == "undefined"){
						window.clients[rid]={};
						window.clients[rid].rooms=[];
					}
					window.clients[rid].rooms.push(room); //add to clients if not our own id
				}
			}
		});
		socket.on('join', (room,rid,conf) => { //received when someone joined same room this client is in
			window.funcsys.dolog('['+window.comms.name+'] '+rid+' connected to room '+room);
			//check if client object exists, if not create it, add room to client object, add avatar
			if(typeof window.clients[rid] == "undefined"){
				window.clients[rid]={};
				window.clients[rid].rooms=[];
				if(typeof window.comms.peers[rid] == "undefined"){
					window.comms.peers[rid] = new SimplePeer({
						"initiator": false,
						"trickle": false,
						"config": {
							//"iceTransportPolicy": "relay",
							"iceServers": [
								{"urls": "stun:stun.l.google.com:19302"},
								{"urls": "stun:stun.services.mozilla.com"},
								{"urls": "stun:stun.skyway.io:3478"},
								{"urls": "turn:universe.werescape.com?transport=udp", "username": "werescape2", "credential": "d9duhjo9hs89ghs9"}
							]
						}
					});
					window.comms.peers[rid].on('error', function(e){window.funcsys.dolog('[p2p] Error: ', e);});
					window.comms.peers[rid].on('connect', function(){
						window.funcsys.dolog('[p2p] Connected to '+rid);
						window.comms.peers[rid].on('data', function(data){
							window.comms.dproc(data);
						});
					});
					window.comms.peers[rid].on('signal', function(data){
						window.comms.signal(JSON.stringify(data),rid); //send offer to remote peer
					});
					socket.emit('jconf',window.uid,rid,window.displayname);
				}
				var cnfg = JSON.parse(conf);
				window.avisys.addactor(rid,cnfg.name); //todo: add mesh uid param after name param
			}
			window.clients[rid].rooms.push(room);
		});
		socket.on('jconf', function(from,dname){
			if(typeof window.comms.peers[from] == "undefined"){
				window.funcsys.dolog('['+window.comms.name+'] Attempting to open p2p connection to ('+from+')');
				if(typeof window.comms.peers[from] == "undefined"){
					window.comms.peers[from] = new SimplePeer({
						"initiator": true,
						"trickle": false,
						"config": {
							//"iceTransportPolicy": "relay",
							"iceServers": [
								{"urls": "stun:stun.l.google.com:19302"},
								{"urls": "stun:stun.services.mozilla.com"},
								{"urls": "stun:stun.skyway.io:3478"},
								{"urls": "turn:universe.werescape.com?transport=udp", "username": "werescape2", "credential": "d9duhjo9hs89ghs9"}
							]
						}
					});
					window.comms.peers[from].on('error', function(e){window.funcsys.dolog('[p2p] Error: ', e);});
					window.comms.peers[from].on('connect', function(){
						window.funcsys.dolog('[p2p] Connected to '+from);
						window.avisys.addactor(from,dname);
					});
					window.comms.peers[from].on('data', function(data){
						window.comms.dproc(data);
					});
					window.comms.peers[from].on('signal', function(data){
						window.comms.signal(JSON.stringify(data),from); //send answer to remote peer
					});
				}
			}
		});
		socket.on('leave', function(room,rid){ //when someone has left a room this client is in
			window.funcsys.dolog('['+window.comms.name+'] '+rid+' has left room '+room);
			//Remove from the local room list
			window.clients[rid].rooms.splice(window.clients[rid].rooms.indexOf(room),1);
			//Now we check if they remain in any other room this client is in, if not close p2p connection
			if(window.clients[rid].rooms.length==0){ //close remote peer connection if they aren't in any of the rooms, remove avatar
				window.comms.close(rid);
			}
		});
		socket.on('signal', function(data,from){
			var json = JSON.parse(data);
			var cont = 0;
			if(json.type == "offer" && from != window.uid && window.offers[from] == undefined){window.offers[from] = data; cont=1;}
			else if(json.type == "answer" && from != window.uid && window.answers[from] == undefined){window.answers[from] = data; cont=1;}
			else if(typeof json["candidate"] == "object" && from != window.uid && window.candidates[from] == undefined){window.candidates[from] = data; cont=1;}
			if(from != window.uid && cont != 0){window.comms.peers[from].signal(json); window.funcsys.dolog('['+window.comms.name+' Signal] Data: '+data);}
		});
		socket.on('chat', (rid,msg,dname) => {
			if(rid==null){
				new window.Noty({
					type: 'alert',
					queue: 'chat',
					text: '<b>'+dname+':</b> '+libbase64.decode(msg).toString(),
					container: '.chatlog',
					closeWith: []
				}).show();
				new window.Noty({
					type: 'alert',
					queue: 'chat2',
					text: '<b>'+dname+':</b> '+libbase64.decode(msg).toString(),
					container: '.tempchat',
					timeout: 5000,
					progressBar: false
				}).show();
				$(".chatlog").stop().animate({ scrollTop: $(".chatlog")[0].scrollHeight}, 1000);
			} else {
				
			}
		});
		socket.on('utime', function(utime){
			if(window.timeoverride==false) window.sunorbdelta=utime;
		});
	},
	"reg": function(){ //register and set unique id
		window.funcsys.dolog('['+window.comms.name+'] Registering with presence server..');
		socket.emit('reg',window.uid);
	},
	"join": function(tile){ //join room with name of the tile id provided
		socket.emit('join',tile,window.displayname);
	},
	"leave": function(tile){ //leave room with name of tile id provided
		socket.emit('leave',tile);
	},
	"close": function(id){
		for(var i=0; i < scene.animationGroups.length; i++){
			if(scene.animationGroups[i].targetedAnimations[0].target._parentNode.parent.id == id || scene.animationGroups[i].targetedAnimations[0].target._parentNode == null){
				scene.animationGroups[i].dispose();
				delete scene.animationGroups[i];
			}
		}
		delete window.animations[id];
		delete window.offers[id];
		delete window.answers[id];
		delete window.candidates[id];
		window.watersys.waterit(id+'_body',0);
		window.shadowsys.sgshadow(id+'_body',0);
		window.comms.peers[id].destroy();
		delete window.comms.peers[id];
		window[id].phys.physicsImpostor.dispose();
		window[id].phys.dispose();
		window[id].dispose();
		delete window.clients[id];
	},
	"send": async function(id,data){ //async as to be non-blocking, udp send
		if(id!=undefined&&id!=null&&id!='') window.comms.peers[id].send(data); //send to specific viewer
		else { //send to all connected viewers
			for(var i=0; i < Object.keys(window.comms.peers).length; i++) window.comms.peers[Object.keys(window.comms.peers)[0]].send(data);
		}
	},
	"signal": function(data,rid){
		socket.emit('signal',data,rid);
	},
	"dproc": function(data){ //process received p2p data
		var json = JSON.parse(data);
		var op = json.o;
		var sop = json.s;
		var cid = json.cid.toString();
		var t = json.t;
		switch(op){
			case "0": //get asset list
				switch(sop){
					case "0": //get list of assets associated with given tile, send to requesting peer
						var assets = json.al;
						let have = [];
						for(var i=0; i<Object.keys(assets).length; i++){
							let aid = Object.keys(assets)[i];
							let md5 = assets[aid][0];
							window.filesys.readfile(aid,t,function(e){
								let md = window.md5(e);
								if(md==md5){
									have.push(aid);
								}
							});
						}
						var msg = '{"o":"0", "s":"1", "cid":"'+window.uid+'", "t":"'+tile+'", "al":"'+have+'"}';
						window.comms.send(cid,msg);
					break;
					case "1": //receiving asset list from remote peer
						var assets = json.al;
						window.assetsys.p_assets(assets,t,cid);
					break;
					case "2": //remote peer asking for an asset
						var aid = json.a;
						window.assetsys.get_asset(aid, (d) => {
							var msg = '{"o":"0", "s":"3", "cid":"'+window.uid+'", "d":"'+btoa(d)+'"}';
							window.comms.send(cid,msg);
						});
					break;
					case "3": //response from remote peer with actual asset
						var d = atob(json.d);
						window.rezsys.rezfromdata(d);
					break;
				}
			break;
			case "1": //move/rotate
				switch(sop){
					case "0": //idle
						var p = json.p; //final position, to be sure they are in right spot
						var r = json.r; //final rotation, to be sure facing right way
						delete window.move[cid];
						delete window.rotate[cid];
						if(window.animations[cid].current!=0) window.animations[cid].states["idle"]();
						window[cid].phys.position=new window.BABYLON.Vector3(p.x,p.y,p.z);
						window[cid].phys.rotationQuaternion=new window.BABYLON.Quaternion(parseFloat(r.x),parseFloat(r.y),parseFloat(r.z),parseFloat(r.w));
					break;
					case "1": //position update
						switch(t){
							case "0": //walk
								if(window.animations[cid].current!=1) window.animations[cid].states["walk"]();
							break;
							case "1": //backup
								if(window.animations[cid].current!=1) window.animations[cid].states["walk"]();
							break;
							case "2": //run
								if(window.animations[cid].current!=1) window.animations[cid].states["run"]();
							break;
							case "3": //fly
								if(window.animations[cid].current!=1) window.animations[cid].states["fly"]();
							break;
							case "4": //swim
								if(window.animations[cid].current!=1) window.animations[cid].states["swim"]();
							break;
						}
						if(!(cid in window.move)) window.move[cid] = {"type": t};
					break;
					case "2": //rotation update
						switch(t){
							case "0": //rotate left ani
								
							break;
							case "1": //rotate right ani
								
							break;
						}
						if(!(cid in window.rotate)) window.rotate[cid] = {"type": t};
					break;
					case "3": //stop rotation
						var r = json.r; //final rotation, to be sure facing right way
						if(cid in window.rotate){
							delete window.rotate[cid];
							window[cid].phys.rotationQuaternion=new window.BABYLON.Quaternion(parseFloat(r.x),parseFloat(r.y),parseFloat(r.z),parseFloat(r.w));
						}
					break;
				}
			break;
		}
	},
	//Inform clients of movement
	"idle": function(){
		var pos = '{"x":'+window.actor.phys.position.x+', "y":'+window.actor.phys.position.y+', "z":'+window.actor.phys.position.z+'}';
		var rot = '{"x":'+window.actor.phys.rotationQuaternion.x+', "y":'+window.actor.phys.rotationQuaternion.y+', "z":'+window.actor.phys.rotationQuaternion.z+', "w":'+window.actor.phys.rotationQuaternion.w+'}';
		var msg = '{"o":"1", "s":"0","p":'+pos+',"r":'+rot+',"cid": "'+window.uid+'"}';
		window.comms.send(null,msg);
	},
	"norot": function(){
		var rot = '{"x":'+window.actor.phys.rotationQuaternion.x+', "y":'+window.actor.phys.rotationQuaternion.y+', "z":'+window.actor.phys.rotationQuaternion.z+', "w":'+window.actor.phys.rotationQuaternion.w+'}';
		var msg = '{"o":"1", "s":"3", "r":'+rot+',"cid": "'+window.uid+'"}';
		window.comms.send(null,msg);
	},
	"moveav": function(t){
		var msg = '{"o":"1", "s":"1", "cid":"'+window.uid+'", "t":"0"}';
		window.comms.send(null,msg); //add check to see if already moving or not
	},
	//Inform clients of rotation change
	"rotateav": function(t){
		var msg = '{"o":"1", "s":"2", "cid":"'+window.uid+'", "t":"'+t+'"}';
		window.comms.send(null,msg);
	},
	//Send Chat Message
	"sendchat": async function(rid,msg,type=0){
		var digest = [];
		if(type==0){ //normal local, includes 3m and 5m
			digest = digest.concat(window.radar['3m']);
			digest = digest.concat(window.radar['5m']);
		}
		if(type==1){ //whisper local
			digest = digest.concat(window.radar['3m']);
		}
		if(type==2){ //shout local, includes 3m, 5m, 25m
			digest = digest.concat(window.radar['3m']);
			digest = digest.concat(window.radar['5m']);
			digest = digest.concat(window.radar['25m']);
		}
		if(digest.length==0) digest = 0;
		var data = '{"op":"chat", "data": "'+libbase64.encode(msg)+'"}';
		socket.emit('chat',rid,data,digest,window.displayname);
		new window.Noty({
			type: 'alert',
			queue: 'chat',
			text: '<span style="font-weight:bold;color:#254f02;">'+window.displayname+':</span> '+msg,
			container: '.chatlog',
			closeWith: []
		}).show();
		new window.Noty({
			type: 'alert',
			queue: 'chat2',
			text: '<span style="font-weight:bold;color:#254f02;">'+window.displayname+':</span> '+msg,
			container: '.tempchat',
			timeout: 5000,
			progressBar: false
		}).show();
		$(".chatlog").stop().animate({ scrollTop: $(".chatlog")[0].scrollHeight}, 1000);
	}
};
window.console.log('[Comms] Loaded.');