var filesys = {
	"ver": "042519.0300",
	"update_summary": {
		"042519.0300": "Removed references to window.debug.",
		"022519.0110": "Minor code revisions."
	},
	//Direct Storage System
	"dfs_read": function(file,callback,en,enc){
		var d;
		dfs.readFile(file,"utf8",function(error,data){
			//decode
			if(en) d = window.atob(data);
			else d = data;
			//decrypt
			if(enc) d = window.cryptsys.decrypt(d);
			if(callback) callback(d);
			else window.funcsys.dolog('[DFS] Callback required for DFS calls!');
		});
	},
	"dfs_write": function(file,callback,en,data,enc,bin){ //file name,callback,encoded?,data, encrypt it?
		var d;
		//encrypt
		if(enc) d = window.cryptsys.encrypt(data);
		else d = data;
		//encode
		if(en) d = window.btoa(d);
		//write the file
		if(bin){ //binary
			var stream = dfs.createWriteStream(file);
			stream.on('error', function(e) { window.console.error(e); });
			stream.write(data);
			stream.end();
		} else { //non-binary
			dfs.writeFile(file,d,function(err){
				if(err) return console.error(err);
			});
		}
		if(callback) callback(d);
		else window.funcsys.dolog('[DFS] Callback required for DFS calls!');
	},
	//Local Storage System
	"savefile": function(file,dir,contents,callback){
		window.filesys.remfile(file,dir); //remove file before creating file to fix blob overright issue
		if(!dir){dir = '/';}
		if(dir.slice(1) != '/'){dir='/'+dir;} //must start with /
		if(dir.slice(-1) != '/'){dir+='/';} //must end with /
		fs.root.getDirectory(dir, {create: true}, function(de){
			fs.root.getFile(dir+file, {create: true}, function(fe){
				fe.createWriter(function(fw){
					fw.onwriteend = function(e){
						window.funcsys.dolog('[Saved File] '+fe.name);
					};
					fw.onerror = function(e){
						window.funcsys.dolog('[Write Failed] '+e.toString());
					};
					var blob = new Blob([contents], {type: 'text/plain'});
					fw.write(blob);
				}, function(e){window.funcsys.dolog('[File Writer Failed] '+e.toString());});
			}, function(e){window.funcsys.dolog('[Get File Failed] '+e.toString());});
		}, function(e){window.funcsys.dolog('[Directory Error] '+e.toString());});
	},
	"readfile": function(file,dir,callback){
		if(!callback){
			window.funcsys.dolog('[Read File] Callback required!');
			return false;
		}
		if(!dir) dir = '/';
		if(dir.slice(1) != '/') dir='/'+dir; //must start with /
		if(dir.slice(-1) != '/') dir+='/'; //must end with /fs=null;
		fs.root.getFile(dir+file, {create: false}, function(fe){
			fe.file(function(f){
				var reader = new FileReader();
				var res;
				reader.onloadend = function(e){
					callback(decodeURIComponent(this.result));
				};
				reader.readAsText(f);
			});
		});
	},
	"remfile": function(file,dir,callback){
		if(!dir) dir = '/';
		if(dir.slice(1) != '/') dir='/'+dir; //must start with /
		if(dir.slice(-1) != '/') dir+='/'; //must end with /
		fs.root.getFile(dir+file, {create: false}, function(fe){
			fe.remove(function(){
				window.funcsys.dolog('[File Removed] '+fe.name);
			}, function(e){
				window.funcsys.dolog('[Delete Failed] '+e.toString());
			});
		}, function(e){
			window.funcsys.dolog('[Get File Failed] '+e.toString());
		});
		//Try to remove directory if empty if not root
		if(dir != '/'){
			fs.root.getDirectory(dir, {}, function(de){
				de.remove(function(){
					window.funcsys.dolog('[Directory Deleted] '+de.name);
				},function(e){
					window.funcsys.dolog('[Directory Delete Error] '+e.toString());
				});
			});
		}
	},
	"dirlist": function(dir,callback){
		if(!dir) dir = '/';
		fs.root.getDirectory(dir, {}, function(de){
			var dirReader = de.createReader();
			var entries = [];
			var readEntries = function(){
				dirReader.readEntries (function(results){
				  if(!results.length){
					callback(entries);
				  } else {
					entries.push(results);
					readEntries();
				  }
				}, function(e){
					window.funcsys.dolog('');
				});
			};
			readEntries();
		});
	}
};
window.console.log('[FileSys] Loaded.');