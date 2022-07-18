// Digistar Script 
// Created: 03/05/2021

var DsObject = class {
	constructor() {
		let args = arguments[0];
	
		if (typeof arguments[0] !== 'object') {
			args = {
				name: arguments[0],
				class: arguments[1]
			}
		}
	
		if (args.name) {
			this.name = args.name;
		} else {
			Ds.SendMessageError("No name specified");
		}
		
		if (args.class) {
			Ds.CreateObject(args.name, args.class);
		}
	
		this.refs = {};
	
		const proxy = new Proxy(this, {
			get: function(obj, prop, receiver) {
				if (obj.hasOwnProperty(prop)) {
					return obj[prop];
				}
				
				if (prop === 'add') {
					return (child) => { 
						Ds.AddObjectChild(obj.name, child.name); 
					}
				}
				
				if (prop === 'remove') {
					return (child) => {
						Ds.RemoveObjectChild(obj.name, child.name);
					}
				}
				
				if (prop === 'on') {
					return (args) => {
						let dur = args;
						
						if (typeof args === 'object') {
							if (args['duration'] !== undefined) {
								dur = args['duration'];
							}
						}
						
						let duration = dur !== undefined ? `duration ${dur}` : '';
						
						Ds.SendStringCommand(`${obj.name} on ${duration}`);
					}
				}
			
				if (prop == 'set') {
					return (params) => {
						let props = Object.keys(params);
						let controller;
						
						if (params.duration != undefined) {
							controller = Ds.NewObjectAttrController(params.duration, params.up || 0.0, params.down || 0.0, params.func || 'linear', params.rate || false, params.step || false);
						}

						for (let i = 0; i < props.length; i++) {
							let prop = props[i];

							if (prop == 'class' || prop == 'name' || prop == 'duration' ) {
								continue;
							}
							
							try {
								Ds.SetObjectAttr(obj['name'], prop, params[prop], controller);
							} catch (ex) {
								print(`Error setting attribute: ${prop}`);
							}
							
							this[prop] = params[prop];
						}
					}
				}
			
				let result;
			
				obj.refs[prop] = obj.refs[prop] || Ds.NewObjectAttrRef(obj['name'], prop);
			
				let index = Ds.GetAttrRefIndex(obj.refs[prop]); // returns -1 if not an attribute

				if (index >= 0) {
					return Ds.GetObjectAttrUsingRef(obj.refs[prop]);
				}
				
				obj.refs[prop] = Ds.NewObjectCommandRef(obj['name'], prop);
				
				try {
					index = Ds.GetCommandRefIndex(obj.refs[prop]); // throws error if not a command
					
					result = () => { 
						Ds.ExecuteObjectCommandUsingRef(obj.refs[prop], prop);
					}
					obj[prop] = result;
				} catch (ex) {
					Ds.SendMessageError(`No such property or command: ${prop}`);
				}
				
				return result;
			},
			set: function(obj, prop, value) {
				let controller;
			
				if (value.duration !== undefined) {
					controller = Ds.NewObjectAttrController(value.duration, value.up || 0.0, value.down || 0.0, value.func || 'linear', value.rate || false, value.step || false);
				}
			
				obj.refs[prop] = obj.refs[prop] || Ds.NewObjectAttrRef(obj['name'], prop);
				
				Ds.SetObjectAttrUsingRef(obj.refs[prop], value, controller);
			}
		});
		
		proxy.set(args);
		
		return proxy;
	}
	
	static get(name) {
		return new this(name);
	}
	
	static create(name, className) {
		return new this(name, className);
	}
	
	static clone(name, toCopy) {
		const obj = Ds.CloneObject(name, toCopy);
		return new this(name);
	}
};
