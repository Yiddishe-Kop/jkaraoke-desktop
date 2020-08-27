import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js'
import threeFont from 'three/examples/fonts/helvetiker_bold.typeface.json';
import TextSprite from '@seregpie/three.text-sprite';
import BezierEasing from 'bezier-easing'

class ThreeDvizualizer {

  domEl = undefined
  audio = undefined
  noise = undefined
  analyser = undefined
  camera = undefined
  scene = undefined
  group = undefined
  ballGroup = undefined
  text = ''
  lastGeneratedText = ''
  font = new THREE.Font(threeFont)
  textMesh = undefined
  plane = undefined
  plane2 = undefined
  ball = undefined
  ballMaterial = undefined
  textMaterial = undefined
  numbersGroup = undefined
  renderer = undefined
  dataArray = []
  amp = 8

  constructor(audio, domEl) {
    this.audio = audio
    this.domEl = domEl
  }

  init = async () => {
    //initialise simplex noise instance
    this.noise = new SimplexNoise();
    window.ThreeDAudioContext = new AudioContext();
    var src = ThreeDAudioContext.createMediaElementSource(this.audio);
    this.analyser = ThreeDAudioContext.createAnalyser();
    src.connect(this.analyser);
    this.analyser.connect(ThreeDAudioContext.destination);
    this.analyser.fftSize = 512;
    var bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);

    //here comes the webgl
    this.scene = new THREE.Scene();
    this.group = new THREE.Group();

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({
      color: '#D6BCFA',
      side: THREE.DoubleSide,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });

    this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.plane.rotation.x = -0.5 * Math.PI;
    this.plane.position.set(0, 60, 0);
    this.group.add(this.plane);

    this.plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
    this.plane2.rotation.x = -0.5 * Math.PI;
    this.plane2.position.set(0, -60, 0);
    this.group.add(this.plane2);

    var icosahedronGeometry = new THREE.IcosahedronGeometry(15, 4);
    icosahedronGeometry.center();
    this.ballMaterial = new THREE.MeshLambertMaterial({
      color: '#ca81ec',
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });

    this.ball = new THREE.Mesh(icosahedronGeometry, this.ballMaterial);
    this.ball.position.set(0, 0, 0);
    this.ball.scale.set(1.3, 1.3, 1.3)
    this.ballGroup = new THREE.Group();
    this.ballGroup.add(this.ball);

    this.numbersGroup = new THREE.Group();
    this.numbersGroup.scale.set(5, 5, 5)
    this.generateSmallNumbers();
    this.scene.add(this.numbersGroup);

    this.textMaterial = new THREE.MeshLambertMaterial({
      color: '#D8DF25',
    });
    this.textMesh = this.getTextMesh(this.text, this.textMaterial)
    this.group.add(this.textMesh);

    var ambientLight = new THREE.AmbientLight('#B794F4');
    this.scene.add(ambientLight);

    var spotLight = new THREE.SpotLight('#FAF5FF');
    spotLight.intensity = 0.9;
    spotLight.position.set(-10, 40, 20);
    spotLight.lookAt(this.ball);
    spotLight.castShadow = true;
    this.scene.add(spotLight);

    this.group.add(this.ballGroup)
    this.scene.add(this.group);

