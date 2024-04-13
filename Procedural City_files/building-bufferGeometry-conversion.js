function Building(xPos, yPos) {
    /// create holder for building
    self = this;

    self.x = xPos;
    self.y = yPos;
    self.isStreet = false;

    self.object = new THREE.Object3D();
    self.object.position.x = self.x;
    self.object.position.y = self.y;
    self.object.position.z = -0.1;
    

    self.setFaceColor = function(geo, color) {
        console.log("INSIDE setFaceColor COLOR----------------");
        console.log(geo);
        console.log("COLOR IS");
        console.log(color);
        console.log("-------------------");

        // Check if the geometry has a color attribute; if not, create it
        if (!geo.attributes.color) {
            const colors = new Float32Array(geo.attributes.position.count * 3); // three components per vertex
            geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        }

        // Get the color attribute array
        const colors = geo.attributes.color.array;

        // Assuming each face is a triangle (3 vertices), and each vertex needs its color set
        for (let i = 0; i < colors.length; i += 9) { // each face has 3 vertices, each vertex has 3 color components (r, g, b)
            // Set the color for all three vertices of a triangle
            for (let j = 0; j < 9; j += 3) {
                colors[i + j] = color.r;     // Set red component
                colors[i + j + 1] = color.g; // Set green component
                colors[i + j + 2] = color.b; // Set blue component
            }
        }

        // Mark the color attribute as needing an update
        geo.attributes.color.needsUpdate = true;
    }


    var hue = ((noise.simplex2(xPos * 0.0005, yPos * 0.0005) + 1) / 2);
    hue = hue + Math.random() * 0.2;
    var saturation = Math.random() * 0.5 + 0.5;
    // saturation = 1;

    self.geometry = new THREE.BoxGeometry();
    self.geometry.rotateX(Math.PI / 2);
    // self.geometry.rotateZ(Math.PI/4);
    self.geometry.rotateZ(Math.random(Math.PI));
   
    self.setFaceColor(self.geometry, new THREE.Color().setHSL(0.0, 0.0, 0.1));
    self.isDead = false;

    var numParts = Math.round(Math.random() * 5 + 5);
    var partCount = 0;
    // numParts = 30;

    var minWidth = 0.01;
    var maxWidth = Math.random() * 5 + 40;

    // minWidth = 0.01;
    // maxWidth = 10;

    // maxWidth = 10;
    var offsetRange = maxWidth * (Math.random() * 0.7 + 0.2) * 1.5;
    var minHeight = 10;
    var maxHeightMod = ((noise.simplex2(xPos * 0.0012, yPos * 0.0012) + 1) / 2);
    maxHeightMod *= ((noise.simplex2(xPos * 0.013, yPos * 0.013) + 1) / 2);
    maxHeightMod /= ((noise.simplex2(xPos * 0.0003, yPos * 0.0003) + 1) / 2);
    //console.log(maxHeightMod);
    var maxHeight = minHeight + maxHeightMod * 150;

    // minHeight = 1;
    // maxHeight = 5;

    var slopeIntensity = Math.random();
    var spikeIntensity = Math.random();
    if (Math.random() > 0.5) spikeIntensity = 0;

    var symmetryType = Math.floor(Math.random() * 2.5);

		

		self.shiftLeftEdge = function(geo, amount) {
		    // Accessing the position attribute's array directly
		    let positions = geo.attributes.position.array;

		    // Shifting left edge: typically vertices 6 and 4 in a BoxBufferGeometry
		    positions[6 * 3] += amount; // Vertex 6, x-coordinate
		    positions[4 * 3] += amount; // Vertex 4, x-coordinate
		    geo.attributes.position.needsUpdate = true; // Notify Three.js to update the GPU data
		};

		self.shiftRightEdge = function(geo, amount) {
		    let positions = geo.attributes.position.array;

		    // Shifting right edge: typically vertices 1 and 3 in a BoxBufferGeometry
		    positions[1 * 3] += amount; // Vertex 1, x-coordinate
		    positions[3 * 3] += amount; // Vertex 3, x-coordinate
		    geo.attributes.position.needsUpdate = true;
		};

		self.shiftNearEdge = function(geo, amount) {
		    let positions = geo.attributes.position.array;

		    // Shifting near edge: typically vertices 1 and 4 in a BoxBufferGeometry
		    positions[1 * 3 + 1] += amount; // Vertex 1, y-coordinate
		    positions[4 * 3 + 1] += amount; // Vertex 4, y-coordinate
		    geo.attributes.position.needsUpdate = true;
		};

		self.shiftFarEdge = function(geo, amount) {
		    let positions = geo.attributes.position.array;

		    // Shifting far edge: typically vertices 6 and 3 in a BoxBufferGeometry
		    positions[6 * 3 + 1] += amount; // Vertex 6, y-coordinate
		    positions[3 * 3 + 1] += amount; // Vertex 3, y-coordinate
		    geo.attributes.position.needsUpdate = true;
		};

		self.slopeEdge = function(geo, edge, amount) {
		    let positions = geo.attributes.position.array;
		    let edges = [[6, 4], [1, 4], [1, 3], [6, 3]];

		    // Sloping edge: Adjusting z-coordinates of specified edge vertices
		    positions[edges[edge][0] * 3 + 2] += amount; // First vertex of the edge, z-coordinate
		    positions[edges[edge][1] * 3 + 2] += amount; // Second vertex of the edge, z-coordinate
		    geo.attributes.position.needsUpdate = true;
		};


		

    self.createPart = function () {
        var width = Math.random() * (maxWidth - minWidth) + minWidth;
        var depth = width;
        if (Math.random() > 0.8) depth = Math.random() * (maxWidth - minWidth) + minWidth;
        var heightMod = Math.pow(Math.random(), 1);
        var height = heightMod * (maxHeight - minHeight) + minHeight;

        var X = Math.random() * offsetRange - offsetRange / 2;
        var Y = Math.random() * offsetRange - offsetRange / 2;
        var Z = -height / 2;

        //console.log(offsetRange + " " + X + " " + Y + " " + Z);

        // if (isSymmetric && j>2) z -= Math.random()*maxHeight*0.5;

        var lightness = Math.random() * 0.3 + 0.2;
        var saturation = Math.random() * 0.5 + 0.5;
        var color = new THREE.Color().setHSL(hue + Math.random() * 0.0, saturation, lightness);

	var partGeo = new THREE.BoxGeometry(width, depth, height);
				

        /// shift top edges in a random amount
        var rightShift = -Math.random() * width / 2 * slopeIntensity;
        var leftShift = Math.random() * width / 2 * slopeIntensity;
        var farShift = Math.random() * width / 2 * slopeIntensity;
        var nearShift = -Math.random() * width / 2 * slopeIntensity;

        var slopeEdge = Math.floor(Math.random() * 4);
        var slopeMod = height * 0.5;
        var slopeAmount = Math.random() * slopeMod - slopeMod * 0.5;
        // slopeAmount = 1;
        if (Math.random() > 0.2) slopeAmount = 0;

        self.shiftLeftEdge(partGeo, leftShift);
        self.shiftRightEdge(partGeo, rightShift);
        self.shiftNearEdge(partGeo, nearShift);
        self.shiftFarEdge(partGeo, farShift);

        self.slopeEdge(partGeo, slopeEdge, slopeAmount);


        var rot = Math.random(Math.PI * 0.001);

      
        self.setFaceColor(partGeo, color);

        partGeo.translate(X, Y, Z);

        if (symmetryType > 0) {
            var partGeo2 = new THREE.BoxGeometry();
            partGeo2.copy(partGeo);

            self.reflectGeo(partGeo2, true, false);

	var geometries = [self.geometry, partGeo2];
	partGeo2 = THREE.BufferGeometryUtils.mergeGeometries(geometries);
						
            self.geometry=partGeo2;


            partGeo2.dispose();

            if (symmetryType > 1) {
                var partGeo3 = new THREE.BoxGeometry();
                partGeo3.copy(partGeo);
                self.reflectGeo(partGeo3, false, true);

		geometries = [self.geometry, partGeo3];
		partGeo3 = THREE.BufferGeometryUtils.mergeGeometries(geometries);
		

                self.geometry=partGeo3;
                // self.geometry.merge(partGeo3);
                partGeo3.dispose();

                var partGeo4 = new THREE.BoxGeometry();
                partGeo4.copy(partGeo);
                self.reflectGeo(partGeo4, true, true);
                geometries = [self.geometry, partGeo4];
								partGeo4 = THREE.BufferGeometryUtils.mergeGeometries(geometries);
                self.geometry=partGeo4;
                // self.geometry.merge(partGeo4);
                partGeo4.dispose();
            }
        }

        partCount++;
        if (partCount == numParts) self.createMesh();
    }

    self.reflectGeo = function (geo, reflectX, reflectY) {
        var array = geo.attributes.position.array;
        for (var i = 0; i < array.length; i += 3) {
            if (reflectX) array[i] *= -1;
            if (reflectY) array[i + 1] *= -1;
        }
        geo.attributes.position.needsUpdate = true;
    }

    self.createMesh = function () {
        self.mesh = new THREE.Mesh(self.geometry, BUILDING_MAT);
        self.mesh.updateMatrix();
        self.mesh.position.x = 0;
        self.mesh.position.y = 0;
        self.mesh.position.z = 0;
        self.object.add(self.mesh);

        self.object.position.x = self.x;
        self.object.position.y = self.y;

        self.object.scale.x = 0;
        self.object.scale.y = 0;
        self.object.scale.z = 0;

        // var rot = Math.random(Math.PI*0.001);
        // self.object.rotateZ(rot);

        var rotSnap = Math.floor(Math.random() * 4);
        var rot = rotSnap * Math.PI * 0.5;
        self.object.rotateZ(rot);

        TweenLite.to(self.object.scale, 1, { x: 1, y: 1, z: 1, ease: Sine.easeOut, delay: 0 });
    }

    self.generateGeometry = function () {
        for (var i = 0; i < numParts; i++) {
            self.createPart();
        }
    }



    // figure out if this cell should be a building or a road
    var roadNoise = (noise.simplex2(xPos * 0.0015, yPos * 0.0015) + 1) / 2;
    var roadRange = 0.4;

    if (roadNoise < 0.5 - roadRange / 2 || roadNoise > 0.5 + roadRange / 2) {
        self.generateGeometry();
    } else {
        self.isStreet = true;
        self.setFaceColor(self.geometry, new THREE.Color().setHSL(hue, 0.0, 0.1));
        self.createMesh();
    }

    // self.generateGeometry();

    self.destroy = function () {
        self.geometry.dispose();
    }
}
