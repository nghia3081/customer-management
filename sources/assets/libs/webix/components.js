if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

webix.protoUI({
	name:"ckeditor",
	$init:function(config){
		this.$view.className += " webix_selectable";
		this._waitEditor = webix.promise.defer();
	},
	defaults:{
		borderless:true,
		language:"vi",
		toolbar:[
		{ name: 'document', items: [ 'Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
		{ name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
		{ name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
		{ name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
		'/',
		{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
		{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
		{ name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
		{ name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
		'/',
		{ name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
		{ name: 'colors', items: [ 'TextColor', 'BGColor' ] },
		{ name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
		{ name: 'about', items: [ 'About' ] }
	]
	},
	_init_ckeditor_once:function(){
		var tid = this.config.textAreaID = "t"+webix.uid();
		this.$view.innerHTML = "<textarea id='"+tid+"'>"+this.config.value+"</textarea>";

		this._3rd_editor = CKEDITOR.replace( this.config.textAreaID, {
				toolbar: this.config.toolbar,
				language: this.config.language,
				width:this.$width -2,
				height:this.$height - 44
			});
			this._waitEditor.resolve(this._3rd_editor);

		this._init_ckeditor_once = function(){};
	},
	_set_inner_size:function(x, y){
		if (!this._3rd_editor || !this._3rd_editor.container || !this.$width) return;
		this._3rd_editor.resize(x, y);
	},
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this, x, y)){
			this._init_ckeditor_once();
			this._set_inner_size(x,y);
		}
	},
	setValue:function(value){
		this.config.value = value;
		if (this._3rd_editor)
			this._3rd_editor.setData(value);
		else webix.delay(function(){
			this.setValue(value);
		},this,[],100);
	},
	getValue:function(){
		return this._3rd_editor?this._3rd_editor.getData():this.config.value;
	},
	focus:function(){
		this._focus_await = true;
		if (this._3rd_editor)
			this._3rd_editor.focus();
	},
	getEditor:function(waitEditor){
		return waitEditor?this._waitEditor:this._3rd_editor;
	}
}, webix.ui.view);

webix.protoUI({
	name: "autonumeric",
	defaults:{
		maximumValue: 999999999,
		minValue: -999999999,
		decimalPlaces: 0
	},        
    $init:function(config){ 
		
		this.$view.className += " webix_el_text";
		this._waitEditor = webix.promise.defer(); 
		
		this.attachEvent("onAfterRender", webix.once(function(){
			
			var el = this.$view.getElementsByTagName("input")[0];
			//el.setAttribute("style","text-align:right");

			var options = {
				maximumValue: this.config.maximumValue,
				minValue: this.config.minValue,
				decimalPlaces: this.config.decimalPlaces
			};

			this._3rd_editor = new AutoNumeric(el,options);
			this._waitEditor.resolve(this._3rd_editor);

		}));
        
    },
    _init_autonumeric_once:function(){
		
		var tid = this.config.autoNumericID = webix.uid();

		if (webix.isUndefined(this.config.value)){
			this.$view.innerHTML = "<input id='"+tid+"' type='text'  ></input>";
		}
		else {
			this.$view.innerHTML = "<input id='"+tid+"' type='text' value='"+this.config.value+"' ></input>";
		}

		var el = this.$view.getElementsByTagName("input")[0];
		this._3rd_editor = new AutoNumeric(el);
		this._waitEditor.resolve(this._3rd_editor);        
		
		this._init_autonumeric_once = function(){};
	},
	getValue:function(){
		return this._3rd_editor?this._3rd_editor.getNumber():this.config.value;
	},
    setValue:function(value){
		this.config.value = value;
		if (this._3rd_editor)
			this._3rd_editor.set(value);
		else webix.delay(function(){
			this.setValue(value);
		},this,[],100);
	},
	getEditor:function(waitEditor){
		return waitEditor?this._waitEditor:this._3rd_editor;
	}

},webix.ui.text);

webix.protoUI({
	name:"searchlookup",
	$init:function(config){		
		this.$view.className += " webix_el_combo";      
	},
	$skin:function(){
		this.defaults.inputPadding = webix.skin.$active.inputPadding;
	},	
	getInputNode:function(){
		return this.$view.getElementsByTagName("input")[0];
	},
	setValue: function(value){
		this.config.value = value;
		webix.delay(function(){
			this.setValue("abc");
		},this,[],100);
	}

}, webix.ui.combo);


webix.protoUI({
	name:"gridsuggest",
	defaults:{
		type:"datatable",
		fitMaster:false,
		width:0,
		body:{
			navigation:true,
			autoheight:true,
			autowidth:true,
			select:true
		},
		filter:function(item, value){
			var text = this.config.template(item);
			if (text.toString().toLowerCase().indexOf(value.toLowerCase())===0) return true;
				return false;
		}
	},
	$init:function(obj){
		if (!obj.body.columns)
			obj.body.autoConfig = true;
		if (!obj.template)
			obj.template = webix.bind(this._getText, this);

		this.attachEvent('onValueSuggest', function(){
           	webix.delay(function(){
                webix.callEvent("onEditEnd",[]);
            });
        });
	},
	_getText:function(item, common){
		var grid = this.getBody();
		var displayField = this.config.body.textValue || grid.config.columns[0].id;
		
		var selectedItem = grid.getItem(item.id);
		var value = selectedItem[displayField];

		return value;
	}
}, webix.ui.suggest);

webix.protoUI({
	name:"treesuggest",
	defaults:{
		type:"treetable",
		fitMaster:false,
		width:0,
		body:{
			navigation:true,
			height: 250,
			autowidth:true,
			select:true
		},
		filter:function(item, value){
			var text = this.config.template(item);
			if (text.toString().toLowerCase().indexOf(value.toLowerCase())===0) return true;
				return false;
		}
	},
	$init:function(obj){
		if (!obj.body.columns)
			obj.body.autoConfig = true;
		if (!obj.template)
			obj.template = webix.bind(this._getText, this);

		this.attachEvent('onValueSuggest', function(){
           	webix.delay(function(){
                webix.callEvent("onEditEnd",[]);
            });
        });
	},

	_getText:function(item, common){
		var grid = this.getBody();
		var displayField = "id";

		if (this.config.textValue!=null){
			if (this.config.textValue!=""){
				displayField = this.config.textValue;
			}
		}

		var value = item.id;
		var selectedItem = grid.getItem(item.id);

		if (selectedItem!=null){
			value = selectedItem[displayField];
		}

		return value;
	}
}, webix.ui.suggest);

webix.protoUI({
  name:"combo2",
  $cssName:"combo custom",
  $renderIcon:function(){
    var config = this.config;
    if (config.icons.length){
      var height = config.aheight - 2*config.inputPadding,
        padding = (height - 18)/2 -1,
		html = "", pos = 2;
        
      for(var i=0; i<config.icons.length; i++){
          html+="<span style='right:"+pos+"px;height:"
            +(height-padding)+"px;padding-top:"+padding
            +"px;' class='webix_input_icon fa-"+config.icons[i]+"'></span>";
          
          pos+=24;
        }
        return html;
      }
      return "";
  },
  on_click:{
    "fa-times":function(e, id, node){
      return this.callEvent("onReset", [e]);
    }
  },
}, webix.ui.combo);

webix.editors.autonumeric = webix.extend({
	render: function(){
		var node = webix.html.create("div", {
			"class":"webix_dt_editor"
		}, "<input type='text' style='text-align:right' role='autonumeric' >");	 

		var input = node.getElementsByTagName("input")[0];

		var options = {
			maximumValue: 999999999,
			minValue: -999999999,
			decimalPlaces: 0
		};

		if (!webix.isUndefined(this.config.numericConfig)){
			options = this.config.numericConfig;
		}

		var numeric = new AutoNumeric(input, options);

		this._3rd_editor = numeric;

		return node;
	},	
	getInputNode:function(){
			return this.node.firstChild;
	},
	focus:function(){
			this.getInputNode().focus();
	},
	setValue: function(value){
		if (this._3rd_editor){
			this._3rd_editor.set(value);
		}	
		else {
			this.getInputNode().value = value;
		}
		
	},
	getValue: function(){
		return this._3rd_editor?this._3rd_editor.getNumber():this.getInputNode().value;
	}	
},webix.ui.text);

webix.editors.textsearch = webix.extend({
	render: function(){
		var width = this.config.width - 25;
		var tableId = "";

		if (this.config.tableId != undefined){
			tableId = "tableId='" + this.config.tableId + "'";
		}

		var node = webix.html.create("div", {
			"class":"webix_dt_editor"
		}, "<input style='width:"+width+"px;' type='text' ><span style='padding-top:3px;cursor: pointer;'  class='webix_input_icon fa-plus' role='button' tabindex='0' "+tableId+"></span>");		

		if (typeof this.config.onIconButtonClick === "function") { 
			var iconButton = node.getElementsByTagName("span")[0];
			iconButton.addEventListener("click", this.config.onIconButtonClick );
		}		

		return node;
	},	
	getInputNode:function(){
			return this.node.firstChild;
	},
	focus:function(){
			this.getInputNode().focus();
	}	
}, webix.editors.text);

webix.ui.datafilter.countColumn = webix.extend({
    refresh: function (master, node, value) {
        var result = 0;
        master.mapCells(null, value.columnId, null, 1, function (value) {
            result++;
            return value;
        });

        node.firstChild.innerHTML = result;
    }
}, webix.ui.datafilter.summColumn);

webix.isMobile = function() {
	var userAgent = navigator.userAgent;

	if( userAgent.match(/Android/i) || userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)
		)
	{
		return true;
	}
	else {
		return false;
	}
};

String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };

function getWorkDays(month){

	var dateFrom = new Date(month.getFullYear(),month.getMonth(),1);
	var days = moment(month).daysInMonth();

	var workday = [];
	var holiday = [];

	for(var i = 1 ; i<=days; i++){

		var date = new Date(month.getFullYear(), month.getMonth(),i);
		var mm = moment(date);            

		if (mm.isoWeekday()!==7){                
			workday.push(mm.format("DD"));                
		}
		else {
			holiday.push(mm.format("DD"));
		}
	}
	
	if (days<=28){
		holiday.push("29");
		holiday.push("30");
		holiday.push("31");
	}

	if (days<=29){
		holiday.push("30");
		holiday.push("31");
	}

	if (days<=30){
		holiday.push("31");
	}

	var item = {
		workday: workday,
		holiday: holiday,
		month: month,
		days: days
	};

	return item;
}

function removeTimeZoneT(value){
	if (typeof(value) == "object"){
		return value;
	}

	return value.replace("T", " ");
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function formatDecimal(value){

	if (webix.rules.isNumber(value)==false){
		return value;
	}
	
	var amount = webix.Number.format(value,{
						groupDelimiter:",",
						groupSize:3,
						decimalDelimiter:".",
						decimalSize:0
					});
	
	return amount;
}

function listToTree(data, options) {
	
	options = options || {};
	var ID_KEY = options.idKey || 'id';
	var PARENT_KEY = options.parentKey || 'parentId';
	var CHILDREN_KEY = options.childrenKey || 'data';

	var tree = [],
		childrenOf = {};
	var item, id, parentId;

	for (var i = 0, length = data.length; i < length; i++) {
		item = data[i];
		id = item[ID_KEY];
		parentId = item[PARENT_KEY] || 0;
		// every item may have children
		childrenOf[id] = childrenOf[id] || [];
		// init its children
		item[CHILDREN_KEY] = childrenOf[id];
		if (parentId != 0) {
		// init its parent's children object
		childrenOf[parentId] = childrenOf[parentId] || [];
		// push it into its parent's children object
		childrenOf[parentId].push(item);
		} else {
		tree.push(item);
		}
	};

return tree;
}