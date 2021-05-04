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
	
		const proxy =  new Proxy(this, {
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

							if (prop == 'class' || prop == 'name') {
								continue;
							}
							
							Ds.SetObjectAttr(obj['name'], prop, params[prop], controller);

							this[prop] = params[prop];
						}
					}
				}
			
				let result = Ds.GetObjectAttr(obj['name'], prop);
				
				if (result == undefined) {
					result = () => { 
						Ds.ExecuteObjectCommand(obj['name'], prop);
					}
				}
				
				return result;
			},
			set: function(obj, prop, value) {
				let controller;
			
				if (value.duration != undefined) {
					controller = Ds.NewObjectAttrController(value.duration, value.up || 0.0, value.down || 0.0, value.func || 'linear', value.rate || false, value.step || false);
				}
			
				Ds.SetObjectAttr(obj['name'], prop, value, controller);
			}
		});
		
		proxy.set(args);
		
		return proxy;
	}
};
