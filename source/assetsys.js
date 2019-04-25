var assetsys = {
	"ver": "040319.1000",
	"update_summary": {
		"040319.1000": "Changed function name saveasset to update_asset. Added incoming and outgoing update queues for updating asset properties.",
		"031619.2245": "Re-write number three, finally got it simplified and 95% completed!",
		"031019.2230": "Finalized code for socket on assetlist.",
		"030219.2150": "Began work on hasassets io listener."
	},
	"name": 'AssetSys',
	"outgoing_queue": { //holds parts of objects needing updated remotely, used to send to peers and universe
		
	},
	"incoming_queue": { //holds parts of objects needing updated on this viewer
		
	},
	"init": () => {
		socket.on('assetlist', (tile,alist) => {
			window.assetsys.asset_list(tile,alist);
		});
		socket.on('asset', (a) => { //incoming asset from universe, base64 encoded
			let asset = atob(a);
			window.rezsys.rezfromdata(asset);
		});
	},
	"get_list": (tile) => { //stage 1: get list of assets associated with tile
		window.assetsys.toget = {}; //list of assets we don't have locally with md5
		//add current peers to window.assetsys.peer_assets, new peers will be ignored
		for(var i=0; i<Object.keys(window.comms.peers).length; i++){
			let pid = Object.keys(window.comms.peers)[i];
			window.assetsys.peer_assets[pid] = {};
		}
		socket.emit('assetlist',tile);
	},
	"asset_list": (tile,alist) => { //stage 2: receive asset list from universe
		let list = JSON.parse(alist);
		//check local storage for assets
		for(var i=0; i<Object.keys(list).length; i++){
			var aid = Object.keys(list)[i];
			var md5 = list[aid][0];
			window.filesys.readfile(aid,tile, (e) => { //we have it locally, check MD5 checksum
				let md = window.md5(e);
				if(md==md5){ //matches, rez it
					window.rezsys.rezfromdata(e);
				}
			}, (e) => {
				if (e.code == FileError.NOT_FOUND_ERR){ //don't have it locally, add to toget list
					window.assetsys.toget[aid] = md5;
				}
			});
		}
		//ask each peer if they have the assets
		for(var i=0; i<Object.keys(window.assetsys.peer_assets).length; i++){
			let pid = Object.keys(window.assetsys.peer_assets)[i];
			window.assetsys.peer_timers[pid] = setTimeout(window.assetsys.timer_expire(pid),2000);
			var msg = '{"o":"0", "s":"0", "cid":"'+window.uid+'", "t":"'+tile+'", "al":"'+window.assetsys.toget+'"}';
			window.comms.send(pid,msg);
		}
		//if no peers, get assets from universe
		if(Object.keys(window.comms.peers).length==0){
			for(var i=0; i<Object.keys(window.assetsys.toget).length; i++){
				var aid = Object.keys(window.assetsys.toget)[i];
				var md5 = window.assetsys.toget[aid][0];
				socket.emit('getasset',aid,md5);
			}
		}
	},
	"p_assets": (alist,tile,pid) => { //stage 3: process incoming assets from peers
		//heard back from peer, stop and remove timer, remove peer from window.assetsys.peer_assets
		clearTimeout(window.assetsys.peer_timers[pid]);
		delete window.assetsys.peer_timers[pid];
		delete window.assetsys.peer_assets[pid];
		//now process the assets from peer
		for(var i=0; i<alist.length; i++){
			let aid1 = alist[i];
			for(var ii=0; ii<Object.keys(window.assetsys.toget).length; ii++){
				let aid2 = window.assetsys.toget[ii];
				if(aid1==aid2){ //asset still needed, remove from list then rez it
					delete window.assetsys.toget[ii];
					//ask peer for the asset
					var msg = '{"o":"0", "s":"2", "cid":"'+window.uid+'", "a":"'+aid1+'"}';
					window.comms.send(pid,msg);
				}
			}
		}
		window.assetsys.get_clean();
	},
	"timer_expire": (pid) => {//time expired, remove peer from queue but leave window.assetsys.toget alone
		delete window.assetsys.peer_timers[pid];
		delete window.assetsys.peer_assets[pid];
		window.assetsys.get_clean();
	},
	"get_clean": () => { //check if any assets still need to be fetched if no peers left
		if(Object.keys(window.assetsys.toget).length>0 && Object.keys(window.assetsys.peer_assets).length==0){
			//we will now request the assets from universe
			for(var i=0; i<Object.keys(window.assetsys.toget).length; i++){
				var aid = Object.keys(window.assetsys.toget)[i];
				var md5 = window.assetsys.toget[aid][0];
				socket.emit('getasset',aid,md5);
			}
		}
	},
	"get_asset": (aid,cb=null) => { //load an asset and return it
		if(cb!==null){
			window.filesys.readfile(aid,'mesh', (d) => {
				cb(d);
			});
		} else window.console.log('[AssetSys] Function getasset requires a callback as 2nd parameter.');
	},
	"update_asset": (aid,tile,data) => { //update an asset
		
	},
	"attach": (a,ap) => { //get and attach an asset to attach point
		
	}
};
window.console.log('[AssetSys] Loaded.');