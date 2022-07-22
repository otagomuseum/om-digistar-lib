# Digistar Javacript Proxy

This library for Digistar adds a more fluent syntax for manipulating Digistar objects in Javascript.

| Original Digistar | DsObject equivalent |
| ----------------- | ------------------- |
| `Ds.CreateObject('myempty','emptyClass');` | `let myempty = DsObject.create('myempty', 'emptyClass');` |
| `let ref = Ds.NewObjectAttrRef('myempty', 'position');`<br>`let pos = Ds.GetObjectAttrUsingRef(ref);`  | `let pos = myempty.position;` |
| `let controller = Ds.NewObjectAttrController(30,  5,  5);`<br>`Ds.SetObjectAttrUsingRef(ref, 'position', {x: 0, y:100, z: 200}, controller);` | `myempty.position = {value: {x: 0, y:100, z: 200}, controller: { duration: 30, up: 5, down: 5 }};` |
| `Ds.SetObjectAttr('navigation','destObject', 'Earth');`<br>`Ds.SetObjectAttr('navigation','flyToDuration', 5);`<br>`Ds.ExecuteObjectCommand('navigation','flyToDest);`    | `let nav = DsObject.get('navigation');`<br><br>`nav.set({`<br>`   destObject: 'Earth',`<br>   `   flyToDuration: 5`<br>`});`<br><br>`nav.flyToDest();` |

**The following operations are supported:**

`let proxy = DsObject.create([name], [class])` creates a new Digistar object and returns a proxy object

`let proxy = DsObject.get([name])` gets an existing Digistar object and returns a proxy object

`let proxy = DsObject.clone([name], [toCopy])` clones an existing Digistar object and returns a proxy object of the clone

`proxy.[attribute]` returns the value of the attribute {e.g. `proxy.position` }

`proxy.[attribute] = 1234` sets the value of the attribute

`proxy.[attribute] = { value: 1234, controller: { duration: 30, up: 5, down: 5 }}` sets the value of the attribute with a controller

`proxy.[command]()` executes the command { e.g. `proxy.on()` }

`proxy.set({ [attribute]: 1234, [attribute2]: 4567 }, controller: { duration: 30, up: 5, down: 5 })` sets multiple attributes with a controller

`proxy.add(proxy2)` adds another object as a child

`proxy.remove(proxy2)` removes a child object

## Usage

Simply include the library file at the top of any Javascript file you want to use it in, for example:

`include('$content/user/om-digistar-lib/dsproxy.js');`

See the `proxyexample.js` file for more examples

**Not yet supported**

Arrays are not currently supported, so you cannot get and set by array index