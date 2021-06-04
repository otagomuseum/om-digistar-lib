// Digistar Script 
// Created: 03/05/2021

include('$content/user/om-digistar-lib/dsproxy.js');

// Get a reference to exisiting objects
let scene = new DsObject('scene');
let skyObjects = new DsObject('skyObjects');
let Earth = new DsObject('Earth');
let sky = new DsObject('sky');
let nav = new DsObject('navigation');

// Create a new object by specifying the class
let empty = new DsObject('myEmpty', 'EmptyClass');

// Set properties on creation
let empty2 = new DsObject({
	name: 'myEmpty2',
	class: 'EmptyClass',
	position: {x: 1, y: 1, z: 50}
});

// Object hierarchy
scene.add(empty);
empty.add(empty2);

// special handling for 'on' as object may not 'exist'
sky.on(0);
skyObjects.on({ duration: 0 });

Ds.Wait(5)

// Use JSON.stringify to log
console.log(JSON.stringify(Earth.oceanColor));
console.log(JSON.stringify(empty.position));
console.log(JSON.stringify(empty2.position));

nav.set({
	destObject: 'Earth',
	flyToDuration: 5,
});

nav.flyToDest();

// use controller
Earth.scale = {x:0.1, y: 0.1, z:0.1, duration: 2};

Ds.Wait(2);

Earth.scale = {x:1, y: 1, z:1, duration:2, up: 1, down: 1};

Ds.Wait(2);

// set multiple properties at once, with controller
Earth.set({ interior: 100, oceanColor: { r: 100, g: 50, b: 50}, duration: 3 });

Ds.Wait(10);

Earth.off();

Ds.Wait(10);
scene.remove(empty);

empty.delete();
empty2.delete();