    this.domEl.appendChild(this.renderer.domElement);
    this.render();
  }

  isCountdown = () => !!this.text

  numberEasing = t => BezierEasing(0, 1, 1, 0)(t)

  render = () => {

    if (this.text) { // show countdown
      if (this.text != this.lastGeneratedText) {
        // update the text mesh
        this.group.remove(this.textMesh)
        this.textMesh = this.getTextMesh(this.text, this.textMaterial)
        // rotate
        this.animateVector3(this.textMesh.rotation, new THREE.Vector3(0, Math.PI / 2, 0), {
          easing: this.numberEasing,
          duration: 1000,
        })
        // scale
        if (this.text == '0') {
          // fly out towards camera
          this.animateVector3(this.textMesh.position, new THREE.Vector3(1.5, 0, 110), {
            easing: TWEEN.Easing.Quadratic.In,
            duration: 950,
          })
        } else if (Number(this.text) <= 5) {
          // from 5s: grow & shrink
          this.animateVector3(this.textMesh.scale, new THREE.Vector3(1.25, 1.25, 1.25), {
            easing: TWEEN.Easing.Quadratic.Out,
            duration: 500,
            callback: () => {
              this.animateVector3(this.textMesh.scale, new THREE.Vector3(1, 1, 1), {
                easing: TWEEN.Easing.Quadratic.In,
                duration: 500,
              })
            }
          })
        }
        this.group.attach(this.textMesh)
        this.numbersGroup.children.forEach(sprite => sprite.text = this.text)
        this.lastGeneratedText = this.text
      }

      const colors = [
        '#DE2644',
        '#DE2726',
        '#DE4626',
        '#DE6626',
        '#DE8526',
        '#DEA526',
        '#DEC426',
        '#D8DF25',
      ]
      const number = Number(this.text)
      // this.textMaterial.setValues({
      //   color: (number >= 0 && number < colors.length - 1) ? colors[number] : '#D8DF25'
      // });

      if (!this.audio.paused) {
        // this.textMesh.scale.multiplyScalar(1.01)
        // this.textMesh.position.y -= 0.14 // move a drop left
        // this.textMesh.position.z += 8 // move toward camera
        // if (this.textMesh.rotation.y < 1.5707963) {
        //   this.textMesh.rotation.y += 0.05 // rotate the big number
        // }

      }

      this.ballMaterial.setValues({
        opacity: 0.2
      })
      this.amp = 8
      this.textMaterial.visible = true
      this.numbersGroup.visible = true
    } else { // show ball
      this.ballMaterial.setValues({
        opacity: 0.3,
      })
      this.amp = 4
      this.textMaterial.visible = false
      this.numbersGroup.visible = false
    }

    this.analyser.getByteFrequencyData(this.dataArray);

    var lowerHalfArray = this.dataArray.slice(0, this.dataArray.length / 2 - 1);
    var upperHalfArray = this.dataArray.slice(this.dataArray.length / 2 - 1, this.dataArray.length - 1);

    var overallAvg = avg(this.dataArray);
    var lowerMax = max(lowerHalfArray);
    var lowerAvg = avg(lowerHalfArray);
    var upperMax = max(upperHalfArray);
    var upperAvg = avg(upperHalfArray);

    var lowerMaxFr = lowerMax / lowerHalfArray.length;
    var lowerAvgFr = lowerAvg / lowerHalfArray.length;
    var upperMaxFr = upperMax / upperHalfArray.length;
    var upperAvgFr = upperAvg / upperHalfArray.length;

    this.makeRoughGround(this.plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
    this.makeRoughGround(this.plane2, modulate(lowerAvgFr, 0, 1, 0.5, 4));
    this.makeRoughBall(this.ball, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 1), modulate(upperAvgFr, 0, 1, 0, 1));

    let rotateBy = this.isCountdown() ? 0.005 : 0.001;
    this.ballGroup.rotation.y += rotateBy;

    this.numbersGroup.children.forEach((n, i) => {
      // move up
      if (n.position.y < 16) {
        n.position.y += 0.1;
      } else {
        n.position.y = -16;
      }
      // move right/left
      let moveBy = Math.randomBetween(1, 3.5) * 0.01
      if (i % 2) {
        n.position.x += moveBy
      } else {
        n.position.x -= moveBy
      }

      // bring back into viewable area
      if (n.position.x > 15) {
        n.position.x = -15
      }
      if (n.position.x < -15) {
        n.position.x = 15
      }
    })
    TWEEN.update();

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  }

  getTextMesh = (text, material) => {
    material.opacity = 1
    var textGeometry = new THREE.TextGeometry(text,
      {
        font: this.font,
        size: 23,
        height: 12,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 0.3,
        bevelOffset: 0,
        bevelSegments: 4
      }
    );
    textGeometry.center();
    let numberMesh = new THREE.Mesh(textGeometry, material);
    numberMesh.position.set(0, 0, 0);
    numberMesh.rotation.y = -Math.PI / 2;
    return numberMesh;
  };

  generateSmallNumbers = () => {
    let sprite = new TextSprite({
      fillStyle: '#D8DF25',
      fontFamily: 'Heebo var, sans-serif',
      fontSize: 2000,
      fontStyle: 'bold',
      text: this.text,
      align: 'center'
    });
    const NUM_OF_SPRITES = 8
    for (let i = 0; i < NUM_OF_SPRITES; i++) {
      let spriteClone = sprite.clone()
      let xPos = Math.randomBetween(-15, 15)
      let yPos = Math.randomBetween(-16, 16)
      let zPos = -20
      spriteClone.position.set(xPos, yPos, zPos);

      this.numbersGroup.add(spriteClone)
    }
  }

  makeRoughBall = (mesh, bassFr, treFr) => {
    mesh.geometry.vertices.forEach((vertex, i) => {
      var offset = mesh.geometry.parameters.radius;
      var time = window.performance.now();
      vertex.normalize();
      var rf = 0.00001;
      var distance =
        offset +
        bassFr +
        this.noise.noise3D(vertex.x + time * rf * 7, vertex.y + time * rf * 8, vertex.z + time * rf * 9) * this.amp * treFr;
      vertex.multiplyScalar(distance);
    });
    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.normalsNeedUpdate = true;
    mesh.geometry.computeVertexNormals();
    mesh.geometry.computeFaceNormals();
  }

  makeRoughGround = (mesh, distortionFr) => {
    mesh.geometry.vertices.forEach((vertex, i) => {
      var time = Date.now();
      var distance = (this.noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) * distortionFr * Math.min(this.amp, 2);
      vertex.z = distance;
    });
    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.normalsNeedUpdate = true;
    mesh.geometry.computeVertexNormals();
    mesh.geometry.computeFaceNormals();
  }

  animateVector3 = (vectorToAnimate, target, options) => {
    options = options || {};
    // get targets from options or set to defaults
    var to = target || THREE.Vector3(),
      easing = options.easing || TWEEN.Easing.Quadratic.In,
      duration = options.duration || 2000;
    // create the tween
    var tweenVector3 = new TWEEN.Tween(vectorToAnimate)
      .to({ x: to.x, y: to.y, z: to.z, }, duration)
      .easing(easing)
      .onUpdate(function (d) {
        if (options.update) {
          options.update(d);
        }
      })
      .onComplete(function () {
        if (options.callback) options.callback();
      });
    // start the tween
    tweenVector3.start();
    // return the tween in case we want to manipulate it later on
    return tweenVector3;
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}


//some helper functions here
function fractionate(val, minVal, maxVal) {
  return (val - minVal) / (maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
  var fr = fractionate(val, minVal, maxVal);
  var delta = outMax - outMin;
  return outMin + fr * delta;
}

function avg(arr) {
  var total = arr.reduce(function (sum, b) {
    return sum + b;
  });
  return total / arr.length;
}

function max(arr) {
  return arr.reduce(function (a, b) {
    return Math.max(a, b);
  });
}
export default ThreeDvizualizer
